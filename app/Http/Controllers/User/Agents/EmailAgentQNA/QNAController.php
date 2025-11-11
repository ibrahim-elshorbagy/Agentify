<?php

namespace App\Http\Controllers\User\Agents\EmailAgentQNA;

use App\Http\Controllers\Controller;
use App\Models\Agent\QNAAgent\QNAConversation;
use App\Models\Agent\QNAAgent\QNAMessage;
use App\Services\Agents\QNAAgent\QNAAgentChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class QNAController extends Controller
{
  /**
   * Display the chat interface
   */
  public function chat(Request $request)
  {
    $user = Auth::user();

    // Get user's conversations with latest message
    $conversations = QNAConversation::forUser($user->id)
      ->with('latestMessage')
      ->orderBy('updated_at', 'desc')
      ->get();

    return inertia('User/Agents/QNAAgent/QNAAgent', [
      'conversations' => $conversations,
    ]);
  }

  /**
   * Show specific conversation
   */
  public function showConversation(Request $request, QNAConversation $conversation)
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
    $conversations = QNAConversation::forUser($user->id)
      ->with('latestMessage')
      ->orderBy('updated_at', 'desc')
      ->get();

    // Get messages for this conversation
    $messages = $conversation->messages()->get();

    return inertia('User/Agents/QNAAgent/QNAAgent', [
      'conversations' => $conversations,
      'currentConversation' => $conversation,
      'messages' => $messages,
    ]);
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

    $conversation = QNAConversation::create([
      'user_id' => $user->id,
      'name' => $request->name,
    ]);

    return redirect()->route('user.qna-agent.conversation.show', $conversation)
      ->with('title', __('website_response.conversation_created_title'))
      ->with('message', __('website_response.conversation_created_message'))
      ->with('status', 'success');
  }

  /**
   * Update conversation
   */
  public function updateConversation(Request $request, QNAConversation $conversation)
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
  public function deleteConversation(Request $request, QNAConversation $conversation)
  {
    // Ensure the conversation belongs to the authenticated user
    if ($conversation->user_id !== Auth::id()) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    $conversation->delete();

    return redirect()->route('user.qna-agent.chat')
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
      'conversation_id' => 'required|exists:q_n_a_conversations,id',
      'message' => 'required|string|max:500|min:1',
    ]);

    $user = Auth::user();
    $conversation = QNAConversation::findOrFail($request->conversation_id);

    // Ensure the conversation belongs to the authenticated user
    if ($conversation->user_id !== $user->id) {
      return back()
        ->with('title', __('website_response.access_denied_title'))
        ->with('message', __('website_response.access_denied_message'))
        ->with('status', 'error');
    }

    // Save user message
    $userMessage = QNAMessage::create([
      'q_n_a_conversation_id' => $conversation->id,
      'message' => $request->message,
      'sender_type' => 'user',
    ]);

    // Update conversation timestamp
    $conversation->touch();

    // Prepare data for chat webhook
    $chatData = [
      'userId' => $user->id,
      'conversationId' => $conversation->id,
      'chatInput' => $request->message,
    ];

    // Log the data being sent
    Log::info('QNAController: Sending message to chat webhook', [
      'user_id' => $user->id,
      'conversation_id' => $conversation->id,
      'message_length' => strlen($request->message),
    ]);

    // Trigger QNA Agent Chat webhook
    $chatService = new QNAAgentChatService();
    $result = $chatService->sendMessage($chatData);

    if ($result['success']) {
      // Extract AI response from webhook result
      $result = is_string($result) ? json_decode($result, true) : $result;
      $aiResponse = $result['data'][0]['output'] ?? ($result['data']['output'] ?? 'Processing your request...');

      Log::info('QNAController: Chat webhook successful', [
        'conversation_id' => $conversation->id,
        'response_received' => !empty($aiResponse)
      ]);

      // Save AI response
      QNAMessage::create([
        'q_n_a_conversation_id' => $conversation->id,
        'message' => $aiResponse,
        'sender_type' => 'ai',
      ]);

      return back();
      // ->with('title', __('website_response.message_sent_title'))
      // ->with('message', __('website_response.message_sent_message'))
      // ->with('status', 'success');
    } else {
      Log::error('QNAController: Chat webhook failed', [
        'conversation_id' => $conversation->id,
        'error' => $result['error'] ?? 'Unknown error',
        'status_code' => $result['status_code'] ?? null
      ]);

      // Save error message as AI response for user feedback
      QNAMessage::create([
        'q_n_a_conversation_id' => $conversation->id,
        'message' => 'Sorry, I encountered an error processing your request. Please try again later.',
        'sender_type' => 'ai',
      ]);

      return back()
        ->with('title', __('website_response.message_error_title'))
        ->with('message', __('website_response.message_error_message'))
        ->with('status', 'error');
    }
  }

}
