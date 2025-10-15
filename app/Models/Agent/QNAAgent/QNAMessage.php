<?php

namespace App\Models\Agent\QNAAgent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QNAMessage extends Model
{
    protected $table = 'q_n_a_messages';

    protected $fillable = [
        'q_n_a_conversation_id',
        'message',
        'sender_type',
    ];

    /**
     * Get the conversation that owns the message.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(QNAConversation::class, 'q_n_a_conversation_id');
    }
}
