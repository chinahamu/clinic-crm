<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StepMailLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reservation_id',
        'mail_type',
        'sent_at',
        // Phase 3 追加カラム
        'mail_scenario_id',
        'scheduled_at',
        'status',
        'rendered_message',
    ];

    protected $casts = [
        'sent_at'      => 'datetime',
        'scheduled_at' => 'datetime',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function mailScenario(): BelongsTo
    {
        return $this->belongsTo(MailScenario::class);
    }

    // -------------------------------------------------------
    // Scopes
    // -------------------------------------------------------

    /** 送信待機中かつ送信予定時刻を過ぎたレコード */
    public function scopeDue($query)
    {
        return $query->where('status', 'scheduled')
                     ->where('scheduled_at', '<=', now());
    }
}
