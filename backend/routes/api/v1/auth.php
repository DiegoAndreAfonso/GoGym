<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Http\Request;


Route::prefix('auth')->group(function () {
    Route::post('/register', RegisterController::class);
    
    Route::prefix('/verify-email')->controller(VerifyEmailController::class)->group(function () {
        Route::post('/', 'verify')->name('auth.verify');
        Route::post('/resend', 'resendCode')->name('auth.verify.resend');
        Route::get('/status/{email}', 'checkStatus');
    });
    
    Route::post('/login', LoginController::class);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', fn (Request $r) => $r->user());
        Route::post('/logout', LogoutController::class);
    });
});