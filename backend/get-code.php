<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$code = DB::table('password_reset_codes')->where('email', 'kennedyp.contato@gmail.com')->first();
if ($code) {
    echo "Código: {$code->code}\n";
    echo "Token: {$code->token}\n";
    echo "Expira: {$code->expires_at}\n";
    
    // Mostrar comando para testar
    echo "\nComando para verificar:\n";
    echo "curl -X POST http://localhost:8000/api/v1/password/verify \\\n";
    echo "  -H \\"Content-Type: application/json\\" \\\n";
    echo "  -d '{\\"email\\":\\"kennedyp.contato@gmail.com\\",\\"code\\":\\"{$code->code}\\"}'\n";
} else {
    echo "Nenhum código encontrado para kennedyp.contato@gmail.com\n";
}
