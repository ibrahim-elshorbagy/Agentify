<?php

namespace App\Services\Agents\EmailAgent;

use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ResponseMessageService
{
  /**
   * Get response emails for any status with filters and pagination
   */
  public function getResponseEmails(Request $request, $status, $source = null, $pageParam = 'page')
  {
    // Validate status parameter
    if (!in_array($status, ['sent', 'draft'])) {
      throw new \InvalidArgumentException('Invalid status type');
    }

    $request->validate([
      'search' => ['nullable', 'string', 'max:255'],
      'date_from' => ['nullable', 'date'],
      'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
      'sort' => ['nullable', 'string', 'in:id,to_email,from_email,created_at,sent_at'],
      'direction' => ['nullable', 'string', 'in:asc,desc'],
      'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
    ]);

    $sortField = $request->input('sort', 'created_at');
    $sortDirection = $request->input('direction', 'desc');
    $perPage = $request->input('per_page', 15);

    // Response emails query - filter by current user and status
    $emailsQuery = MessageResponse::query()
      ->with('message')
      ->where('user_id', Auth::id())
      ->where('status', $status);

    if ($source) {
      $emailsQuery->where('source', $source);
    }

    $this->applyFilters($emailsQuery, $request);

    $emails = $emailsQuery->orderBy($sortField, $sortDirection)
      ->paginate($perPage, ['*'], $pageParam)
      ->withQueryString();

    return [
      'emails' => $emails,
      'queryParams' => $request->query() ?: null,
    ];
  }

  /**
   * Apply filters to the query
   */
  private function applyFilters($query, Request $request)
  {
    // Combined search in from_email, from_name, OR subject
    if ($request->filled('search')) {
      $searchTerm = '%' . trim($request->input('search')) . '%';

      $query->where(function ($q) use ($searchTerm) {
        $q->where('from_email', 'like', $searchTerm)
          ->orWhere('from_name', 'like', $searchTerm)
          ->orWhere('to_email', 'like', $searchTerm)
          ->orWhere('to_name', 'like', $searchTerm)
          // ->orWhere('subject', 'like', $searchTerm)
          ->orWhere('body_text', 'like', $searchTerm);
      });
    }

    if ($request->filled('date_from')) {
      $query->whereDate('created_at', '>=', $request->input('date_from'));
    }
    if ($request->filled('date_to')) {
      $query->whereDate('created_at', '<=', $request->input('date_to'));
    }
  }

  /**
   * Get counts for sent and draft by source
   */
  public function getEmailCounts()
  {
    $userId = Auth::id();
    return [
      'gmail' => [
        'sent_total' => MessageResponse::where('user_id', $userId)->where('status', 'sent')->where('source', 'gmail')->count(),
        'draft_total' => MessageResponse::where('user_id', $userId)->where('status', 'draft')->where('source', 'gmail')->count(),
      ],
      'outlook' => [
        'sent_total' => MessageResponse::where('user_id', $userId)->where('status', 'sent')->where('source', 'outlook')->count(),
        'draft_total' => MessageResponse::where('user_id', $userId)->where('status', 'draft')->where('source', 'outlook')->count(),
      ],
    ];
  }

  /**
   * View a sent/draft message and its original
   */
  public function viewMessage($id)
  {
    $response = MessageResponse::with('message')
      ->where('user_id', Auth::id())
      ->findOrFail($id);
    return $response;
  }

  /**
   * Delete a draft message
   */
  public function deleteDraft($id)
  {
    $response = MessageResponse::where('id', $id)
      ->where('user_id', Auth::id())
      ->where('status', 'draft')
      ->firstOrFail();

    $response->delete();
    return 1; // Return count of deleted items
  }

  /**
   * Send a draft message
   */
  public function sendDraft($id)
  {
    $response = MessageResponse::where('id', $id)
      ->where('user_id', Auth::id())
      ->where('status', 'draft')
      ->firstOrFail();

    $response->status = 'sent';
    $response->sent_at = now();
    $response->save();

    return 1; // Return count of updated items
  }

  /**
   * Update a draft message
   */
  public function updateDraft(array $validatedData, $id)
  {
    $response = MessageResponse::where('id', $id)
      ->where('user_id', Auth::id())
      ->where('status', 'draft')
      ->firstOrFail();

    $response->update($validatedData);

    return $response; // Return the updated model
  }

  /**
   * Bulk delete drafts
   */
  public function bulkDeleteDrafts(array $ids)
  {
    return MessageResponse::whereIn('id', $ids)
      ->where('user_id', Auth::id())
      ->where('status', 'draft')
      ->delete();
  }

  /**
   * Bulk send drafts
   */
  public function bulkSendDrafts(array $ids)
  {
    return MessageResponse::whereIn('id', $ids)
      ->where('user_id', Auth::id())
      ->where('status', 'draft')
      ->update([
        'status' => 'sent',
        'sent_at' => now()
      ]);
  }

  /**
   * Bulk delete sent messages (move to deleted status or permanently delete)
   */
  public function bulkDeleteSent(array $ids)
  {
    return MessageResponse::whereIn('id', $ids)
      ->where('user_id', Auth::id())
      ->where('status', 'sent')
      ->delete();
  }

}
