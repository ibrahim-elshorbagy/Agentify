<?php
namespace App\Models\SubscriptionSystem;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
  protected $guarded = ['id'];
  protected $casts = [
    'name' => 'array',
    'description' => 'array',
  ];

  protected function getTranslatedValue(array $translations): string
  {
    $locale = app()->getLocale();
    return $translations[$locale] ?? $translations['en'] ?? '';
  }

  protected $appends = ['name_value', 'description_value'];

  public function getNameValueAttribute(): string
  {
    return $this->getTranslatedValue($this->name ?? []);
  }

  public function getDescriptionValueAttribute(): string
  {
    return $this->getTranslatedValue($this->description ?? []);
  }

  public function features()
  {
    return $this->belongsToMany(Feature::class, PlanFeature::class)
      ->withPivot(['limit_value', 'active']) // 🔥 ADD 'active' HERE
      ->withTimestamps();
  }

  public function subscriptions()
  {
    return $this->hasMany(Subscription::class);
  }
}
