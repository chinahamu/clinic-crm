<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use App\Models\Room;
use App\Models\Machine;
use App\Models\Staff;
use App\Models\Shift;
use Carbon\Carbon;

class ClinicSeeder extends Seeder
{
    public function run()
    {
        // Menus
        $consultation = Menu::create([
            'name' => '初診カウンセリング',
            'description' => '初めての方はこちら',
            'price' => 3000,
            'duration_minutes' => 30,
        ]);

        $laser = Menu::create([
            'name' => 'レーザー治療',
            'description' => 'シミ取りレーザー',
            'price' => 10000,
            'duration_minutes' => 60,
        ]);

        // Rooms
        $room1 = Room::create(['name' => '診察室1', 'type' => 'consultation']);
        $room2 = Room::create(['name' => '処置室1', 'type' => 'treatment']);

        // Machines
        $machine1 = Machine::create(['name' => 'レーザー機器A', 'type' => 'laser']);

        // Staff
        // Check if staff exists first to avoid duplicates if run multiple times or use firstOrCreate
        $staff1 = Staff::firstOrCreate(
            ['email' => 'doctor@example.com'],
            ['name' => '医師 太郎', 'password' => bcrypt('password')]
        );

        $staff2 = Staff::firstOrCreate(
            ['email' => 'nurse@example.com'],
            ['name' => '看護師 花子', 'password' => bcrypt('password')]
        );

        // Shifts (Today and Tomorrow)
        $today = Carbon::today();
        
        Shift::create([
            'staff_id' => $staff1->id,
            'start_time' => $today->copy()->setHour(9),
            'end_time' => $today->copy()->setHour(18),
            'status' => 'scheduled',
        ]);

        Shift::create([
            'staff_id' => $staff2->id,
            'start_time' => $today->copy()->setHour(9),
            'end_time' => $today->copy()->setHour(18),
            'status' => 'scheduled',
        ]);
    }
}
