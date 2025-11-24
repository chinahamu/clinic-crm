<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contract extends Model
{
    use HasFactory;
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

    /**
     * Consume one ticket from the contract.
     *
     * @param int $reservationId
     * @return ContractUsage|null
     */
    public function consume(int $reservationId)
    {
        if ($this->remaining_count <= 0) {
            return null;
        }

        if ($this->expiration_date && $this->expiration_date < now()) {
            return null;
        }

        $this->decrement('remaining_count');

        if ($this->remaining_count === 0) {
            $this->update(['status' => 'completed']);
        }

        return $this->usages()->create([
            'reservation_id' => $reservationId,
            'used_count' => 1,
            'used_date' => now(),
        ]);
    }

    /**
     * Refund one ticket to the contract (e.g. cancellation).
     *
     * @param int $reservationId
     */
    public function refund(int $reservationId)
    {
        $usage = $this->usages()->where('reservation_id', $reservationId)->first();

        if ($usage) {
            $usage->delete();
            $this->increment('remaining_count');
            
            if ($this->status === 'completed' && $this->remaining_count > 0) {
                $this->update(['status' => 'active']);
            }
        }
    }
}
