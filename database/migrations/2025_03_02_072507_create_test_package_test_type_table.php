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
            $table->foreignId("test_package_id")->constrained()->cascadeOnDelete();
            $table->foreignId("test_type_id")->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->primary(['test_package_id', 'test_type_id']);
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
