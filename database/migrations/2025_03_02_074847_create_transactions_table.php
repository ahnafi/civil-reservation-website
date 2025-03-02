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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger("amount")->default(0)->nullable();
            $table->string("payment_method");
            $table->enum("payment_status", ["pending", "success", "failed"])->default("pending");
            $table->date("payment_date");
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId("submission_id")->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
