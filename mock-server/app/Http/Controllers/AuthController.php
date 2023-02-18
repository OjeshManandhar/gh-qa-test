<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;

// resources
use App\Http\Resources\UserResource;

class AuthController extends Controller {
  public function me() {
    return new UserResource(request()->user());
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
