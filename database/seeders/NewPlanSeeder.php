<?php

namespace Database\Seeders;

use App\Models\SubscriptionSystem\Feature;
use App\Models\SubscriptionSystem\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -------------------------
        // 1️⃣ Create New Starter Plan (Monthly)
        // -------------------------
        $starterPlan = [
            'id' => 4,
            'name' => ['en' => 'Starter', 'ar' => 'المبتدئ'],
            'description' => ['en' => 'Perfect for new users to get started', 'ar' => 'مثالي للمستخدمين الجدد للبدء'],
            'price' => 0,
            'type' => 'monthly',
        ];

        Plan::updateOrCreate(['id' => $starterPlan['id']], $starterPlan);

        // -------------------------
        // 2️⃣ Define Limited Feature Limits for Starter Plan
        // -------------------------
        $starterLimits = [
            1 => 5,      // Email fetches per month
            2 => 10,     // Email messages per month (Agent + QNA)
            3 => 2,      // Fetch CVs from email box per month
            4 => 5,      // Upload CV per month
            5 => 3,      // Files per month
            6 => 10,     // Reports messages per month
            7 => 2,      // Max file size (MB)
        ];

        // -------------------------
        // 3️⃣ Attach Features to Starter Plan
        // -------------------------
        foreach ($starterLimits as $featureId => $limitValue) {
            DB::table('plan_features')->updateOrInsert(
                ['plan_id' => 4, 'feature_id' => $featureId],
                [
                    'limit_value' => $limitValue,
                    'active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
