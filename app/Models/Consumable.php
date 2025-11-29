<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consumable extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'unit',
        'clinic_id',
    ];

    public function stock(): MorphOne
    {
        return $this->morphOne(Stock::class, 'stockable');
    }

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
}
