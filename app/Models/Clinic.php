<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clinic extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'address', 'phone', 'is_active', 'code'];

    protected static function booted()
    {
        static::creating(function ($clinic) {
            $clinic->code = Str::random(10);
        });
    }

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

    public function schedules()
    {
        return $this->hasMany(ClinicSchedule::class);
    }

    public function exceptions()
    {
        return $this->hasMany(ClinicScheduleException::class);
    }
}
