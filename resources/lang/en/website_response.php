<?php

return [
  /*
  |--------------------------------------------------------------------------
  | All Website Controllers Responses Lines
  |--------------------------------------------------------------------------
  |
  |
  */

  'language_changed_title' => 'Language Changed',
  'language_changed_message' => 'Language updated successfully.',
  "blocked_account" => "Your account has been blocked. Please contact administrator",

  /* Auth Controller Responses */
  'login_successful_title' => 'Login Successful',
  'login_successful_message' => 'Welcome back! You have been logged in successfully.',
  'logout_successful_title' => 'Logged Out',
  'logout_successful_message' => 'You have been logged out successfully.',
  'registration_successful_title' => 'Registration Successful',
  'registration_successful_message' => 'Your account has been created successfully. Welcome!',
  'password_reset_link_sent_title' => 'Password Reset Link Sent',
  'password_reset_link_sent_message' => 'A password reset link has been sent to your email address.',
  'password_reset_successful_title' => 'Password Reset Successful',
  'password_reset_successful_message' => 'Your password has been reset successfully. You can now log in.',
  'verification_link_sent_title' => 'Verification Link Sent',
  'verification_link_sent_message' => 'A new verification link has been sent to your email address.',
  'password_confirmed_title' => 'Password Confirmed',
  'password_confirmed_message' => 'Your password has been confirmed successfully.',

  /* Auth Validation Messages */
  'username_required' => 'The username field is required.',
  'password_required' => 'The password field is required.',
  'name_required' => 'The name field is required.',
  'username_unique' => 'This username is already taken.',
  "username_regex" => "The username may only contain lowercase letters, numbers, hyphens, and underscores.",
  'email_required' => 'The email field is required.',
  'email_invalid' => 'Please enter a valid email address.',
  'email_unique' => 'This email is already registered.',
  'password_confirmation' => 'The password confirmation does not match.',
  /* End Auth Validation Messages */

  /* End Auth Controller Responses */

  /* Profile Controller Responses */
  'profile_updated_title' => 'Profile Updated',
  'profile_updated_message' => 'Your profile information has been updated successfully.',
  'account_deleted_title' => 'Account Deleted',
  'account_deleted_message' => 'Your account has been permanently deleted.',
  'password_updated_title' => 'Password Updated',
  'password_updated_message' => 'Your password has been updated successfully.',
  'profile_image_updated_title' => 'Profile Image Updated',
  'profile_image_updated_message' => 'Your profile image has been updated successfully.',


  /* User Management Responses */
  'user_created_title' => 'User Created',
  'user_created_message' => 'User has been created successfully.',
  'user_updated_title' => 'User Updated',
  'user_updated_message' => 'User has been updated successfully.',
  'user_deleted_title' => 'User Deleted',
  'user_deleted_message' => 'User has been deleted successfully.',
  'users_deleted_title' => 'Users Deleted',
  'users_deleted_message' => ':count users have been deleted successfully.',
  'user_blocked_title' => 'User Blocked',
  'user_blocked_message' => 'User has been blocked successfully.',
  'user_unblocked_title' => 'User Unblocked',
  'user_unblocked_message' => 'User has been unblocked successfully.',
  'user_delete_error_title' => 'Delete Error',
  'user_delete_error_self_message' => 'You cannot delete your own account.',



  /* Plans Controller Responses */
  'plan_created_title' => 'Plan Created',
  'plan_created_message' => 'Plan has been created successfully.',
  'plan_updated_title' => 'Plan Updated',
  'plan_updated_message' => 'Plan has been updated successfully.',
  'plan_deleted_title' => 'Plan Deleted',
  'plan_deleted_message' => 'Plan has been deleted successfully.',
  'plans_deleted_title' => 'Plans Deleted',
  'plans_deleted_message' => ':count plans have been deleted successfully.',

  /* HR Agent Responses */
  'hr_candidate_deleted_title' => 'HR Candidate Deleted',
  'hr_candidate_deleted_message' => 'HR candidate has been deleted successfully.',

  /* HR Agent N8N Integration Responses */
  'hr_files_uploaded_title' => 'Files Uploaded Successfully',
  'hr_files_uploaded_message' => 'CV files have been uploaded and sent for analysis.',
  'hr_upload_failed_title' => 'Upload Failed',
  'hr_upload_failed_message' => 'Failed to upload CV files. Please try again.',
  'hr_gmail_processing_title' => 'Gmail Processing Started',
  'hr_gmail_processing_message' => 'Gmail emails are being processed for candidate analysis.',
  'hr_gmail_failed_title' => 'Gmail Processing Failed',
  'hr_gmail_failed_message' => 'Failed to process Gmail emails. Please try again.',
  'hr_gmail_no_credential_title' => 'Gmail Not Connected',
  'hr_gmail_no_credential_message' => 'Please connect your Gmail account first.',
  'hr_outlook_processing_title' => 'Outlook Processing Started',
  'hr_outlook_processing_message' => 'Outlook emails are being processed for candidate analysis.',
  'hr_outlook_failed_title' => 'Outlook Processing Failed',
  'hr_outlook_failed_message' => 'Failed to process Outlook emails. Please try again.',
  'hr_outlook_no_credential_title' => 'Outlook Not Connected',
  'hr_outlook_no_credential_message' => 'Please connect your Outlook account first.',
  'hr_gmail_token_expired_title' => 'Gmail Access Expired',
  'hr_gmail_token_expired_message' => 'Your Gmail access has expired. Please reconnect your account.',
  'hr_outlook_token_expired_title' => 'Outlook Access Expired',
  'hr_outlook_token_expired_message' => 'Your Outlook access has expired. Please reconnect your account.',

  // Message Response Management
  "message_response_created_title" => "Response Created",
  "message_response_created_message" => "Response has been created successfully.",
  "message_response_updated_title" => "Response Updated",
  "message_response_updated_message" => "Response has been updated successfully.",

  /* Email Action Responses */
  'email_marked_as_read' => 'Email marked as read successfully.',
  'email_marked_as_unread' => 'Email marked as unread successfully.',
  'email_starred_successfully' => 'Email starred successfully.',
  'email_unstarred_successfully' => 'Email unstarred successfully.',
  'email_moved_to_spam' => 'Email moved to spam successfully.',
  'email_moved_to_bin' => 'Email moved to bin successfully.',
  'emails_moved_title' => 'Emails Moved',
  'emails_moved_message' => 'Selected emails have been moved successfully.',
  'email_restored_to_inbox' => 'Email restored to inbox successfully.',
  'email_deleted_permanently' => 'Email deleted permanently.',
  'error_updating_email_status' => 'Error updating email status.',
  'error_moving_email' => 'Error moving email.',
  'error_restoring_email' => 'Error restoring email.',
  'error_deleting_email' => 'Error deleting email.',
  'unauthorized_access' => 'Unauthorized access to this email.',
  'email_moved_title' => 'Email Moved',
  'email_restored_title' => 'Email Restored',
  'email_deleted_title' => 'Email Deleted',
  "message_sent_successfully" => "Message sent successfully.",
  "message_saved_as_draft" => "Response saved as draft.",
  "message_updated_and_sent" => "Response updated and sent successfully.",
  "message_updated_successfully" => "Response updated successfully.",
  "response_sent_successfully" => "Response sent successfully.",
  "response_saved_as_draft" => "Response saved as draft.",
  "error_storing_response" => "An error occurred while storing the response.",
  "error_storing_message" => "An error occurred while storing the response.",
  "error_updating_message" => "An error occurred while updating the response.",

  /* Email Bulk Action Responses */

  'bulk_action_completed' => 'Bulk action completed successfully',
  'bulk_marked_as_read' => ':count emails marked as read',
  'bulk_marked_as_unread' => ':count emails marked as unread',
  'bulk_starred' => ':count emails starred',
  'bulk_unstarred' => ':count emails unstarred',
  'bulk_moved_to_spam' => ':count emails moved to spam',
  'bulk_moved_to_bin' => ':count emails moved to bin',
  'bulk_restored_to_inbox' => ':count emails restored to inbox',
  'bulk_deleted_permanently' => ':count emails deleted permanently',
  'error_bulk_action' => 'An error occurred while performing the bulk action',

  'confirm_move_to_spam' => 'Are you sure you want to move :count emails to spam?',
  'confirm_move_to_bin' => 'Are you sure you want to move :count emails to bin?',
  'confirm_restore_emails' => 'Are you sure you want to restore :count emails to inbox?',
  'confirm_permanent_delete_bulk' => 'Are you sure you want to permanently delete :count emails? This action cannot be undone.',
  'confirm_action' => 'Are you sure you want to perform this action on :count items?',
  'confirm_delete_hr_candidate' => 'Are you sure you want to delete this HR candidate?',

  /* Email Agent Response Messages */
  'draft_deleted_title' => 'Draft Deleted',
  'draft_deleted_successfully' => 'Draft message has been deleted successfully.',
  'error_deleting_draft' => 'An error occurred while deleting the draft message.',
  'draft_sent_title' => 'Draft Sent',
  'draft_sent_successfully' => 'Draft message has been sent successfully.',
  'error_sending_draft' => 'An error occurred while sending the draft message.',
  'draft_updated_title' => 'Draft Updated',
  'draft_updated_successfully' => 'Draft message has been updated successfully.',
  'error_updating_draft' => 'An error occurred while updating the draft message.',
  'bulk_drafts_deleted' => ':count draft messages have been deleted successfully.',
  'bulk_drafts_sent' => ':count draft messages have been sent successfully.',
  'deleted_successfully' => ':count items have been deleted successfully.',
  'bulk_sent_deleted' => ':count sent messages have been deleted successfully.',
  'bulk_action_success' => 'Bulk Action Completed',
  /* End Email Agent Response Messages */

  /* Admin Impersonation Responses */
  'impersonation_success_title' => 'Logged in as user',
  'impersonation_success_message' => 'Successfully logged in as user: :name',
  'impersonation_return_title' => 'Returned to admin',
  'impersonation_return_message' => 'Successfully returned to the admin account.',
  'impersonation_failed_title' => 'Return failed',
  'impersonation_failed_message' => 'Could not return to the admin account.',

  /* Settings Responses */
  'setting_created_title' => 'Setting Created',
  'setting_created_message' => 'Setting has been created successfully.',
  'setting_updated_title' => 'Setting Updated',
  'setting_updated_message' => 'Setting has been updated successfully.',
  'setting_deleted_title' => 'Setting Deleted',
  'setting_deleted_message' => 'Setting has been deleted successfully.',
  'settings_deleted_title' => 'Settings Deleted',
  'settings_deleted_message' => ':count settings have been deleted successfully.',
  'setting_key_exists' => 'A setting with this key already exists.',

  /* Report Agent Controller Responses */
  'files_uploaded_title' => 'Files Uploaded',
  'files_uploaded_message' => ':count files have been uploaded successfully.',
  'file_updated_title' => 'File Updated',
  'file_updated_message' => 'File has been updated successfully.',
  'file_deleted_title' => 'File Deleted',
  'file_deleted_message' => 'File has been deleted successfully.',
  'conversation_created_title' => 'Conversation Created',
  'conversation_created_message' => 'New conversation has been created successfully.',
  'conversation_updated_title' => 'Conversation Updated',
  'conversation_updated_message' => 'Conversation has been updated successfully.',
  'conversation_deleted_title' => 'Conversation Deleted',
  'conversation_deleted_message' => 'Conversation has been deleted successfully.',
  'message_sent_title' => 'Message Sent',
  'message_sent_message' => 'Your message has been sent and processed.',
  'message_error_title' => 'Message Error',
  'message_error_message' => 'Failed to process your message. Please try again.',
  'access_denied_title' => 'Access Denied',
  'access_denied_message' => 'You do not have permission to access this resource.',

  /* OAuth Connection Responses */
  'oauth_connection_success_title' => 'Connection Successful',
  'oauth_connection_success_message' => 'Your :provider account has been connected successfully.',
  'oauth_disconnect_success_title' => 'Disconnected Successfully',
  'oauth_disconnect_success_message' => 'Your :provider account has been disconnected.',
  'oauth_disconnect_error_title' => 'Disconnect Failed',
  'oauth_disconnect_error_message' => 'Failed to disconnect the account. Please try again.',
  'oauth_not_connected_title' => 'Not Connected',
  'oauth_not_connected_message' => 'Your :provider account is not connected.',
  'oauth_connection_test_success' => ':provider connection is working properly.',
  'oauth_connection_test_failed' => ':provider connection failed. Please reconnect your account.',
  'oauth_provider_invalid_title' => 'Invalid Provider',
  'oauth_provider_invalid_message' => 'The specified OAuth provider is not supported.',
  'oauth_general_error_title' => 'Authentication Error',
  'oauth_general_error_message' => 'An error occurred during authentication. Please try again.',
  'oauth_authentication_required_title' => 'Authentication Required',
  'oauth_authentication_required_message' => 'You must be logged in to connect email accounts.',
  'oauth_no_email_title' => 'No Email Found',
  'oauth_no_email_message' => 'Unable to retrieve email from your :provider account.',
  'oauth_connection_error_title' => 'Connection Failed',
  'oauth_connection_error_message' => 'Failed to connect your :provider account. Please try again.',
  'oauth_redirect_error_title' => 'Redirect Failed',
  'oauth_redirect_error_message' => 'Failed to redirect to :provider. Please try again.',
  'oauth_token_missing_title' => 'Access Token Missing',
  'oauth_token_missing_message' => 'No access token found. Please reconnect your account.',
  'oauth_token_expired_title' => 'Access Token Expired',
  'oauth_token_expired_message' => 'Your access token has expired and could not be refreshed. Please reconnect your account.',
  'oauth_test_success_title' => 'Connection Test Successful',
  'oauth_test_success_message' => 'Connection successful! Latest email retrieved.',
  'oauth_test_no_emails_title' => 'Connected but No Emails',
  'oauth_test_no_emails_message' => 'Connected successfully but unable to fetch emails. Check permissions.',
  'oauth_test_failed_title' => 'Connection Test Failed',
  'oauth_test_failed_message' => 'Connection test failed. Please check your connection and try again.',

  // Email Agent responses
  'no_gmail_connection' => 'No Gmail account connected. Please connect your Gmail account first.',
  'no_outlook_connection' => 'No Outlook account connected. Please connect your Outlook account first.',
  'gmail_token_invalid' => 'Gmail access token is invalid or expired. Please reconnect your Gmail account.',
  'outlook_token_invalid' => 'Outlook access token is invalid or expired. Please reconnect your Outlook account.',
  'something_went_wrong' => 'Something went wrong. Please try again.',
  'success_title' => 'Success',
  'error_title' => 'Error',
];
