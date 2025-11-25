<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Machine extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
        'quantity',
        'is_active',
        'clinic_id',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
