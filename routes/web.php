<?php
/*
 * Nom       : Gnimassou
 * Prénom    : Jean-Marie Aristide 
 * Email     : aristechdev@gmail.com
 *
 * Signature DREAMER:
 *
 *  _______   _______   ________   ______   __       __  ________  _______  
 * /       \ /       \ /        | /      \ /  \     /  |/        |/       \ 
 * $$$$$$$  |$$$$$$$  |$$$$$$$$/ /$$$$$$  |$$  \   /$$ |$$$$$$$$/ $$$$$$$  |
 * $$ |  $$ |$$ |__$$ |$$ |__    $$ |__$$ |$$$  \ /$$$ |$$ |__    $$ |__$$ |
 * $$ |  $$ |$$    $$< $$    |   $$    $$ |$$$$  /$$$$ |$$    |   $$    $$< 
 * $$ |  $$ |$$$$$$$  |$$$$$/    $$$$$$$$ |$$ $$ $$/$$ |$$$$$/    $$$$$$$  |
 * $$ |__$$ |$$ |  $$ |$$ |_____ $$ |  $$ |$$ |$$$/ $$ |$$ |_____ $$ |  $$ |
 * $$    $$/ $$ |  $$ |$$       |$$ |  $$ |$$ | $/  $$ |$$       |$$ |  $$ |
 * $$$$$$/  $$/   $$/ $$$$$$$$/ $$/   $$/ $$/      $$/ $$$$$$$$/ $$/   $$/ 
 *
 */

use Inertia\Inertia;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\CRAController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Exemple : Accès réservé aux managers
Route::get('/manager/dashboard', [ManagerController::class, 'index'])
    ->middleware(['auth', 'role:manager']); // <-- Middleware personnalisé

// Exemple : Accès réservé aux admins
Route::get('/admin/stats', [AdminController::class, 'stats'])
    ->middleware(['auth', 'role:admin']);

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Routes pour les CRAs (Worker)
Route::middleware(['auth', CheckRole::class.':worker'])->group(function () {
    Route::get('/cra', [CRAController::class, 'index'])->name('cra.index');
    Route::get('/cra/create', [CRAController::class, 'create'])->name('cra.create');
    Route::post('/cra', [CRAController::class, 'store'])->name('cra.store');
    Route::get('/cra/{cra}', [CRAController::class, 'show'])->name('cra.show');
    Route::get('/cra/{cra}/edit', [CRAController::class, 'edit'])->name('cra.edit');
    Route::put('/cra/{cra}', [CRAController::class, 'update'])->name('cra.update');
    
    Route::post('/cra/{cra}/activities', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('/activities/{activity_id}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{activity_id}', [ActivityController::class, 'destroy'])->name('activities.destroy');
});

// Routes pour les activités (Nested)
Route::middleware(['auth', CheckRole::class.':manager'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('/cra', [CRAController::class, 'index'])->name('cra.index');
    Route::get('/cra/create', [CRAController::class, 'create'])->name('cra.create');
    Route::post('/cra', [CRAController::class, 'store'])->name('cra.store');
    Route::get('/cra/{cra}', [CRAController::class, 'show'])->name('cra.show');
    Route::get('/cra/{cra}/edit', [CRAController::class, 'edit'])->name('cra.edit');
    Route::put('/cra/{cra}', [CRAController::class, 'update'])->name('cra.update');
    
    Route::post('/cra/{cra}/activities', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('/activities/{activity_id}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{activity_id}', [ActivityController::class, 'destroy'])->name('activities.destroy');
    
    Route::resource('projects', ProjectController::class);
    Route::resource('users', UserController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
