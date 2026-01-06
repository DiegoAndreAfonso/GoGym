<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordController;

Route::prefix('password')->controller(PasswordController::class)->group(function () {
    Route::post('/forgot', 'sendResetCode');
    Route::post('/verify', 'verifyCode');
    Route::post('/reset', 'resetPassword');
});
