<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Laboratory;
use App\Models\Test;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ModelTestTest extends TestCase
{

    public function testCreateModel(): void
    {
        $lab = Laboratory::query()->create([
            "code" => "SSHH",
            "name" => "lab beton",
            "room" => "D 101"
        ]);

        $category = Category::query()->create([
            "name" => "sample",
            "description" => "sample description"
        ]);

        $test = Test::query()->create([
            "name" => "pengujian kekuatan beton ",
            "price" => 200000,
            "description" => "test description",
            "images" => "test images",
            "minimum_unit" => 2,
            "daily_slot" => 4,
            "is_active" => true,
            "category_id" => $category->id,
            "laboratory_id" => $lab->id
        ]);

        self::assertNotNull($test->slug);
        Log::info($test);
    }
}
