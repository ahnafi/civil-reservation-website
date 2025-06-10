<?php

namespace App\Services;

use App\Models\Test;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FileNaming
{
    public static function generateUserProfileName($user_id, $extension): string
    {
        if ($user_id != -1) {
            $code = 'up-' . str_pad($user_id, 3, '0', STR_PAD_LEFT);
        } else {
            $nextId = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'users')
                ->value('AUTO_INCREMENT');

            $code = 'up-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        }

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-user_profile-' . $code . '-' . $shortUuid . '-' . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateInvoiceName($transaction_id, $extension): string
    {
        if ($transaction_id == -1) {
            $transaction_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'transactions')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($transaction_id, 3, '0', STR_PAD_LEFT);
        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-invoice-' . $paddedId . '-' . $shortUuid . '-'. now()->format('YmdHis') . '.' . $extension;
    }

    public static function generatePaymentReceiptName($transaction_id, $extension): string
    {
        if ($transaction_id == -1) {
            $transaction_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'transactions')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($transaction_id, 3, '0', STR_PAD_LEFT);

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-payment_receipt-' . $paddedId . '-'. $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateTestName($test_id, $test_name, $extension): string
    {
        if ($test_id == -1) {
            $test_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'tests')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($test_id, 3, '0', STR_PAD_LEFT);

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);
        $slug = Str::slug($test_name, '-');

        return 'civil-test-' . $paddedId . '-' . $slug . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generatePackageName($package_id, $package_name, $extension): string
    {
        if ($package_id == -1) {
            $package_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'packages')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($package_id, 3, '0', STR_PAD_LEFT);

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);
        $slug = Str::slug($package_name, '-');

        return 'civil-package-' . $paddedId . '-' . $slug . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateTestingResult($testing_id, $extension): string
    {
        if ($testing_id == -1) {
            $testing_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'testings')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($testing_id, 3, '0', STR_PAD_LEFT);

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-testing_result-' . $paddedId . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }
}
