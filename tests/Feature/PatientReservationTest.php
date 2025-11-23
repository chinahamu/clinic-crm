<?php

namespace Tests\Feature;

use App\Models\Clinic;
use App\Models\Menu;
use App\Models\Staff;
use App\Models\Shift;
use App\Models\Room;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class PatientReservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_view_reservation_page_with_valid_code()
    {
        $clinic = Clinic::create([
            'name' => 'Test Clinic',
            'address' => 'Test Address',
            'phone' => '1234567890',
            'is_active' => true,
        ]);

        $response = $this->get(route('patient.reservation.index', ['code' => $clinic->code]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Patient/Reservation/Index')
            ->has('clinic')
            ->has('menus')
        );
    }

    public function test_patient_cannot_view_reservation_page_with_invalid_code()
    {
        $response = $this->get(route('patient.reservation.index', ['code' => 'invalid']));

        $response->assertStatus(404);
    }

    public function test_availability_api_returns_correct_structure()
    {
        $clinic = Clinic::create([
            'name' => 'Test Clinic',
            'address' => 'Test Address',
            'phone' => '1234567890',
            'is_active' => true,
        ]);

        $menu = Menu::create([
            'name' => 'Test Menu',
            'price' => 5000,
            'duration_minutes' => 60,
            'is_active' => true,
        ]);

        $response = $this->get(route('patient.reservation.availability', [
            'code' => $clinic->code,
            'menu_id' => $menu->id,
            'start_date' => now()->format('Y-m-d'),
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'dates',
            'slots',
            'availability',
        ]);
    }

    public function test_availability_logic_checks_staff_shifts()
    {
        $clinic = Clinic::create([
            'name' => 'Test Clinic',
            'address' => 'Test Address',
            'phone' => '1234567890',
            'is_active' => true,
        ]);

        $menu = Menu::create([
            'name' => 'Test Menu',
            'price' => 5000,
            'duration_minutes' => 60,
            'is_active' => true,
        ]);

        // Create Staff
        $staff = Staff::create([
            'user_id' => User::factory()->create()->id,
            'clinic_id' => $clinic->id,
            'role' => 'staff',
            'name' => 'Test Staff',
            'email' => 'staff@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create Room (needed for availability)
        Room::create([
            'clinic_id' => $clinic->id,
            'name' => 'Room 1',
            'type' => 'general',
            'capacity' => 1,
        ]);

        $date = Carbon::tomorrow();
        $startTime = $date->copy()->setHour(10)->setMinute(0);
        $endTime = $startTime->copy()->addMinutes(60);

        // Create Shift for Staff
        Shift::create([
            'staff_id' => $staff->id,
            'clinic_id' => $clinic->id,
            'start_time' => $date->copy()->setHour(9)->setMinute(0),
            'end_time' => $date->copy()->setHour(18)->setMinute(0),
        ]);

        // Check availability - should be available
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $date->format('Y-m-d'),
        ]));

        $response->assertStatus(200);
        $availability = $response->json('availability');
        $this->assertTrue($availability[$date->format('Y-m-d')]['10:00']);

        // Create overlapping reservation
        Reservation::create([
            'user_id' => User::factory()->create()->id,
            'menu_id' => $menu->id,
            'staff_id' => $staff->id,
            'clinic_id' => $clinic->id,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => 'confirmed',
        ]);

        // Check availability - should be unavailable
        $response = $this->get(route('patient.reservation.availability', [
            'code' => $clinic->code,
            'menu_id' => $menu->id,
            'start_date' => $date->format('Y-m-d'),
        ]));

        $availability = $response->json('availability');
        $this->assertFalse($availability[$date->format('Y-m-d')]['10:00']);
        
        // 11:00 should be available
        $this->assertTrue($availability[$date->format('Y-m-d')]['11:00']);
    }
}
