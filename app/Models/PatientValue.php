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
        // Phase 1: LTV集計属性
        'ltv',
        'visit_count',
        'last_visit_at',
        'status_label',
    ];

    protected $casts = [
        'last_visit_at' => 'datetime',
        'ltv'           => 'integer',
        'visit_count'   => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
