<?php

namespace App\Http\Controllers\User\Agents\ReportAgent;

use App\Http\Controllers\Controller;
use App\Models\User\Agents\ReportAgent\Conversation;
use App\Models\User\Agents\ReportAgent\ConversationMessage;
use App\Models\User\Agents\ReportAgent\ReportFile;
use App\Services\N8nWebhookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class ReportAgentController extends Controller
{
  /**
   * Display the chat interface
   */
  public function chat(Request $request)
  {
    $user = Auth::user();

    // Get user's conversations with latest message
    $conversations = Conversation::forUser($user->id)
      ->with('latestMessage')
      ->orderBy('updated_at', 'desc')
      ->get();

    // Get user's files
    $files = ReportFile::where('user_id', $user->id)
      ->orderBy('created_at', 'desc')
      ->get();

    return inertia('User/Agents/ReportAgent/ReportAgent', [
      'conversations' => $conversations,
      'files' => $files,
      'hasFiles' => $files->count() > 0,
    ]);
  }

  /**
   * Show specific conversation
   */
  public function showConversation(Request $request, Conversation $conversation)
  {
    // Ensure the conversation belongs to the authenticated user
    if ($conversation->user_id !== Auth::id()) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    $user = Auth::user();

    // Get all conversations for sidebar
    $conversations = Conversation::forUser($user->id)
      ->with('latestMessage')
      ->orderBy('updated_at', 'desc')
      ->get();

    // Get user's files
    $files = ReportFile::where('user_id', $user->id)
      ->orderBy('created_at', 'desc')
      ->get();

    // Get messages for this conversation
    $messages = $conversation->messages()->get();

    return inertia('User/Agents/ReportAgent/ReportAgent', [
      'conversations' => $conversations,
      'files' => $files,
      'currentConversation' => $conversation,
      'messages' => $messages,
      'hasFiles' => $files->count() > 0,
    ]);
  }

  /**
   * Display files management page
   */
  public function files(Request $request)
  {
    $user = Auth::user();

    $files = ReportFile::where('user_id', $user->id)
      ->orderBy('created_at', 'desc')
      ->get();

    return inertia('User/Agents/ReportAgent/Files', [
      'files' => $files,
    ]);
  }

  /**
   * Upload files
   */
  public function uploadFiles(Request $request)
  {
    $request->validate([
      'files' => 'required|array|max:10',
      'files.*' => 'required|file|mimes:pdf,doc,docx,txt,xlsx,xls,csv',
    ]);

    $user = Auth::user();
    $uploadedFiles = [];

    foreach ($request->file('files') as $file) {
      $originalName = $file->getClientOriginalName();
      $fileName = time() . '_' . $originalName;
      $userPath = "user_{$user->id}/Agents/ReportAgent/files";

      // Store the file
      $path = $file->storeAs($userPath, $fileName, 'public');

      // Save to database
      $reportFile = ReportFile::create([
        'user_id' => $user->id,
        'path' => $path,
        'original_name' => $originalName,
        'file_size' => $file->getSize(),
        'mime_type' => $file->getMimeType(),
      ]);

      $uploadedFiles[] = $reportFile;
    }

    return back()
      ->with('title', __('website_response.files_uploaded_title'))
      ->with('message', __('website_response.files_uploaded_message', ['count' => count($uploadedFiles)]))
      ->with('status', 'success');
  }

  /**
   * Update file
   */
  public function updateFile(Request $request, ReportFile $file)
  {
    // Ensure the file belongs to the authenticated user
    if ($file->user_id !== Auth::id()) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    $request->validate([
      'file' => 'required|file|max:10240|mimes:pdf,doc,docx,txt,xlsx,xls,csv',
    ]);

    $user = Auth::user();

    // Delete old file
    if (Storage::disk('public')->exists($file->path)) {
      Storage::disk('public')->delete($file->path);
    }

    // Upload new file
    $newFile = $request->file('file');
    $originalName = $newFile->getClientOriginalName();
    $fileName = time() . '_' . $originalName;
    $userPath = "user_{$user->id}/Agents/ReportAgent/files";

    $path = $newFile->storeAs($userPath, $fileName, 'public');

    // Update database record
    $file->update([
      'path' => $path,
      'original_name' => $originalName,
      'file_size' => $newFile->getSize(),
      'mime_type' => $newFile->getMimeType(),
    ]);

    return back()
      ->with('title', __('website_response.file_updated_title'))
      ->with('message', __('website_response.file_updated_message'))
      ->with('status', 'success');
  }

  /**
   * Delete file
   */
  public function deleteFile(Request $request, ReportFile $file)
  {
    // Ensure the file belongs to the authenticated user
    if ($file->user_id !== Auth::id()) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    // Delete file from storage
    if (Storage::disk('public')->exists($file->path)) {
      Storage::disk('public')->delete($file->path);
    }

    // Delete from database
    $file->delete();

    return back()
      ->with('title', __('website_response.file_deleted_title'))
      ->with('message', __('website_response.file_deleted_message'))
      ->with('status', 'success');
  }

  /**
   * Create new conversation
   */
  public function createConversation(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255',
    ]);

    $user = Auth::user();

    $conversation = Conversation::create([
      'user_id' => $user->id,
      'name' => $request->name,
    ]);

    return redirect()->route('user.report-agent.conversation.show', $conversation)
      ->with('title', __('website_response.conversation_created_title'))
      ->with('message', __('website_response.conversation_created_message'))
      ->with('status', 'success');
  }

  /**
   * Update conversation
   */
  public function updateConversation(Request $request, Conversation $conversation)
  {
    // Ensure the conversation belongs to the authenticated user
    if ($conversation->user_id !== Auth::id()) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    $request->validate([
      'name' => 'required|string|max:255',
    ]);

    $conversation->update([
      'name' => $request->name,
    ]);

    return back()
      ->with('title', __('website_response.conversation_updated_title'))
      ->with('message', __('website_response.conversation_updated_message'))
      ->with('status', 'success');
  }

  /**
   * Delete conversation
   */
  public function deleteConversation(Request $request, Conversation $conversation)
  {
    // Ensure the conversation belongs to the authenticated user
    if ($conversation->user_id !== Auth::id()) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    $conversation->delete();

    return redirect()->route('user.report-agent.chat')
      ->with('title', __('website_response.conversation_deleted_title'))
      ->with('message', __('website_response.conversation_deleted_message'))
      ->with('status', 'success');
  }

  /**
   * Send message
   */
  public function sendMessage(Request $request)
  {
    $request->validate([
      'conversation_id' => 'required|exists:conversations,id',
      'message' => 'required|string|max:10000',
    ]);

    $user = Auth::user();
    $conversation = Conversation::findOrFail($request->conversation_id);

    // Ensure the conversation belongs to the authenticated user
    if ($conversation->user_id !== $user->id) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    // Save user message
    $userMessage = ConversationMessage::create([
      'conversation_id' => $conversation->id,
      'message' => $request->message,
      'sender_type' => 'user',
    ]);

    // Update conversation timestamp
    $conversation->touch();

    // Get user files for N8N context
    $files = ReportFile::where('user_id', $user->id)->get();

    // Trigger N8N webhook
    $webhookService = new N8nWebhookService();
    $data = [
      'user_id' => $user->id,
      'conversation_id' => $conversation->id,
      'message' => $request->message,
      'files' => $files->map(function ($file) {
        return [
          'id' => $file->id,
          'path' => asset('storage/' . $file->path),
          'name' => $file->original_name,
          'size' => $file->file_size,
          'type' => $file->mime_type,
        ];
      }),
    ];

    $result = $webhookService->triggerWebhook($data);

    if ($result['success']) {
      // Save AI response (this would typically come from a webhook response)
      ConversationMessage::create([
        'conversation_id' => $conversation->id,
        'message' => $result['data']['response'] ?? 'Processing your request...',
        'sender_type' => 'ai',
      ]);

      return back()
        ->with('title', __('website_response.message_sent_title'))
        ->with('message', __('website_response.message_sent_message'))
        ->with('status', 'success');
    } else {
      return back()
        ->with('title', __('website_response.message_error_title'))
        ->with('message', __('website_response.message_error_message'))
        ->with('status', 'error');
    }
  }
}
