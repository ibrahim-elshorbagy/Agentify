<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Agents\EmailAgent\ResponseMessageService;
use App\Models\Agent\EmailAgent\MessageResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ResponseMessageController extends Controller
{
  use AuthorizesRequests;
  protected $responseService;

  public function __construct(ResponseMessageService $responseService)
  {
    $this->responseService = $responseService;
  }

  /**
   * Display sent emails with Gmail/Outlook tabs
   */
  public function sent(Request $request)
  {
    $gmailData = $this->responseService->getResponseEmails($request, 'sent', 'gmail', 'gmail_page');
    $outlookData = $this->responseService->getResponseEmails($request, 'sent', 'outlook', 'outlook_page');

    $gmailEmails = $this->addRowNumbers($gmailData['emails']);
    $outlookEmails = $this->addRowNumbers($outlookData['emails']);

    return inertia('User/Agents/EmailAgent/MessagesResponse', [
      'gmailEmails' => $gmailEmails,
      'outlookEmails' => $outlookEmails,
      'type' => 'sent',
      'queryParams' => $request->query() ?: null,
      'emailCounts' => $this->responseService->getEmailCounts(),
    ]);
  }

  /**
   * Display draft emails with Gmail/Outlook tabs
   */
  public function draft(Request $request)
  {
    $gmailData = $this->responseService->getResponseEmails($request, 'draft', 'gmail', 'gmail_page');
    $outlookData = $this->responseService->getResponseEmails($request, 'draft', 'outlook', 'outlook_page');

    $gmailEmails = $this->addRowNumbers($gmailData['emails']);
    $outlookEmails = $this->addRowNumbers($outlookData['emails']);

    return inertia('User/Agents/EmailAgent/MessagesResponse', [
      'gmailEmails' => $gmailEmails,
      'outlookEmails' => $outlookEmails,
      'type' => 'draft',
      'queryParams' => $request->query() ?: null,
      'emailCounts' => $this->responseService->getEmailCounts(),
    ]);
  }

  /**
   * Bulk delete drafts
   */
  public function bulkDeleteDrafts(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:message_responses,id']
    ]);

    $deleted = $this->responseService->bulkDeleteDrafts($request->input('ids'));

    return back()
      ->with('title', __('website_response.bulk_action_completed'))
      ->with('message', __('website_response.bulk_drafts_deleted', ['count' => $deleted]))
      ->with('status', 'success');
  }

  /**
   * Bulk send drafts
   */
  public function bulkSendDrafts(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:message_responses,id']
    ]);

    $updated = $this->responseService->bulkSendDrafts($request->input('ids'));

    return back()
      ->with('title', __('website_response.bulk_action_completed'))
      ->with('message', __('website_response.bulk_drafts_sent', ['count' => $updated]))
      ->with('status', 'success');
  }

  /**
   * Bulk delete sent messages
   */
  public function bulkDeleteSent(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:message_responses,id']
    ]);

    $deleted = $this->responseService->bulkDeleteSent($request->input('ids'));

    return back()
      ->with('title', __('website_response.bulk_action_completed'))
      ->with('message', __('website_response.bulk_sent_deleted', ['count' => $deleted]))
      ->with('status', 'success');
  }
}
