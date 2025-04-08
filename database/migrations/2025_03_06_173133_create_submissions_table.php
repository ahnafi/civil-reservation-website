<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string("code")->unique()->nullable();
            $table->foreignId("user_id")->constrained()->cascadeOnDelete();
            $table->string("company_name")->nullable();
            $table->string("project_name");
            $table->string("project_address");
            $table->unsignedInteger("total_cost")->default(0)->nullable();
            $table->string("document")->nullable();
            $table->date("test_submission_date");
            $table->enum("status", ["submitted", "approved", "rejected"])->default("submitted");
            $table->text("note")->nullable();
            $table->dateTime("approval_date")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
