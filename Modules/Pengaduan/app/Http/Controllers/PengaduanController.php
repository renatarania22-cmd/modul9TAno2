<?php

namespace Modules\Pengaduan\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Pengaduan\Http\Requests\PengaduanRequest;
use Modules\Pengaduan\Models\Pengaduan;

class PengaduanController extends Controller
{
    /**
     * Display the React page. Data is loaded via AJAX.
     */
    public function index(): Response
    {
        return Inertia::render('Pengaduan::index');
    }

    /**
     * Return all complaints as JSON.
     */
    public function getData(): JsonResponse
    {
        return response()->json(Pengaduan::latest()->get());
    }

    /**
     * Store a newly created complaint with its uploaded photo/document.
     */
    public function store(PengaduanRequest $request): JsonResponse
    {
        $data = $request->safe()->except('foto_bukti');
        $file = $request->file('foto_bukti');
        $data['foto_bukti'] = $file->store('bukti_pengaduan', 'public');
        $data['nama_file_foto'] = $file->getClientOriginalName();

        Pengaduan::create($data);

        return response()->json(['success' => 'Laporan pengaduan berhasil dikirim.']);
    }

    /**
     * Return a single complaint record for edit.
     */
    public function edit(Pengaduan $pengaduan): JsonResponse
    {
        return response()->json($pengaduan);
    }

    /**
     * Update the specified complaint.
     */
    public function update(PengaduanRequest $request, Pengaduan $pengaduan): JsonResponse
    {
        $data = $request->safe()->except('foto_bukti');

        if ($request->hasFile('foto_bukti')) {
            if ($pengaduan->foto_bukti) {
                Storage::disk('public')->delete($pengaduan->foto_bukti);
            }

            $file = $request->file('foto_bukti');
            $data['foto_bukti'] = $file->store('bukti_pengaduan', 'public');
            $data['nama_file_foto'] = $file->getClientOriginalName();
        }

        $pengaduan->update($data);

        return response()->json(['success' => 'Laporan pengaduan berhasil diperbarui.']);
    }

    /**
     * Remove the specified complaint and its uploaded file.
     */
    public function destroy(Pengaduan $pengaduan): JsonResponse
    {
        if ($pengaduan->foto_bukti) {
            Storage::disk('public')->delete($pengaduan->foto_bukti);
        }

        $pengaduan->delete();

        return response()->json(['success' => 'Laporan pengaduan berhasil dihapus.']);
    }
}
