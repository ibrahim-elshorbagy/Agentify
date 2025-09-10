<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionSystem\Plan;
use App\Models\SubscriptionSystem\Feature;
use Illuminate\Support\Facades\DB;

class SubscriptionSystemSeeder extends Seeder
{
    public function run()
    {
        // -------------------------
        // 1️⃣ Create Features
        // -------------------------
        $features = [
            // Email Agent - Smart Email Management
            ['id' => 1, 'key' => 'email_agent', 'type' => 'boolean', 'name' => ['en' => 'Secure Email Connection', 'ar' => 'الاتصال الآمن بالبريد'], 'description' => ['en' => 'Seamlessly connect your Gmail & Outlook with bank-level security.', 'ar' => 'ربط سلس وآمن لحسابات Gmail و Outlook بأمان مصرفي.']],
            ['id' => 2, 'key' => 'email_agent', 'type' => 'counter', 'name' => ['en' => 'Smart Email Reading', 'ar' => 'قراءة ذكية للرسائل'], 'description' => ['en' => 'Automatically read and understand your emails like a personal assistant.', 'ar' => 'قراءة وفهم رسائلك تلقائياً كمساعد شخصي ذكي.']],
            ['id' => 3, 'key' => 'email_agent', 'type' => 'counter', 'name' => ['en' => 'Intelligent Email Sorting', 'ar' => 'تصنيف ذكي للرسائل'], 'description' => ['en' => 'Organize emails by importance, sender, and topic - never miss what matters.', 'ar' => 'تنظيم الرسائل حسب الأهمية والمرسل والموضوع - لا تفوت المهم أبداً.']],
            ['id' => 4, 'key' => 'email_agent', 'type' => 'counter', 'name' => ['en' => 'Instant Auto-Reply', 'ar' => 'الرد الفوري التلقائي'], 'description' => ['en' => 'Send professional, contextual replies instantly while you focus on bigger tasks.', 'ar' => 'إرسال ردود مهنية فورية بينما تركز على المهام الأهم.']],
            ['id' => 5, 'key' => 'email_agent', 'type' => 'counter', 'name' => ['en' => 'AI Draft Suggestions', 'ar' => 'اقتراحات الذكي للردود'], 'description' => ['en' => 'Get perfectly crafted reply suggestions that match your tone and style.', 'ar' => 'احصل على اقتراحات ردود مصاغة بإتقان تناسب أسلوبك ونبرتك.']],
            ['id' => 6, 'key' => 'email_agent', 'type' => 'counter', 'name' => ['en' => 'Smart Email Cleanup', 'ar' => 'تنظيف ذكي للرسائل'], 'description' => ['en' => 'Eliminate spam and unwanted emails automatically - keep your inbox pristine.', 'ar' => 'القضاء على البريد العشوائي والرسائل غير المرغوبة تلقائياً.']],
            ['id' => 7, 'key' => 'email_agent', 'type' => 'counter', 'name' => ['en' => 'Auto-Read Management', 'ar' => 'إدارة تلقائية للقراءة'], 'description' => ['en' => 'Mark emails as read intelligently to keep your inbox organized and clean.', 'ar' => 'تحديد الرسائل كمقروءة بذكاء للحفاظ على صندوق بريد منظم.']],
            ['id' => 8, 'key' => 'email_agent', 'type' => 'counter', 'name' => ['en' => 'Space Optimizer', 'ar' => 'محسن المساحة'], 'description' => ['en' => 'Free up valuable mailbox space by intelligently emptying trash and old emails.', 'ar' => 'توفير مساحة قيمة بحذف المهملات والرسائل القديمة بذكاء.']],

            // Email Answer Agent - AI Email Assistant
            ['id' => 9, 'key' => 'email_smart_answer', 'type' => 'boolean', 'name' => ['en' => 'Email Answer Agent', 'ar' => 'وكيل الرد على البريد'], 'description' => ['en' => 'Uses your email history to answer questions about any email.', 'ar' => 'يستخدم تاريخ بريدك للإجابة على أي سؤال حول البريد.']],
            ['id' => 10, 'key' => 'email_smart_answer', 'type' => 'counter', 'name' => ['en' => 'Smart Email Replies', 'ar' => 'الردود الذكية على البريد'], 'description' => ['en' => 'Generate quick AI-powered replies to your emails.', 'ar' => 'إنشاء ردود سريعة مدعومة بالذكاء الاصطناعي على بريدك.']],
            ['id' => 11, 'key' => 'email_smart_answer', 'type' => 'counter', 'name' => ['en' => 'Email Summarizer', 'ar' => 'ملخص البريد الإلكتروني'], 'description' => ['en' => 'Summarize long email threads into clear, actionable points.', 'ar' => 'تلخيص سلاسل البريد الطويلة إلى نقاط واضحة وقابلة للتنفيذ.']],

            // Reports Agent - Data Intelligence
            ['id' => 12, 'key' => 'reports', 'type' => 'boolean', 'name' => ['en' => 'Universal Data Bridge', 'ar' => 'جسر البيانات الشامل'], 'description' => ['en' => 'Connect Google Sheets or upload any file - your data, instantly accessible.', 'ar' => 'ربط Google Sheets أو رفع أي ملف - بياناتك متاحة فوراً.']],
            ['id' => 13, 'key' => 'reports', 'type' => 'counter', 'name' => ['en' => 'Data Chat Messages', 'ar' => 'رسائل الدردشة مع البيانات'], 'description' => ['en' => 'Number of messages you can send to chat and ask questions about your data.', 'ar' => 'عدد الرسائل التي يمكنك إرسالها للدردشة وطرح الأسئلة حول بياناتك.']],
            ['id' => 14, 'key' => 'reports', 'type' => 'boolean', 'name' => ['en' => 'AI Report Generator', 'ar' => 'مولد التقارير الذكي'], 'description' => ['en' => 'Access to AI-powered report generation feature from your data.', 'ar' => 'الوصول لميزة توليد التقارير بالذكاء الاصطناعي من بياناتك.']],
            ['id' => 15, 'key' => 'reports', 'type' => 'counter', 'name' => ['en' => 'Generated Reports', 'ar' => 'التقارير المُنشأة'], 'description' => ['en' => 'Number of professional reports you can generate from your data.', 'ar' => 'عدد التقارير المهنية التي يمكنك إنشاؤها من بياناتك.']],

            // HR Agent - Recruitment Automation
            ['id' => 16, 'key' => 'hr', 'type' => 'boolean', 'name' => ['en' => 'HR AI Agent', 'ar' => 'وكيل التوظيف الذكي'], 'description' => ['en' => 'Automates recruitment tasks using AI to streamline candidate management.', 'ar' => 'أتمتة مهام التوظيف باستخدام الذكاء الاصطناعي لتسهيل إدارة المرشحين.']],
            ['id' => 17, 'key' => 'hr', 'type' => 'counter', 'name' => ['en' => 'CV Auto-Collector', 'ar' => 'جامع السير الذاتية التلقائي'], 'description' => ['en' => 'Automatically download and organize CVs from emails.', 'ar' => 'تحميل وتنظيم السير الذاتية تلقائياً من البريد الإلكتروني.']],
            ['id' => 18, 'key' => 'hr', 'type' => 'counter', 'name' => ['en' => 'Smart CV Parser', 'ar' => 'محلل السير الذاتية الذكي'], 'description' => ['en' => 'Extract candidate data accurately, including skills, experience, and contact info.', 'ar' => 'استخراج بيانات المرشحين بدقة، بما في ذلك المهارات والخبرة ومعلومات التواصل.']],
            ['id' => 19, 'key' => 'hr', 'type' => 'counter', 'name' => ['en' => 'AI Candidate Ranker', 'ar' => 'مصنف المرشحين الذكي'], 'description' => ['en' => 'Score and rank candidates automatically based on their profiles to find top talent.', 'ar' => 'تقييم وترتيب المرشحين تلقائياً حسب ملفاتهم للعثور على أفضل المواهب.']],
        ];

        foreach ($features as $f) {
            Feature::updateOrCreate(['id' => $f['id']], $f);
        }

        // -------------------------
        // 2️⃣ Create Plans (Trial, Starter, Pro, Business - Monthly & Yearly)
        // -------------------------
        $plans = [
            ['id' => 1, 'name' => ['en' => 'Trial', 'ar' => 'تجريبي'], 'description' => ['en' => 'Trial plan', 'ar' => 'الخطة التجريبية'], 'price' => 0, 'type' => 'monthly'],
            // Monthly
            ['id' => 2, 'name' => ['en' => 'Starter', 'ar' => 'المبتدئ'], 'description' => ['en' => 'Starter plan', 'ar' => 'الخطة المبتدئة'], 'price' => 30, 'type' => 'monthly'],
            ['id' => 3, 'name' => ['en' => 'Pro', 'ar' => 'المحترف'], 'description' => ['en' => 'Pro plan', 'ar' => 'الخطة المحترفة'], 'price' => 60, 'type' => 'monthly'],
            ['id' => 4, 'name' => ['en' => 'Business', 'ar' => 'الأعمال'], 'description' => ['en' => 'Business plan', 'ar' => 'خطة الأعمال'], 'price' => 120, 'type' => 'monthly'],
            // Yearly
            ['id' => 5, 'name' => ['en' => 'Starter Yearly', 'ar' => 'المبتدئ سنوي'], 'description' => ['en' => 'Starter plan yearly', 'ar' => 'الخطة المبتدئة السنوية'], 'price' => 300, 'type' => 'yearly'],
            ['id' => 6, 'name' => ['en' => 'Pro Yearly', 'ar' => 'المحترف سنوي'], 'description' => ['en' => 'Pro plan yearly', 'ar' => 'الخطة المحترفة السنوية'], 'price' => 600, 'type' => 'yearly'],
            ['id' => 7, 'name' => ['en' => 'Business Yearly', 'ar' => 'الأعمال سنوي'], 'description' => ['en' => 'Business plan yearly', 'ar' => 'خطة الأعمال السنوية'], 'price' => 1200, 'type' => 'yearly'],
        ];

        foreach ($plans as $p) {
            Plan::updateOrCreate(['id' => $p['id']], $p);
        }

        // -------------------------
        // 3️⃣ Attach Features to Plans (pivot) with ACTIVE field
        // -------------------------
        $planFeatures = [];

        // Define counter limits per plan type
        $counterLimits = [
            'Trial' => [
                1 => 1, 2 => 20, 3 => 10, 4 => 5, 5 => 5, 6 => 5, 7 => 5, 8 => 5,
                9 => 1, 10 => 5, 11 => 2,
                12 => 1, 13 => 10, 14 => 1, 15 => 5,
                16 => 1, 17 => 5, 18 => 5, 19 => 2,
            ],
            'Starter' => [
                1 => 1, 2 => 20, 3 => 10, 4 => 5, 5 => 5, 6 => 5, 7 => 5, 8 => 5,
                9 => 1, 10 => 5, 11 => 2,
                12 => 1, 13 => 10, 14 => 1, 15 => 5,
                16 => 1, 17 => 5, 18 => 5, 19 => 2,
            ],
            'Pro' => [
                1 => 1, 2 => 50, 3 => 30, 4 => 10, 5 => 10, 6 => 10, 7 => 10, 8 => 10,
                9 => 1, 10 => 10, 11 => 5,
                12 => 1, 13 => 50, 14 => 1, 15 => 20,
                16 => 1, 17 => 10, 18 => 10, 19 => 5,
            ],
            'Business' => [
                1 => 1, 2 => 100, 3 => 50, 4 => 20, 5 => 20, 6 => 20, 7 => 20, 8 => 20,
                9 => 1, 10 => 20, 11 => 10,
                12 => 1, 13 => 100, 14 => 1, 15 => 50,
                16 => 1, 17 => 20, 18 => 20, 19 => 10,
            ],
        ];

        // Map plan IDs to types
        $planMap = [
            1 => 'Trial',
            2 => 'Starter',
            3 => 'Pro',
            4 => 'Business',
            5 => 'Starter',
            6 => 'Pro',
            7 => 'Business',
        ];

        // Attach every feature to every plan WITH ACTIVE = TRUE
        foreach ($planMap as $planId => $planType) {
            foreach ($features as $feature) {
                $featureId = $feature['id'];

                // Boolean features get 1, counter features get plan-specific limit
                $limitValue = $feature['type'] === 'boolean'
                    ? 1
                    : ($counterLimits[$planType][$featureId] ?? 0);

                $planFeatures[] = [
                    'plan_id' => $planId,
                    'feature_id' => $featureId,
                    'limit_value' => $limitValue,
                    'active' => true, // 🔥 ALL FEATURES ARE ACTIVE BY DEFAULT
                ];
            }
        }

        // Insert into pivot table with ACTIVE field
        foreach ($planFeatures as $pf) {
            DB::table('plan_features')->updateOrInsert(
                ['plan_id' => $pf['plan_id'], 'feature_id' => $pf['feature_id']],
                [
                    'limit_value' => $pf['limit_value'],
                    'active' => $pf['active'], // 🔥 Include the active field
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
