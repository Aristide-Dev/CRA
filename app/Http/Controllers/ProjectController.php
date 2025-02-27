<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Projet;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    // Liste des projets
    public function index()
    {
        $projects = Projet::all();
        return Inertia::render('Projects/Index', compact('projects'));
    }

    // Formulaire de création
    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    // Enregistrement d'un nouveau projet
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        Projet::create($validated);

        return redirect()->route('projects.index')->with('success', 'Projet créé avec succès.');
    }

    // Affichage d'un projet spécifique
    public function show(Projet $project)
    {
        return Inertia::render('Projects/Show', compact('project'));
    }

    // Formulaire d'édition
    public function edit(Projet $project)
    {
        return Inertia::render('Projects/Edit', compact('project'));
    }

    // Mise à jour d'un projet
    public function update(Request $request, Projet $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $project->update($validated);

        return redirect()->route('projects.index')->with('success', 'Projet mis à jour avec succès.');
    }

    // Suppression d'un projet
    public function destroy(Projet $project)
    {
        if ($project->activities()->exists()) {
            return redirect()->route('projects.index')->with('error', 'Impossible de supprimer ce projet car il contient des activités.');
        }
        
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Projet supprimé avec succès.');
    }
}