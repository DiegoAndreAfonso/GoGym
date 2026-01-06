<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class UserRegistrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function deve_criar_usuario_e_disparar_observer()
    {
        // Mock do Log para verificar
        Log::shouldReceive('info')
            ->atLeast()->once()
            ->with('📝 Observer: Novo usuário registrado', \Mockery::any());
        
        Log::shouldReceive('info')
            ->atLeast()->once()
            ->with('✅ Notificação de registro enviada com sucesso', \Mockery::any());

        // Criar usuário diretamente (dispara observer)
        $user = User::create([
            'name' => 'Teste Observer',
            'email' => 'observer@test.com',
            'password' => bcrypt('password123'),
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'observer@test.com'
        ]);
    }

    /** @test */
    public function endpoint_registro_deve_funcionar_com_observer()
    {
        // Dados para registro
        $userData = [
            'name' => 'Novo Usuário',
            'email' => 'novo@teste.com',
            'password' => 'Senha123@',
            'password_confirmation' => 'Senha123@',
        ];

        $response = $this->postJson('/auth/register', $userData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user', 'token'
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'novo@teste.com'
        ]);
    }
}