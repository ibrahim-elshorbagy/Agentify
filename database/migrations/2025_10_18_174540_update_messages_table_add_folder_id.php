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
        Schema::table('messages', function (Blueprint $table) {
            // Add folder_id foreign key
            $table->foreignId('folder_id')->nullable()->after('source')->constrained('folders')->cascadeOnDelete();

            // Remove indexes on old folder column
            $table->dropIndex(['folder']);
            $table->dropIndex(['folder', 'is_read']);
            $table->dropIndex(['from_email', 'folder']);
            $table->dropIndex(['to_email', 'folder']);
            $table->dropIndex(['folder', 'is_starred']);
            $table->dropIndex(['folder', 'created_at']);

            // Remove old folder column (but keep it for now for data migration)
            // $table->dropColumn('folder');
        });

        // Add new indexes
        Schema::table('messages', function (Blueprint $table) {
            $table->index(['folder_id', 'is_read']);
            $table->index(['from_email', 'folder_id']);
            $table->index(['to_email', 'folder_id']);
            $table->index(['folder_id', 'is_starred']);
            $table->index(['folder_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            // Remove new indexes
            $table->dropIndex(['folder_id', 'is_read']);
            $table->dropIndex(['from_email', 'folder_id']);
            $table->dropIndex(['to_email', 'folder_id']);
            $table->dropIndex(['folder_id', 'is_starred']);
            $table->dropIndex(['folder_id', 'created_at']);

            // Remove folder_id column
            $table->dropForeign(['folder_id']);
            $table->dropColumn('folder_id');

            // Re-add old indexes
            $table->index('folder');
            $table->index(['folder', 'is_read']);
            $table->index(['from_email', 'folder']);
            $table->index(['to_email', 'folder']);
            $table->index(['folder', 'is_starred']);
            $table->index(['folder', 'created_at']);
        });
    }
};
