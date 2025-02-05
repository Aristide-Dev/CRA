<?php

namespace App\Http\Controllers;

use App\Models\Cra;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CRAController extends Controller
{
    // Afficher la liste des CRAs de l'utilisateur
    public function index()
    {
        return Inertia::render('CRA/Index', [
            'cras' => auth()->user()->cras()
                ->with('activities.project') // Charger les relations
                ->get()
        ]);
    }

    // Afficher le formulaire de création
    public function create()
    {
        return Inertia::render('CRA/Create', [
            'projects' => Project::all() // Pour la liste déroulante des projets
        ]);
    }

    // Enregistrer un nouveau CRA
    public function store(Request $request)
    {
        $validated = $request->validate([
            'month_year' => 'required|date_format:Y-m|unique:cras,month_year,NULL,id,user_id,' . auth()->id(),
        ]);

        // Créer le CRA avec le statut "draft" par défaut
        $cra = auth()->user()->cras()->create([
            'month_year' => $validated['month_year'] . '-01' // Format Y-m-01
        ]);

        return redirect()->route('cra.edit', $cra);
    }

    // Afficher le formulaire d'édition
    public function show(Cra $cra)
    {
        // Autoriser uniquement le propriétaire
        Gate::policy('view', $cra);

        return Inertia::render('CRA/Show', [
            'cra' => $cra->load('activities.project'),
            'projects' => Project::all()
        ]);
    }

    // Afficher le formulaire d'édition
    public function edit(Cra $cra)
    {
        // Autoriser uniquement le propriétaire
        Gate::policy('update', $cra);

        return Inertia::render('CRA/Edit', [
            'cra' => $cra->load('activities.project'),
            'projects' => Project::all()
        ]);
    }

    // Mettre à jour un CRA
    public function update(Request $request, Cra $cra)
    {
        Gate::policy('update', $cra);

        $validated = $request->validate([
            'status' => 'required|in:draft,submitted',
            'activities' => 'array' // Validation des activités (à compléter)
        ]);

        $cra->update($validated);

        // Si soumission, notifier le manager
        if ($validated['status'] === 'submitted') {
            // ... Logique de notification ici ...
        }

        return redirect()->route('cra.index');
    }
}