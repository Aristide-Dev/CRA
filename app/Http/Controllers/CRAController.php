<?php

namespace App\Http\Controllers;

use App\Models\Cra;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CRAController extends Controller
{
    public function __construct()
    {
        $this->user = auth()->user();
        $this->role = $this->user->role;
    }

    // Afficher la liste des CRAs de l'utilisateur
    public function index()
    {
        if ($this->role === 'worker') {
            return Inertia::render('CRA/Worker/Index', [
                'cras' => Cra::with('activities.project')
                    ->where('user_id', $this->user->id)
                    ->get()
            ]);
        } else {
            // Pour les managers et admins
            $cras = Cra::with(['activities.project', 'user'])
            ->orderBy('month_year', 'desc')
            ->get()
            ->unique(fn($cra) => $cra->month_year) // Assure l'unicité par utilisateur et date
            ->groupBy(fn($cra) => date('Y', strtotime($cra->month_year))); // Trie les clés (années et mois) dans l'ordre décroissant

            // dd($cras);

            return Inertia::render('CRA/Manager/Index', [
                'cras' => $cras,
                'my_cras' => Cra::with(['activities.project'])
                    ->where('user_id', $this->user->id)
                    ->get()
            ]);
        }
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

        return redirect()->back()->with('success', 'CRA créé avec succès');
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

        return redirect()->back()->with('success', 'CRA mis à jour avec succès');
    }

    public function monthDetail($year, $month)
    {
        $cras = Cra::with(['activities.project', 'user'])
            ->whereYear('month_year', $year)
            ->whereMonth('month_year', $month)
            ->get();

        return Inertia::render('CRA/Manager/MonthDetail', [
            'cras' => $cras,
            'year' => $year,
            'month' => $month
        ]);
    }

    public function showDetails(Cra $cra)
    {
        $cra->load([
            'user',
            'activities.project',
        ]);

        // Grouper les activités par projet
        $activitiesByProject = $cra->activities->groupBy('project.id')->map(function ($activities) {
            $project = $activities->first()->project;
            return [
                'project' => $project,
                'total_hours' => $activities->sum('duration'),
                'activities_count' => $activities->count(),
                'activities' => $activities,
                'average_duration' => $activities->avg('duration'),
                'types' => $activities->groupBy('type')->map->count(), // Répartition par type
            ];
        });

        // Grouper par type d'activité
        $activitiesByType = $cra->activities->groupBy('type')->map(function ($activities) {
            return [
                'total_hours' => $activities->sum('duration'),
                'count' => $activities->count(),
                'average_duration' => $activities->avg('duration'),
            ];
        });

        // Statistiques par jour
        $dailyStats = $cra->activities
            ->groupBy('date')
            ->map(function ($activities) {
                return [
                    'total_hours' => $activities->sum('duration'),
                    'activities_count' => $activities->count(),
                    'projects_count' => $activities->unique('project_id')->count(),
                    'types' => $activities->groupBy('type')->map->count(),
                ];
            });

        return Inertia::render('CRA/Manager/CraDetails', [
            'cra' => $cra,
            'stats' => [
                // Stats globales
                'total_hours' => $cra->activities->sum('duration'),
                'total_activities' => $cra->activities->count(),
                'total_projects' => $activitiesByProject->count(),
                'average_hours_per_day' => $cra->activities->sum('duration') / 20,
                'average_duration_per_activity' => $cra->activities->avg('duration'),
                
                // Stats par projet
                'activities_by_project' => $activitiesByProject,
                
                // Stats par type d'activité
                'activities_by_type' => $activitiesByType,
                
                // Stats quotidiennes
                'daily_stats' => $dailyStats,
                
                // Stats des projets
                'projects_stats' => [
                    'most_time_consuming' => $activitiesByProject->sortByDesc('total_hours')->first(),
                    'most_activities' => $activitiesByProject->sortByDesc('activities_count')->first(),
                    'average_hours_per_project' => $cra->activities->sum('duration') / $activitiesByProject->count(),
                ],
                
                // Distribution du temps
                'time_distribution' => [
                    'by_project' => $activitiesByProject->mapWithKeys(function ($data, $key) use ($cra) {
                        return [$key => ($data['total_hours'] / $cra->activities->sum('duration')) * 100];
                    }),
                    'by_type' => $activitiesByType->mapWithKeys(function ($data, $key) use ($cra) {
                        return [$key => ($data['total_hours'] / $cra->activities->sum('duration')) * 100];
                    }),
                ],
            ]
        ]);
    }
}