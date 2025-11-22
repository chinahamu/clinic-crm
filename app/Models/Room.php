<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name',
        'type',
        'capacity',
        'is_active',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
