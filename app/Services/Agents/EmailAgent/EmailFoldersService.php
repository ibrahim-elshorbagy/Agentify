<?php

namespace App\Services\Agents\EmailAgent;

use App\Models\Agent\EmailAgent\Message;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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
            'sort' => ['nullable', 'string', 'in:id,from_email,subject,received_at,created_at'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        // Inbox emails query
        $emailsQuery = Message::query()->where('folder', 'inbox');

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
            'sort' => ['nullable', 'string', 'in:id,from_email,subject,received_at,created_at'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        // Spam emails query
        $emailsQuery = Message::query()->where('folder', 'spam');

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
            'sort' => ['nullable', 'string', 'in:id,from_email,subject,received_at,created_at'],
            'direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $perPage = $request->input('per_page', 15);

        // Bin emails query
        $emailsQuery = Message::query()->where('folder', 'bin');

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
        // Combined search in from_email OR from_name
        if ($request->filled('from')) {
            $query->where(function ($q) use ($request) {
                $q->where('from_email', 'like', '%' . $request->from . '%')
                  ->orWhere('from_name', 'like', '%' . $request->from . '%');
            });
        }

        if ($request->filled('subject')) {
            $query->where('subject', 'like', '%' . $request->subject . '%');
        }

        if ($request->has('is_read') && $request->is_read !== null) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        if ($request->has('is_starred') && $request->is_starred !== null) {
            $query->where('is_starred', $request->boolean('is_starred'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('received_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('received_at', '<=', $request->date_to);
        }
    }

    /**
     * Get email counts for sidebar
     */
    public function getEmailCounts()
    {
        return [
            'inbox_total' => Message::where('folder', 'inbox')->count(),
            'inbox_unread' => Message::where('folder', 'inbox')->where('is_read', false)->count(),
            'spam_total' => Message::where('folder', 'spam')->count(),
            'spam_unread' => Message::where('folder', 'spam')->where('is_read', false)->count(),
            'bin_total' => Message::where('folder', 'bin')->count(),
            'bin_unread' => Message::where('folder', 'bin')->where('is_read', false)->count(),
            'starred_total' => Message::where('is_starred', true)->count(),
        ];
    }
}
