<?php

namespace App\Models\Site;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCredential extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'user_id',
        'provider_name',
        'provider_id',
        'provider_token',
        'provider_refresh_token'
    ];

    protected $casts = [
        'provider_token' => 'encrypted',
        'provider_refresh_token' => 'encrypted'
    ];

    /**
     * Get the user that owns the credential
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the credential is for Gmail
     */
    public function isGmail(): bool
    {
        return $this->provider_name === 'google';
    }

    /**
     * Check if the credential is for Microsoft
     */
    public function isMicrosoft(): bool
    {
        return $this->provider_name === 'microsoft';
    }

    /**
     * Get provider display name
     */
    public function getProviderDisplayNameAttribute(): string
    {
        return match($this->provider_name) {
            'google' => 'Gmail',
            'microsoft' => 'Outlook',
            default => ucfirst($this->provider_name)
        };
    }

    /**
     * Scope to get credentials by provider
     */
    public function scopeForProvider($query, string $provider)
    {
        return $query->where('provider_name', $provider);
    }

    /**
     * Scope to get credentials for user
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
