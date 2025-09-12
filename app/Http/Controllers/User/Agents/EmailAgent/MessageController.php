<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use App\Services\Agents\EmailAgent\EmailFoldersService;
use Illuminate\Http\Request;

class MessageController extends Controller
{
  protected $emailService;

  public function __construct(EmailFoldersService $emailService)
  {
    $this->emailService = $emailService;
  }

  public function inbox(Request $request)
  {
    $data = $this->emailService->inboxEmails($request);

    return inertia('User/Agents/EmailAgent/Messages', [
      'emails' => $data['emails'],
      'type' => 'inbox',
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }

  public function spam(Request $request)
  {
    $data = $this->emailService->spamEmails($request);

    return inertia('User/Agents/EmailAgent/Messages', [
      'emails' => $data['emails'],
      'type' => 'spam',
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }

  public function bin(Request $request)
  {
    $data = $this->emailService->binEmails($request);

    return inertia('User/Agents/EmailAgent/Messages', [
      'emails' => $data['emails'],
      'type'=> 'bin',
      'queryParams' => $data['queryParams'],
      'emailCounts' => $this->emailService->getEmailCounts(),
    ]);
  }
}
