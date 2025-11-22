<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    protected $fillable = ['name', 'address', 'phone', 'is_active'];

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }

    public function machines()
    {
        return $this->hasMany(Machine::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
