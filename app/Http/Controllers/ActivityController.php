<?php

namespace App\Http\Controllers;

use App\Models\Cra;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Activity;
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
            'project_id' => 'required|exists:projects,id',
            'type' => 'required|in:development,research,training,meeting',
            'duration' => 'required|numeric|min:0.5|max:24',
            'remarks' => 'nullable|string',
        ]);
    
        $cra->activities()->create($validated);
    
        return redirect()->route('cra.show', $cra)->with('success', 'Activités ajoutées !');
    }
    

    public function update(Request $request, $activity_id)
    {
        // $data = $request->all();
        // dd($data,$request);
        $validated = $request->validate([
            'date' => 'required|date',
            'project_id' => 'required|exists:projects,id',
            'type' => 'required|in:development,research,training,meeting',
            'duration' => 'required|numeric|min:0.5|max:24',
            'remarks' => 'nullable|string'
        ]);
    
        $activity = Activity::findOrFail($activity_id);
        $activity->update($validated);
        $cra = $activity->cra;
        return redirect()->route('cra.show', $cra)->with('success', 'Activités  mise à jour avec succès !');
    }
    
    

    // Supprimer une activité
    public function destroy( $activity_id)
    {
        $activity = Activity::findorFail($activity_id);
        Gate::policy('delete', $activity->cra);

        $activity->delete();
        $cra = $activity->cra;

        return redirect()->route('cra.show', $cra)->with('success', 'Activité supprimée.');
    }
}