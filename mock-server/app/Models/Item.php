<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Item extends Model {
  use HasUuids, HasFactory;

  protected $fillable = ['user_id', 'name', 'description', 'price'];

  public function role(): BelongsTo {
    return $this->belongsTo(User::class, 'user_id', 'id');
  }
}
