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
            $table->string("code")->unique();
            $table->unsignedInteger("amount")->default(0);
            $table->enum("payment_method", ["BANK JATENG", "BANK MANDIRI", "BANK BNI", "BANK BRI", "BANK BSI", "BANK BTN"])->nullable();
            $table->text("note")->nullable();
            $table->enum("status", ["pending", "success", "failed"])->default("pending");
            $table->string("payment_invoice_file")->nullable();
            $table->string("payment_receipt_image")->nullable();
            $table->dateTime("payment_date")->nullable();
            $table->foreignId("submission_id")->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
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
