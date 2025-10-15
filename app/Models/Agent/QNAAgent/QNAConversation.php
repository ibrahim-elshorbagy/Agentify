<?php

namespace App\Models\Agent\QNAAgent;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QNAConversation extends Model
{
    protected $table = 'q_n_a_conversations';

    protected $fillable = [
        'user_id',
        'name',
    ];

    /**
     * Get the user that owns the conversation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the messages for the conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(QNAMessage::class, 'q_n_a_conversation_id');
    }

    /**
     * Get the latest message for the conversation.
     */
    public function latestMessage()
    {
        return $this->hasOne(QNAMessage::class, 'q_n_a_conversation_id')->latestOfMany();
    }

    /**
     * Scope to get conversations for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
