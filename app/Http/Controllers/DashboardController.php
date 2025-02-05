<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'totalUsers' => User::count(),
            'adminCount' => User::where('role', 'admin')->count(),
            'userCount' => User::where('role', 'user')->count(),
            'latestUsers' => User::latest()->take(5)->get(),
        ]);
    }
}
