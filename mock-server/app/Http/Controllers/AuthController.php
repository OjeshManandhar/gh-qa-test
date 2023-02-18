<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

// models
use App\Models\User;

// resources
use App\Http\Resources\UserResource;

class AuthController extends Controller {
  public function me() {
    return new UserResource(request()->user());
  }

  public function register() {
    $body = request()->validate([
      'name' => ['required', 'string', 'min:4', 'max:30'],
      'email' => ['required', 'email', Rule::unique('users', 'email')],
      'password' => ['required', 'min:8']
    ]);

    $body['password'] = Hash::make($body['password']);
    $body['role'] = 'user';

    $user = User::create($body);
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json(['token' => $token], 200);
  }

  public function authenticate() {
    $validator = Validator::make(request()->all(), [
      'email' => ['required', 'email'],
      'password' => ['required']
    ]);

    if ($validator->fails()) {
      return response()->json([
        'message' => 'Invalid input',
        'errors' => $validator->errors()
      ], 400);
    }

    $body = $validator->validated();
    // error_log('body: ' . json_encode($body));

    if (auth()->attempt($body)) {
      /** @var \App\Models\User $user **/
      $user = auth()->user();
      $user->tokens()->delete();
      $token = $user->createToken('auth_token')->plainTextToken;

      return response()->json(['token' => $token], 200);
    }

    return response()->json(
      [
        "message" => "Invalid email or password",
        "errors" => []
      ],
      401
    );
  }
}
