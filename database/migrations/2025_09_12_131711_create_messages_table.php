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
    Schema::create('messages', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();

      $table->unsignedBigInteger('message_id')->nullable();
      $table->string('from_email')->nullable()->index();
      $table->string('from_name')->nullable()->index();
      $table->string('to_email')->nullable()->index();
      $table->string('to_name')->nullable()->index();

      $table->text('subject')->index();
      $table->longText('body_text')->nullable();
      $table->string('source')->nullable()->index();

      $table->foreignId('folder_id')->nullable()->constrained('folders')->nullOnDelete();
      $table->boolean('is_read')->default(false)->index();
      $table->boolean('is_starred')->default(false)->index();

      $table->string('received_at')->nullable()->index();
      $table->timestamps();

      // composite indexes (updated to use folder_id)
      $table->index(['folder_id', 'is_read']);
      $table->index(['from_email', 'folder_id']);
      $table->index(['to_email', 'folder_id']);
      $table->index(['folder_id', 'is_starred']);
      $table->index(['from_email', 'is_read']);
      $table->index(['to_email', 'is_read']);
      $table->index(['from_email', 'to_email']);
      $table->index(['folder_id', 'created_at']);
    });

  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('messages');
  }
};
