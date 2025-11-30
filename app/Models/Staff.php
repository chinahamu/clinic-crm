<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Staff extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, LogsActivity;

    protected $fillable = [
        'name',
        'email',
        'password',
        'clinic_id',
        'last_login_ip',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'clinic_id']);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function constraints()
    {
        return $this->hasOne(StaffConstraint::class);
    }
}
