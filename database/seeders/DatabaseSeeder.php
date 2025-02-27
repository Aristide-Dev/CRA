<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Projet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        
        // User::factory(10)->create();
        User::factory()->create([
            'name' => 'Manager 1',
            'email' => 'manager@cgti.com',
            'password' => Hash::make('password'),
            'role' => 'manager'
        ]);
        
        User::factory()->create([
            'name' => 'Worker 1',
            'email' => 'worker@cgti.com',
            'password' => Hash::make('password'),
            'role' => 'worker',
        ]);

        
        Projet::create(['name' => 'SIGMAE', 'description' => 'Projet SIGMAE']);
        Projet::create(['name' => 'LASSIRI', 'description' => 'Projet LASSIRI']);
        Projet::create(['name' => 'CGUITECH', 'description' => 'Projet CGUITECH']);
        Projet::create(['name' => 'SIVALIM', 'description' => 'Projet SIVALIM']);
        Projet::create(['name' => 'SIGEGUI', 'description' => 'Projet SIGEGUI']);
        Projet::create(['name' => 'SERVIR224', 'description' => 'Projet SERVIR224']);
        Projet::create(['name' => 'Min Transport', 'description' => 'Projet Min Transport']);
        Projet::create(['name' => 'La Poste', 'description' => 'Projet La Poste']);
        Projet::create(['name' => 'Autre', 'description' => 'Projet Autre']);
    }
}
