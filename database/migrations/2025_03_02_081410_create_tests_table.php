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
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->enum("status", ["testing", "completed"])->default("testing");
            $table->text("note")->nullable();
            $table->dateTime("completed_at")->nullable();
            $table->date("test_date")->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId("submission_id")->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};
