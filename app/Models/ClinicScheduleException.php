<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Clinic;

class ClinicScheduleException extends Model
{
    protected $fillable = [
        'clinic_id',
        'date',
        'start_time',
        'end_time',
        'is_closed',
        'note',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
