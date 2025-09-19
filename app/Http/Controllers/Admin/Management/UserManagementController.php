<?php

namespace App\Http\Controllers\Admin\Management;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
  public function index(Request $request)
  {
    $request->validate([
      'name' => ['nullable', 'string', 'max:255'],
      'email' => ['nullable', 'string', 'max:255'],
      'username' => ['nullable', 'string', 'max:255'],
      'sort' => ['nullable', 'string', 'in:name,email,username,created_at'],
      'direction' => ['nullable', 'string', 'in:asc,desc'],
      'per_page' => ['nullable', 'integer', 'min:1'],
    ]);

    $sortField = $request->input('sort', 'id');
    $sortDirection = $request->input('direction', 'desc');
    $perPage = $request->input('per_page', 15);

    // Shared filter function
    $applyFilters = function ($query) use ($request) {
      if ($request->filled('search')) {
        $search = trim($request->search);
        $query->where(function ($q) use ($search) {
          $q->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->orWhere('username', 'like', "%{$search}%");
        });
      }
    };


    // Admins
    $adminsQuery = User::query()->with('roles')->whereHas('roles', fn($q) => $q->where('name', 'admin'))->whereNot('id', $request->user()->id);
    $applyFilters($adminsQuery);
    $admins = $adminsQuery->orderBy($sortField, $sortDirection)
      ->paginate($perPage, ['*'], 'admins_page')
      ->withQueryString();
    $admins = $this->addRowNumbers($admins);


    // Users
    $usersQuery = User::query()->with('roles')->whereHas('roles', fn($q) => $q->where('name', 'user'));
    $applyFilters($usersQuery);
    $users = $usersQuery->orderBy($sortField, $sortDirection)
      ->paginate($perPage, ['*'], 'users_page')
      ->withQueryString();
    $users = $this->addRowNumbers($users);


    // Roles for dropdown in modals
    $roles = Role::all();

    return inertia('Admin/Management/UserManagement/Users', [
      'admins' => $admins,
      'users' => $users,
      'roles' => $roles,
      'queryParams' => $request->query() ?: null,
    ]);
  }

  public function store(Request $request)
  {
    $data = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
      'username' => ['required', 'string', 'max:255', 'unique:users'],
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
      'role' => ['required', 'string', 'exists:roles,name'],
    ]);

    $user = User::create([
      'name' => $data['name'],
      'email' => $data['email'],
      'username' => $data['username'],
      'password' => Hash::make($data['password']),
    ]);

    $user->assignRole($data['role']);

    return back()
      ->with('title', __('website_response.user_created_title'))
      ->with('message', __('website_response.user_created_message'))
      ->with('status', 'success');
  }

  public function update(Request $request, User $user)
  {
    // Check if it's a block/unblock request
    if ($request->has('blocked') && !$request->has('name')) {
      $request->validate([
        'blocked' => ['required', 'boolean'],
      ]);

      $user->update([
        'blocked' => $request->blocked,
      ]);

      $status = $request->blocked ? 'blocked' : 'unblocked';

      return back()
        ->with('title', __("website_response.user_{$status}_title"))
        ->with('message', __("website_response.user_{$status}_message"))
        ->with('status', $request->blocked ? 'warning' : 'success');
    }

    // Regular update request
    $data = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
      'username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id],
      'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
      'role' => ['required', 'string', 'exists:roles,name'],
      'blocked' => ['nullable', 'boolean'],
    ]);

    $updateData = [
      'name' => $data['name'],
      'email' => $data['email'],
      'username' => $data['username'],
      'blocked' => $data['blocked'] ?? false,
    ];

    if (!empty($data['password'])) {
      $updateData['password'] = Hash::make($data['password']);
    }

    $user->update($updateData);

    // Sync role
    $user->syncRoles($data['role']);

    return back()
      ->with('title', __('website_response.user_updated_title'))
      ->with('message', __('website_response.user_updated_message'))
      ->with('status', 'success');
  }

  public function destroy(Request $request, User $user)
  {
    // Don't allow deleting self
    if ($user->id === $request->user()->id) {
      return back()
        ->with('title', __('website_response.user_delete_error_title'))
        ->with('message', __('website_response.user_delete_error_self_message'))
        ->with('status', 'error');
    }

    $user->delete();

    return back()
      ->with('title', __('website_response.user_deleted_title'))
      ->with('message', __('website_response.user_deleted_message'))
      ->with('status', 'warning');
  }

  /**
   * Bulk block users
   */
  public function bulkBlock(Request $request)
  {
    $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'exists:users,id'
    ]);

    $count = User::whereIn('id', $request->ids)
      ->where('blocked', false)
      ->update(['blocked' => true]);

    return back()->with('success', "Successfully blocked {$count} users.");
  }

  /**
   * Bulk unblock users
   */
  public function bulkUnblock(Request $request)
  {
    $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'exists:users,id'
    ]);

    $count = User::whereIn('id', $request->ids)
      ->where('blocked', true)
      ->update(['blocked' => false]);

    return back()->with('success', "Successfully unblocked {$count} users.");
  }

  /**
   * Bulk delete users
   */
  public function bulkDelete(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array'],
      'ids.*' => ['required', 'integer', 'exists:users,id'],
    ]);

    $ids = $request->input('ids');

    // Don't allow deleting self
    if (in_array($request->user()->id, $ids)) {
      return back()
        ->with('title', __('website_response.user_delete_error_title'))
        ->with('message', __('website_response.user_delete_error_self_message'))
        ->with('status', 'error');
    }

    $count = User::whereIn('id', $ids)->count();
    User::whereIn('id', $ids)->delete();

    return back()
      ->with('title', __('website_response.users_deleted_title'))
      ->with('message', __('website_response.users_deleted_message', ['count' => $count]))
      ->with('status', 'warning');
  }
}
