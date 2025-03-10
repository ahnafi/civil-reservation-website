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
        Schema::create('submission_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId("submission_id")->references("id")->on("submissions")->onDelete("cascade");
            $table->foreignId("package_id")->references("id")->on("packages")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_package');
    }
};
