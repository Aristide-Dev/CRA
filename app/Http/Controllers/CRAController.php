<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Cra;
use Inertia\Inertia;
use App\Models\Projet;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
        Gate::policy('create', $this->user);
        return Inertia::render('CRA/Create', [
            'projects' => Project::all() // Pour la liste déroulante des projets
        ]);
    }

    // Enregistrer un nouveau CRA
    public function store(Request $request)
    {
        // Ajout de -01 pour le format de date
        $request->month_year = $request->month_year . "-01";
    
        $request->validate([
            'month_year' => [
                'required',
                'date_format:Y-m',
                Rule::unique('cras')->where(function ($query) {
                    return $query->where('user_id', auth()->id());
                }),
            ],
        ], [
            'month_year.required' => 'Le mois et l\'année sont requis',
            'month_year.date_format' => 'Le format de la date doit être AAAA-MM',
            'month_year.unique' => 'Vous avez déjà un CRA pour ce mois',
        ]);

        // Vérification de l'existence d'un CRA avec la même date
        $verify = Cra::where('user_id', $this->user->id)
        ->where('month_year', $request->month_year)->first();

        if ($verify) {
        return redirect()->back()->withErrors(['month_year' => 'Vous avez déjà un CRA pour ce mois.']);
        }

        Cra::create([
            'user_id' => auth()->id(),
            'month_year' => $request->month_year,
            // Ajoutez d'autres champs nécessaires ici
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
            'projects' => Projet::all()
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
        // Ajout de -01 pour le format de date
        $request->month_year = $request->month_year . "-01";

        $request->validate([
            'month_year' => [
                'required',
                'date_format:Y-m',
                Rule::unique('cras')->where(function ($query) use ($cra) {
                    return $query->where('user_id', $cra->user_id);
                })->ignore($cra->id),
            ],
        ], [
            'month_year.required' => 'Le mois et l\'année sont requis',
            'month_year.date_format' => 'Le format de la date doit être AAAA-MM',
            'month_year.unique' => 'Vous avez déjà un CRA pour ce mois',
        ]);

        // Vérification de l'existence d'un CRA avec la même date
        $verify = Cra::where('user_id', $this->user->id)
                    ->where('month_year', $request->month_year)->first();

        if ($verify) {
            return redirect()->back()->withErrors(['month_year' => 'Vous avez déjà un CRA pour ce mois.']);
        }

        $cra->update([
            'month_year' => $request->month_year,
        ]);

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

        // Calcul total des heures avec vérification
        $totalHours = $cra->activities->sum('duration');
        $totalActivities = $cra->activities->count();

        // Statistiques regroupées par projet
        $activitiesByProject = $cra->activities
            ->groupBy('project.id')
            ->map(function ($activities) {
                $project = $activities->first()->project;
                return [
                    'project' => $project,
                    'total_hours' => $activities->sum('duration'),
                    'activities_count' => $activities->count(),
                    'activities' => $activities,
                    'average_duration' => $activities->count() ? round($activities->avg('duration'), 2) : 0,
                    'types' => $activities->groupBy('type')->map(function ($group) {
                        return $group->count();
                    })
                ];
            });

        // Statistiques regroupées par type d'activité
        $activitiesByType = $cra->activities->groupBy('type')->map(function ($activities) use ($totalHours, $totalActivities, $cra) {
            $sumHours = $activities->sum('duration');
            return [
                'total_hours' => $sumHours,
                'count' => $activities->count(),
                'average_duration' => $activities->count() ? round($activities->avg('duration'), 2) : 0,
                'percentage_hours' => $totalHours > 0 ? round(($sumHours / $totalHours) * 100, 2) : 0,
                'percentage_activities' => $totalActivities > 0 ? round(($activities->count() / $totalActivities) * 100, 2) : 0,
            ];
        });

        // Statistiques par date
        $dailyStats = $cra->activities->groupBy('date')->map(function ($activities) {
            return [
                'total_hours' => $activities->sum('duration'),
                'activities_count' => $activities->count(),
                'projects_count' => $activities->unique('project_id')->count(),
                'types' => $activities->groupBy('type')->map->count(),
                'average_duration' => $activities->count() ? round($activities->avg('duration'), 2) : 0,
            ];
        });

        // Calcul correct des jours ouvrés du mois
        // On suppose que $cra->month_year est au format "Y-m" (ex: "2023-10")
        try {
            $date = \Carbon\Carbon::createFromFormat('Y-m', $cra->month_year);
        } catch (\Exception $e) {
            $date = \Carbon\Carbon::now();
        }
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();
        $workingDays = 0;
        for ($day = $startOfMonth->copy(); $day->lte($endOfMonth); $day->addDay()) {
            if (!in_array($day->dayOfWeek, [\Carbon\Carbon::SATURDAY, \Carbon\Carbon::SUNDAY])) {
                $workingDays++;
            }
        }

        return \Inertia\Inertia::render('CRA/Manager/CraDetails', [
            'cra' => $cra,
            'stats' => [
                // Statistiques globales
                'total_hours' => $totalHours,
                'total_activities' => $totalActivities,
                'total_projects' => $activitiesByProject->count(),
                'average_hours_per_day' => $workingDays > 0 ? round($totalHours / $workingDays, 2) : 0,
                'average_duration_per_activity' => $totalActivities ? round($cra->activities->avg('duration'), 2) : 0,
                
                // Statistiques par projet
                'activities_by_project' => $activitiesByProject,
                
                // Statistiques par type d'activité
                'activities_by_type' => $activitiesByType,
                
                // Statistiques quotidiennes
                'daily_stats' => $dailyStats,
                
                // Statistiques des projets
                'projects_stats' => [
                    'most_time_consuming' => $activitiesByProject->sortByDesc('total_hours')->first(),
                    'most_activities' => $activitiesByProject->sortByDesc('activities_count')->first(),
                    'average_hours_per_project' => $activitiesByProject->count() ? round($totalHours / $activitiesByProject->count(), 2) : 0,
                ],
                
                // Distribution du temps en pourcentage
                'time_distribution' => [
                    'by_project' => $activitiesByProject->mapWithKeys(function ($data, $key) use ($totalHours) {
                        return [$key => $totalHours > 0 ? round(($data['total_hours'] / $totalHours) * 100, 2) : 0];
                    }),
                    'by_type' => $activitiesByType->mapWithKeys(function ($data, $key) use ($totalHours) {
                        return [$key => $totalHours > 0 ? round(($data['total_hours'] / $totalHours) * 100, 2) : 0];
                    }),
                ],
                
                // Autres statistiques
                'average_activities_per_day' => $workingDays > 0 ? round($totalActivities / $workingDays, 2) : 0,
                'average_projects_per_day' => $workingDays > 0 ? round($activitiesByProject->count() / $workingDays, 2) : 0,
                'working_days' => $workingDays,
            ]
        ]);
    }

    public function personalIndex()
    {
        return Inertia::render('CRA/Personal', [
            'my_cras' => Cra::with(['activities.project'])
                ->where('user_id', $this->user->id)
                ->get()
        ]);
    }
}