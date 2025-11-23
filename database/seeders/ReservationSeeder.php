<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Machine;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        $users = User::role('patient')->get();
        $menus = Menu::all();
        $staffs = Staff::where('clinic_id', $clinic->id)->get();
        $rooms = Room::where('clinic_id', $clinic->id)->get();
        $machines = Machine::where('clinic_id', $clinic->id)->get();

        if ($users->isEmpty() || $menus->isEmpty() || $staffs->isEmpty() || $rooms->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // Create 1-5 reservations per user
            $count = rand(1, 5);
            for ($i = 0; $i < $count; $i++) {
                Reservation::factory()->create([
                    'user_id' => $user->id,
                    'menu_id' => $menus->random()->id,
                    'staff_id' => $staffs->random()->id,
                    'room_id' => $rooms->random()->id,
                    'machine_id' => $machines->isNotEmpty() ? $machines->random()->id : null,
                    'clinic_id' => $clinic->id,
                ]);
            }
        }
    }
}
