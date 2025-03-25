<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateSubmissionRequest;
use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use App\Models\User;
use App\Notifications\SubmissionSubmitted;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SubmissionController extends Controller
{
    public function create(CreateSubmissionRequest $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $totalCost = 0;
        $user = $request->user();

        // 1. Hitung harga paket
        if (!empty($data['packages'])) {
            $packageIds = $data['packages'];
            $packages = Package::findMany($packageIds);
            $totalCost += $packages->sum('price');
        }

        // 2. Hitung harga test + quantity
        if (!empty($data['tests'])) {
            // Format: [ ['id' => 1, 'quantity' => 5], ... ]
            $testEntries = $data['tests'];

            // Ambil semua ID test
            $testIds = array_column($testEntries, 'id');
            $tests = Test::findMany($testIds);

            // Buat array asosiatif [id => quantity] untuk memudahkan pencarian
            $quantities = array_column($testEntries, 'quantity', 'id');

            foreach ($tests as $test) {
                $totalCost += $test->price * $quantities[$test->id];
            }
        }

        Log::info("Total cost is :" . $totalCost);

        // 3. Buat submission
        $submission = Submission::create([
            "status" => "submitted",
            "company_name" => $data["company_name"] ?? null,
            "project_name" => $data["project_name"],
            "project_address" => $data["project_address"],
            "total_cost" => $user->role === "external" ? $totalCost : 0,
            "document" => $request->hasFile("document")
                ? $request->file("document")->storePublicly("submissions")
                : null,
            "user_id" => $user->id,
            "note" => $data["note"] ?? null,
        ]);

        Log::info("Submission created :" . $submission->project_name);

        // 4. Simpan relasi
        if (!empty($packageIds)) {
            $submission->packages()->sync($packageIds);
        }

        if (!empty($testEntries)) {
            // Format untuk sync: [1 => ['quantity' => 5], 2 => ['quantity' => 3]]
            $testsSyncFormat = [];
            foreach ($testEntries as $entry) {
                $testsSyncFormat[$entry['id']] = ['quantity' => $entry['quantity']];
            }
            $submission->tests()->sync($testsSyncFormat);
        }

        $submission->load(["packages", "tests", "user"]);
//        email ke user
        $user->notify(new SubmissionSubmitted($submission));
//        email ke role admin
        $admins = User::where("role", "admin")->get();
        Notification::send($admins, new SubmissionSubmitted($submission));

        Log::info("Submission notify mail");

        return back()->with("success", "Pengujian berhasil diajukan");
    }
}
