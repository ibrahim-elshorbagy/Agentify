<?php

namespace App\Http\Controllers\User\Agents\HrAgent;

use App\Http\Controllers\Controller;
use App\Models\Agent\HrAgent\HrAgent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class HrAgentController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display HR agent candidates
     */
    public function index(Request $request)
    {
        $query = HrAgent::where('user_id', Auth::id());

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('candidate_name', 'like', "%{$search}%")
                  ->orWhere('email_address', 'like', "%{$search}%")
                  ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort_field', 'analyzed_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        if (in_array($sortField, ['candidate_name', 'email_address', 'contact_number', 'score', 'analyzed_at'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('analyzed_at', 'desc');
        }

        $perPage = $request->get('per_page', 15);
        $hrAgents = $query->paginate($perPage);
        $hrAgents = $this->addRowNumbers($hrAgents);

        return inertia('User/Agents/HrAgent/HrAgent', [
            'hrAgents' => $hrAgents,
            'queryParams' => $request->query(),
        ]);
    }

    /**
     * View a specific HR agent candidate
     */
    public function view(HrAgent $hrAgent)
    {
        // Ensure the HR agent belongs to the authenticated user
        if ($hrAgent->user_id !== Auth::id()) {
            abort(403);
        }

        return inertia('User/Agents/HrAgent/Pages/View', [
            'hrAgent' => $hrAgent,
        ]);
    }

    /**
     * Delete a specific HR agent candidate
     */
    public function destroy(HrAgent $hrAgent)
    {
        // Ensure the HR agent belongs to the authenticated user
        if ($hrAgent->user_id !== Auth::id()) {
            abort(403);
        }

        $hrAgent->delete();

        return back()
            ->with('title', __('website_response.hr_candidate_deleted_title'))
            ->with('message', __('website_response.hr_candidate_deleted_message'))
            ->with('status', 'success');
    }

    /**
     * Bulk delete HR agent candidates
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer']
        ]);

        $deletedCount = HrAgent::whereIn('id', $request->ids)
            ->where('user_id', Auth::id())
            ->delete();

        return back()
            ->with('title', __('website_response.bulk_action_completed'))
            ->with('message', __('website_response.deleted_successfully', ['count' => $deletedCount]))
            ->with('status', 'success');
    }
}
