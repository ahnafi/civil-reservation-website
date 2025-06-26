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
        Schema::create('submission_internal_details', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('program_study');
            $table->string('research_title');
            $table->unsignedTinyInteger('personnel_count')->nullable();
            $table->string('supervisor')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_internal_details');
    }
};
