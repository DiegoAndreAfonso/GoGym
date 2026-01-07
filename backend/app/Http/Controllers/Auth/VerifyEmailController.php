<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Models\User;
use App\Services\AuthService;
use App\Services\EmailVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    public function __construct(
        private EmailVerificationService $emailVerificationService,
        private AuthService $authService
    ) {}

   
    public function verify(VerifyEmailRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        $verificationResult = $this->emailVerificationService->verifyCode(
            $user, 
            $request->code
        );

        if (!$verificationResult['success']) {
            return response()->json([
                'message' => $verificationResult['message']
            ], 422);
        }

        Log::info(' Usuário ativado via verificação de email', [
            'user_id' => $user->id,
            'email' => $user->email
        ]);

        $authData = $this->authService->authenticate($user, $request->password);

        return response()->json([
            'message' => 'Email verificado e conta ativada com sucesso!',
            'user' => $authData['user'],
            'token' => $authData['token'],
            'redirect_to' => '/dashboard' 
        ], 200);
    }

    public function resendCode(VerifyEmailRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email já verificado',
                'redirect_to' => '/login'
            ], 400);
        }

        $result = $this->emailVerificationService->resendVerificationCode($user);

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message']
            ], 400);
        }

        return response()->json([
            'message' => $result['message'],
            'expires_in_minutes' => 10
        ], 200);
    }

    public function checkStatus(string $email): JsonResponse
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        $status = $this->emailVerificationService->checkUserStatus($user);

        return response()->json([
            'status' => $status,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ], 200);
    }
}