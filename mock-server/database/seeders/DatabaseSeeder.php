<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;
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

    // create access controls
    DB::table('access_controls')->insert([
      'id' => Str::uuid(),
      'role' => 'admin',
      'entity' => 'user',
      'canRead' => true,
      'canWrite' => true,
      'canDelete' => true,
    ]);
    DB::table('access_controls')->insert([
      'id' => Str::uuid(),
      'role' => 'admin',
      'entity' => 'item',
      'canRead' => true,
      'canWrite' => true,
      'canDelete' => true,
    ]);
    DB::table('access_controls')->insert([
      'id' => Str::uuid(),
      'role' => 'user',
      'entity' => 'item',
      'canRead' => true,
      'canWrite' => true,
      'canDelete' => false,
    ]);
    DB::table('access_controls')->insert([
      'id' => Str::uuid(),
      'role' => 'guest',
      'entity' => 'item',
      'canRead' => true,
      'canWrite' => false,
      'canDelete' => false,
    ]);

    // create admin
    \App\Models\User::factory()->create([
      'name' => 'admin',
      'email' => 'admin@test.com',
      'role' => 'admin',
    ]);

    // \App\Models\User::factory(10)->create();
  }
}
