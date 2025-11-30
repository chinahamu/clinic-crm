<?php

namespace Tests\Unit\Services;

use App\Models\ShiftRequest;
use App\Models\Staff;
use App\Models\StaffConstraint;
use App\Services\ShiftGenerationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ShiftGenerationServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_generate_shifts()
    {
        // Arrange
        $staff = Staff::factory()->create(['name' => 'Test Staff']);
        StaffConstraint::create([
            'staff_id' => $staff->id,
            'max_hours_per_week' => 40,
        ]);
        ShiftRequest::create([
            'staff_id' => $staff->id,
            'date' => Carbon::today()->addDay(),
            'start_time' => '09:00',
            'end_time' => '18:00',
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        [
                                            'staff_id' => $staff->id,
                                            'date' => Carbon::today()->addDay()->toDateString(),
                                            'start_time' => '09:00',
                                            'end_time' => '18:00',
                                        ]
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200),
        ]);

        $service = new ShiftGenerationService();

        // Act
        $shifts = $service->generate(Carbon::today(), Carbon::today()->addDays(6));

        // Assert
        $this->assertCount(1, $shifts);
        $this->assertEquals($staff->id, $shifts[0]['staff_id']);
        $this->assertEquals('09:00', $shifts[0]['start_time']);
    }
}
