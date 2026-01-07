<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailVerificationService
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

 
    public function sendVerificationCode(User $user): bool
    {
        try {
            $code = $user->generateVerificationCode();
            
            Log::info('📧 Código de verificação gerado', [
                'user_id' => $user->id,
                'email' => $user->email,
                'code' => $code
            ]);

            $this->sendVerificationEmail($user, $code);
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('❌ Erro ao enviar código de verificação', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    
    private function sendVerificationEmail(User $user, string $code): void
    {
        $subject = 'Verificação de Email - GoGym';
        $message = "
        Olá {$user->name},
        
        Seu código de verificação é: **{$code}**
        
        Este código expira em 10 minutos.
        
        Se você não solicitou este código, ignore este email.
        
        Atenciosamente,
        Equipe GoGym
        ";

        Mail::raw($message, function ($mail) use ($user, $subject) {
            $mail->to($user->email)
                 ->subject($subject);
        });

       
    }

  
    public function verifyCode(User $user, string $code): array
    {
        if (!$user->isValidVerificationCode($code)) {
            return [
                'success' => false,
                'message' => 'Código inválido ou expirado'
            ];
        }

        $user->markEmailAsVerified();
        
        Log::info('✅ Email verificado com sucesso', [
            'user_id' => $user->id,
            'email' => $user->email
        ]);

        return [
            'success' => true,
            'message' => 'Email verificado com sucesso!',
            'user' => $user->fresh()
        ];
    }

    public function resendVerificationCode(User $user): array
    {
        if ($user->hasVerifiedEmail()) {
            return [
                'success' => false,
                'message' => 'Email já verificado'
            ];
        }

        $recentAttempts = $user->email_verification_sent_at 
            ? $user->email_verification_sent_at->diffInMinutes(now()) < 1
            : false;

        if ($recentAttempts) {
            return [
                'success' => false,
                'message' => 'Aguarde 1 minuto para reenviar'
            ];
        }

        $sent = $this->sendVerificationCode($user);
        
        if (!$sent) {
            return [
                'success' => false,
                'message' => 'Erro ao reenviar código'
            ];
        }

        return [
            'success' => true,
            'message' => 'Código reenviado com sucesso!'
        ];
    }

  
    public function checkUserStatus(User $user): array
    {
        return [
            'email_verified' => $user->hasVerifiedEmail(),
            'is_active' => $user->is_active,
            'can_login' => $user->hasVerifiedEmail() && $user->is_active,
            'verification_code_sent' => !is_null($user->email_verification_sent_at),
            'verification_code_expires_at' => $user->email_verification_code_expires_at
        ];
    }
}