<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class UserSettings extends Model
{
  protected $guarded = ['id'];


  /**
   * Get the user that owns the setting.
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Scope a query to only include settings for a specific user.
   */
  public function scopeForUser($query, $userId)
  {
    return $query->where('user_id', $userId);
  }

  /**
   * Get a setting value by key for a user.
   */
  public static function getValueByKey($userId, $key)
  {
    return static::where('user_id', $userId)
      ->where('key', $key)
      ->value('value');
  }

  /**
   * Set a setting value by key for a user.
   */
  public static function setValueByKey($userId, $key, $value, $name = null)
  {
    return static::updateOrCreate(
      ['user_id' => $userId, 'key' => $key],
      ['value' => $value, 'name' => $name]
    );
  }
}
