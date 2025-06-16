<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('internal_submissions', function (Blueprint $table) {
            $table->id();
            $table->string("code")->unique()->nullable();
            $table->foreignId("user_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->string("study_program");
            $table->string("research_title");
            $table->unsignedInteger("total_personnel");
            $table->string("supervisor");
            $table->text("documents")->nullable();
            $table->date("test_submission_date");
            $table->enum("status", ["submitted", "approved", "rejected"])->default("submitted");
            $table->text("user_note")->nullable();
            $table->text("admin_note")->nullable();
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
        Schema::dropIfExists('internal_submissions');
    }
};
