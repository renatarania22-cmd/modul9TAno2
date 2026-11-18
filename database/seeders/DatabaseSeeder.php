<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Modules\Fasilitas\Models\Fasilitas;
use Modules\Pengaduan\Models\Pengaduan;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Pengurus RT 05',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        User::factory()->create([
            'name' => 'Bapak Warga (Budi)',
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        // Seed initial facilities
        Fasilitas::create([
            'nama_fasilitas' => 'Balai Pertemuan Warga RW 05',
            'kategori' => 'Fasilitas Umum',
            'lokasi' => 'Jl. Utama Komp. Mawar No. 1',
            'kondisi' => 'Baik',
            'penanggung_jawab' => 'Seksi Sarpras RT',
            'keterangan' => 'Kapasitas 100 orang, tersedia sound system & proyektor.',
        ]);

        Fasilitas::create([
            'nama_fasilitas' => 'Lapangan Badminton & Voli',
            'kategori' => 'Olahraga',
            'lokasi' => 'Blok B Samping Taman',
            'kondisi' => 'Baik',
            'penanggung_jawab' => 'Karang Taruna',
            'keterangan' => 'Penerangan malam aktif sampai pukul 22.00 WIB.',
        ]);

        Fasilitas::create([
            'nama_fasilitas' => 'Pos Keamanan & Portal Gerbang Timur',
            'kategori' => 'Keamanan',
            'lokasi' => 'Gerbang Masuk Timur',
            'kondisi' => 'Baik',
            'penanggung_jawab' => 'Koordinator Keamanan',
            'keterangan' => 'Dilengkapi monitor CCTV 8 channel dan akses kartu warga.',
        ]);

        Fasilitas::create([
            'nama_fasilitas' => 'Taman Kanak-kanak & Playground',
            'kategori' => 'Fasilitas Umum',
            'lokasi' => 'Tengah Blok A dan B',
            'kondisi' => 'Perlu Pemeliharaan',
            'penanggung_jawab' => 'Ibu-ibu PKK',
            'keterangan' => 'Ayunan rantai perlu pengecatan ulang anti karat.',
        ]);

        Fasilitas::create([
            'nama_fasilitas' => 'Musholla Al-Muhajirin',
            'kategori' => 'Keagamaan',
            'lokasi' => 'Blok C No. 12',
            'kondisi' => 'Baik',
            'penanggung_jawab' => 'DKM Al-Muhajirin',
            'keterangan' => 'AC dan tempat wudhu berfungsi normal.',
        ]);

        // Seed initial complaints
        Pengaduan::create([
            'nama_pelapor' => 'Bapak Warga (Budi)',
            'jenis_kerusakan' => 'Lampu Jalan Penerangan Mati',
            'lokasi' => 'Depan Rumah Blok B No. 14',
            'deskripsi' => 'Lampu jalan redup dan sering mati sejak 2 hari yang lalu, mohon diganti bohlamnya.',
            'kontak' => '081234567890',
            'status' => 'Sedang Diproses',
            'foto_bukti' => null,
            'nama_file_foto' => null,
        ]);
    }
}
