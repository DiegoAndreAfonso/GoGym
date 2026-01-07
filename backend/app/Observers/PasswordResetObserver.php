<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PasswordResetObserver
{
   
    public function register(): void
    {
        DB::table('password_reset_codes')->beforeQuery(function ($query) {
            if ($query->method === 'insert') {
                Log::channel('security')->info('📧 Código de recuperação criado', [
                    'email' => $query->bindings['email'] ?? 'unknown',
                    'created_at' => now(),
                    'ip' => request()->ip()
                ]);
            }
        });

        DB::table('users')->beforeQuery(function ($query) {
            if ($query->method === 'update' && 
                isset($query->bindings['password'])) {
                
                Log::channel('security')->alert('🔐 SENHA ALTERADA via recovery', [
                    'email' => $this->extractEmailFromWhere($query),
                    'changed_at' => now(),
                    'ip' => request()->ip(),
                    'user_agent' => request()->userAgent()
                ]);
            }
        });
    }

 
    private function extractEmailFromWhere($query): string
    {
        if (isset($query->bindings['email'])) {
            return $query->bindings['email'];
        }
        
        foreach ($query->wheres as $where) {
            if ($where['column'] === 'email' && isset($where['value'])) {
                return $where['value'];
            }
        }
        
        return 'unknown';
    }
}