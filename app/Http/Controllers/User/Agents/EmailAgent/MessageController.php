<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use App\Services\Agents\EmailAgent\EmailFoldersService;
use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MessageController extends Controller
{
  use AuthorizesRequests;

  protected $emailService;

  public function __construct(EmailFoldersService $emailService)
  {
    $this->emailService = $emailService;
  }

  public function inbox(Request $request)
  {
    $data = $this->emailService->inboxEmails($request);

    return inertia('User/Agents/EmailAgent/Messages', [
      'emails' => $data['emails'],
      'type' => 'inbox',
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }

  public function spam(Request $request)
  {
    $data = $this->emailService->spamEmails($request);

    return inertia('User/Agents/EmailAgent/Messages', [
      'emails' => $data['emails'],
      'type' => 'spam',
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }

  public function bin(Request $request)
  {
    $data = $this->emailService->binEmails($request);

    return inertia('User/Agents/EmailAgent/Messages', [
      'emails' => $data['emails'],
      'type' => 'bin',
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }

  public function toggleStar(Request $request, Message $message)
  {

    $this->authorize('manage', $message);
    $this->emailService->toggleStar($message->id);

  }

  public function toggleRead(Request $request, Message $message)
  {

    $this->authorize('manage', $message);
    $this->emailService->toggleRead($message->id);

  }

  public function moveToSpam(Request $request, Message $message)
  {
    $this->authorize('manage', $message);

    $result = $this->emailService->moveToSpam($message->id);

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.email_moved_title'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  public function moveToBin(Request $request, Message $message)
  {
    $this->authorize('manage', $message);

    $result = $this->emailService->moveToBin($message->id);

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.email_moved_title'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  public function restore(Request $request, Message $message)
  {
    $this->authorize('manage', $message);

    $result = $this->emailService->restore($message->id);

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.email_restored_title'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  public function deletePermanently(Request $request, Message $message)
  {
    $this->authorize('forceDelete', $message);

    $result = $this->emailService->deletePermanently($message->id);

    if ($result['success']) {
      return back()
        ->with('title', __('website_response.email_deleted_title'))
        ->with('message', $result['message'])
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  public function view(Message $message)
  {
    $this->authorize('view', $message);

    $message->load([
      'responses' => function ($query) {
        $query->orderBy('created_at', 'asc');
      }
    ]);

    // Mark message as read if it's unread
    if (!$message->is_read) {
      $message->update(['is_read' => true]);
    }

    return inertia('User/Agents/EmailAgent/Partials/Pages/ViewMessage', [
      'message' => $message,
      'responses' => $message->responses,
    ]);
  }

  public function storeResponse(Request $request, Message $message)
  {
    $this->authorize('manage', $message);

    $result = $this->emailService->storeResponse($request, $message->id);

    if ($result['success']) {
      return back()->with('success', $result['message']);
    }

    return back()->with('error', $result['message']);
  }

  public function storeMessage(Request $request)
  {
    $result = $this->emailService->storeMessage($request);

    if ($result['success']) {
      $statusMessage = $request->status === 'sent'
        ? __('website_response.message_sent_successfully')
        : __('website_response.message_saved_as_draft');

      return back()
        ->with('title', __('website_response.message_response_created_title'))
        ->with('message', $statusMessage)
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  public function updateMessage(Request $request, MessageResponse $messageResponse)
  {
    $this->authorize('manage', $messageResponse);

    $result = $this->emailService->updateMessage($request, $messageResponse->id);

    if ($result['success']) {
      $statusMessage = $request->status === 'sent'
        ? __('website_response.message_updated_and_sent')
        : __('website_response.message_updated_successfully');

      return back()
        ->with('title', __('website_response.message_response_updated_title'))
        ->with('message', $statusMessage)
        ->with('status', 'success');
    }

    return back()
      ->with('title', __('website_response.error_title'))
      ->with('message', $result['message'])
      ->with('status', 'error');
  }

  /**
   * Bulk mark messages as read
   */
  public function bulkMarkAsRead(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkMarkAsRead($request->ids);

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
   * Bulk mark messages as unread
   */
  public function bulkMarkAsUnread(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkMarkAsUnread($request->ids);

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
   * Bulk star messages
   */
  public function bulkStar(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkStar($request->ids);

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
   * Bulk unstar messages
   */
  public function bulkUnstar(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkUnstar($request->ids);

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
   * Bulk move messages to spam
   */
  public function bulkMoveToSpam(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkMoveToSpam($request->ids);

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
   * Bulk move messages to bin
   */
  public function bulkMoveToBin(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkMoveToBin($request->ids);

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
   * Bulk restore messages to inbox
   */
  public function bulkRestore(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkRestore($request->ids);

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
   * Bulk delete messages permanently
   */
  public function bulkDeletePermanently(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array', 'min:1'],
      'ids.*' => ['integer', 'exists:messages,id'],
    ]);

    $result = $this->emailService->bulkDeletePermanently($request->ids);

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
}
