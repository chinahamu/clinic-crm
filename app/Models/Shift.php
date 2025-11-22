<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $fillable = [
        'staff_id',
        'start_time',
        'end_time',
        'status',
        'location',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
