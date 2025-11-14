<?php

namespace App\Enums;

enum FeatureEnum: int
{
  // Email Agent Features (includes QNA)
  case EMAIL_AGENT_FETCHES = 1;
  case EMAIL_AGENT_CHAT = 2;

  // HR Agent Features
  case HR_FETCH_CVS_FROM_EMAIL = 3;
  case HR_UPLOAD_CV = 4;

  // Reports Agent Features
  case REPORTS_FILES_COUNT = 5;
  case REPORTS_CHAT_WITH_FILES = 6;
  case REPORTS_MAX_FILE_SIZE = 7;
}
