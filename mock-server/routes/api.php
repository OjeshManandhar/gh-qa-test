<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// controllers
use App\Http\Controllers\AuthController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('auth')->group(function () {
  Route::post('/register', [AuthController::class, 'register'])
    ->middleware('auth:sanctum')
    ->can('create', User::class);

  Route::post('/login', [AuthController::class, 'authenticate'])
    ->name('login');

  Route::get('/me', [AuthController::class, 'me'])
    ->middleware('auth:sanctum');
});
