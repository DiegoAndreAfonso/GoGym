<?php

namespace App\Collections;

use Illuminate\Http\Resources\Json\JsonResource;

class VerificationCollection extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'is_active' => $this->is_active,
            'email_verified' => !is_null($this->email_verified_at),
            'verification_status' => [
                'code_sent' => !is_null($this->email_verification_sent_at),
                'code_expires_at' => $this->email_verification_code_expires_at,
                'expires_in_minutes' => $this->email_verification_code_expires_at 
                    ? now()->diffInMinutes($this->email_verification_code_expires_at, false)
                    : null
            ],
            'created_at' => $this->created_at->toDateTimeString(),
            'links' => [
                'verify' => route('auth.verify'),
                'resend_code' => route('auth.verify.resend')
            ]
        ];
    }
}