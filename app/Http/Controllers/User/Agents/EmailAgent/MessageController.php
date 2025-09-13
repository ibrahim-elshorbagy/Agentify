<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use App\Services\Agents\EmailAgent\EmailFoldersService;
use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
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
      'type'=> 'bin',
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }

  public function toggleStar(Request $request, $id)
  {
    $result = $this->emailService->toggleStar($id);

    if ($result['success']) {
      return back()->with('success', $result['message']);
    }

    return back()->with('error', $result['message']);
  }

  public function toggleRead(Request $request, $id)
  {
    $result = $this->emailService->toggleRead($id);

    if ($result['success']) {
      return back()->with('success', $result['message']);
    }

    return back()->with('error', $result['message']);
  }

  public function moveToSpam(Request $request, $id)
  {
    $result = $this->emailService->moveToSpam($id);

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

  public function moveToBin(Request $request, $id)
  {
    $result = $this->emailService->moveToBin($id);

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

  public function restore(Request $request, $id)
  {
    $result = $this->emailService->restore($id);

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

  public function deletePermanently(Request $request, $id)
  {
    $result = $this->emailService->deletePermanently($id);

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

  public function view($id)
  {
    $message = Message::with(['responses' => function($query) {
      $query->orderBy('created_at', 'asc');
    }])->findOrFail($id);

    // Mark message as read if it's unread
    if (!$message->is_read) {
      $message->update(['is_read' => true]);
    }

    return inertia('User/Agents/EmailAgent/Partials/Pages/ViewMessage', [
      'message' => $message,
      'responses' => $message->responses,
    ]);
  }

  public function storeResponse(Request $request, $id)
  {
    $request->validate([
      'body_text' => 'required|string',
      'from_email' => 'required|email',
      'from_name' => 'required|string|max:255',
      'to_email' => 'required|email',
      'to_name' => 'required|string|max:255',
      'status' => 'required|in:draft,sent',
    ]);

    $message = Message::findOrFail($id);

    $response = MessageResponse::create([
      'message_id' => $message->id,
      'user_id' => Auth::id(),
      'body_text' => $request->body_text,
      'from_email' => $request->from_email,
      'from_name' => $request->from_name,
      'to_email' => $request->to_email,
      'to_name' => $request->to_name,
      'status' => $request->status,
      'sent_at' => $request->status === 'sent' ? now() : null,
    ]);

    $statusMessage = $request->status === 'sent'
      ? __('website_response.response_sent_successfully')
      : __('website_response.response_saved_as_draft');

    return back()->with('success', $statusMessage);
  }

  public function storeMessage(Request $request)
  {
    $request->validate([
      'body_text' => 'required|string',
      'from_email' => 'required|email',
      'from_name' => 'required|string|max:255',
      'to_email' => 'required|email',
      'to_name' => 'required|string|max:255',
      'status' => 'required|in:draft,sent',
      'message_id' => 'required|integer|exists:messages,id',
    ]);

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

  public function updateMessage(Request $request, $id)
  {
    $request->validate([
      'body_text' => 'required|string',
      'from_email' => 'required|email',
      'from_name' => 'required|string|max:255',
      'to_email' => 'required|email',
      'to_name' => 'required|string|max:255',
      'status' => 'required|in:draft,sent',
    ]);

    $result = $this->emailService->updateMessage($request, $id);

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
}
