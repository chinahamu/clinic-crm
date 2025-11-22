<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    protected $fillable = [
        'name',
        'type',
        'is_active',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
