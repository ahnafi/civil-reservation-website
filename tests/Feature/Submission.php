<?php

namespace Tests\Feature;

use App\Models\TestType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class Submission extends TestCase
{

    public function setUp(): void
    {
        parent::setUp();
        TestType::forceDelete();
    }

    public function test_create_submission_items()
    {

    }
}
