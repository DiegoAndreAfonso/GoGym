<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class AuthService
{
    public function authenticate(User $user, string $plainPassword): array
    {
        if (!Hash::check($plainPassword, $user->password)) {
            throw new UnauthorizedHttpException('', 'Credenciais inválidas');
        }

        if (!$user->hasVerifiedEmail()) {
            throw new UnauthorizedHttpException('', 'Email não verificado. Verifique seu email.');
        }

        if (!$user->is_active) {
            throw new UnauthorizedHttpException('', 'Conta inativa. Entre em contato com o suporte.');
        }

        $user->tokens()
            ->where('name', 'mobile')
            ->delete();

        $token = $user->createToken(
            'mobile',
            ['*'],
            now()->addDays(30)
        )->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}
