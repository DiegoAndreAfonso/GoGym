<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function __invoke(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Não autenticado'
            ], 401);
        }

        $this->authService->logout($user);

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }
}
