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
   * Display sent emails
   */
  public function sent(Request $request)
  {
    $data = $this->responseService->sentEmails($request);
    $emails = $this->addRowNumbers($data['emails']);

    return inertia('User/Agents/EmailAgent/MessagesResponse', [
      'type' => 'sent',
      'emails' => $emails,
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->responseService->getEmailCounts(),
    ]);
  }

  /**
   * Display draft emails
   */
  public function draft(Request $request)
  {
    $data = $this->responseService->draftEmails($request);
    $emails = $this->addRowNumbers($data['emails']);

    return inertia('User/Agents/EmailAgent/MessagesResponse', [
      'type' => 'draft',
      'emails' => $emails,
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->responseService->getEmailCounts(),
    ]);
  }

  /**
   * View a sent/draft message and its original
   */
  public function view(MessageResponse $messageResponse)
  {
    $this->authorize('view', $messageResponse);

    $response = $this->responseService->viewMessage($messageResponse->id);
    return inertia('User/Agents/EmailAgent/ViewMessage', [
      'message' => $response->message,
      'responses' => [$response],
    ]);
  }

  /**
   * Delete a draft message
   */
  public function deleteDraft(MessageResponse $messageResponse)
  {
    $this->authorize('delete', $messageResponse);

    $result = $this->responseService->deleteDraft($messageResponse->id);

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.draft_deleted_title'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  /**
   * Send a draft message
   */
  public function sendDraft(MessageResponse $messageResponse)
  {
    $this->authorize('update', $messageResponse);

    $result = $this->responseService->sendDraft($messageResponse->id);

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.draft_sent_title'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  /**
   * Update a draft message
   */
  public function updateDraft(Request $request, MessageResponse $messageResponse)
  {
    $this->authorize('update', $messageResponse);

    $result = $this->responseService->updateDraft($request, $messageResponse->id);

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.draft_updated_title'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
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

    $result = $this->responseService->bulkDeleteDrafts($request->input('ids'));

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
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

    $result = $this->responseService->bulkSendDrafts($request->input('ids'));

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
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

    $result = $this->responseService->bulkDeleteSent($request->input('ids'));

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }
  // Add actions for edit, delete, send draft, etc. as needed
}
