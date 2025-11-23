<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menu extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_minutes',
        'required_room_type',
        'required_machine_type',
        'is_active',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
