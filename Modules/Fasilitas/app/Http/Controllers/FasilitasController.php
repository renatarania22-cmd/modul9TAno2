<?php

namespace Modules\Fasilitas\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Fasilitas\Http\Requests\StoreFasilitasRequest;
use Modules\Fasilitas\Http\Requests\UpdateFasilitasRequest;
use Modules\Fasilitas\Models\Fasilitas;

class FasilitasController extends Controller
{
    /**
     * Display a listing of community facilities with search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $fasilitas = Fasilitas::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $q) use ($search) {
                    $q->where('nama_fasilitas', 'like', "%{$search}%")
                        ->orWhere('kategori', 'like', "%{$search}%")
                        ->orWhere('lokasi', 'like', "%{$search}%")
                        ->orWhere('kondisi', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Fasilitas::index', [
            'fasilitas' => $fasilitas,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new facility.
     */
    public function create(): Response
    {
        return Inertia::render('Fasilitas::create');
    }

    /**
     * Store a newly created facility.
     */
    public function store(StoreFasilitasRequest $request): RedirectResponse
    {
        Fasilitas::create($request->validated());

        return redirect()->route('fasilitas.index')->with('success', 'Data fasilitas berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified facility.
     */
    public function edit(Fasilitas $fasilita): Response
    {
        return Inertia::render('Fasilitas::edit', [
            'fasilitas' => $fasilita,
        ]);
    }

    /**
     * Update the specified facility.
     */
    public function update(UpdateFasilitasRequest $request, Fasilitas $fasilita): RedirectResponse
    {
        $fasilita->update($request->validated());

        return redirect()->route('fasilitas.index')->with('success', 'Data fasilitas berhasil diperbarui.');
    }

    /**
     * Remove the specified facility.
     */
    public function destroy(Fasilitas $fasilita): RedirectResponse
    {
        $fasilita->delete();

        return redirect()->route('fasilitas.index')->with('success', 'Data fasilitas berhasil dihapus.');
    }
}
