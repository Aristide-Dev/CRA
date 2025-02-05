<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Project;
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

        
        Project::create(['name' => 'SIGMAE', 'description' => 'Projet SIGMAE']);
        Project::create(['name' => 'LASSIRI', 'description' => 'Projet LASSIRI']);
        Project::create(['name' => 'CGUITECH', 'description' => 'Projet CGUITECH']);
        Project::create(['name' => 'SIVALIM', 'description' => 'Projet SIVALIM']);
        Project::create(['name' => 'SIGEGUI', 'description' => 'Projet SIGEGUI']);
        Project::create(['name' => 'SERVIR224', 'description' => 'Projet SERVIR224']);
        Project::create(['name' => 'Min Transport', 'description' => 'Projet Min Transport']);
        Project::create(['name' => 'La Poste', 'description' => 'Projet La Poste']);
        Project::create(['name' => 'Autre', 'description' => 'Projet Autre']);
    }
}
