<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class PasswordController extends Controller
{
    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Se o email existir, um código será enviado.'
            ]);
        }

        $code = random_int(100000, 999999);

        DB::table('password_reset_codes')->updateOrInsert(
            ['email' => $user->email],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        Mail::raw(
            "Seu código de recuperação é: {$code}",
            fn ($m) => $m->to($user->email)->subject('Recuperação de senha')
        );

        return response()->json([
            'message' => 'Se o email existir, um código será enviado.'
        ]);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required'
        ]);

        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        return response()->json([
            'valid' => (bool) $record
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
            'password' => 'required|min:6'
        ]);

        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Código inválido ou expirado'
            ], 422);
        }

        User::where('email', $request->email)
            ->update([
                'password' => Hash::make($request->password)
            ]);

        DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Senha atualizada com sucesso'
        ]);
    }
}
