<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LifeEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'occurred_at',
        'title',
        'category',
        'impact_level',
    ];

    protected $casts = [
        'occurred_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
