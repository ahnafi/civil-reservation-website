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
        Schema::create('unit_categories', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->text("description")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table("test_types", function (Blueprint $table) {
            $table->integer("minimum_unit")->default(0);
            $table->foreignId("unit_category_id")->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_categories');
        Schema::table('test_types', function (Blueprint $table) {
            $table->dropColumn('minimum_unit');
            $table->dropColumn('unit_category_id');
        });
    }
};
