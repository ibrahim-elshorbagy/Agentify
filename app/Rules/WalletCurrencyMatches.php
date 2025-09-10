<?php

namespace App\Rules;

use App\Models\FinanceTrack\Wallet;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class WalletCurrencyMatches implements ValidationRule
{
    protected $currencyId;

    public function __construct($currencyId)
    {
        $this->currencyId = $currencyId;
    }

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed   $value
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $wallet = Wallet::find($value);

        if (!$wallet) {
            return;
        }

        if ($wallet->currency_id != $this->currencyId) {
            $fail(__('website_response.wallet_currency_mismatch'));
        }
    }
}
