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
  "username_regex" => "يمكن أن يحتوي اسم المستخدم فقط على أحرف إنجليزية صغيرة، وأرقام، وشرطات (-)، وشرطات سفلية (_).",
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

  /* HR Agent Responses */
  'hr_candidate_deleted_title' => 'تم حذف مرشح الموارد البشرية',
  'hr_candidate_deleted_message' => 'تم حذف مرشح الموارد البشرية بنجاح.',

  /* HR Agent N8N Integration Responses */
  'hr_files_uploaded_title' => 'تم رفع الملفات بنجاح',
  'hr_files_uploaded_message' => 'تم رفع ملفات السير الذاتية وإرسالها للتحليل.',
  'hr_upload_failed_title' => 'فشل الرفع',
  'hr_upload_failed_message' => 'فشل في رفع ملفات السير الذاتية. يرجى المحاولة مرة أخرى.',
  'hr_gmail_processing_title' => 'تم بدء معالجة Gmail',
  'hr_gmail_processing_message' => 'جاري معالجة رسائل Gmail لتحليل المرشحين.',
  'hr_gmail_failed_title' => 'فشلت معالجة Gmail',
  'hr_gmail_failed_message' => 'فشل في معالجة رسائل Gmail. يرجى المحاولة مرة أخرى.',
  'hr_gmail_no_credential_title' => 'Gmail غير متصل',
  'hr_gmail_no_credential_message' => 'يرجى ربط حساب Gmail أولاً.',
  'hr_outlook_processing_title' => 'تم بدء معالجة Outlook',
  'hr_outlook_processing_message' => 'جاري معالجة رسائل Outlook لتحليل المرشحين.',
  'hr_outlook_failed_title' => 'فشلت معالجة Outlook',
  'hr_outlook_failed_message' => 'فشل في معالجة رسائل Outlook. يرجى المحاولة مرة أخرى.',
  'hr_outlook_no_credential_title' => 'Outlook غير متصل',
  'hr_outlook_no_credential_message' => 'يرجى ربط حساب Outlook أولاً.',

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
  'emails_moved_title' => 'تم نقل البريد الإلكتروني',
  'emails_moved_message' => 'تم نقل البريد الإلكتروني المحدد بنجاح.',
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
  'confirm_delete_hr_candidate' => 'هل أنت متأكد من حذف هذا المرشح؟',
  'deleted_successfully' => 'تم حذف :count عنصر بنجاح.',

  /* ردود اتصال OAuth */
  'oauth_connection_success_title' => 'تم الاتصال بنجاح',
  'oauth_connection_success_message' => 'تم ربط حساب :provider بنجاح.',
  'oauth_disconnect_success_title' => 'تم قطع الاتصال بنجاح',
  'oauth_disconnect_success_message' => 'تم قطع الاتصال عن حساب :provider.',
  'oauth_disconnect_error_title' => 'فشل في قطع الاتصال',
  'oauth_disconnect_error_message' => 'فشل في قطع الاتصال عن الحساب. يرجى المحاولة مرة أخرى.',
  'oauth_not_connected_title' => 'غير متصل',
  'oauth_not_connected_message' => 'حساب :provider غير متصل.',
  'oauth_connection_test_success' => 'اتصال :provider يعمل بشكل صحيح.',
  'oauth_connection_test_failed' => 'فشل اتصال :provider. يرجى إعادة ربط حسابك.',
  'oauth_provider_invalid_title' => 'مزود غير صالح',
  'oauth_provider_invalid_message' => 'مزود OAuth المحدد غير مدعوم.',
  'oauth_general_error_title' => 'خطأ في المصادقة',
  'oauth_general_error_message' => 'حدث خطأ أثناء المصادقة. يرجى المحاولة مرة أخرى.',
  'oauth_authentication_required_title' => 'المصادقة مطلوبة',
  'oauth_authentication_required_message' => 'يجب أن تكون مسجلاً للدخول لربط حسابات البريد الإلكتروني.',
  'oauth_no_email_title' => 'لم يتم العثور على بريد إلكتروني',
  'oauth_no_email_message' => 'تعذر استرداد البريد الإلكتروني من حساب :provider الخاص بك.',
  'oauth_connection_error_title' => 'فشل الاتصال',
  'oauth_connection_error_message' => 'فشل في ربط حساب :provider الخاص بك. يرجى المحاولة مرة أخرى.',
  'oauth_redirect_error_title' => 'فشل التوجيه',
  'oauth_redirect_error_message' => 'فشل في التوجيه إلى :provider. يرجى المحاولة مرة أخرى.',
  'oauth_token_missing_title' => 'رمز الوصول مفقود',
  'oauth_token_missing_message' => 'لم يتم العثور على رمز وصول. يرجى إعادة ربط حسابك.',
  'oauth_token_expired_title' => 'انتهت صلاحية رمز الوصول',
  'oauth_token_expired_message' => 'انتهت صلاحية رمز الوصول الخاص بك ولم يتمكن من التجديد. يرجى إعادة ربط حسابك.',
  'oauth_test_success_title' => 'اختبار الاتصال نجح',
  'oauth_test_success_message' => 'الاتصال ناجح! تم استرداد آخر رسالة بريد إلكتروني.',
  'oauth_test_no_emails_title' => 'متصل ولكن لا توجد رسائل',
  'oauth_test_no_emails_message' => 'تم الاتصال بنجاح ولكن تعذر جلب رسائل البريد الإلكتروني. تحقق من الأذونات.',
  'oauth_test_failed_title' => 'فشل اختبار الاتصال',
  'oauth_test_failed_message' => 'فشل اختبار الاتصال. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',

  // Email Agent responses
  'no_gmail_connection' => 'لا يوجد حساب Gmail متصل. يرجى ربط حساب Gmail الخاص بك أولاً.',
  'no_outlook_connection' => 'لا يوجد حساب Outlook متصل. يرجى ربط حساب Outlook الخاص بك أولاً.',
  'gmail_token_invalid' => 'رمز الوصول لـ Gmail غير صالح أو منتهي الصلاحية. يرجى إعادة ربط حساب Gmail الخاص بك.',
  'outlook_token_invalid' => 'رمز الوصول لـ Outlook غير صالح أو منتهي الصلاحية. يرجى إعادة ربط حساب Outlook الخاص بك.',
  'something_went_wrong' => 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  'success_title' => 'نجح',


  'settings_updated_title' => 'تم تحديث الإعدادات',
  'settings_updated_message' => 'تم حفظ الإعدادات بنجاح.',

];
