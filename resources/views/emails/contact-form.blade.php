@component('mail::message')
# New Contact Form Submission

**From:** {{ $contactData['name'] }}
**Email:** {{ $contactData['email'] }}
**Subject:** {{ $contactData['subject'] }}

## Message:

{{ $contactData['message'] }}

---

You can reply directly to this email as it's configured to reply to the sender's email address.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
