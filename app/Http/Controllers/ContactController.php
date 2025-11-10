<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Store a new contact message
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:10000',
        ]);

        try {
            // Get the validated data
            $data = $request->only(['name', 'email', 'subject', 'message']);

            Mail::to('support@agentifysa.com')->send(new ContactFormMail($data));

            return back()
                ->with('title', __('website_response.contact_message_sent_title'))
                ->with('message', __('website_response.contact_message_sent_message'))
                ->with('status', 'success');

        } catch (\Exception $e) {
            Log::error('Contact form error', [
                'error' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);

            return back()
                ->with('title', __('website_response.contact_message_error_title'))
                ->with('message', __('website_response.contact_message_error_message'))
                ->with('status', 'error')
                ->withInput();
        }
    }
}
