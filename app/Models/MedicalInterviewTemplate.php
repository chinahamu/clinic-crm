<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalInterviewTemplate extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'name',
        'questions',
    ];

    protected $casts = [
        'questions' => 'array',
    ];
}
