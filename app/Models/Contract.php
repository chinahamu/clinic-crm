<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    protected $fillable = [
        'user_id',
        'menu_id',
        'clinic_id',
        'contract_date',
        'total_count',
        'remaining_count',
        'total_price',
        'expiration_date',
        'status',
    ];

    protected $casts = [
        'contract_date' => 'date',
        'expiration_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function usages(): HasMany
    {
        return $this->hasMany(ContractUsage::class);
    }
}
