<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Machine;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Staff;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * デモ用予約データを生成する。
     *
     * ステータス分布 (seeder-plan.md より):
     *   confirmed : 60% - 未来日 (+1〜+30日)
     *   completed : 30% - 過去日 (-1〜-90日)
     *   cancelled :  5% - ランダム日
     *   no_show   :  5% - 過去日 (-1〜-60日)
     *
     * 対象テーブル : reservations
     * 前提シーダー : ClinicSeeder, ClinicScheduleSeeder, MenuSeeder,
     *                    StaffSeeder, PatientSeeder, MasterDataSeeder
     */
    public function run(): void
    {
        $clinic   = Clinic::first();
        $users    = User::role('patient')->get();
        $menus    = Menu::all();
        $staffs   = Staff::where('clinic_id', $clinic->id)->get();
        $rooms    = Room::where('clinic_id', $clinic->id)->get();
        $machines = Machine::where('clinic_id', $clinic->id)->get();

        if ($users->isEmpty() || $menus->isEmpty() || $staffs->isEmpty() || $rooms->isEmpty()) {
            $this->command->warn('ReservationSeeder: 必要データが不足しているためスキップします。');

            return;
        }

        $clinic->load(['schedules', 'exceptions']);

        foreach ($users as $user) {
            $count = rand(1, 5);
            for ($i = 0; $i < $count; $i++) {
                // --------------------------------------------------------
                // 1. ステータスと基準日を重み付きランダムで決定
                // --------------------------------------------------------
                [$status, $date] = $this->pickStatusAndDate();

                $menu     = $menus->random();
                $duration = $menu->duration_minutes ?? 60;

                // --------------------------------------------------------
                // 2. 営業スケジュールに合わせた時間帯に素の時間を選定
                // --------------------------------------------------------
                $attempts = 0;
                while ($attempts < 50) {
                    $attempts++;

                    $exception = $clinic->exceptions->firstWhere('date', $date->toDateString());
                    if ($exception && $exception->is_closed) {
                        $date = $this->shiftDate($status);
                        continue;
                    }

                    $schedule = $clinic->schedules->firstWhere('day_of_week', $date->dayOfWeek);
                    if (! $schedule && ! $exception) {
                        $date = $this->shiftDate($status);
                        continue;
                    }

                    if ($schedule && $schedule->is_closed && ! $exception) {
                        $date = $this->shiftDate($status);
                        continue;
                    }

                    $openStr  = $exception ? $exception->start_time : $schedule->start_time;
                    $closeStr = $exception ? $exception->end_time   : $schedule->end_time;

                    if (! $openStr || ! $closeStr) {
                        $date = $this->shiftDate($status);
                        continue;
                    }

                    $openTime  = Carbon::parse($date->toDateString() . ' ' . $openStr);
                    $closeTime = Carbon::parse($date->toDateString() . ' ' . $closeStr);
                    $maxStart  = $closeTime->copy()->subMinutes($duration);

                    if ($openTime->gt($maxStart)) {
                        $date = $this->shiftDate($status);
                        continue;
                    }

                    $diff      = $openTime->diffInMinutes($maxStart);
                    $randomAdd = rand(0, (int) ($diff / 15)) * 15;
                    $startTime = $openTime->copy()->addMinutes($randomAdd);
                    $endTime   = $startTime->copy()->addMinutes($duration);

                    Reservation::factory()->create([
                        'user_id'    => $user->id,
                        'menu_id'    => $menu->id,
                        'staff_id'   => $staffs->random()->id,
                        'room_id'    => $rooms->random()->id,
                        'machine_id' => $machines->isNotEmpty() ? $machines->random()->id : null,
                        'clinic_id'  => $clinic->id,
                        'start_time' => $startTime,
                        'end_time'   => $endTime,
                        'status'     => $status,
                    ]);
                    break;
                }
            }
        }
    }

    /**
     * ステータス確率表に従ってステータスと基準日を返す。
     *
     * @return array{0: string, 1: Carbon}
     */
    private function pickStatusAndDate(): array
    {
        $rand = rand(1, 100);

        if ($rand <= 60) {
            return ['confirmed', Carbon::today()->addDays(rand(1, 30))];
        }
        if ($rand <= 90) {
            return ['completed', Carbon::today()->subDays(rand(1, 90))];
        }
        if ($rand <= 95) {
            return ['cancelled', Carbon::today()->addDays(rand(-30, 30))];
        }

        return ['no_show', Carbon::today()->subDays(rand(1, 60))];
    }

    /**
     * ステータスに合わせた日付を再抗せんする。
     */
    private function shiftDate(string $status): Carbon
    {
        return match ($status) {
            'completed', 'no_show' => Carbon::today()->subDays(rand(1, 90)),
            'cancelled'            => Carbon::today()->addDays(rand(-30, 30)),
            default                => Carbon::today()->addDays(rand(1, 30)),
        };
    }
}
