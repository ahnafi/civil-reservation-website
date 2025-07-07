<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Test;
use Inertia\Response;
use App\Models\Schedule;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function cart(): Response
    {
        $tests = Test::active()->get();
        $packages = Package::get();

        return inertia('orders/cart', [
            'tests' => $tests,
            'packages' => $packages,
        ]);
    }

    public function form(Request $request)
    {
        $testIds = $request->input('testIds', []);
        $packageIds = $request->input('packageIds', []);

        if (!is_array($testIds)) {
            $testIds = explode(',', $testIds);
        }

        if (!is_array($packageIds)) {
            $packageIds = explode(',', $packageIds);
        }

        $testIds = array_map('intval', $testIds);
        $packageIds = array_map('intval', $packageIds);

        $packageTestIds = Package::whereIn('id', $packageIds)
            ->with('tests:id')
            ->get()
            ->flatMap(fn($package) => $package->tests->pluck('id'))
            ->toArray();

        $allTestIds = array_unique(array_merge($testIds, $packageTestIds));

        $fullSlotDate = Schedule::whereIn('test_id', $allTestIds)
            ->where('available_slots', 0)
            ->pluck('date')
            ->unique()
            ->values();

        return inertia('orders/form', [
            'fullSlotDate' => $fullSlotDate,
        ]);
    }


}
