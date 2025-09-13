<?php

return [
  /*
  |--------------------------------------------------------------------------
  | All Website Controllers Responses Lines
  |--------------------------------------------------------------------------
  |
  |
  */

  'language_changed_title' => 'تم تغيير اللغة',
  'language_changed_message' => 'تم تغيير اللغة بنجاح.',
  "blocked_account"=>"تم حظر حسابك. يُرجى التواصل مع المسؤول.",

  /* Auth Controller Responses */
  'login_successful_title' => 'تم تسجيل الدخول بنجاح',
  'login_successful_message' => 'مرحباً بعودتك! تم تسجيل دخولك بنجاح.',
  'logout_successful_title' => 'تم تسجيل الخروج',
  'logout_successful_message' => 'تم تسجيل خروجك بنجاح.',
  'registration_successful_title' => 'تم إنشاء الحساب بنجاح',
  'registration_successful_message' => 'تم إنشاء حسابك بنجاح. مرحباً بك!',
  'password_reset_link_sent_title' => 'تم إرسال رابط إعادة تعيين كلمة المرور',
  'password_reset_link_sent_message' => 'تم إرسال رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني.',
  'password_reset_successful_title' => 'تم إعادة تعيين كلمة المرور بنجاح',
  'password_reset_successful_message' => 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.',
  'verification_link_sent_title' => 'تم إرسال رابط التحقق',
  'verification_link_sent_message' => 'تم إرسال رابط تحقق جديد إلى عنوان بريدك الإلكتروني.',
  'password_confirmed_title' => 'تم تأكيد كلمة المرور',
  'password_confirmed_message' => 'تم تأكيد كلمة المرور بنجاح.',

  /* Auth Validation Messages */
  'username_required' => 'حقل اسم المستخدم مطلوب.',
  'password_required' => 'حقل كلمة المرور مطلوب.',
  'name_required' => 'حقل الاسم مطلوب.',
  'username_unique' => 'اسم المستخدم هذا مُستخدم بالفعل.',
  'email_required' => 'حقل البريد الإلكتروني مطلوب.',
  'email_invalid' => 'يرجى إدخال عنوان بريد إلكتروني صحيح.',
  'email_unique' => 'هذا البريد الإلكتروني مُسجل بالفعل.',
  'password_confirmation' => 'تأكيد كلمة المرور غير متطابق.',
  /* End Auth Validation Messages */

  /* End Auth Controller Responses */

  /* Profile Controller Responses */
  'profile_updated_title' => 'تم تحديث الملف الشخصي',
  'profile_updated_message' => 'تم تحديث معلومات ملفك الشخصي بنجاح.',
  'account_deleted_title' => 'تم حذف الحساب',
  'account_deleted_message' => 'تم حذف حسابك بشكل دائم.',
  'password_updated_title' => 'تم تحديث كلمة المرور',
  'password_updated_message' => 'تم تحديث كلمة المرور الخاصة بك بنجاح.',
  'profile_image_updated_title' => 'تم تحديث الصورة ',
  'profile_image_updated_message' => 'تم تحديث صورة الملف الشخصي بنجاح.',

  /* User Management Responses */
  'user_created_title' => 'تم إنشاء المستخدم',
  'user_created_message' => 'تم إنشاء المستخدم بنجاح.',
  'user_updated_title' => 'تم تحديث المستخدم',
  'user_updated_message' => 'تم تحديث المستخدم بنجاح.',
  'user_deleted_title' => 'تم حذف المستخدم',
  'user_deleted_message' => 'تم حذف المستخدم بنجاح.',
  'users_deleted_title' => 'تم حذف المستخدمين',
  'users_deleted_message' => 'تم حذف :count من المستخدمين بنجاح.',
  'user_blocked_title' => 'تم حظر المستخدم',
  'user_blocked_message' => 'تم حظر المستخدم بنجاح.',
  'user_unblocked_title' => 'تم إلغاء حظر المستخدم',
  'user_unblocked_message' => 'تم إلغاء حظر المستخدم بنجاح.',
  'user_delete_error_title' => 'خطأ في الحذف',
  'user_delete_error_self_message' => 'لا يمكنك حذف حسابك الخاص.',


  /* Validation Rules Responses */
  'wallet_currency_mismatch' => 'المحفظة المختارة لا تتطابق مع العملة المختارة.',

  /* Plans Controller Responses */
  'plan_created_title' => 'تم إنشاء الخطة',
  'plan_created_message' => 'تم إنشاء الخطة بنجاح.',
  'plan_updated_title' => 'تم تحديث الخطة',
  'plan_updated_message' => 'تم تحديث الخطة بنجاح.',
  'plan_deleted_title' => 'تم حذف الخطة',
  'plan_deleted_message' => 'تم حذف الخطة بنجاح.',
  'plans_deleted_title' => 'تم حذف الخطط',
  'plans_deleted_message' => 'تم حذف :count من الخطط بنجاح.',

  // Message Response Management
  "message_response_created_title" => "تم إنشاء الرد ",
  "message_response_created_message" => "تم إنشاء الرد بنجاح.",
  "message_response_updated_title" => "تم تحديث الرد",
  "message_response_updated_message" => "تم تحديث الرد بنجاح.",

  /* Email Action Responses */
  'email_marked_as_read' => 'تم تحديد البريد الإلكتروني كمقروء بنجاح.',
  'email_marked_as_unread' => 'تم تحديد البريد الإلكتروني كغير مقروء بنجاح.',
  'email_starred_successfully' => 'تم تمييز البريد الإلكتروني بنجمة بنجاح.',
  'email_unstarred_successfully' => 'تم إزالة النجمة من البريد الإلكتروني بنجاح.',
  'email_moved_to_spam' => 'تم نقل البريد الإلكتروني إلى المزعج بنجاح.',
  'email_moved_to_bin' => 'تم نقل البريد الإلكتروني إلى سلة المحذوفات بنجاح.',
  'email_restored_to_inbox' => 'تم استعادة البريد الإلكتروني إلى صندوق الوارد بنجاح.',
  'email_deleted_permanently' => 'تم حذف البريد الإلكتروني نهائياً.',
  'error_updating_email_status' => 'خطأ في تحديث حالة البريد الإلكتروني.',
  'error_moving_email' => 'خطأ في نقل البريد الإلكتروني.',
  'error_restoring_email' => 'خطأ في استعادة البريد الإلكتروني.',
  'error_deleting_email' => 'خطأ في حذف البريد الإلكتروني.',
  'unauthorized_access' => 'وصول غير مصرح به لهذا البريد الإلكتروني.',
  'email_moved_title' => 'تم نقل البريد',
  'email_restored_title' => 'تم استعادة البريد',
  'email_deleted_title' => 'تم حذف البريد',
  "message_sent_successfully" => "تم إرسال الرسالة بنجاح.",
  "message_saved_as_draft" => "تم حفظ الرد كمسودة.",
  "message_updated_and_sent" => "تم تحديث وإرسال الرد بنجاح.",
  "message_updated_successfully" => "تم تحديث الرد بنجاح.",
  "response_sent_successfully" => "تم إرسال الرد بنجاح.",
  "response_saved_as_draft" => "تم حفظ الرد كمسودة.",
  "error_storing_response" => "حدث خطأ أثناء حفظ الرد.",
  "error_storing_message" => "حدث خطأ أثناء حفظ الرد.",
  "error_updating_message" => "حدث خطأ أثناء تحديث الرد.",
  "error_title" => "خطأ",

  /* Email Bulk Action Responses */

  'bulk_action_completed' => 'تم تنفيذ العملية الجماعية بنجاح',
  'bulk_marked_as_read' => 'تم تعليم :count بريد كمقروء',
  'bulk_marked_as_unread' => 'تم تعليم :count بريد كغير مقروء',
  'bulk_starred' => 'تم إضافة نجمة إلى :count بريد',
  'bulk_unstarred' => 'تمت إزالة النجمة من :count بريد',
  'bulk_moved_to_spam' => 'تم نقل :count بريد إلى البريد العشوائي',
  'bulk_moved_to_bin' => 'تم نقل :count بريد إلى سلة المهملات',
  'bulk_restored_to_inbox' => 'تم استعادة :count بريد إلى الوارد',
  'bulk_deleted_permanently' => 'تم حذف :count بريد بشكل نهائي',
  'error_bulk_action' => 'حدث خطأ أثناء تنفيذ العملية الجماعية',

  'confirm_move_to_spam' => 'هل أنت متأكد أنك تريد نقل :count بريد إلى البريد المزعج',
  'confirm_move_to_bin' => 'هل أنت متأكد أنك تريد نقل :count بريد إلى سلة المهملات؟',
  'confirm_restore_emails' => 'هل أنت متأكد أنك تريد استعادة :count بريد إلى الوارد؟',
  'confirm_permanent_delete_bulk' => 'هل أنت متأكد أنك تريد حذف :count بريد بشكل نهائي؟ هذا الإجراء لا يمكن التراجع عنه.',
  'confirm_action' => 'هل أنت متأكد أنك تريد تنفيذ هذا الإجراء على :count عنصر؟',


];
