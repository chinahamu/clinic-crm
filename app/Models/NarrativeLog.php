<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NarrativeLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'staff_id',
        'content',
        'emotional_tags',
        'context',
    ];

    protected $casts = [
        'emotional_tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
