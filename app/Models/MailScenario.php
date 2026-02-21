<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $casts = [
        'is_active'   => 'boolean',
        'days_offset' => 'integer',
    ];

    // -------------------------------------------------------
    // Scopes
    // -------------------------------------------------------

    /** 有効なシナリオのみを返す */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function stepMailLogs(): HasMany
    {
        return $this->hasMany(StepMailLog::class);
    }
}
