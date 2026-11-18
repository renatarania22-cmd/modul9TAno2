<?php

namespace Modules\Fasilitas\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Fasilitas\Models\Fasilitas;

/**
 * @extends Factory<Fasilitas>
 */
class FasilitasFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Fasilitas::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_fasilitas' => fake()->randomElement(['Taman Warga Blok A', 'Lapangan Badminton RW', 'Pos Satpam Utama', 'Balai Warga', 'Masjid Al-Ikhlas', 'CCTV Gerbang Barat']),
            'kategori' => fake()->randomElement(['Fasilitas Umum', 'Olahraga', 'Keagamaan', 'Keamanan']),
            'lokasi' => 'Blok ' . fake()->randomElement(['A', 'B', 'C', 'D']) . ' No. ' . fake()->numberBetween(1, 20),
            'kondisi' => fake()->randomElement(['Baik', 'Perlu Pemeliharaan', 'Rusak Ringan']),
            'penanggung_jawab' => fake()->name(),
            'keterangan' => fake()->sentence(),
        ];
    }
}
