<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'line_id',
        'avatar',
        'password',
        'phone',
        'birthday',
        'gender',
        'address',
        'referral_source',
        'consent_status',
        'caution_flag',
        'caution_details',
        'last_visit_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'birthday'          => 'date',
            'caution_flag'      => 'boolean',
            'last_visit_at'     => 'datetime',
        ];
    }

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function signedDocuments(): HasMany
    {
        return $this->hasMany(SignedDocument::class);
    }

    /**
     * Phase 1: LTV集計レコード（user_id 比対 1対1）
     * 既存の patientValues()（hasMany）は残し、
     * 集計参照はこちらを使う。
     */
    public function patientValue(): HasOne
    {
        return $this->hasOne(PatientValue::class)->latestOfMany('updated_at');
    }

    /** @deprecated Phase1以前の hasMany 属性 — patientValue()へ移行は阪せない場所で使用のこと */
    public function patientValues(): HasMany
    {
        return $this->hasMany(PatientValue::class);
    }

    public function lifeEvents(): HasMany
    {
        return $this->hasMany(LifeEvent::class);
    }

    public function narrativeLogs(): HasMany
    {
        return $this->hasMany(NarrativeLog::class);
    }
}
