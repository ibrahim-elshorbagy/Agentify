<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use App\Services\Agents\EmailAgent\EmailFoldersService;
use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class MessageController extends Controller
{

  protected $emailService;

  public function __construct(EmailFoldersService $emailService)
  {
    $this->emailService = $emailService;
  }

  public function emails(Request $request, $folder)
  {
    // Validate folder parameter from route
    if (!in_array($folder, ['inbox', 'spam', 'bin'])) {
      abort(404);
    }

    $gmailData = $this->emailService->getEmails($request, $folder, 'gmail', 'gmail_page');
    $outlookData = $this->emailService->getEmails($request, $folder, 'outlook', 'outlook_page');

    $gmailEmails = $this->addRowNumbers($gmailData['emails']);
    $outlookEmails = $this->addRowNumbers($outlookData['emails']);

    return inertia('User/Agents/EmailAgent/Messages', [
      'gmailEmails' => $gmailEmails,
      'outlookEmails' => $outlookEmails,
      'type' => $folder,
      'queryParams' => $request->query() ?: null,
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }

  public function view(Message $message)
  {
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

    try {
      $updated = $this->emailService->bulkMarkAsRead($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_marked_as_read', ['count' => $updated]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
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

    try {
      $updated = $this->emailService->bulkMarkAsUnread($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_marked_as_unread', ['count' => $updated]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
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

    try {
      $updated = $this->emailService->bulkStar($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_starred', ['count' => $updated]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
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

    try {
      $updated = $this->emailService->bulkUnstar($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_unstarred', ['count' => $updated]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
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

    try {
      $updated = $this->emailService->bulkMoveToSpam($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_moved_to_spam', ['count' => $updated]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
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

    try {
      $updated = $this->emailService->bulkMoveToBin($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_moved_to_bin', ['count' => $updated]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
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

    try {
      $updated = $this->emailService->bulkRestore($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_restored_to_inbox', ['count' => $updated]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
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

    try {
      $deletedCount = $this->emailService->bulkDeletePermanently($request->ids);

      return back()
        ->with('title', __('website_response.bulk_action_completed'))
        ->with('message', __('website_response.bulk_deleted_permanently', ['count' => $deletedCount]))
        ->with('status', 'success');
    } catch (\Exception $e) {
      return back()
        ->with('title', 'Error')
        ->with('message', __('website_response.error_bulk_action'))
        ->with('status', 'error');
    }
  }
}
