<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('q_n_a_messages', function (Blueprint $table) {
      $table->id();
      $table->foreignId('q_n_a_conversation_id')->constrained()->onDelete('cascade');
      $table->text('message');
      $table->enum('sender_type', ['user', 'ai']);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('q_n_a_messages');
  }
};
