<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SubscriptionSystem\SubscriptionService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'=>'required|string|max:255',
            'username' => [
              'required',
              'string',
              'max:255',
              'unique:users,username',
              'regex:/^[a-z0-9-_]+$/',
            ],
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required' => __('website_response.name_required'),
            'username.required' => __('website_response.username_required'),
            'username.unique' => __('website_response.username_unique'),
            'username.regex' => __('website_response.username_regex'),
            'email.required' => __('website_response.email_required'),
            'email.email' => __('website_response.email_invalid'),
            'email.unique' => __('website_response.email_unique'),
            'password.required' => __('website_response.password_required'),
            'password.confirmed' => __('website_response.password_confirmation'),
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('user');

        // Automatically subscribe new user to Starter plan (ID: 4)
        $subscriptionService = new SubscriptionService();
        $subscriptionService->subscribe($user->id, 4);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
