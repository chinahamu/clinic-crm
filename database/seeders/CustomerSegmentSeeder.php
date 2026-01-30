<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Contract;
use App\Models\CustomerSegment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CustomerSegmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure we have a clinic
        $clinic = Clinic::first() ?? Clinic::factory()->create();

        // 2. Create "Dormant Users" (Last visit > 6 months ago)
        $dormantCount = 15;
        $this->command->info("Creating {$dormantCount} dormant users...");
        User::factory()->count($dormantCount)->create([
            'last_visit_at' => Carbon::now()->subMonths(7)->subDays(rand(1, 30)),
            'created_at' => Carbon::now()->subYears(2),
        ])->each(function ($user) use ($clinic) {
            Reservation::factory()->count(rand(1, 3))->create([
                'user_id' => $user->id,
                'clinic_id' => $clinic->id,
                'start_time' => Carbon::now()->subMonths(8),
                'status' => 'visited',
            ]);
        });
        
        // Create the segment definition
        CustomerSegment::updateOrCreate(
            ['name' => '休眠顧客 (半年以上来院なし)', 'clinic_id' => $clinic->id],
            ['filters' => ['last_visit_before' => Carbon::now()->subMonths(6)->toDateString()]]
        );


        // 3. Create "VIP Users" (Sales > 300,000 & Visit Count > 10)
        $vipCount = 10;
        $this->command->info("Creating {$vipCount} VIP users...");
        User::factory()->count($vipCount)->create([
            'last_visit_at' => Carbon::now()->subDays(rand(1, 10)),
            'created_at' => Carbon::now()->subYear(),
        ])->each(function ($user) use ($clinic) {
            // High value contracts
            Contract::factory()->create([
                'user_id' => $user->id,
                'clinic_id' => $clinic->id,
                'total_price' => 500000,
                'status' => 'active',
            ]);
            // Many visits
            Reservation::factory()->count(12)->create([
                'user_id' => $user->id,
                'clinic_id' => $clinic->id,
                'status' => 'visited',
                'start_time' => Carbon::now()->subMonths(rand(0, 10)),
            ]);
        });
        
        CustomerSegment::updateOrCreate(
            ['name' => 'VIP顧客 (売上30万以上 & 10回以上)', 'clinic_id' => $clinic->id],
            ['filters' => [
                'min_total_sales' => 300000,
                'min_visit_count' => 10,
            ]]
        );

        // 4. Create "New Users" (Registered this month)
        $newCount = 20;
        $this->command->info("Creating {$newCount} new users...");
        User::factory()->count($newCount)->create([
            'last_visit_at' => null, // Not visited yet or very recent
            'created_at' => Carbon::now()->subDays(rand(0, 20)),
        ]);

        CustomerSegment::updateOrCreate(
            ['name' => '新規登録 (今月)', 'clinic_id' => $clinic->id],
            ['filters' => ['registered_after' => Carbon::now()->startOfMonth()->toDateString()]]
        );

        // 5. Create "Birthday Users" (Birthday is next month)
        $birthdayCount = 8;
        $targetMonth = Carbon::now()->addMonth()->month;
        $this->command->info("Creating {$birthdayCount} users with birthday in month {$targetMonth}...");
        User::factory()->count($birthdayCount)->create([
            // Year doesn't matter, only month
            'birthday' => Carbon::create(1990, $targetMonth, 15)->format('Y-m-d'),
        ]);

        CustomerSegment::updateOrCreate(
            ['name' => '翌月誕生日', 'clinic_id' => $clinic->id],
            ['filters' => ['birth_month' => $targetMonth]]
        );

        $this->command->info("Seeding completed.");
    }
}
