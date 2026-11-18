<?php

namespace Modules\Pengaduan\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PengaduanRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $pengaduan = $this->route('pengaduan');

        return [
            'nama_pelapor' => ['required', 'string', 'max:255'],
            'jenis_kerusakan' => ['required', 'string', 'max:255'],
            'lokasi' => ['required', 'string', 'max:255'],
            'deskripsi' => ['required', 'string', 'max:1500'],
            'kontak' => ['required', 'string', 'regex:/^[0-9+]{8,20}$/'],
            'status' => ['required', 'string', 'in:Menunggu Verifikasi,Sedang Diproses,Selesai,Ditolak'],
            'foto_bukti' => [$pengaduan ? 'nullable' : 'required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_pelapor.required' => 'Nama pelapor wajib diisi.',
            'jenis_kerusakan.required' => 'Jenis kerusakan/masalah wajib dipilih.',
            'lokasi.required' => 'Lokasi kejadian wajib diisi.',
            'deskripsi.required' => 'Deskripsi keluhan wajib diisi.',
            'kontak.required' => 'Nomor kontak telepon/WhatsApp wajib diisi.',
            'kontak.regex' => 'Nomor kontak hanya boleh berisi angka (8-20 digit).',
            'status.required' => 'Status pengaduan wajib dipilih.',
            'foto_bukti.required' => 'Foto bukti keluhan wajib diunggah.',
            'foto_bukti.mimes' => 'Foto bukti harus berformat jpg, jpeg, png, atau pdf.',
            'foto_bukti.max' => 'Ukuran berkas foto bukti maksimal 2 MB.',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
