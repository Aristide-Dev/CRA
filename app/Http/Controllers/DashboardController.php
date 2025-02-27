<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Projet;
use App\Models\Cra;
use App\Models\Activitie;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Filtres de date par défaut
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->input('end_date', Carbon::now());

        // Statistiques utilisateurs
        $totalUsers = User::count();
        $adminCount = User::where('role', 'admin')->count();
        $userCount = User::where('role', 'user')->count();
        $latestUsers = User::latest()->take(5)->get();

        // Statistiques des projets
        $totalProjects = Projet::count();
        $projectStatuses = Projet::select('status')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn($item) => [$item->status => $item->count]);

        // Liste des projets pour le filtre
        $projectsList = Projet::select('id', 'name')->get();

        // Statistiques des projets filtrées
        $projectStats = Projet::with(['activities' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }])
            ->when($request->projet_id, function ($query, $projectId) {
                return $query->where('id', $projectId);
            })
            ->get()
            ->map(function ($project) {
                $activities = $project->activities;
                return [
                    'project' => [
                        'id' => $project->id,
                        'name' => $project->name,
                    ],
                    'total_hours' => $activities->sum('duration'),
                    'total_activities' => $activities->count(),
                    'average_duration' => $activities->count() > 0 
                        ? round($activities->sum('duration') / $activities->count(), 2) 
                        : 0,
                    'employee_count' => $activities->pluck('user_id')->unique()->count(),
                    'planned_hours' => $project->planned_hours ?? 0,
                    'progress' => $project->progress ?? 0,
                    'last_activity' => $activities->max('date'),
                ];
            });

        // Statistiques CRA
        $craStats = [
            'total_cras' => Cra::count(),
            'total_hours' => Activitie::sum('duration'),
            'total_activities' => Activitie::count(),
            'average_hours_per_day' => Activitie::avg('duration'),
            'pending_approval' => Cra::where('status', 'pending')->count(),
            'approved_count' => Cra::where('status', 'approved')->count(),
            'rejected_count' => Cra::where('status', 'rejected')->count(),
            'pending_count' => Cra::where('status', 'pending')->count(),
            'average_activities_per_cra' => round(Activitie::count() / max(Cra::count(), 1), 2),
            'monthly_data' => $this->getMonthlyData(),
        ];

        // Taux d'approbation et de rejet
        $totalCras = max(Cra::count(), 1); // Éviter la division par zéro
        $approvalRate = round((Cra::where('status', 'approved')->count() / $totalCras) * 100, 2);
        $rejectionRate = round((Cra::where('status', 'rejected')->count() / $totalCras) * 100, 2);

        // Distribution des activités par type
        $activitiesByType = Activitie::select('type')
            ->selectRaw('COUNT(*) as count, SUM(duration) as total_hours')
            ->groupBy('type')
            ->get()
            ->mapWithKeys(function ($item) use ($craStats) {
                return [$item->type => [
                    'count' => $item->count,
                    'total_hours' => $item->total_hours,
                    'percentage_count' => round(($item->count / max($craStats['total_activities'], 1)) * 100, 2),
                    'percentage_hours' => round(($item->total_hours / max($craStats['total_hours'], 1)) * 100, 2),
                ]];
            });

        // Projets les plus actifs
        $topProjectsActive = Projet::withCount('activities')
            ->orderByDesc('activities_count')
            ->take(5)
            ->get()
            ->map(function ($project) {
                return [
                    'project' => [
                        'id' => $project->id,
                        'name' => $project->name,
                    ],
                    'total_activities' => $project->activities_count,
                ];
            });

        // Projets par heures consommées
        $topProjectsByHours = Projet::with('activities')
            ->get()
            ->map(function ($project) {
                return [
                    'project' => [
                        'id' => $project->id,
                        'name' => $project->name,
                    ],
                    'total_hours' => $project->activities->sum('duration'),
                ];
            })
            ->sortByDesc('total_hours')
            ->take(5)
            ->values();

        return Inertia::render('dashboard', [
            'totalUsers' => $totalUsers,
            'adminCount' => $adminCount,
            'userCount' => $userCount,
            'latestUsers' => $latestUsers,
            'totalProjects' => $totalProjects,
            'projectStatuses' => $projectStatuses,
            'projectsList' => $projectsList,
            'projectStats' => $projectStats,
            'craStats' => $craStats,
            'approvalRate' => $approvalRate,
            'rejectionRate' => $rejectionRate,
            'activitiesByType' => $activitiesByType,
            'topProjectsActive' => $topProjectsActive,
            'topProjectsByHours' => $topProjectsByHours,
            'projectFilters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'projet_id' => $request->projet_id,
            ],
        ]);
    }

    private function getMonthlyData()
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        if ($connection === 'sqlite') {
            // Version SQLite (local)
            return Activitie::select(
                DB::raw('strftime("%Y-%m", date) as month'),
                DB::raw('COUNT(*) as activities'),
                DB::raw('SUM(duration) as hours')
            )
                ->groupBy('month')
                ->orderBy('month')
                ->take(12)
                ->get()
                ->map(function ($item) {
                    return [
                        'month' => Carbon::createFromFormat('Y-m', $item->month)->format('M Y'),
                        'activities' => $item->activities,
                        'hours' => $item->hours,
                    ];
                });
        } else {
            // Version MySQL (production)
            return Activitie::select(
                DB::raw('DATE_FORMAT(date, "%Y-%m") as month'),
                DB::raw('COUNT(*) as activities'),
                DB::raw('SUM(duration) as hours')
            )
                ->groupBy('month')
                ->orderBy('month')
                ->take(12)
                ->get()
                ->map(function ($item) {
                    return [
                        'month' => Carbon::createFromFormat('Y-m', $item->month)->format('M Y'),
                        'activities' => $item->activities,
                        'hours' => $item->hours,
                    ];
                });
        }
    }
}