<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffConstraint extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'max_hours_per_week',
        'min_hours_per_week',
        'available_days',
    ];

    protected $casts = [
        'available_days' => 'array',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
