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
        Schema::create('submission_test', function (Blueprint $table) {
            $table->id();
            $table->foreignId("submission_id")->references("id")->on("submissions")->onDelete("cascade");
            $table->foreignId("test_id")->references("id")->on("tests")->onDelete("cascade");
            $table->integer("quantity")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_test');
    }
};
