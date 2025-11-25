<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClinicSchedule extends Model
{
    protected $fillable = [
        'clinic_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_closed',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
