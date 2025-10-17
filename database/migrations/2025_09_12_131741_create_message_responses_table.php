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
    Schema::create('message_responses', function (Blueprint $table) {
      $table->id();
      $table->foreignId('message_id')->constrained()->cascadeOnDelete();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();

      $table->longText('body_text')->nullable();

      $table->string('from_email')->nullable()->index();
      $table->string('from_name')->nullable()->index();
      $table->string('to_email')->nullable()->index();
      $table->string('to_name')->nullable()->index();
      $table->string('source')->nullable()->index();

      $table->enum('status', ['draft', 'sent'])->default('draft');

      $table->timestamp('sent_at')->nullable()->index();
      $table->timestamps();

      $table->index(['message_id', 'status']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('message_responses');
  }
};
