<?php

namespace Modules\Pengaduan\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Pengaduan\Models\Pengaduan;

/**
 * @extends Factory<Pengaduan>
 */
class PengaduanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Pengaduan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_pelapor' => fake()->name(),
            'jenis_kerusakan' => fake()->randomElement(['Lampu Jalan Mati', 'Jalan Berlubang', 'Pipa Air Bocor', 'Sampah Menumpuk', 'Pohon Tumbang']),
            'lokasi' => 'Jl. Mawar Blok ' . fake()->randomElement(['A', 'B', 'C']),
            'deskripsi' => fake()->paragraph(),
            'kontak' => fake()->numerify('08##########'),
            'status' => fake()->randomElement(['Menunggu Verifikasi', 'Sedang Diproses', 'Selesai']),
            'foto_bukti' => null,
            'nama_file_foto' => null,
        ];
    }
}
