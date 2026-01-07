<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('password_reset_codes', function (Blueprint $table) {
            $table->string('token')->nullable()->after('code');
            $table->integer('attempts')->default(0)->after('token');
            $table->string('ip_address')->nullable()->after('attempts');
            $table->text('user_agent')->nullable()->after('ip_address');
        });
    }

    public function down(): void
    {
        Schema::table('password_reset_codes', function (Blueprint $table) {
            $table->dropColumn(['token', 'attempts', 'ip_address', 'user_agent']);
        });
    }
};