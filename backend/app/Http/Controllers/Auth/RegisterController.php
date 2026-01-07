<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\AuthService;
use App\Services\EmailVerificationService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    
    public function __construct(
        private EmailVerificationService $emailVerificationService
    ) {}

    public function __invoke(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => false 
        ]);

        Log::info('👤 Usuário criado (pendente verificação)', [
            'user_id' => $user->id,
            'email' => $user->email
        ]);

        $codeSent = $this->emailVerificationService->sendVerificationCode($user);
        
        if (!$codeSent) {
            Log::error('⚠️ Falha ao enviar código de verificação', [
                'user_id' => $user->id
            ]);
            
        }

        return response()->json([
            'message' => 'Registro realizado! Verifique seu email para o código de ativação.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => false,
                'email_verified' => false
            ],
            'verification' => [
                'required' => true,
                'code_sent' => $codeSent,
                'expires_in_minutes' => 10
            ]
        ], 201);
    }
}
