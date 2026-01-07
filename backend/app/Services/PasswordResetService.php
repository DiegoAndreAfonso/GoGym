<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetService
{
    
    public function sendResetCode(string $email): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            Log::info('Tentativa de recuperação para email não cadastrado', [
                'email' => $email,
                'ip' => request()->ip()
            ]);
            
            return [
                'success' => true,
                'message' => 'Se o email existir, um código será enviado.',
                'email_sent' => false
            ];
        }

        if ($this->hasTooManyAttempts($user)) {
            Log::warning(' Muitas tentativas de recuperação de senha', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => request()->ip()
            ]);
            
            return [
                'success' => true,
                'message' => 'Se o email existir, um código será enviado.',
                'email_sent' => false,
                'rate_limited' => true
            ];
        }

        $code = $this->generateUniqueCode($user->email);
        
        DB::table('password_reset_codes')->updateOrInsert(
            ['email' => $user->email],
            [
                'code' => $code,
                'token' => Str::random(60),
                'expires_at' => now()->addMinutes(15),
                'attempts' => 0,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $emailSent = $this->sendResetEmail($user, $code);
        
        if ($emailSent) {
            Log::info('Código de recuperação enviado', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
        }

        return [
            'success' => true,
            'message' => 'Se o email existir, um código será enviado.',
            'email_sent' => $emailSent,
            'expires_in_minutes' => 15
        ];
    }

   
    public function verifyCode(string $email, string $code): array
    {
        $record = DB::table('password_reset_codes')
            ->where('email', $email)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            Log::warning('Tentativa de código inválido', [
                'email' => $email,
                'code' => $code,
                'ip' => request()->ip()
            ]);
            
            return [
                'valid' => false,
                'message' => 'Código inválido ou expirado'
            ];
        }

        DB::table('password_reset_codes')
            ->where('email', $email)
            ->where('code', $code)
            ->increment('attempts');

        Log::info('Código de recuperação verificado', [
            'email' => $email,
            'code_valid' => true
        ]);

        return [
            'valid' => true,
            'message' => 'Código válido',
            'token' => $record->token,
            'expires_at' => $record->expires_at->toDateTimeString()
        ];
    }


    public function resetPassword(string $email, string $code, string $token, string $newPassword): array
    {
        $record = DB::table('password_reset_codes')
            ->where('email', $email)
            ->where('code', $code)
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            Log::error('Tentativa de reset com dados inválidos', [
                'email' => $email,
                'ip' => request()->ip()
            ]);
            
            return [
                'success' => false,
                'message' => 'Dados inválidos ou expirados'
            ];
        }

        if ($record->attempts >= 5) {
            Log::alert('Muitas tentativas de verificação de código', [
                'email' => $email,
                'attempts' => $record->attempts,
                'ip' => request()->ip()
            ]);
            
            DB::table('password_reset_codes')->where('email', $email)->delete();
            
            return [
                'success' => false,
                'message' => 'Muitas tentativas. Solicite um novo código.'
            ];
        }

        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Usuário não encontrado'
            ];
        }

        if (Hash::check($newPassword, $user->password)) {
            Log::info(' Tentativa de usar senha antiga', [
                'user_id' => $user->id,
                'email' => $email
            ]);
            
            return [
                'success' => false,
                'message' => 'A nova senha não pode ser igual à senha atual'
            ];
        }

        $user->update([
            'password' => Hash::make($newPassword)
        ]);

        $user->tokens()->delete();

        DB::table('password_reset_codes')->where('email', $email)->delete();

        Log::info(' Senha resetada com sucesso', [
            'user_id' => $user->id,
            'email' => $email,
            'reset_at' => now()
        ]);

        return [
            'success' => true,
            'message' => 'Senha atualizada com sucesso!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ];
    }

  
    private function generateUniqueCode(string $email): string
    {
        do {
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            $exists = DB::table('password_reset_codes')
                ->where('email', $email)
                ->where('code', $code)
                ->exists();
                
        } while ($exists);

        return $code;
    }

   
    private function sendResetEmail(User $user, string $code): bool
    {
        try {
            $appName = config('app.name', 'GoGym');
            $expiresIn = 15;
            
            $subject = "Recuperação de Senha - {$appName}";
            $message = "Olá {$user->name},\n\n";
            $message .= "Recebemos uma solicitação para redefinir sua senha na {$appName}.\n\n";
            $message .= "Seu código de recuperação é: **{$code}**\n\n";
            $message .= "Este código expira em {$expiresIn} minutos.\n\n";
            $message .= "Se você não solicitou a recuperação de senha, ignore este email.\n\n";
            $message .= "Atenciosamente,\nEquipe {$appName}";
            
            Mail::raw($message, function ($mail) use ($user, $subject) {
                $mail->to($user->email)
                     ->subject($subject);
            });
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email de recuperação', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    

    private function hasTooManyAttempts(User $user): bool
    {
        $recentAttempts = DB::table('password_reset_codes')
            ->where('email', $user->email)
            ->where('created_at', '>', now()->subMinutes(15))
            ->count();
            
        return $recentAttempts >= 3;
    }

  
    public function checkCodeStatus(string $email, string $code): array
    {
        $record = DB::table('password_reset_codes')
            ->where('email', $email)
            ->where('code', $code)
            ->first();
            
        if (!$record) {
            return [
                'exists' => false,
                'message' => 'Código não encontrado'
            ];
        }
        
        $isExpired = now()->greaterThan($record->expires_at);
        
        return [
            'exists' => true,
            'expired' => $isExpired,
            'expires_at' => $record->expires_at->toDateTimeString(),
            'attempts' => $record->attempts,
            'created_at' => $record->created_at->toDateTimeString(),
            'minutes_remaining' => $isExpired ? 0 : now()->diffInMinutes($record->expires_at, false)
        ];
    }
}