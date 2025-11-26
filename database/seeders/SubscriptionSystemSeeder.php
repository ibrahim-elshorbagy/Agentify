<?php

namespace Database\Seeders;

use App\Models\SubscriptionSystem\Feature;
use App\Models\SubscriptionSystem\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionSystemSeeder extends Seeder
{
  public function run()
  {
    // -------------------------
    // 1️⃣ Create Features
    // -------------------------
    $features = [
      // Email Agent + QNA Features (slug: email_agent - COMBINED)
      [
        'id' => 1,
        'key' => 'email_agent',
        'type' => 'counter',
        'name' => ['en' => 'Email Fetches per Month ( gmail | outlook )', 'ar' => 'جلب البريد من صندوق الوارد ( gmail | outlook )'],
        'description' => ['en' => 'Number of times to fetch emails from Gmail or Outlook per month', 'ar' => 'عدد المرات لجلب البريد من Gmail أو Outlook شهرياً'],
      ],
      [
        'id' => 2,
        'key' => 'email_agent',
        'type' => 'counter',
        'name' => [
          'en' => 'Chat With Your Emails',
          'ar' => 'الدردشة مع بريدك',
        ],
        'description' => [
          'en' => 'AI messages used to chat with your emails, ask questions, and get summaries or answers',
          'ar' => 'رسائل تُستخدم للدردشة مع بريدك، وطرح الأسئلة، والحصول على ملخصات وإجابات',
        ],
      ],

      // HR Agent Features (slug: hr)
      [
        'id' => 3,
        'key' => 'hr',
        'type' => 'counter',
        'name' => ['en' => 'Fetch CVs From Email Box ( gmail | outlook )', 'ar' => 'جلب السير الذاتية من صندوق البريد ( gmail | outlook ) '],
        'description' => ['en' => 'Number of times to fetch CVs from Gmail or Outlook per month', 'ar' => 'عدد المرات لجلب السير الذاتية من Gmail أو Outlook شهرياً'],
      ],
      [
        'id' => 4,
        'key' => 'hr',
        'type' => 'counter',
        'name' => ['en' => 'Upload CV', 'ar' => 'رفع السيرة الذاتية'],
        'description' => ['en' => 'Number of CVs you can upload per month', 'ar' => 'عدد السير الذاتية التي يمكنك رفعها شهرياً'],
      ],

      // Reports Agent Features (slug: reports)
      [
        'id' => 5,
        'key' => 'reports',
        'type' => 'counter',
        'name' => ['en' => 'Number of Files per Month', 'ar' => 'عدد الملفات شهرياً'],
        'description' => ['en' => 'Maximum number of files you can upload per month', 'ar' => 'الحد الأقصى لعدد الملفات التي يمكنك رفعها شهرياً'],
      ],
      [
        'id' => 6,
        'key' => 'reports',
        'type' => 'counter',
        'name' => [
          'en' => 'Chat With Your Files',
          'ar' => 'الدردشة مع ملفاتك',
        ],
        'description' => [
          'en' => 'AI messages used to chat, ask questions, and extract insights from your uploaded files',
          'ar' => 'رسائل تُستخدم للدردشة وطرح الأسئلة والحصول على معلومات من ملفاتك المرفوعة',
        ],
      ],
      [
        'id' => 7,
        'key' => 'reports',
        'type' => 'counter',
        'name' => ['en' => 'Max File Size (MB)', 'ar' => ' الحد الأقصى لحجم الملف (MB)'],
        'description' => ['en' => 'Maximum size of each file in MB', 'ar' => 'الحد الأقصى لحجم كل ملف بالميجابايت'],
      ],
    ];

    foreach ($features as $f) {
      Feature::updateOrCreate(['id' => $f['id']], $f);
    }

    // -------------------------
    // 2️⃣ Create Plans (6 Plans Total - 3 Monthly + 3 Yearly)
    // -------------------------
    $plans = [
      // ============ MONTHLY PLANS ============
      [
        'id' => 1,
        'name' => ['en' => 'Basic', 'ar' => 'الأساسي'],
        'description' => ['en' => 'Perfect for individuals just getting started', 'ar' => 'مثالي للأفراد الذين يبدأون'],
        'price' => 20,
        'type' => 'monthly',
      ],
      [
        'id' => 2,
        'name' => ['en' => 'Starter', 'ar' => 'المبتدئ'],
        'description' => ['en' => 'Ideal for small teams', 'ar' => 'مثالي للفرق الصغيرة'],
        'price' => 40,
        'type' => 'monthly',
      ],
      [
        'id' => 3,
        'name' => ['en' => 'Pro', 'ar' => 'المحترف'],
        'description' => ['en' => 'For growing businesses', 'ar' => 'للشركات المتنامية'],
        'price' => 80,
        'type' => 'monthly',
      ],

      // ============ YEARLY PLANS ============
      [
        'id' => 5,
        'name' => ['en' => 'Basic', 'ar' => 'الأساسي'],
        'description' => ['en' => 'Perfect for individuals - Save 17%', 'ar' => 'مثالي للأفراد - وفر 17%'],
        'price' => 200,
        'type' => 'yearly',
      ],
      [
        'id' => 6,
        'name' => ['en' => 'Starter', 'ar' => 'المبتدئ'],
        'description' => ['en' => 'Ideal for small teams - Save 17%', 'ar' => 'مثالي للفرق الصغيرة - وفر 17%'],
        'price' => 400,
        'type' => 'yearly',
      ],
      [
        'id' => 7,
        'name' => ['en' => 'Pro', 'ar' => 'المحترف'],
        'description' => ['en' => 'For growing businesses - Save 17%', 'ar' => 'للشركات المتنامية - وفر 17%'],
        'price' => 800,
        'type' => 'yearly',
      ],
    ];

    foreach ($plans as $p) {
      Plan::updateOrCreate(['id' => $p['id']], $p);
    }

    // -------------------------
    // 3️⃣ Define Feature Limits per Plan Tier
    // -------------------------
    $planLimits = [
      // Basic Plan
      'Basic' => [
        1 => 10,     // Email fetches per month
        2 => 20,     // Email messages per month (Agent + QNA)
        3 => 5,      // Fetch CVs from email box per month
        4 => 10,     // Upload CV per month
        5 => 5,      // Files per month
        6 => 20,     // Reports messages per month
        7 => 5,      // Max file size (MB)
      ],

      // Starter Plan
      'Starter' => [
        1 => 30,     // Email fetches per month
        2 => 50,     // Email messages per month (Agent + QNA)
        3 => 15,     // Fetch CVs from email box per month
        4 => 30,     // Upload CV per month
        5 => 15,     // Files per month
        6 => 50,     // Reports messages per month
        7 => 15,     // Max file size (MB)
      ],

      // Pro Plan
      'Pro' => [
        1 => 75,     // Email fetches per month
        2 => 150,    // Email messages per month (Agent + QNA)
        3 => 40,     // Fetch CVs from email box per month
        4 => 75,     // Upload CV per month
        5 => 40,     // Files per month
        6 => 150,    // Reports messages per month
        7 => 30,     // Max file size (MB)
      ],
    ];

    // Map plan IDs to plan tiers
    $planMap = [
      1 => 'Basic',     // Monthly
      2 => 'Starter',   // Monthly
      3 => 'Pro',       // Monthly
      5 => 'Basic',     // Yearly
      6 => 'Starter',   // Yearly
      7 => 'Pro',       // Yearly
    ];

    // -------------------------
    // 4️⃣ Attach Features to Plans with Limits
    // -------------------------
    $planFeatures = [];

    foreach ($planMap as $planId => $planTier) {
      foreach ($features as $feature) {
        $featureId = $feature['id'];
        $limitValue = $planLimits[$planTier][$featureId] ?? 0;

        $planFeatures[] = [
          'plan_id' => $planId,
          'feature_id' => $featureId,
          'limit_value' => $limitValue,
          'active' => true,
        ];
      }
    }

    // Insert into pivot table
    foreach ($planFeatures as $pf) {
      DB::table('plan_features')->updateOrInsert(
        ['plan_id' => $pf['plan_id'], 'feature_id' => $pf['feature_id']],
        [
          'limit_value' => $pf['limit_value'],
          'active' => $pf['active'],
          'created_at' => now(),
          'updated_at' => now(),
        ]
      );
    }
  }
}
