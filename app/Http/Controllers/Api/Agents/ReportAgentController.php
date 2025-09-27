<?php

namespace App\Http\Controllers\Api\Agents;

use App\Http\Controllers\Controller;
use App\Services\Agents\ReportAgentService;
use Illuminate\Http\Request;

class ReportAgentController extends Controller
{
  /**
   * Trigger ReportAgent webhook for chat system processing
   */
  public function triggerReportWebhook(Request $request)
  {
    $webhookService = new ReportAgentService();

    $result = $webhookService->triggerWebhook();

    if ($result['success']) {
      return back()
        ->with('title', 'ReportAgent Webhook Success')
        ->with('message', 'ReportAgent workflow has been triggered successfully!')
        ->with('status', 'success')
        ->with('webhookResponse', $result);
    } else {
      return back()
        ->with('title', 'ReportAgent Webhook Error')
        ->with('message', 'Failed to trigger ReportAgent webhook: ' . ($result['error'] ?? 'Unknown error'))
        ->with('status', 'error')
        ->with('WebhookResponse', $result);
    }
  }
}
