<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    
    public function __invoke(RegisterRequest $request, AuthService $auth)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(
            $auth->authenticate($user, $request->password),
            201
        );
    }
}
