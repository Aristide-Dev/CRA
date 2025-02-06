<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ReportController extends Controller
{
    public function index()
    {
        $reports = auth()->user()->role === 'manager' 
            ? Report::whereHas('managers', function($query) {
                $query->where('user_id', auth()->id());
            })->with(['user', 'managers'])->get()
            : auth()->user()->reports()->with('managers')->get();

        return Inertia::render('Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function create()
    {
        $managers = User::where('role', 'manager')->get();
        
        return Inertia::render('Reports/Create', [
            'managers' => $managers,
            'tiny_api_key' => env('TINY_API_KEY')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'manager_ids' => 'required|array|min:1'
        ]);

        $report = Report::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => 'submitted'
        ]);

        $report->managers()->attach($validated['manager_ids'], ['status' => 'pending']);

        return redirect()->route('reports.index')
            ->with('success', 'Rapport soumis avec succès');
    }

    public function show(Report $report)
    {
        Gate::policy('view', $report);

        $report->load(['user', 'managers']);

        return Inertia::render('Reports/Show', [
            'report' => $report,
            'isManager' => auth()->user()->role === 'manager',
            'managerFeedback' => $report->managers->where('id', auth()->id())->first()?->pivot
        ]);
    }

    public function edit(Report $report)
    {
        Gate::policy('update', $report);

        return Inertia::render('Reports/Edit', [
            'report' => $report,
            'managers' => User::where('role', 'manager')->get(),
            'tiny_api_key' => env('TINY_API_KEY')
        ]);
    }

    public function update(Request $request, Report $report)
    {
        Gate::policy('update', $report);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'manager_ids' => 'required|array|min:1'
        ]);

        $report->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
        ]);

        $report->managers()->sync($validated['manager_ids'], ['status' => 'pending']);

        return redirect()->route('reports.show', $report)
            ->with('success', 'Rapport mis à jour avec succès');
    }

    public function updateStatus(Request $request, Report $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:submitted,draft',
        ]);

        $report->update(['status' => $validated['status']]);

        return back()->with('success', 'Statut du rapport mis à jour');
    }

    public function managerFeedback(Request $request, Report $report)
    {
        Gate::policy('provideManagerFeedback', $report);

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'feedback' => 'required|string'
        ]);

        $report->managers()->updateExistingPivot(auth()->id(), [
            'status' => $validated['status'],
            'feedback' => $validated['feedback']
        ]);

        // Mettre à jour le statut global si tous les managers ont répondu
        $allManagersResponded = !$report->managers()
            ->wherePivotNotIn('status', ['approved', 'rejected'])
            ->exists();

        if ($allManagersResponded) {
            $allApproved = !$report->managers()
                ->wherePivot('status', '!=', 'approved')
                ->exists();

            $report->update([
                'status' => $allApproved ? 'approved' : 'rejected'
            ]);
        }

        return back()->with('success', 'Feedback enregistré avec succès');
    }

    public function destroy(Report $report)
    {
        Gate::policy('delete', $report);
        
        $report->delete();
        
        return redirect()->route('reports.index')
            ->with('success', 'Rapport supprimé avec succès');
    }

    public function managerDashboard()
    {
        Gate::policy('viewManagerDashboard', auth()->user());

        $reports = auth()->user()->managedReports()
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Reports/Manager/Dashboard', [
            'reports' => $reports
        ]);
    }
} 