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
        Schema::create('submission_external_details', function (Blueprint $table) {
            $table->id();
            $table->string("company_name")->nullable();
            $table->string("project_name");
            $table->string("project_address");
            $table->unsignedInteger("total_cost")->default(0)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_external_details');
    }
};
