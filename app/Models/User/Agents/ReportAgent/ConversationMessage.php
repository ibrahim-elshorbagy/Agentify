<?php

namespace App\Models\User\Agents\ReportAgent;

use Illuminate\Database\Eloquent\Model;

class ConversationMessage extends Model
{
    protected $fillable = [
        'conversation_id',
        'message',
        'sender_type',
    ];

    protected $casts = [
        'sender_type' => 'string',
    ];

    /**
     * Get the conversation that owns the message.
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Scope to get user messages
     */
    public function scopeUser($query)
    {
        return $query->where('sender_type', 'user');
    }

    /**
     * Scope to get AI messages
     */
    public function scopeAi($query)
    {
        return $query->where('sender_type', 'ai');
    }

    /**
     * Check if the message is from user
     */
    public function isFromUser()
    {
        return $this->sender_type === 'user';
    }

    /**
     * Check if the message is from AI
     */
    public function isFromAi()
    {
        return $this->sender_type === 'ai';
    }
}
