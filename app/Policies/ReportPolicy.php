<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function view(User $user, Report $report)
    {
        return $user->id === $report->user_id || 
               $report->managers->contains($user->id);
    }

    public function update(User $user, Report $report)
    {
        return $user->id === $report->user_id && 
               $report->status !== 'approved';
    }

    public function delete(User $user, Report $report)
    {
        return $user->id === $report->user_id && 
               $report->status === 'draft';
    }

    public function provideManagerFeedback(User $user, Report $report)
    {
        return $user->role === 'manager' && 
               $report->managers->contains($user->id);
    }
} 