<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailScenario extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'clinic_id',
        'name',
        'is_active',
        'trigger_type',
        'days_offset',
        'sender_name',
        'subject',
        'body',
    ];

    /**
     * Scope a query to only include active scenarios.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
