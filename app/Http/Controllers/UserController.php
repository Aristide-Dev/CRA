<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    // Liste des utilisateurs
    public function index(): Response
    {
        $users = User::all();
        return Inertia::render('Users/Index', compact('users'))->with('success', 'Utilisateur créé avec succès.');
    }

    // Formulaire de création
    public function create(): Response
    {
        return Inertia::render('Users/Create');
    }

    // Enregistrement d'un nouvel utilisateur
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès.');
    }

    // Formulaire d'édition
    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit', compact('user'));
    }

    // Mise à jour d'un utilisateur
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|string',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour avec succès.');
    }

    // Suppression d'un utilisateur
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé avec succès.');
    }
}
