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
        Schema::create('submission_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId("submission_id")->references("id")->on("submissions")->onDelete("cascade");
            $table->foreignId("test_type_id")->nullable()->references("id")->on("test_types")->onDelete("cascade");
            $table->foreignId("test_package_id")->nullable()->references("id")->on("test_packages")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_item');
    }
};
