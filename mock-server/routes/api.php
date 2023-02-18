<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;

// models
use App\Models\User;
use App\Models\Item;

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

Route::prefix('items')->group(function () {
  Route::get('/', [ItemController::class, 'index']);

  Route::get('/{item}', [ItemController::class, 'show']);

  Route::post('/', [ItemController::class, 'store'])
    ->middleware('auth:sanctum')
    ->can('create', Item::class);

  Route::put('/{item}', [ItemController::class, 'update'])
    ->middleware('auth:sanctum')
    ->can('update', 'item');

  Route::delete('/{item}', [ItemController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->can('delete', 'item');
});
