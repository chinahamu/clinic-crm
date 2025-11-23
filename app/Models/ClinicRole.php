<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class ClinicRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'role_id',
        'label',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // JSON に展開する属性
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
