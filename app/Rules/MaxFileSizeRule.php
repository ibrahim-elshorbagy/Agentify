<?php

namespace App\Rules;

use App\Enums\FeatureEnum;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class MaxFileSizeRule implements ValidationRule
{
    protected $user;
    protected $feature;
    protected $maxSizeInBytes;

    public function __construct(User $user, FeatureEnum $feature)
    {
        $this->user = $user;
        $this->feature = $feature;

        // Get the max size limit from user's subscription (in MB)
        $subscription = $this->user->subscription;
        if ($subscription) {
            $usage = $subscription->usages()->where('feature_id', $feature->value)->first();
            $maxSizeInMB = $usage ? $usage->limit_value : null;
        } else {
            $maxSizeInMB = null;
        }

        // Convert MB to bytes (1 MB = 1,048,576 bytes)
        $this->maxSizeInBytes = $maxSizeInMB ? $maxSizeInMB * 1048576 : null;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$this->maxSizeInBytes) {
            // No limit set, allow any size
            return;
        }

        // If value is an array of files, check each file
        if (is_array($value)) {
            foreach ($value as $file) {
                if ($file && $file->getSize() > $this->maxSizeInBytes) {
                    $maxSizeInMB = $this->maxSizeInBytes / 1048576;
                    $fail(__('website_response.files_size_exceeds_limit', ['size' => $maxSizeInMB]));
                    return;
                }
            }
        } else {
            // Single file
            if ($value && $value->getSize() > $this->maxSizeInBytes) {
                $maxSizeInMB = $this->maxSizeInBytes / 1048576;
                $fail(__('website_response.file_size_exceeds_limit', ['size' => $maxSizeInMB]));
                return;
            }
        }
    }
}
