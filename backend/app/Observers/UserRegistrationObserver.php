<?php


namespace App\Observers;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class UserRegistrationObserver
{
    /**
     * Serviço para enviar notificações
     */
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Handle the User "created" event.
     * Disparado APENAS quando um novo usuário é criado (registrado)
     */
    public function created(User $user): void
    {
        Log::info('📝 Observer: Novo usuário registrado', [
            'user_id' => $user->id,
            'email' => $user->email,
            'time' => now()->toDateTimeString()
        ]);

        try {
            $this->notificationService->sendWelcomeNotification($user);
           

            Log::info('✅ Notificação de registro enviada com sucesso', [
                'user_id' => $user->id
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao enviar notificação de registro', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // IMPORTANTE: Não lançamos exceção para não quebrar o fluxo do usuário
            // O registro já foi feito, a notificação é um "plus"
        }
    }

    /**
     * Envia notificação de boas-vindas via API
     */
    private function sendWelcomeNotification(User $user): void
    {
        $message = "🎉 Bem-vindo, {$user->name}! Seu cadastro foi realizado com sucesso.";

        // Aqui você pode:
        // 1. Chamar uma API externa
        // 2. Enviar email
        // 3. Enviar push notification
        // 4. Registrar no sistema de notificações interno

        // Exemplo com nosso NotificationService
        $this->notificationService->sendToUser($user, [
            'type' => 'welcome',
            'title' => 'Cadastro realizado!',
            'message' => $message,
            'metadata' => [
                'user_id' => $user->id,
                'registration_date' => $user->created_at->toISOString()
            ]
        ]);

        // Você também pode usar jobs para processar em background:
        // dispatch(new SendWelcomeNotificationJob($user));
    }

    /**
     * NOTA: Não implementamos outros métodos (updated, deleted, etc)
     * porque este observer é ESPECÍFICO para registro.
     * Se precisar de outras funcionalidades, crie observers separados.
     */
}
