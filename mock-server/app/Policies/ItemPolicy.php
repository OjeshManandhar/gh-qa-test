<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;

// models
use App\Models\Item;
use App\Models\User;
use App\Models\AccessControl;

class ItemPolicy {
  /**
   * Determine whether the user can view any models.
   */
  public function viewAny(?User $user): Response {
    return Response::allow();
  }

  /**
   * Determine whether the user can view the model.
   */
  public function view(User $user, Item $item): Response {
    return Response::allow();
  }

  /**
   * Determine whether the user can create models.
   */
  public function create(User $user): Response {
    $access = AccessControl::where('role', $user->role)
      ->where('entity', 'item')
      ->first();

    return (!empty($access) && boolval($access->canWrite))
      ? Response::allow()
      : Response::denyWithStatus(403, 'You are not authorized to create an item');
  }

  /**
   * Determine whether the user can update the model.
   */
  public function update(User $user, Item $item): Response {
    $access = AccessControl::where('role', $user->role)
      ->where('entity', 'item')
      ->first();

    if (empty($access) || !boolval($access->canWrite)) {
      return Response::denyWithStatus(403, 'You are not authorized to update items');
    }

    if ($user->role === 'admin' || $user->id === $item->user_id) {
      return Response::allow();
    }

    return Response::denyWithStatus(403, 'You are not authorized to update this item');
  }

  /**
   * Determine whether the user can delete the model.
   */
  public function delete(User $user, Item $item): Response {
    $access = AccessControl::where('role', $user->role)
      ->where('entity', 'item')
      ->first();

    if (empty($access) || !boolval($access->canDelete)) {
      return Response::denyWithStatus(403, 'You are not authorized to delete items');
    }

    return Response::allow();
  }

  /**
   * Determine whether the user can restore the model.
   */
  public function restore(User $user, Item $item): Response {
    return Response::denyWithStatus(501, 'Not implemented');
  }

  /**
   * Determine whether the user can permanently delete the model.
   */
  public function forceDelete(User $user, Item $item): Response {
    return Response::denyWithStatus(501, 'Not implemented');
  }
}
