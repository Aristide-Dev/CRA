<?php

namespace App\Http\Controllers;

use App\Models\Cra;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Activity;
use App\Models\Activitie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ActivityController extends Controller
{
    // Ajouter une activité à un CRA
    public function store(Request $request, Cra $cra)
    {
        // Affiche l'ensemble des données envoyées
        // $data = $request->all();
        // dd($data,$request);
    
        // Exemple de validation pour un tableau d'activités
        $validated = $request->validate([
            'date' => 'required|date',
            'projet_id' => 'required|exists:projets,id',
            'type' => 'required',
            'duration' => 'required|numeric|min:0.5|max:24',
            'remarks' => 'nullable|string',
        ]);
    
        $cra->activities()->create($validated);
    
        return redirect()->back()->with('success', 'Activités ajoutées !');
    }
    

    public function update(Request $request, $activity_id)
    {
        // $data = $request->all();
        // dd($data,$request);
        $validated = $request->validate([
            'date' => 'required|date',
            'projet_id' => 'required|exists:projets,id',
            'type' => 'required',
            'duration' => 'required|numeric|min:0.5|max:24',
            'remarks' => 'nullable|string'
        ]);
    
        $activity = Activitie::findOrFail($activity_id);
        $activity->update($validated);
        $cra = $activity->cra;
        return redirect()->back()->with('success', 'Activités  mise à jour avec succès !');
    }
    
    

    // Supprimer une activité
    public function destroy( $activity_id)
    {
        $activity = Activity::findorFail($activity_id);
        Gate::policy('delete', $activity->cra);

        $activity->delete();
        $cra = $activity->cra;

        return redirect()->back()->with('success', 'Activité supprimée.');
    }
}