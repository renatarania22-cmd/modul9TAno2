<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Modules\Pengaduan\Models\Pengaduan;

beforeEach(function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());
});

function dataPengaduan(array $overrides = []): array
{
    return [
        'nama_pelapor' => 'Siti Aminah',
        'jenis_kerusakan' => 'Pipa Air Bersih Bocor',
        'lokasi' => 'Depan Rumah Blok C No. 5',
        'deskripsi' => 'Genangan air mulai mengalir ke jalanan kompleks, butuh segera diperbaiki teknisi.',
        'kontak' => '081987654321',
        'status' => 'Menunggu Verifikasi',
        ...$overrides,
    ];
}

test('index renders the react page of the module', function () {
    $this->get('/pengaduan')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Pengaduan::index', false));
});

test('data endpoint returns complaints as json', function () {
    Pengaduan::factory()->count(3)->create();
    $this->getJson('/pengaduan/data')->assertOk()->assertJsonCount(3);
});

test('store returns 422 when the form is empty', function () {
    $this->postJson('/pengaduan', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['nama_pelapor', 'jenis_kerusakan', 'lokasi', 'deskripsi', 'kontak', 'status', 'foto_bukti']);
});

test('store saves data and the uploaded photo proof', function () {
    $this->postJson('/pengaduan', dataPengaduan([
        'foto_bukti' => UploadedFile::fake()->image('bukti_pipa.jpg'),
    ]))->assertOk()->assertJson(['success' => 'Laporan pengaduan berhasil dikirim.']);

    $laporan = Pengaduan::first();
    expect($laporan->nama_file_foto)->toBe('bukti_pipa.jpg');
    Storage::disk('public')->assertExists($laporan->foto_bukti);
});

test('zip file is rejected', function () {
    $this->postJson('/pengaduan', dataPengaduan([
        'foto_bukti' => UploadedFile::fake()->create('arsip.zip', 100),
    ]))->assertStatus(422)->assertJsonValidationErrors('foto_bukti');
});

test('update replaces the old file', function () {
    $this->postJson('/pengaduan', dataPengaduan([
        'foto_bukti' => UploadedFile::fake()->image('bukti_awal.png'),
    ]));

    $laporan = Pengaduan::first();
    $oldPath = $laporan->foto_bukti;

    $this->postJson("/pengaduan/{$laporan->id}", dataPengaduan([
        '_method' => 'PUT',
        'status' => 'Sedang Diproses',
        'foto_bukti' => UploadedFile::fake()->create('surat_laporan.pdf', 100, 'application/pdf'),
    ]))->assertOk();

    Storage::disk('public')->assertMissing($oldPath);
    expect($laporan->fresh()->status)->toBe('Sedang Diproses');
});

test('destroy deletes data and its file, unknown id returns 404', function () {
    $this->postJson('/pengaduan', dataPengaduan([
        'foto_bukti' => UploadedFile::fake()->image('bukti.png'),
    ]));

    $laporan = Pengaduan::first();
    $this->deleteJson("/pengaduan/{$laporan->id}")->assertOk();

    Storage::disk('public')->assertMissing($laporan->foto_bukti);
    $this->assertDatabaseMissing('pengaduans', ['id' => $laporan->id]);

    $this->deleteJson('/pengaduan/999')->assertNotFound();
});
