<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\Machine;
use App\Models\Menu;
use App\Models\Room;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ja = FakerFactory::create('ja_JP');
        $startTime = $ja->dateTimeBetween('-1 month', '+1 month');
        $endTime = (clone $startTime)->modify('+1 hour');

        return [
            'user_id' => User::factory(),
            'menu_id' => Menu::factory(),
            'staff_id' => Staff::factory(),
            'room_id' => Room::factory(),
            'machine_id' => Machine::factory(),
            'clinic_id' => Clinic::factory(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'reservation_type' => $ja->randomElement(['consultation', 'treatment']),
            'status' => $ja->randomElement(['confirmed', 'cancelled', 'completed']),
            'reception_status' => $ja->randomElement(['waiting', 'checked_in', 'checked_out']),
            'notes' => $ja->realText(50),
        ];
    }
}
