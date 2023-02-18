<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('access_controls', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->timestamps();
      $table->string('role')->nullable(false)->default();
      $table->string('entity')->nullable(false)->default();
      $table->boolean('canRead')->nullable(false)->default(false);
      $table->boolean('canWrite')->nullable(false)->default(false);
      $table->boolean('canDelete')->nullable(false)->default(false);

      $table->foreign('role')->references('name')->on('roles');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::dropIfExists('access_controls');
  }
};
