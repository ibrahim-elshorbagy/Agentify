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
     * Get sent emails with filters and pagination
     */
    public function sentEmails(Request $request)
    {
        $request->validate([
            'to_email' => ['nullable', 'string', 'max:255'],
            'from_email' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'string', 'in:id,to_email,from_email,created_at,sent_at'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        $emailsQuery = MessageResponse::query()
            ->with('message')
            ->where('user_id', Auth::id())
            ->where('status', 'sent');

        $this->applyFilters($emailsQuery, $request);

        $emails = $emailsQuery->orderBy($sortField, $sortDirection)
            ->paginate($perPage, ['*'], 'sent_page')
            ->withQueryString();

        return [
            'emails' => $emails,
            'queryParams' => $request->query() ?: null,
        ];
    }

    /**
     * Get draft emails with filters and pagination
     */
    public function draftEmails(Request $request)
    {
        $request->validate([
            'to_email' => ['nullable', 'string', 'max:255'],
            'from_email' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'string', 'in:id,to_email,from_email,created_at'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        $emailsQuery = MessageResponse::query()
            ->with('message')
            ->where('user_id', Auth::id())
            ->where('status', 'draft');

        $this->applyFilters($emailsQuery, $request);

        $emails = $emailsQuery->orderBy($sortField, $sortDirection)
            ->paginate($perPage, ['*'], 'draft_page')
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
        if ($request->filled('to_email')) {
            $query->where('to_email', 'like', '%' . $request->input('to_email') . '%');
        }
        if ($request->filled('from_email')) {
            $query->where('from_email', 'like', '%' . $request->input('from_email') . '%');
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }
    }

    /**
     * Get counts for sent and draft
     */
    public function getEmailCounts()
    {
        $userId = Auth::id();
        return [
            'sent' => MessageResponse::where('user_id', $userId)->where('status', 'sent')->count(),
            'draft' => MessageResponse::where('user_id', $userId)->where('status', 'draft')->count(),
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
        try {
            $response = MessageResponse::where('id', $id)
                ->where('user_id', Auth::id())
                ->where('status', 'draft')
                ->firstOrFail();

            $response->delete();

            return [
                'success' => true,
                'message' => __('website_response.draft_deleted_successfully')
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_deleting_draft')
            ];
        }
    }

    /**
     * Send a draft message
     */
    public function sendDraft($id)
    {
        try {
            $response = MessageResponse::where('id', $id)
                ->where('user_id', Auth::id())
                ->where('status', 'draft')
                ->firstOrFail();

            $response->status = 'sent';
            $response->sent_at = now();
            $response->save();

            return [
                'success' => true,
                'message' => __('website_response.draft_sent_successfully')
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_sending_draft')
            ];
        }
    }

    /**
     * Update a draft message
     */
    public function updateDraft(Request $request, $id)
    {
        $validatedData = $request->validate([
            'body_text' => ['required', 'string', 'max:10000'],
            'from_email' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
            'to_email' => ['required', 'email', 'max:255'],
            'to_name' => ['required', 'string', 'max:255'],
        ]);

        try {
            $response = MessageResponse::where('id', $id)
                ->where('user_id', Auth::id())
                ->where('status', 'draft')
                ->firstOrFail();

            $response->update($validatedData);

            return [
                'success' => true,
                'message' => __('website_response.draft_updated_successfully'),
                'response' => $response,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_updating_draft')
            ];
        }
    }

    /**
     * Bulk delete drafts
     */
    public function bulkDeleteDrafts(array $ids)
    {
        try {
            $deleted = MessageResponse::whereIn('id', $ids)
                ->where('user_id', Auth::id())
                ->where('status', 'draft')
                ->delete();

            return [
                'success' => true,
                'message' => __('website_response.bulk_drafts_deleted', ['count' => $deleted])
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_bulk_action')
            ];
        }
    }

    /**
     * Bulk send drafts
     */
    public function bulkSendDrafts(array $ids)
    {
        try {
            $updated = MessageResponse::whereIn('id', $ids)
                ->where('user_id', Auth::id())
                ->where('status', 'draft')
                ->update([
                    'status' => 'sent',
                    'sent_at' => now()
                ]);

            return [
                'success' => true,
                'message' => __('website_response.bulk_drafts_sent', ['count' => $updated])
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_bulk_action')
            ];
        }
    }

    /**
     * Bulk delete sent messages (move to deleted status or permanently delete)
     */
    public function bulkDeleteSent(array $ids)
    {
        try {
            $deleted = MessageResponse::whereIn('id', $ids)
                ->where('user_id', Auth::id())
                ->where('status', 'sent')
                ->delete();

            return [
                'success' => true,
                'message' => __('website_response.bulk_sent_deleted', ['count' => $deleted])
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_bulk_action')
            ];
        }
    }

    // Add actions as needed (edit, delete, send draft, etc.)
}
