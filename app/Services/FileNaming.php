<?php

namespace App\Services;

class FileNaming
{
    public static function generateUserProfileName($user_id, $extension): string
    {
        return 'civil-user_profile-' . $user_id . '-' . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateInvoiceName($transaction_id, $extension): string
    {
        return 'civil-invoice-' . $transaction_id . '-' . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generatePaymentReceiptName($transaction_id, $extension): string
    {
        return 'civil-payment_receipt-' . $transaction_id . '-' . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateTestName($test_id, $extension): string
    {
        return 'civil-test-' . $test_id . '-' . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generatePackageName($package_id, $extension): string
    {
        return 'civil-package-' . $package_id . '-' . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateTestingTResult($testing_id, $extension): string
    {
        return 'civil-testing_result-' . $testing_id . '-' . now()->format('YmdHis') . '.' . $extension;
    }
}
