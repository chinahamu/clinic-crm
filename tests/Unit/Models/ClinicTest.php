<?php

namespace Tests\Unit\Models;

use App\Models\Clinic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClinicTest extends TestCase
{
    use RefreshDatabase;

    public function test_clinic_generates_code_on_creation()
    {
        $clinic = Clinic::create([
            'name' => 'Test Clinic',
            'address' => 'Test Address',
            'phone' => '1234567890',
            'is_active' => true,
        ]);

        $this->assertNotNull($clinic->code);
        $this->assertEquals(10, strlen($clinic->code));
    }
}
