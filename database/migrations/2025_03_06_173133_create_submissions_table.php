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
            $table->enum("submission_type", ["internal", "external"]);

            $table->unsignedBigInteger('submission_internal_detail_id')->nullable();
            $table->unsignedBigInteger('submission_external_detail_id')->nullable();
            $table->foreign('submission_internal_detail_id')->references('id')->on('submission_internal_details')->nullOnDelete();
            $table->foreign('submission_external_detail_id')->references('id')->on('submission_external_details')->nullOnDelete();

            $table->date("test_submission_date");
            $table->enum("status", ["submitted", "approved", "rejected"])->default("submitted");
            $table->text("documents")->nullable();
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
        Schema::dropIfExists('submissions');
    }
};
