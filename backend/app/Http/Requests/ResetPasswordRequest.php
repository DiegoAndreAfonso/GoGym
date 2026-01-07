<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|max:255',
            'code' => 'required|string|size:6',
            'token' => 'required|string',
            'password' => [
                'required',
                'confirmed',
                'min:6'
                // Se quiser mais segurança, use:
                // Password::min(8)->letters()->mixedCase()->numbers()->symbols()
            ]
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'O email é obrigatório',
            'code.required' => 'O código é obrigatório',
            'code.size' => 'O código deve ter 6 dígitos',
            'token.required' => 'Token de segurança é necessário',
            'password.required' => 'A nova senha é obrigatória',
            'password.confirmed' => 'A confirmação de senha não corresponde',
            'password.min' => 'A senha deve ter no mínimo 6 caracteres'
        ];
    }
}