<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('password_reset_codes', function (Blueprint $table) {
            if (!Schema::hasColumn('password_reset_codes', 'token')) {
                $table->string('token')->nullable()->after('code');
            }
            if (!Schema::hasColumn('password_reset_codes', 'attempts')) {
                $table->integer('attempts')->default(0)->after('token');
            }
            if (!Schema::hasColumn('password_reset_codes', 'ip_address')) {
                $table->string('ip_address')->nullable()->after('attempts');
            }
            if (!Schema::hasColumn('password_reset_codes', 'user_agent')) {
                $table->text('user_agent')->nullable()->after('ip_address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('password_reset_codes', function (Blueprint $table) {
            $table->dropColumn(['token', 'attempts', 'ip_address', 'user_agent']);
        });
    }
};