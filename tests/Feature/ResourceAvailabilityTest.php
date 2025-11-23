<?php

namespace Tests\Feature;

use App\Models\Clinic;
use App\Models\Menu;
use App\Models\Staff;
use App\Models\Shift;
use App\Models\Room;
use App\Models\Machine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;
use Carbon\Carbon;

class ResourceAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    protected $clinic;
    protected $date;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clinic = Clinic::factory()->create();
        $this->date = Carbon::tomorrow();
        
        // Create Roles
        Role::create(['name' => 'doctor', 'guard_name' => 'staff']);
        Role::create(['name' => 'nurse', 'guard_name' => 'staff']);
    }

    public function test_menu_requires_specific_role()
    {
        $menu = Menu::factory()->create([
            'required_role' => 'doctor',
            'required_room_type' => null,
            'required_machine_type' => null,
            'duration_minutes' => 60,
        ]);

        // Create Nurse with Shift
        $nurse = Staff::factory()->create(['clinic_id' => $this->clinic->id]);
        $nurse->assignRole('nurse');
        
        Shift::factory()->create([
            'staff_id' => $nurse->id,
            'clinic_id' => $this->clinic->id,
            'start_time' => $this->date->copy()->setHour(9)->setMinute(0),
            'end_time' => $this->date->copy()->setHour(18)->setMinute(0),
        ]);

        // Create Room (generic) - needed because logic checks if ANY room exists if type is null?
        // Logic: if roomType is null, we count all rooms. If 0, return false.
        Room::factory()->create(['clinic_id' => $this->clinic->id]);

        // Check availability - Should be unavailable (only nurse has shift)
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $this->clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $this->date->format('Y-m-d'),
        ]));

        $availability = $response->json('availability');
        $this->assertFalse($availability[$this->date->format('Y-m-d')]['10:00']);

        // Create Doctor with Shift
        $doctor = Staff::factory()->create(['clinic_id' => $this->clinic->id]);
        $doctor->assignRole('doctor');

        Shift::factory()->create([
            'staff_id' => $doctor->id,
            'clinic_id' => $this->clinic->id,
            'start_time' => $this->date->copy()->setHour(9)->setMinute(0),
            'end_time' => $this->date->copy()->setHour(18)->setMinute(0),
        ]);

        // Check availability - Should be available now
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $this->clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $this->date->format('Y-m-d'),
        ]));

        $availability = $response->json('availability');
        $this->assertTrue($availability[$this->date->format('Y-m-d')]['10:00']);
    }

    public function test_menu_requires_specific_room_type()
    {
        $menu = Menu::factory()->create([
            'required_room_type' => 'treatment',
            'required_role' => null,
            'required_machine_type' => null,
            'duration_minutes' => 60,
        ]);

        // Create Staff with Shift (Role doesn't matter here)
        $staff = Staff::factory()->create(['clinic_id' => $this->clinic->id]);
        Shift::factory()->create([
            'staff_id' => $staff->id,
            'clinic_id' => $this->clinic->id,
            'start_time' => $this->date->copy()->setHour(9)->setMinute(0),
            'end_time' => $this->date->copy()->setHour(18)->setMinute(0),
        ]);

        // Create Wrong Room Type
        Room::factory()->create([
            'clinic_id' => $this->clinic->id,
            'type' => 'consultation',
        ]);

        // Check availability - Should be unavailable
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $this->clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $this->date->format('Y-m-d'),
        ]));

        $availability = $response->json('availability');
        $this->assertFalse($availability[$this->date->format('Y-m-d')]['10:00']);

        // Create Correct Room Type
        Room::factory()->create([
            'clinic_id' => $this->clinic->id,
            'type' => 'treatment',
        ]);

        // Check availability - Should be available
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $this->clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $this->date->format('Y-m-d'),
        ]));

        $availability = $response->json('availability');
        $this->assertTrue($availability[$this->date->format('Y-m-d')]['10:00']);
    }

    public function test_menu_requires_specific_machine_type()
    {
        $menu = Menu::factory()->create([
            'required_machine_type' => 'laser',
            'required_role' => null,
            'required_room_type' => null,
            'duration_minutes' => 60,
        ]);

        // Create Staff with Shift
        $staff = Staff::factory()->create(['clinic_id' => $this->clinic->id]);
        Shift::factory()->create([
            'staff_id' => $staff->id,
            'clinic_id' => $this->clinic->id,
            'start_time' => $this->date->copy()->setHour(9)->setMinute(0),
            'end_time' => $this->date->copy()->setHour(18)->setMinute(0),
        ]);

        // Create Room (needed)
        Room::factory()->create(['clinic_id' => $this->clinic->id]);

        // Create Wrong Machine Type
        Machine::factory()->create([
            'clinic_id' => $this->clinic->id,
            'type' => 'hifu',
        ]);

        // Check availability - Should be unavailable
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $this->clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $this->date->format('Y-m-d'),
        ]));

        $availability = $response->json('availability');
        $this->assertFalse($availability[$this->date->format('Y-m-d')]['10:00']);

        // Create Correct Machine Type
        Machine::factory()->create([
            'clinic_id' => $this->clinic->id,
            'type' => 'laser',
        ]);

        // Check availability - Should be available
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $this->clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $this->date->format('Y-m-d'),
        ]));

        $availability = $response->json('availability');
        $this->assertTrue($availability[$this->date->format('Y-m-d')]['10:00']);
    }
}
