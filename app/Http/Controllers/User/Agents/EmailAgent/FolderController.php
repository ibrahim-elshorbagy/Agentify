<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use App\Models\Agent\EmailAgent\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FolderController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folders = Folder::forUser(Auth::id())
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'folders' => $folders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('folders')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                })
            ],
            'icon' => 'nullable|string|max:50'
        ]);

        try {
            // Get the highest sort_order for the user
            $maxSortOrder = Folder::forUser(Auth::id())->max('sort_order') ?? 0;

            $folder = Folder::create([
                'user_id' => Auth::id(),
                'name' => $request->name,
                'icon' => $request->icon ?? 'fa-folder',
                'is_default' => false,
                'sort_order' => $maxSortOrder + 1
            ]);

            return back()
                ->with('title', __('website_response.success_title'))
                ->with('message', __('Folder created successfully'))
                ->with('status', 'success');

        } catch (\Exception $e) {
            return back()
                ->with('title', __('website_response.error_title'))
                ->with('message', __('website_response.something_went_wrong'))
                ->with('status', 'error');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        // Check if user owns the folder
        if ($folder->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('folders')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                })->ignore($folder->id)
            ],
            'icon' => 'nullable|string|max:50'
        ]);

        try {
            $folder->update([
                'name' => $request->name,
                'icon' => $request->icon ?? $folder->icon
            ]);

            return back()
                ->with('title', __('website_response.success_title'))
                ->with('message', __('Folder updated successfully'))
                ->with('status', 'success');

        } catch (\Exception $e) {
            return back()
                ->with('title', __('website_response.error_title'))
                ->with('message', __('website_response.something_went_wrong'))
                ->with('status', 'error');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        // Check if user owns the folder
        if ($folder->user_id !== Auth::id()) {
            abort(403);
        }

        // Check if folder can be deleted (not a default folder)
        if (!$folder->canDelete()) {
            return back()
                ->with('title', __('website_response.error_title'))
                ->with('message', __('Cannot delete default folders'))
                ->with('status', 'error');
        }

        try {
            // Move messages to inbox before deleting folder
            $inboxFolder = Folder::forUser(Auth::id())
                ->where('name', 'inbox')
                ->first();

            if ($inboxFolder) {
                $folder->messages()->update(['folder_id' => $inboxFolder->id]);
            }

            $folder->delete();

            return redirect()
                ->route('user.email-agent.emails', ['folder' => 'inbox'])
                ->with('title', __('website_response.success_title'))
                ->with('message', __('website_response.folder_deleted_successfully'))
                ->with('status', 'success');

        } catch (\Exception $e) {
            return back()
                ->with('title', __('website_response.error_title'))
                ->with('message', __('website_response.something_went_wrong'))
                ->with('status', 'error');
        }
    }
}
