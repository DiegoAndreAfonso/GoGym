<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PasswordController extends Controller
{
    
    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            Log::info('Email não encontrado para recuperação', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'message' => 'Se o email existir, um código será enviado.'
            ]);
        }

        $recentAttempts = DB::table('password_reset_codes')
            ->where('email', $user->email)
            ->where('created_at', '>', now()->subMinutes(15))
            ->count();
            
        if ($recentAttempts >= 3) {
            Log::warning('Muitas tentativas de recuperação', [
                'user_id' => $user->id,
                'email' => $user->email,
                'attempts' => $recentAttempts
            ]);
            
            return response()->json([
                'message' => 'Se o email existir, um código será enviado.'
            ]);
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $token = Str::random(60);

        DB::table('password_reset_codes')->updateOrInsert(
            ['email' => $user->email],
            [
                'code' => $code,
                'token' => $token,
                'expires_at' => now()->addMinutes(15),
                'attempts' => 0,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $appName = config('app.name', 'GoGym');
        $subject = "Recuperação de Senha - {$appName}";
        $message = "Olá {$user->name},\n\n";
        $message .= "Seu código de recuperação é: **{$code}**\n\n";
        $message .= "Este código expira em 15 minutos.\n\n";
        $message .= "Se você não solicitou a recuperação de senha, ignore este email.\n\n";
        $message .= "Atenciosamente,\nEquipe {$appName}";

        try {
            Mail::raw($message, function ($mail) use ($user, $subject) {
                $mail->to($user->email)
                     ->subject($subject);
            });
            
            Log::info('Código de recuperação enviado', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }

        return response()->json([
            'message' => 'Se o email existir, um código será enviado.',
            'expires_in_minutes' => 15
        ]);
    }


    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            Log::warning('Código inválido ou expirado', [
                'email' => $request->email,
                'code' => $request->code,
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'valid' => false,
                'message' => 'Código inválido ou expirado'
            ], 422);
        }

        DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->increment('attempts');

        Log::info('Código verificado com sucesso', [
            'email' => $request->email
        ]);

        return response()->json([
            'valid' => true,
            'message' => 'Código válido',
            'token' => $record->token,
            'expires_at' => $record->expires_at
        ]);
    }


    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'token' => 'required|string',
            'password' => 'required|min:6|confirmed'
        ]);

        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->where('token', $request->token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            Log::error('Dados inválidos para reset', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'message' => 'Dados inválidos ou expirados'
            ], 422);
        }

        if ($record->attempts >= 5) {
            Log::alert('Muitas tentativas de verificação', [
                'email' => $request->email,
                'attempts' => $record->attempts
            ]);
            
            DB::table('password_reset_codes')->where('email', $request->email)->delete();
            
            return response()->json([
                'message' => 'Muitas tentativas. Solicite um novo código.'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        if (Hash::check($request->password, $user->password)) {
            Log::info('Tentativa de usar senha antiga', [
                'user_id' => $user->id,
                'email' => $request->email
            ]);
            
            return response()->json([
                'message' => 'A nova senha não pode ser igual à senha atual'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        $user->tokens()->delete();

        DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->delete();

        Log::info('Senha resetada com sucesso', [
            'user_id' => $user->id,
            'email' => $request->email
        ]);

        return response()->json([
            'message' => 'Senha atualizada com sucesso!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ]);
    }


    public function checkCodeStatus(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();
            
        if (!$record) {
            return response()->json([
                'exists' => false,
                'message' => 'Código não encontrado'
            ]);
        }
        
        $isExpired = now()->greaterThan($record->expires_at);
        
        return response()->json([
            'exists' => true,
            'expired' => $isExpired,
            'expires_at' => $record->expires_at,
            'attempts' => $record->attempts,
            'minutes_remaining' => $isExpired ? 0 : now()->diffInMinutes($record->expires_at, false)
        ]);
    }
}