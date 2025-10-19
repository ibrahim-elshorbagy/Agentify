<?php

namespace Database\Factories\Agent\EmailAgent;

use App\Models\Agent\EmailAgent\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
  protected $model = Message::class;

  public function definition()
  {
    return [
      'user_id' => 2,
      'from_email' => $this->faker->safeEmail(),
      'from_name' => $this->faker->name(),
      'to_email' => $this->faker->safeEmail(),
      'to_name' => $this->faker->name(),
      'subject' => $this->faker->sentence(nbWords: 6),
      'body_text' => $this->faker->paragraphs(3, true),
      'source' => $this->faker->randomElement(['gmail', 'outlook']),
      'folder' => $this->faker->randomElement(['inbox', 'spam', 'bin', 'promotions', 'social', 'personal', 'clients', 'team', 'finance', 'hr']),
      'is_read' => $this->faker->boolean(50),
      'is_starred' => $this->faker->boolean(20),
      'is_archived' => $this->faker->boolean(20),
      'received_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
    ];
  }
}
