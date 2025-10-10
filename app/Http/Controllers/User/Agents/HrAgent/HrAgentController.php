<?php

namespace App\Http\Controllers\User\Agents\HrAgent;

use App\Http\Controllers\Controller;
use App\Models\Agent\HrAgent\HrAgent;
use App\Models\Site\UserCredential;
use App\Services\Agents\HrAgent\HrAgentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class HrAgentController extends Controller
{
  use AuthorizesRequests;

  protected HrAgentService $hrAgentService;

  public function __construct(HrAgentService $hrAgentService)
  {
    $this->hrAgentService = $hrAgentService;
  }

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

  /**
   * Upload files for HR agent analysis
   */
  public function uploadFiles(Request $request)
  {
    $request->validate([
      'files' => ['required', 'array', 'min:1'],
      'files.*' => ['file', 'mimes:pdf,doc,docx', 'max:10240'], // 10MB max per file
    ]);

    try {
      $fileUrls = [];

      foreach ($request->file('files') as $file) {
        // Store file
        $path = $file->store('user_'.Auth::id().'/Agents/HrAgent/uploads', 'public');
        $fileUrls[] = Storage::url($path);
      }

      // Prepare data for N8N webhook
      $data = [
        'user_id' => Auth::id(),
        'source' => 'website',
        'files' => $fileUrls
      ];

      // Call HR Agent service
      $result = $this->hrAgentService->uploadFile($data);

      if ($result['success']) {
        return back()
          ->with('title', __('website_response.hr_files_uploaded_title'))
          ->with('message', __('website_response.hr_files_uploaded_message'))
          ->with('status', 'success');
      } else {
        return back()
          ->with('title', __('website_response.hr_upload_failed_title'))
          ->with('message', __('website_response.hr_upload_failed_message'))
          ->with('status', 'error');
      }
    } catch (\Exception $e) {
      return back()
        ->with('title', __('website_response.hr_upload_failed_title'))
        ->with('message', $e->getMessage())
        ->with('status', 'error');
    }
  }

  /**
   * Get Gmail emails via HR Agent
   */
  public function getGmail()
  {
    try {
      // Get user's Gmail credentials
      $gmailCredential = UserCredential::forUser(Auth::id())
        ->forProvider('google')
        ->first();

      if (!$gmailCredential) {
        return back()
          ->with('title', __('website_response.hr_gmail_no_credential_title'))
          ->with('message', __('website_response.hr_gmail_no_credential_message'))
          ->with('status', 'error');
      }

      // Prepare data for N8N webhook
      $data = [
        'user_id' => Auth::id(),
        'source' => 'gmail',
        'access_token' => $gmailCredential->provider_token
      ];

      // Call HR Agent service
      $result = $this->hrAgentService->getGmail($data);

      if ($result['success']) {
        return back()
          ->with('title', __('website_response.hr_gmail_processing_title'))
          ->with('message', __('website_response.hr_gmail_processing_message'))
          ->with('status', 'success');
      } else {
        return back()
          ->with('title', __('website_response.hr_gmail_failed_title'))
          ->with('message', __('website_response.hr_gmail_failed_message'))
          ->with('status', 'error');
      }
    } catch (\Exception $e) {
      return back()
        ->with('title', __('website_response.hr_gmail_failed_title'))
        ->with('message', $e->getMessage())
        ->with('status', 'error');
    }
  }

  /**
   * Get Outlook emails via HR Agent
   */
  public function getOutlook()
  {
    try {
      // Get user's Microsoft credentials
      $outlookCredential = UserCredential::forUser(Auth::id())
        ->forProvider('microsoft')
        ->first();

      if (!$outlookCredential) {
        return back()
          ->with('title', __('website_response.hr_outlook_no_credential_title'))
          ->with('message', __('website_response.hr_outlook_no_credential_message'))
          ->with('status', 'error');
      }

      // Prepare data for N8N webhook
      $data = [
        'user_id' => Auth::id(),
        'source' => 'outlook',
        'access_token' => $outlookCredential->provider_token
      ];

      // Call HR Agent service
      $result = $this->hrAgentService->getOutlook($data);

      if ($result['success']) {
        return back()
          ->with('title', __('website_response.hr_outlook_processing_title'))
          ->with('message', __('website_response.hr_outlook_processing_message'))
          ->with('status', 'success');
      } else {
        return back()
          ->with('title', __('website_response.hr_outlook_failed_title'))
          ->with('message', __('website_response.hr_outlook_failed_message'))
          ->with('status', 'error');
      }
    } catch (\Exception $e) {
      return back()
        ->with('title', __('website_response.hr_outlook_failed_title'))
        ->with('message', $e->getMessage())
        ->with('status', 'error');
    }
  }
}
