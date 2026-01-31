<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'clinic_id',
        'attribute_name',
        'score',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
