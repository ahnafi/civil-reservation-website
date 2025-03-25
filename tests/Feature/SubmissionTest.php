<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Laboratory;
use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LaboratorySeeder;
use Database\Seeders\PackagesSeeder;
use Database\Seeders\TestSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SubmissionTest extends TestCase
{
//    use RefreshDatabase;
    use WithoutMiddleware;

    protected $user;
    protected $admin;
    protected $test;
    protected $package;

    protected function setUp(): void
    {
        parent::setUp();

//        Submission::query()->forceDelete();
//        Package::query()->forceDelete();
//        Test::query()->forceDelete();
//        User::query()->delete();
//        Category::query()->forceDelete();
//        Laboratory::query()->forceDelete();
//
////         Run seeders
//        $this->seed([
//            UserSeeder::class,
//            CategorySeeder::class,
//            LaboratorySeeder::class,
//        ]);

        // Ambil data dari seeder
        $this->user = User::where('email', 'external@example.com')->first();
        $this->admin = User::where('email', 'admin@example.com')->first();
        $this->test = Test::first();
        $this->package = Package::first();
    }

    /** @test */
    public function test_create_submission_successfully()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('post.orders.cart.form'), [
//            'user_id' => $this->user->id,
            "company_name" => "abrakadabra",
            'project_name' => 'Proyek Test',
            'project_address' => 'Jl. Test No. 123',
            'packages' => [$this->package->id],
            'tests' => [
                ['id' => $this->test->id, 'quantity' => 3]
            ],
            'document' => UploadedFile::fake()->create('doc.pdf', 1024),
        ]);

        Log::info("test unit testing");

        $response->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('submissions', [
            'project_name' => 'Proyek Test'
        ]);

        $submission = Submission::first();
        $this->assertNotNull($submission->packages());
        foreach ($submission->packages as $package) {
            Log::info("package: " . $package->id);
        }
        $this->assertEquals(3, $submission->tests->first()->pivot->quantity);
    }

//    /** @test */
//    public function test_create_submission_unauthenticated()
//    {
//        $response = $this->post(route('post.orders.cart.form'), [
//            'project_name' => 'Proyek Test'
//        ]);
//
//        $response->assertRedirect(route('login'));
//    }

    /** @test */
    public function test_create_submission_validation_errors()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('post.orders.cart.form'), [
            'project_name' => '', // required
            'tests' => [
                ['id' => 999, 'quantity' => 0] // invalid
            ]
        ]);

        $response->assertSessionHasErrors([
            'project_name',
            'tests.0.id',
            'tests.0.quantity'
        ]);
    }
}
