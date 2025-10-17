import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Dashboard() {
  const { t } = useTrans();
  const user = usePage().props.auth.user;
  const { flash } = usePage().props;

  return (
    <AppLayout>
      <Head title={t('dashboard')} />

      <div className="py-8 bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {t('hello_user', { name: user.name })} 👋
                  </h1>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
