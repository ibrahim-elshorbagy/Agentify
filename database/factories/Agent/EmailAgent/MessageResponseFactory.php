<?php

namespace Database\Factories\Agent\EmailAgent;

use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agent\EmailAgent\MessageResponse>
 */
class MessageResponseFactory extends Factory
{
  protected $model = MessageResponse::class;

  public function definition()
  {
    return [
      'message_id' => function () {
        return Message::factory()->create()->message_id;
      },
      'user_id' => $this->faker->randomElement([2, 3]), // Create for both users
      'body_text' => $this->faker->paragraphs(2, true),
      'from_email' => $this->faker->safeEmail(),
      'from_name' => $this->faker->name(),
      'to_email' => $this->faker->safeEmail(),
      'to_name' => $this->faker->name(),
      'source' => $this->faker->randomElement(['gmail', 'outlook']),
      'status' => $this->faker->randomElement(['draft', 'sent']),
      'sent_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
    ];
  }
}
