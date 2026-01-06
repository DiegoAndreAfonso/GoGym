<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class EnsureSingleSession
{
    public function handle(Request $request, Closure $next)
    {
        $tokenModel = $request->user()->currentAccessToken();

        if ($tokenModel->expires_at->diffInDays(now()) <= 2) {
            $tokenModel->delete();

            $newToken = $request->user()->createToken(
                'mobile',
                ['*'],
                now()->addDays(30)
            )->plainTextToken;

            return response()->json([
                'token' => $newToken
            ]);
        }
    }
}
