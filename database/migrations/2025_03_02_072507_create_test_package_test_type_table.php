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
        Schema::create('test_package_test_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId("test_package_id")->references("id")->on("test_packages")->onDelete("cascade");
            $table->foreignId("test_type_id")->references("id")->on("test_types")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("test_package_test_type");
    }
};
