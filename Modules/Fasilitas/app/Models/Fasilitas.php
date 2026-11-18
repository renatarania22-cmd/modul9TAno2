<?php

namespace Modules\Fasilitas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Fasilitas\Database\Factories\FasilitasFactory;

class Fasilitas extends Model
{
    /** @use HasFactory<FasilitasFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'fasilitas';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama_fasilitas',
        'kategori',
        'lokasi',
        'kondisi',
        'penanggung_jawab',
        'keterangan',
    ];

    protected static function newFactory(): FasilitasFactory
    {
        return FasilitasFactory::new();
    }
}
