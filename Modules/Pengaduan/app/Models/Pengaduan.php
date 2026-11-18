<?php

namespace Modules\Pengaduan\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Pengaduan\Database\Factories\PengaduanFactory;

class Pengaduan extends Model
{
    /** @use HasFactory<PengaduanFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pengaduans';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama_pelapor',
        'jenis_kerusakan',
        'lokasi',
        'deskripsi',
        'kontak',
        'status',
        'foto_bukti',
        'nama_file_foto',
    ];

    /**
     * The accessors to append to the model's array and JSON form.
     *
     * @var list<string>
     */
    protected $appends = [
        'foto_bukti_url',
    ];

    /**
     * Public URL of the uploaded photo proof, or null when there is no file.
     */
    protected function fotoBuktiUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->foto_bukti ? asset('storage/'.$this->foto_bukti) : null);
    }

    protected static function newFactory(): PengaduanFactory
    {
        return PengaduanFactory::new();
    }
}
