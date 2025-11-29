<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'menu_id',
        'staff_id',
        'room_id',
        'machine_id',
        'clinic_id',
        'start_time',
        'end_time',
        'reservation_type',
        'status',
        'reception_status',
        'notes',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }

    public function items()
    {
        return $this->hasMany(ReservationItem::class);
    }
}
