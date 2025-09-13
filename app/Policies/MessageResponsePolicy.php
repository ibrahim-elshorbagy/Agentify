<?php

namespace App\Policies;

use App\Models\Agent\EmailAgent\MessageResponse;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MessageResponsePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MessageResponse $messageResponse): bool
    {
        return $user->id === $messageResponse->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MessageResponse $messageResponse): bool
    {
        return $user->id === $messageResponse->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MessageResponse $messageResponse): bool
    {
        return $user->id === $messageResponse->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MessageResponse $messageResponse): bool
    {
        return $user->id === $messageResponse->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MessageResponse $messageResponse): bool
    {
        return $user->id === $messageResponse->user_id;
    }

    /**
     * Determine whether the user can manage the model (general actions).
     */
    public function manage(User $user, MessageResponse $messageResponse): bool
    {
        return $user->id === $messageResponse->user_id;
    }
}
