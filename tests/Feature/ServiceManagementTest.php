<?php

namespace Tests\Feature;

use App\Models\Clinic;
use App\Models\Contract;
use App\Models\Menu;
use App\Models\User;
use App\Models\Staff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class ServiceManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_menu_with_tickets()
    {
        $staff = Staff::factory()->create();
        $this->actingAs($staff, 'staff');

        $response = $this->post(route('staff.menus.store'), [
            'name' => '5x Course',
            'price' => 50000,
            'duration_minutes' => 60,
            'num_tickets' => 5,
            'validity_period_days' => 90,
        ]);

        $response->assertRedirect(route('staff.menus.index'));
        $this->assertDatabaseHas('menus', [
            'name' => '5x Course',
            'num_tickets' => 5,
            'validity_period_days' => 90,
        ]);
    }

    public function test_can_purchase_contract_for_patient()
    {
        $staff = Staff::factory()->create();
        $clinic = Clinic::factory()->create();
        $staff->update(['clinic_id' => $clinic->id]);
        
        $patient = User::factory()->create();
        $menu = Menu::factory()->create([
            'num_tickets' => 5,
            'validity_period_days' => 90,
            'price' => 50000,
            'required_role' => null,
        ]);

        $this->actingAs($staff, 'staff');

        $response = $this->post(route('staff.patients.contracts.store', $patient->id), [
            'menu_id' => $menu->id,
            'contract_date' => now()->toDateString(),
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('contracts', [
            'user_id' => $patient->id,
            'menu_id' => $menu->id,
            'total_count' => 5,
            'remaining_count' => 5,
            'status' => 'active',
        ]);
    }

    public function test_ticket_consumption_on_reservation()
    {
        $clinic = Clinic::factory()->create(['code' => 'TESTCLINIC']);
        \App\Models\Room::factory()->create(['clinic_id' => $clinic->id]);
        $patient = User::factory()->create();
        $menu = Menu::factory()->create([
            'num_tickets' => 5,
            'duration_minutes' => 60,
            'required_role' => null,
            'required_room_type' => null,
            'required_machine_type' => null,
        ]);
        
        // Create contract
        $contract = Contract::create([
            'user_id' => $patient->id,
            'menu_id' => $menu->id,
            'clinic_id' => $clinic->id,
            'contract_date' => now(),
            'total_count' => 5,
            'remaining_count' => 5,
            'total_price' => 50000,
            'status' => 'active',
        ]);

        $this->actingAs($patient);

        // Mock availability check to pass (or setup data so it passes)
        // For simplicity, we assume availability check passes if we don't have conflicting reservations
        // We need a staff member with a shift
        $staff = Staff::factory()->create(['clinic_id' => $clinic->id]);
        \App\Models\Shift::create([
            'staff_id' => $staff->id,
            'clinic_id' => $clinic->id,
            'start_time' => now()->setHour(9)->setMinute(0)->setSecond(0),
            'end_time' => now()->setHour(18)->setMinute(0)->setSecond(0),
        ]);

        $response = $this->post(route('patient.reservation.store'), [
            'clinic_code' => $clinic->code,
            'menu_id' => $menu->id,
            'start_date' => now()->toDateString(),
            'start_time' => '10:00',
        ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('reservations', [
            'user_id' => $patient->id,
            'menu_id' => $menu->id,
        ]);

        $this->assertDatabaseHas('contract_usages', [
            'contract_id' => $contract->id,
            'used_count' => 1,
        ]);

        $contract->refresh();
        $this->assertEquals(4, $contract->remaining_count);
    }
}
