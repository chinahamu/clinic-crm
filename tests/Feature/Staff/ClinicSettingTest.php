<?php

namespace Tests\Feature\Staff;

use App\Models\Clinic;
use App\Models\Staff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClinicSettingTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_view_clinic_settings_page()
    {
        $clinic = Clinic::factory()->create();
        $staff = Staff::factory()->create(['clinic_id' => $clinic->id]);

        $response = $this->actingAs($staff, 'staff')
            ->get(route('staff.settings.clinic.edit'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Staff/Settings/Clinic/Edit')
            ->has('clinic')
            ->has('schedules')
            ->has('exceptions')
        );
    }

    public function test_staff_can_update_clinic_settings()
    {
        $clinic = Clinic::factory()->create();
        $staff = Staff::factory()->create(['clinic_id' => $clinic->id]);

        $schedules = [];
        for ($i = 0; $i <= 6; $i++) {
            $schedules[] = [
                'day_of_week' => $i,
                'start_time' => '09:00',
                'end_time' => '18:00',
                'is_closed' => false,
            ];
        }

        $exceptions = [
            [
                'date' => '2025-12-25',
                'start_time' => null,
                'end_time' => null,
                'is_closed' => true,
                'note' => 'Christmas',
            ]
        ];

        $response = $this->actingAs($staff, 'staff')
            ->put(route('staff.settings.clinic.update'), [
                'schedules' => $schedules,
                'exceptions' => $exceptions,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('clinic_schedules', [
            'clinic_id' => $clinic->id,
            'day_of_week' => 0,
            'start_time' => '09:00',
            'end_time' => '18:00',
            'is_closed' => 0,
        ]);

        $this->assertDatabaseHas('clinic_schedule_exceptions', [
            'clinic_id' => $clinic->id,
            'date' => '2025-12-25 00:00:00',
            'is_closed' => 1,
            'note' => 'Christmas',
        ]);
    }
}
