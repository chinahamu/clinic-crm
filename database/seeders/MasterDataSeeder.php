<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Machine;
use App\Models\Menu;
use App\Models\Product;
use App\Models\Room;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        if (!$clinic) {
            $clinic = Clinic::factory()->create();
        }

        // Create Menus
        Menu::factory()->count(10)->create();

        // Create Rooms (Ensure at least one of each type exists)
        $roomTypes = ['consultation', 'treatment', 'counseling'];
        foreach ($roomTypes as $type) {
            Room::factory()->create([
                'clinic_id' => $clinic->id,
                'type' => $type,
            ]);
        }
        // Create some random extra rooms
        Room::factory()->count(3)->create(['clinic_id' => $clinic->id]);

        // Create Machines (Ensure at least one of each type exists)
        $machineTypes = ['laser', 'hifu'];
        foreach ($machineTypes as $type) {
            Machine::factory()->create([
                'clinic_id' => $clinic->id,
                'type' => $type,
            ]);
        }
        // Create some random extra machines
        Machine::factory()->count(3)->create(['clinic_id' => $clinic->id]);

        

        // Create Products
        Product::factory()->count(20)->create();
    }
}
