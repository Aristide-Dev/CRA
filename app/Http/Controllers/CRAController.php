<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Project;
use App\Models\Activity;
use Illuminate\Http\Request;

class CRAController extends Controller
{
    public function index(): Response
    {
        $activities = Activity::where('user_id', auth()->id())->get();
        return Inertia::render('CRA/Index', compact('activities'));
    }

    public function create(): Response
    {
        $projects = Project::all();
        return Inertia::render('CRA/Create', compact('projects'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'type' => 'required|string',
            'date' => 'required|date',
            'hours' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        Activity::create(array_merge($validated, ['user_id' => auth()->id()]));

        return redirect()->route('cra.index')->with('success', 'Activité ajoutée avec succès.');
    }
}