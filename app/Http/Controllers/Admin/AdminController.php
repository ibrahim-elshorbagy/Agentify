<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function loginAs(Request $request, $userId)
    {
        if (!Auth::user() || !Auth::user()->hasRole('admin')) {
            abort(403);
        }
        $userToLogin = User::findOrFail($userId);
        // Store original admin ID in session
        session(['impersonate_admin_id' => Auth::id()]);
        Auth::login($userToLogin);
        return redirect()->route('profile.edit')
            ->with('title', __('website_response.impersonation_success_title'))
            ->with('message', __('website_response.impersonation_success_message', ['name' => $userToLogin->name]))
            ->with('status', 'success');
    }

    public function returnToAdmin(Request $request)
    {
        $adminId = session('impersonate_admin_id');
        if ($adminId) {
            $admin = User::find($adminId);
            if ($admin) {
                Auth::login($admin);
                session()->forget('impersonate_admin_id');
                return redirect()->route('admin.users.index')
                    ->with('title', __('website_response.impersonation_return_title'))
                    ->with('message', __('website_response.impersonation_return_message'))
                    ->with('status', 'success');
            }
        }
        return redirect()->route('profile.edit')
            ->with('title', __('website_response.impersonation_failed_title'))
            ->with('message', __('website_response.impersonation_failed_message'))
            ->with('status', 'error');
    }
}
