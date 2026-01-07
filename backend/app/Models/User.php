<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verification_code',
        'email_verified_at',
        'email_verification_sent_at',
        'email_verification_code_expires_at',
        'is_active'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verification_code'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'email_verification_sent_at' => 'datetime',
        'email_verification_code_expires_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }

  
    public function isVerificationCodeExpired(): bool
    {
        if (!$this->email_verification_code_expires_at) {
            return true;
        }
        
        return now()->greaterThan($this->email_verification_code_expires_at);
    }

    
    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
            'is_active' => true,
            'email_verification_code' => null,
            'email_verification_code_expires_at' => null
        ])->save();
    }

    
    public function generateVerificationCode(): string
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $this->forceFill([
            'email_verification_code' => $code,
            'email_verification_sent_at' => now(),
            'email_verification_code_expires_at' => now()->addMinutes(10) // 10 minutos de validade
        ])->save();
        
        return $code;
    }

    
    public function isValidVerificationCode(string $code): bool
    {
        if ($this->isVerificationCodeExpired()) {
            return false;
        }
        
        return hash_equals($this->email_verification_code, $code);
    }

}
