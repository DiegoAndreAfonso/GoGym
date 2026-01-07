<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$users = DB::table('users')->get();
echo "Total de usuários: " . $users->count() . "\n";
foreach ($users as $user) {
    echo "- {$user->id}: {$user->email}\n";
}
