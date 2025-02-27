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
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CRAController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    
    Route::resource('projects', ProjectController::class);
    Route::resource('users', UserController::class);
    
    Route::resource('reports', ReportController::class);
    Route::put('reports/{report}/status', [ReportController::class, 'updateStatus'])->name('reports.status');
    Route::post('reports/{report}/feedback', [ReportController::class, 'managerFeedback'])->name('reports.feedback');

    Route::get('/cra', [CRAController::class, 'index'])->name('cra.index');
    Route::get('/cra/create', [CRAController::class, 'create'])->name('cra.create');
    Route::post('/cra', [CRAController::class, 'store'])->name('cra.store');
    Route::get('/cra/{cra}/edit', [CRAController::class, 'edit'])->name('cra.edit');
    Route::put('/cra/{cra}', [CRAController::class, 'update'])->name('cra.update');
    
    Route::get('/cra/personal', [CRAController::class, 'personalIndex'])->name('cra.personal.index');
    Route::get('/cras/{year}/{month}', [CRAController::class, 'monthDetail'])->name('cra.month.detail');
    Route::get('/cra/{cra}/details', [CRAController::class, 'showDetails'])->name('cra.details');
    Route::get('/cra/{cra}', [CRAController::class, 'show'])->name('cra.show');

    Route::post('/cra/{cra}/activities', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('/activities/{activity_id}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{activity_id}', [ActivityController::class, 'destroy'])->name('activities.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';