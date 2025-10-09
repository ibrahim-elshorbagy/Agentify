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
    Schema::create('hr_agent', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->string('candidate_name')->nullable();
      $table->string('email_address')->nullable();
      $table->string('contact_number')->nullable();
      $table->longText('educational_qualifications')->nullable();
      $table->longText('job_history')->nullable();
      $table->text('skills')->nullable();
      $table->string('score')->nullable();
      $table->longText('justification')->nullable();
      $table->timestamp('analyzed_at')->nullable();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('hr_agents');
  }
};
