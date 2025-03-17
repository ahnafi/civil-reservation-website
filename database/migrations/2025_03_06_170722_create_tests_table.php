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
            $table->string("name");
            $table->string("slug")->unique()->nullable();
            $table->unsignedInteger("price")->default(0);
            $table->text("description")->nullable();
            $table->text("images")->nullable();
            $table->integer("minimum_unit")->default(0);
            $table->integer("daily_slot")->default(0);
            $table->boolean("is_active")->default(true);
            $table->foreignId("category_id")->constrained()->cascadeOnDelete();
            $table->foreignId("laboratory_id")->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
