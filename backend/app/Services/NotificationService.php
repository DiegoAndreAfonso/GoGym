<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    private string $apiUrl;
    private bool $enabled;

    public function __construct()
    {
        $this->apiUrl = config('services.notification.api_url', 'https://api.notificacoes.com/v1');
        $this->enabled = config('services.notification.enabled', true);
    }

    public function sendToUser(User $user, array $data): bool
    {
        if (!$this->enabled) {
            Log::info('Notificações desativadas (modo desenvolvimento)', [
                'user_id' => $user->id,
                'simulated_data' => $data
            ]);
            return true; 
        }

        try {
            Log::debug('Enviando notificação para API', [
                'user_id' => $user->id,
                'api_url' => $this->apiUrl
            ]);

            /** @var Response $response */
            $response = Http::timeout(5) 
                ->retry(2, 100) 
                ->post("{$this->apiUrl}/notifications", [
                    'user_email' => $user->email,
                    'user_name' => $user->name,
                    'notification' => $data,
                    'sent_at' => now()->toISOString()
                ]);

            $statusCode = $response->status();
            $isSuccessful = $statusCode >= 200 && $statusCode < 300;
            
            if ($isSuccessful) {
                Log::info('Notificação enviada com sucesso', [
                    'user_id' => $user->id,
                    'status' => $statusCode,
                    'response' => $response->json()
                ]);
                return true;
            }

            Log::warning('API retornou erro', [
                'user_id' => $user->id,
                'status' => $statusCode,
                'response' => $response->body()
            ]);
            
            $this->saveLocalLog($user, $data);
            return false;

        } catch (\Exception $e) {
            Log::error('Falha ao enviar notificação', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'api_url' => $this->apiUrl
            ]);
            
            $this->saveLocalLog($user, $data);
            return false;
        }
    }

    private function saveLocalLog(User $user, array $data): void
    {
        Log::info('Notificação salva localmente (fallback)', [
            'user_id' => $user->id,
            'data' => $data,
            'saved_at' => now()->toDateTimeString()
        ]);
       
    }
    
    public function sendWelcomeNotification(User $user): bool
    {
        return $this->sendToUser($user, [
            'type' => 'welcome',
            'title' => 'Bem-vindo ao GoGym!',
            'message' => "Olá {$user->name}, seu cadastro foi realizado com sucesso! ",
            'priority' => 'high',
            'metadata' => [
                'user_id' => $user->id,
                'registration_date' => $user->created_at->toISOString(),
                'app_name' => config('app.name', 'GoGym')
            ]
        ]);
    }
}