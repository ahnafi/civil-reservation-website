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
        Schema::create('test_scheduling', function (Blueprint $table) {
            $table->foreignId("test_id")->constrained()->cascadeOnDelete();
            $table->foreignId("lab_schedule_id")->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['test_id', 'lab_schedule_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_scheduling');
    }
};
