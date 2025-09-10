<?php

namespace App\Rules;

use App\Models\SubscriptionSystem\Feature;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class FeatureLimitValue implements ValidationRule
{
    protected $featureId;

    public function __construct($featureId)
    {
        $this->featureId = $featureId;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $feature = Feature::find($this->featureId);

        if (!$feature) {
            $fail('The selected feature is invalid.');
            return;
        }

        // Skip validation if value is null (nullable)
        if ($value === null) {
            return;
        }

        if ($feature->type === 'boolean') {
            // For boolean features, accept only 0, 1, "0", "1", true, false
            if (!in_array($value, [0, 1, '0', '1', true, false], true)) {
                $fail('The :attribute must be 0 or 1 for boolean features.');
            }
        } elseif ($feature->type === 'counter') {
            // For counter features, must be integer and >= 0
            if (!is_numeric($value) || (int)$value < 0 || $value != (int)$value) {
                $fail('The :attribute must be an integer greater than or equal to 0.');
            }
        } else {
            $fail('Unknown feature type.');
        }
    }
}
