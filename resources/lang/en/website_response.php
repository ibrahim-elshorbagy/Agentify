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
  "blocked_account"=>"Your account has been blocked. Please contact administrator",

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
  "error_title" => "Error",

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

];
