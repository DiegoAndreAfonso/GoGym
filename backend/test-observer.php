<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "=== TESTE OBSERVER ===\n\n";

// Limpar log
file_put_contents(storage_path('logs/laravel.log'), '');

echo "1. Criando usuário...\n";

try {
    $user = User::create([
        'name' => 'Teste Script',
        'email' => 'teste.script@observer.com',
        'password' => bcrypt('senha123'),
    ]);
    
    echo "   ✓ Usuário criado: ID {$user->id}\n";
    
    // Dar um tempo para o observer processar
    sleep(1);
    
    // Ler o log
    $logContent = file_get_contents(storage_path('logs/laravel.log'));
    
    echo "\n2. Verificando logs...\n";
    
    if (empty($logContent)) {
        echo "   ⚠️ Log vazio - Observer pode não ter sido disparado\n";
    } else {
        echo "   Conteúdo do log:\n";
        echo "   " . str_repeat("-", 50) . "\n";
        echo $logContent . "\n";
        echo "   " . str_repeat("-", 50) . "\n";
        
        if (strpos($logContent, 'Observer: Novo usuário registrado') !== false) {
            echo "   ✓ Observer disparado com sucesso!\n";
        } else {
            echo "   ✗ Observer NÃO foi disparado\n";
        }
    }
    
    echo "\n3. Verificando banco de dados...\n";
    $exists = User::where('email', 'teste.script@observer.com')->exists();
    echo "   Usuário no banco: " . ($exists ? '✓ SIM' : '✗ NÃO') . "\n";
    
} catch (Exception $e) {
    echo "   ✗ Erro: " . $e->getMessage() . "\n";
    echo "   Trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== FIM DO TESTE ===\n";