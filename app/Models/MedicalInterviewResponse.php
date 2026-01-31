<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalInterviewResponse extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'reservation_id',
        'template_id',
        'answers',
    ];

    protected $casts = [
        'answers' => 'array',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function template()
    {
        return $this->belongsTo(MedicalInterviewTemplate::class);
    }
}
