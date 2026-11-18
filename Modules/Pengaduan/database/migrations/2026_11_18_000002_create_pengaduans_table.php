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
        Schema::create('pengaduans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pelapor');
            $table->string('jenis_kerusakan');
            $table->string('lokasi');
            $table->text('deskripsi');
            $table->string('kontak', 25);
            $table->string('status')->default('Menunggu Verifikasi');
            $table->string('foto_bukti')->nullable();
            $table->string('nama_file_foto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaduans');
    }
};
