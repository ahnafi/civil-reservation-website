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

    public static function generateLaboratoryName($lab_id, $lab_name, $extension): string
    {
        if ($lab_id == -1) {
            $lab_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'laboratories')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($lab_id, 3, '0', STR_PAD_LEFT);

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);
        $slug = Str::slug($lab_name, '-');

        return 'civil-lab-' . $paddedId . '-' . $slug . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateSubmissionName($submission_id, $extension): string
    {
        if ($submission_id == -1) {
            $submission_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'submissions')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($submission_id, 3, '0', STR_PAD_LEFT);

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-submission-' . $paddedId . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateDownloadName($download_id, $download_title, $extension): string
    {
        if ($download_id == -1) {
            $download_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'downloads')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($download_id, 3, '0', STR_PAD_LEFT);
        $slug = Str::slug($download_title, '-');

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-download-' . $paddedId . '-' . $slug . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateTeamName($team_id, $team_name, $extension): string
    {
        if ($team_id == -1) {
            $team_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'teams')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($team_id, 3, '0', STR_PAD_LEFT);
        $slug = Str::slug($team_name, '-');

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-team-' . $paddedId . '-' . $slug . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateAuthorName($author_id, $author_name, $extension): string
    {
        if ($author_id == -1) {
            $author_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'authors')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($author_id, 3, '0', STR_PAD_LEFT);
        $slug = Str::slug($author_name, '-');

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-author-' . $paddedId . '-' . $slug . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateEquipmentName($equipment_id, $equipment_name, $extension): string
    {
        if ($equipment_id == -1) {
            $equipment_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'equipments')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($equipment_id, 3, '0', STR_PAD_LEFT);
        $slug = Str::slug($equipment_name, '-');

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-equipment-' . $paddedId . '-' . $slug . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateNewsName($news_id, $news_title, $extension): string
    {
        if ($news_id == -1) {
            $news_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'news')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($news_id, 3, '0', STR_PAD_LEFT);
        $slug = Str::slug($news_title, '-');

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-news-' . $paddedId . '-' . $slug . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }

    public static function generateNewsContentAttachmentName($news_id, $news_title, $extension): string
    {
        if ($news_id == -1) {
            $news_id = DB::table('INFORMATION_SCHEMA.TABLES')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'news')
                ->value('AUTO_INCREMENT');
        }

        $paddedId = str_pad($news_id, 3, '0', STR_PAD_LEFT);
        $slug = Str::slug($news_title, '-');

        $uuid = Str::uuid()->toString();
        $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

        return 'civil-news-content-' . $paddedId . '-' . $slug . '-' . $shortUuid . now()->format('YmdHis') . '.' . $extension;
    }
}
