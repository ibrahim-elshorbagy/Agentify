<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasFactory, Notifiable;
  use HasRoles;
  use HasApiTokens;

  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */
  protected $fillable = [
    'name',
    'email',
    'password',
    'username',
    'image_url',
    'blocked',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }

  /**
   * Get the user's settings.
   */
  public function userSettings()
  {
    return $this->hasMany(\App\Models\User\UserSettings::class);
  }

  /**
   * Get the user's credentials.
   */
  public function credentials()
  {
    return $this->hasMany(\App\Models\Site\UserCredential::class);
  }

  /**
   * Get Gmail credentials for the user.
   */
  public function gmailCredential()
  {
    return $this->hasOne(\App\Models\Site\UserCredential::class)->where('provider_name', 'google');
  }

  /**
   * Get Microsoft credentials for the user.
   */
  public function microsoftCredential()
  {
    return $this->hasOne(\App\Models\Site\UserCredential::class)->where('provider_name', 'microsoft');
  }

  /**
   * Check if user has Gmail connected.
   */
  public function hasGmailConnected(): bool
  {
    return $this->gmailCredential()->exists();
  }

  /**
   * Check if user has Microsoft connected.
   */
  public function hasMicrosoftConnected(): bool
  {
    return $this->microsoftCredential()->exists();
  }

  /**
   * Get user's subscription.
   */
  public function subscription()
  {
    return $this->hasOne(\App\Models\SubscriptionSystem\Subscription::class);
  }

}
