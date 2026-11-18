<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Modules\Fasilitas\Models\Fasilitas;

test('guest is redirected to login from fasilitas page', function () {
    $this->get('/fasilitas')->assertRedirect(route('login'));
});

test('user can see the facility list rendered by the module page', function () {
    Fasilitas::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get('/fasilitas')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Fasilitas::index', false)
            ->has('fasilitas.data', 1));
});

test('user cannot open create facility page or store facility', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/fasilitas/create')
        ->assertForbidden();

    $this->actingAs($user)
        ->post('/fasilitas', [
            'nama_fasilitas' => 'Gazebo Baru',
            'kategori' => 'Fasilitas Umum',
            'lokasi' => 'Blok D',
            'kondisi' => 'Baik',
            'penanggung_jawab' => 'Ketua RT',
        ])
        ->assertForbidden();
});

test('admin can see create facility page and create a facility', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/fasilitas/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Fasilitas::create', false));

    $this->actingAs($admin)
        ->post('/fasilitas', [
            'nama_fasilitas' => 'Lapangan Futsal RW',
            'kategori' => 'Olahraga',
            'lokasi' => 'Blok E Lapangan Barat',
            'kondisi' => 'Baik',
            'penanggung_jawab' => 'Pengurus RT',
            'keterangan' => 'Tersedia gawang dan jaring pengaman.',
        ])
        ->assertRedirect('/fasilitas')
        ->assertSessionHas('success');

    $this->assertDatabaseHas('fasilitas', [
        'nama_fasilitas' => 'Lapangan Futsal RW',
        'kategori' => 'Olahraga',
    ]);
});

test('admin can update a facility', function () {
    $admin = User::factory()->admin()->create();
    $item = Fasilitas::factory()->create();

    $this->actingAs($admin)
        ->get("/fasilitas/{$item->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Fasilitas::edit', false));

    $this->actingAs($admin)
        ->put("/fasilitas/{$item->id}", [
            'nama_fasilitas' => 'Fasilitas Direnovasi',
            'kategori' => 'Fasilitas Umum',
            'lokasi' => 'Lokasi Baru',
            'kondisi' => 'Baik',
            'penanggung_jawab' => 'Koordinator Baru',
        ])
        ->assertRedirect('/fasilitas')
        ->assertSessionHas('success');

    $this->assertDatabaseHas('fasilitas', [
        'id' => $item->id,
        'nama_fasilitas' => 'Fasilitas Direnovasi',
    ]);
});

test('admin can delete a facility', function () {
    $admin = User::factory()->admin()->create();
    $item = Fasilitas::factory()->create();

    $this->actingAs($admin)
        ->delete("/fasilitas/{$item->id}")
        ->assertRedirect('/fasilitas')
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('fasilitas', ['id' => $item->id]);
});
