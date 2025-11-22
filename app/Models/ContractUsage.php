<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractUsage extends Model
{
    protected $fillable = [
        'contract_id',
        'reservation_id',
        'used_count',
        'used_date',
        'notes',
    ];

    protected $casts = [
        'used_date' => 'date',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
