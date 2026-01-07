<?php

namespace App\Providers;

use App\Models\User;
use App\Observers\PasswordResetObserver;
use App\Observers\UserRegistrationObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
     public function register(): void
    {
        $this->app->singleton(\App\Services\PasswordResetService::class);
        
        $this->app->singleton(\App\Services\EmailVerificationService::class, function ($app) {
            return new \App\Services\EmailVerificationService(
                $app->make(\App\Services\NotificationService::class)
            );
        });
    }
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
         (new PasswordResetObserver())->register();
        User::observe(UserRegistrationObserver::class);
        
    }
}
