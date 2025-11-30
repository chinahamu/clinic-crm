<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use App\Models\Room;
use App\Models\Machine;
use App\Models\Staff;
use App\Models\Shift;
use App\Models\Clinic;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;

class ClinicSeeder extends Seeder
{
    public function run()
    {
        // Create Clinic
        $clinic = Clinic::firstOrCreate([
            'name' => '東京本院',
        ], [
            'address' => '東京都渋谷区...',
            'phone' => '03-1234-5678',
            'code' => 'ABCD',
        ]);

        // Create Roles
        $roles = ['doctor', 'nurse', 'reception', 'counselor', 'hq'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'staff']);
        }



        // Rooms
        $room1 = Room::firstOrCreate(['name' => '診察室1', 'clinic_id' => $clinic->id], ['type' => 'consultation', 'clinic_id' => $clinic->id]);
        $room2 = Room::firstOrCreate(['name' => '処置室1', 'clinic_id' => $clinic->id], ['type' => 'treatment', 'clinic_id' => $clinic->id]);

        // Machines
        $machine1 = Machine::firstOrCreate(['name' => 'レーザー機器A', 'clinic_id' => $clinic->id], ['type' => 'laser', 'clinic_id' => $clinic->id]);

        // Staff
        $staff1 = Staff::firstOrCreate(
            ['email' => 'doctor@example.com'],
            ['name' => '医師 太郎', 'password' => bcrypt('password'), 'clinic_id' => $clinic->id]
        );
        $staff1->assignRole('doctor');

        $staff2 = Staff::firstOrCreate(
            ['email' => 'nurse@example.com'],
            ['name' => '看護師 花子', 'password' => bcrypt('password'), 'clinic_id' => $clinic->id]
        );
        $staff2->assignRole('nurse');

        // Shifts (Today and Tomorrow)
        $today = Carbon::today();
        
        Shift::create([
            'staff_id' => $staff1->id,
            'clinic_id' => $clinic->id,
            'start_time' => $today->copy()->setHour(9),
            'end_time' => $today->copy()->setHour(18),
            'status' => 'scheduled',
        ]);

        Shift::create([
            'staff_id' => $staff2->id,
            'clinic_id' => $clinic->id,
            'start_time' => $today->copy()->setHour(9),
            'end_time' => $today->copy()->setHour(18),
            'status' => 'scheduled',
        ]);
    }
}
