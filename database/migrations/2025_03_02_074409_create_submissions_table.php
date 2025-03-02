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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string("company_name");
            $table->string("project_name");
            $table->string("project_address");
            $table->unsignedInteger("sample_qty")->default(0);
            $table->enum("status", ["submitted", "approved", "rejected"])->default("submitted");
            $table->unsignedInteger("total_cost")->default(0)->nullable();
            $table->text("note")->nullable();
            $table->dateTime("approval_date")->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId("user_id")->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
