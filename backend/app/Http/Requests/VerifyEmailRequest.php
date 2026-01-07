<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyEmailRequest extends FormRequest
{
    public function rules(): array
    {
        if ($this->routeIs('auth.verify')) {
            return [
                'email' => 'required|email|exists:users,email',
                'code' => 'required|string|size:6',
                'password' => 'required|string' 
            ];
        }

        if ($this->routeIs('auth.verify.resend')) {
            return [
                'email' => 'required|email|exists:users,email'
            ];
        }

        return [];
    }

    public function messages(): array
    {
        return [
            'code.size' => 'O código deve ter 6 dígitos',
            'email.exists' => 'Email não encontrado',
            'password.required' => 'A senha é necessária para ativação'
        ];
    }
}