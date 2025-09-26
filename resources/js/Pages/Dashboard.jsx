import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Dashboard() {
  const { t } = useTrans();
  const user = usePage().props.auth.user;
  const { flash } = usePage().props;
  const webhookResponse = flash?.response;


  const triggerN8nWebhook = () => {
    router.post(route('n8n.trigger'), {
      data: {
        message: 'Triggered from Dashboard',
        user_name: user.name
      }
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

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

                {/* N8N Webhook Trigger */}
                <div>
                  <button
                    onClick={triggerN8nWebhook}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Trigger N8N Workflow
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Response Display */}
          {webhookResponse && (
            <div className="mb-8">
              <div className={`rounded-2xl shadow-lg border p-6 ${
                webhookResponse.success
                  ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${
                    webhookResponse.success
                      ? 'bg-green-100 dark:bg-green-800'
                      : 'bg-red-100 dark:bg-red-800'
                  }`}>
                    {webhookResponse.success ? (
                      <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <h3 className={`text-lg font-semibold ${
                    webhookResponse.success
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    N8N Webhook Response
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      webhookResponse.success
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-red-900 dark:text-red-100'
                    }`}>
                      Status:
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      webhookResponse.success
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                    }`}>
                      {webhookResponse.success ? 'Success' : 'Failed'}
                    </span>
                  </div>

                  {/* Status Code */}
                  {webhookResponse.status_code && (
                    <div>
                      <h4 className={`font-medium mb-2 ${
                        webhookResponse.success
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        HTTP Status Code:
                      </h4>
                      <span className={`text-sm ${
                        webhookResponse.success
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {webhookResponse.status_code}
                      </span>
                    </div>
                  )}

                  {/* Response Data */}
                  {webhookResponse.data && (
                    <div>
                      <h4 className={`font-medium mb-2 ${
                        webhookResponse.success
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        Response Data:
                      </h4>
                      <pre className={`text-sm p-3 rounded-lg overflow-auto max-h-64 ${
                        webhookResponse.success
                          ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                      }`}>
                        {JSON.stringify(webhookResponse.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Error Details */}
                  {webhookResponse.error && (
                    <div>
                      <h4 className="font-medium mb-2 text-red-900 dark:text-red-100">
                        Error Details:
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-800 p-3 rounded-lg">
                        {webhookResponse.error}
                      </p>
                    </div>
                  )}

                  {/* Raw Response (if available) */}
                  {webhookResponse.response && (
                    <div>
                      <h4 className={`font-medium mb-2 ${
                        webhookResponse.success
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        Raw Response:
                      </h4>
                      <pre className={`text-sm p-3 rounded-lg overflow-auto max-h-64 ${
                        webhookResponse.success
                          ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                      }`}>
                        {typeof webhookResponse.response === 'string'
                          ? webhookResponse.response
                          : JSON.stringify(webhookResponse.response, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Complete Response Object */}
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      webhookResponse.success
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-red-900 dark:text-red-100'
                    }`}>
                      Complete Response:
                    </h4>
                    <pre className={`text-sm p-3 rounded-lg overflow-auto max-h-64 ${
                      webhookResponse.success
                        ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                    }`}>
                      {JSON.stringify(webhookResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
