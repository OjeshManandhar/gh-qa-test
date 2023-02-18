<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder {
  /**
   * Seed the application's database.
   */
  public function run(): void {
    // create roles
    DB::table('roles')->insert(['name' => 'admin']);
    DB::table('roles')->insert(['name' => 'user']);
    DB::table('roles')->insert(['name' => 'guest']);

    // create admin
    \App\Models\User::factory()->create([
      'name' => 'admin',
      'email' => 'admin@test.com',
      'role' => 'admin',
    ]);

    // \App\Models\User::factory(10)->create();
  }
}
