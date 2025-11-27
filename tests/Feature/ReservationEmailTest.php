<?php

namespace Tests\Feature;

use App\Models\Clinic;
use App\Models\Menu;
use App\Models\User;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationCompleted;
use App\Mail\NewReservationNotification;
use Tests\TestCase;
use Carbon\Carbon;

class ReservationEmailTest extends TestCase
{
    use RefreshDatabase;

    public function test_emails_are_sent_when_reservation_is_created()
    {
        Mail::fake();

        $clinic = Clinic::factory()->create();
        $staff = \App\Models\Staff::factory()->create(['clinic_id' => $clinic->id]);
        
        // Create a shift for the staff
        \App\Models\Shift::factory()->create([
            'staff_id' => $staff->id,
            'clinic_id' => $clinic->id,
            'start_time' => Carbon::tomorrow()->setHour(9),
            'end_time' => Carbon::tomorrow()->setHour(18),
        ]);

        // Create a menu with no specific requirements to simplify testing
        $menu = Menu::factory()->create([
            'duration_minutes' => 30,
            'required_role' => null,
            'required_room_type' => null,
            'required_machine_id' => null,
        ]);
        
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson(route('patient.reservation.store'), [
            'clinic_code' => $clinic->code,
            'menu_id' => $menu->id,
            'start_date' => Carbon::tomorrow()->format('Y-m-d'),
            'start_time' => '10:00',
        ]);

        $response->assertStatus(200);

        Mail::assertSent(ReservationCompleted::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });

        Mail::assertSent(NewReservationNotification::class, function ($mail) {
            return $mail->hasTo('admin@example.com');
        });
    }
}
