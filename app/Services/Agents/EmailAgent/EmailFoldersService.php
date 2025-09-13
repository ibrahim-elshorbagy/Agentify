<?php

namespace App\Services\Agents\EmailAgent;

use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class EmailFoldersService
{
    /**
     * Get inbox emails with filters and pagination
     */
    public function inboxEmails(Request $request)
    {
        $request->validate([
            'from' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'is_read' => ['nullable', 'boolean'],
            'is_starred' => ['nullable', 'boolean'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'string', 'in:id,from_email,subject,received_at,created_at,is_starred,is_read'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        // Inbox emails query - filter by current user
        $emailsQuery = Message::query()
            ->where('folder', 'inbox')
            ->where('user_id', Auth::id());

        $this->applyFilters($emailsQuery, $request);

        $emails = $emailsQuery->orderBy($sortField, $sortDirection)
            ->paginate($perPage, ['*'], 'inbox_page')
            ->withQueryString();

        return [
            'emails' => $emails,
            'queryParams' => $request->query() ?: null,
        ];
    }

    /**
     * Get spam emails with filters and pagination
     */
    public function spamEmails(Request $request)
    {
        $request->validate([
            'from' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'is_read' => ['nullable', 'boolean'],
            'is_starred' => ['nullable', 'boolean'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'string', 'in:id,from_email,subject,received_at,created_at,is_starred,is_read'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        // Spam emails query - filter by current user
        $emailsQuery = Message::query()
            ->where('folder', 'spam')
            ->where('user_id', Auth::id());

        $this->applyFilters($emailsQuery, $request);

        $emails = $emailsQuery->orderBy($sortField, $sortDirection)
            ->paginate($perPage, ['*'], 'spam_page')
            ->withQueryString();

        return [
            'emails' => $emails,
            'queryParams' => $request->query() ?: null,
        ];
    }

    /**
     * Get bin emails with filters and pagination
     */
    public function binEmails(Request $request)
    {
        $request->validate([
            'from' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'is_read' => ['nullable', 'boolean'],
            'is_starred' => ['nullable', 'boolean'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'string', 'in:id,from_email,subject,received_at,created_at,is_starred,is_read'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        // Bin emails query - filter by current user
        $emailsQuery = Message::query()
            ->where('folder', 'bin')
            ->where('user_id', Auth::id());

        $this->applyFilters($emailsQuery, $request);

        $emails = $emailsQuery->orderBy($sortField, $sortDirection)
            ->paginate($perPage, ['*'], 'bin_page')
            ->withQueryString();

        return [
            'emails' => $emails,
            'queryParams' => $request->query() ?: null,
        ];
    }

    /**
     * Apply shared filters to email queries
     */
    private function applyFilters($query, Request $request)
    {
        // Combined search in from_email, from_name, OR subject
        if ($request->filled('from')) {
            $searchTerm = '%' . $request->input('from') . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('from_email', 'like', $searchTerm)
                  ->orWhere('from_name', 'like', $searchTerm)
                  ->orWhere('subject', 'like', $searchTerm);
            });
        }

        if ($request->filled('subject')) {
            $query->where('subject', 'like', '%' . $request->input('subject') . '%');
        }

        if ($request->has('is_read') && $request->is_read !== null) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        if ($request->has('is_starred') && $request->is_starred !== null) {
            $query->where('is_starred', $request->boolean('is_starred'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('received_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('received_at', '<=', $request->input('date_to'));
        }
    }

    /**
     * Get email counts for sidebar
     */
    public function getEmailCounts()
    {
        $userId = Auth::id();
        return [
            'inbox_total' => Message::where('folder', 'inbox')->where('user_id', $userId)->count(),
            'inbox_unread' => Message::where('folder', 'inbox')->where('user_id', $userId)->where('is_read', false)->count(),
            'spam_total' => Message::where('folder', 'spam')->where('user_id', $userId)->count(),
            'spam_unread' => Message::where('folder', 'spam')->where('user_id', $userId)->where('is_read', false)->count(),
            'bin_total' => Message::where('folder', 'bin')->where('user_id', $userId)->count(),
            'bin_unread' => Message::where('folder', 'bin')->where('user_id', $userId)->where('is_read', false)->count(),
            'starred_total' => Message::where('is_starred', true)->where('user_id', $userId)->count(),
        ];
    }

    /**
     * Toggle read status for an email
     */
    public function toggleRead($id)
    {
        try {
            $message = Message::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // Toggle the read status
            $message->is_read = !$message->is_read;
            $message->save();

            $status = $message->is_read ? 'read' : 'unread';

            return [
                'success' => true,
                'message' => __('website_response.email_marked_as_' . $status),
                'is_read' => $message->is_read
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_updating_email_status')
            ];
        }
    }

    /**
     * Move email to spam folder
     */
    public function moveToSpam($id)
    {
        try {
            $message = Message::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();
            $message->folder = 'spam';
            $message->save();

            return [
                'success' => true,
                'message' => __('website_response.email_moved_to_spam')
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_moving_email')
            ];
        }
    }

    /**
     * Move email to bin folder
     */
    public function moveToBin($id)
    {
        try {
            $message = Message::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();
            $message->folder = 'bin';
            $message->save();

            return [
                'success' => true,
                'message' => __('website_response.email_moved_to_bin')
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_moving_email')
            ];
        }
    }

    /**
     * Restore email to inbox
     */
    public function restore($id)
    {
        try {
            $message = Message::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();
            $message->folder = 'inbox';
            $message->save();

            return [
                'success' => true,
                'message' => __('website_response.email_restored_to_inbox')
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_restoring_email')
            ];
        }
    }

    /**
     * Delete email permanently
     */
    public function deletePermanently($id)
    {
        try {
            $message = Message::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // Delete associated responses first
            $message->responses()->delete();

            // Delete the message
            $message->delete();

            return [
                'success' => true,
                'message' => __('website_response.email_deleted_permanently')
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_deleting_email')
            ];
        }
    }

    /**
     * Toggle star status for an email
     */
    public function toggleStar($id)
    {
        try {
            $message = Message::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // Toggle the star status
            $message->is_starred = !$message->is_starred;
            $message->save();

            $status = $message->is_starred ? 'starred' : 'unstarred';

            return [
                'success' => true,
                'message' => __('website_response.email_' . $status . '_successfully'),
                'is_starred' => $message->is_starred
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_updating_email_status')
            ];
        }
    }

    /**
     * Store a new message response (draft or sent)
     */
    public function storeResponse(Request $request, $messageId)
    {
        // Validate input data
        $validatedData = $request->validate([
            'body_text' => ['required', 'string', 'max:10000'],
            'from_email' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
            'to_email' => ['required', 'email', 'max:255'],
            'to_name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:draft,sent'],
        ]);

        try {
            // Verify the message belongs to the current user
            $message = Message::where('id', $messageId)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $response = MessageResponse::create([
                'message_id' => $message->id,
                'user_id' => Auth::id(),
                'body_text' => $validatedData['body_text'],
                'from_email' => $validatedData['from_email'],
                'from_name' => $validatedData['from_name'],
                'to_email' => $validatedData['to_email'],
                'to_name' => $validatedData['to_name'],
                'status' => $validatedData['status'],
                'sent_at' => $validatedData['status'] === 'sent' ? now() : null,
            ]);

            $statusMessage = $validatedData['status'] === 'sent'
                ? __('website_response.response_sent_successfully')
                : __('website_response.response_saved_as_draft');

            return [
                'success' => true,
                'message' => $statusMessage,
                'response' => $response,
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_storing_response')
            ];
        }
    }

    /**
     * Store a new message (draft or sent)
     */
    public function storeMessage(Request $request)
    {
        // Validate input data
        $validatedData = $request->validate([
            'body_text' => ['required', 'string', 'max:10000'],
            'from_email' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
            'to_email' => ['required', 'email', 'max:255'],
            'to_name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:draft,sent'],
            'message_id' => ['required', 'integer', 'exists:messages,id'],
        ]);

        try {
            // Verify the message belongs to the current user
            $message = Message::where('id', $validatedData['message_id'])
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $messageResponse = MessageResponse::create([
                'message_id' => $validatedData['message_id'],
                'user_id' => Auth::id(),
                'body_text' => $validatedData['body_text'],
                'from_email' => $validatedData['from_email'],
                'from_name' => $validatedData['from_name'],
                'to_email' => $validatedData['to_email'],
                'to_name' => $validatedData['to_name'],
                'status' => $validatedData['status'],
                'sent_at' => $validatedData['status'] === 'sent' ? now() : null,
            ]);

            $statusMessage = $validatedData['status'] === 'sent'
                ? __('website_response.message_sent_successfully')
                : __('website_response.message_saved_as_draft');

            return [
                'success' => true,
                'message' => $statusMessage,
                'response' => $messageResponse,
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_storing_message'),
            ];
        }
    }

    /**
     * Update an existing message response (draft or sent)
     */
    public function updateMessage(Request $request, $id)
    {
        // Validate input data
        $validatedData = $request->validate([
            'body_text' => ['required', 'string', 'max:10000'],
            'from_email' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
            'to_email' => ['required', 'email', 'max:255'],
            'to_name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:draft,sent'],
        ]);

        try {
            $messageResponse = MessageResponse::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $messageResponse->update([
                'body_text' => $validatedData['body_text'],
                'from_email' => $validatedData['from_email'],
                'from_name' => $validatedData['from_name'],
                'to_email' => $validatedData['to_email'],
                'to_name' => $validatedData['to_name'],
                'status' => $validatedData['status'],
                'sent_at' => $validatedData['status'] === 'sent' ? now() : null,
            ]);

            $statusMessage = $validatedData['status'] === 'sent'
                ? __('website_response.message_updated_and_sent')
                : __('website_response.message_updated_successfully');

            return [
                'success' => true,
                'message' => $statusMessage,
                'response' => $messageResponse,
            ];
        }  catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('website_response.error_updating_message'),
            ];
        }
    }
}
