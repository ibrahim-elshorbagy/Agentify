<?php

namespace App\Models\User\Agents\ReportAgent;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Conversation extends Model
{
    protected $fillable = [
        'user_id',
        'name',
    ];

    /**
     * Get the user that owns the conversation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all messages for the conversation.
     */
    public function messages()
    {
        return $this->hasMany(ConversationMessage::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get the latest message for the conversation.
     */
    public function latestMessage()
    {
        return $this->hasOne(ConversationMessage::class)->latestOfMany();
    }

    /**
     * Scope to get conversations for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
