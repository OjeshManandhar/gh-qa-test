<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;

// models
use App\Models\User;
use App\Models\AccessControl;

class UserPolicy {
  public function create(User $curUser): Response {
    error_log('access: ' . json_encode($curUser->role));
    $access = AccessControl::where('role', $curUser->role)
      ->where('entity', 'user')
      ->first();

    return (!empty($access) && boolval($access->canWrite))
      ? Response::allow()
      : Response::denyWithStatus(403, 'You are not authorized to create a user');
  }
}
