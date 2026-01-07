<?php

namespace App\Observers;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class UserRegistrationObserver
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    
    public function created(User $user): void
    {
        Log::info('Novo usuário registrado (pendente verificação)', [
            'user_id' => $user->id,
            'email' => $user->email,
            'time' => now()->toDateTimeString()
        ]);
        
    }

    public function updated(User $user): void
    {
        if ($user->isDirty('email_verified_at') && $user->hasVerifiedEmail()) {
            Log::info('Usuário verificou email - Enviando boas-vindas', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            $this->sendWelcomeNotification($user);
        }
    }

    private function sendWelcomeNotification(User $user): void
    {
        try {
            $this->notificationService->sendWelcomeNotification($user);
            
            Log::info('Notificação de boas-vindas enviada', [
                'user_id' => $user->id
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erro ao enviar notificação de boas-vindas', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}