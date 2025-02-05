<?php

namespace App\Policies;

use App\Models\CRA;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CRAPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CRA $cRA): bool
    {
        return $user->id === $cra->user_id || $user->role === 'admin'|| $user->role === 'manager';
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CRA $cRA): bool
    {
        return $user->id === $cra->user_id && $cra->status === 'draft';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CRA $cRA): bool
    {
        return $user->id === $cra->user_id && $cra->status === 'draft';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CRA $cRA): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CRA $cRA): bool
    {
        return false;
    }
}
