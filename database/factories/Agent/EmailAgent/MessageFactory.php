<?php

namespace Database\Factories\Agent\EmailAgent;

use App\Models\Agent\EmailAgent\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agent\EmailAgent\Message>
 */
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
      'subject' => $this->faker->sentence(6),
      'body_text' => $this->faker->paragraphs(3, true),
      'folder' => $this->faker->randomElement(['inbox', 'spam', 'bin']),
      'is_read' => $this->faker->boolean(50),
      'is_starred' => $this->faker->boolean(20),
      'received_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
    ];
  }
}
