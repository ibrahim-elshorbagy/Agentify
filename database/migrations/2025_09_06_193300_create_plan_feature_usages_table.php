<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plan_feature_usages', function (Blueprint $table) {
          $table->id();
          $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
          $table->foreignId('feature_id')->constrained()->cascadeOnDelete();
          $table->unsignedBigInteger('used_value')->default(0);
          $table->unsignedBigInteger('limit_value')->nullable();//Max Limit from the plan -> when he subscribed
          $table->enum('type', ['counter', 'quota']); //Counter: count up usage // Quota: size amount increase and decrease
          $table->timestamp('reset_date')->nullable();
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_feature_usages');
    }
};
