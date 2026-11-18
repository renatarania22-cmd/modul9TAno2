<?php

use Illuminate\Support\Facades\Route;
use Modules\Fasilitas\Http\Controllers\FasilitasController;

Route::middleware('auth')->group(function () {
    Route::get('fasilitas', [FasilitasController::class, 'index'])->name('fasilitas.index');

    Route::middleware('role:admin')->group(function () {
        Route::get('fasilitas/create', [FasilitasController::class, 'create'])->name('fasilitas.create');
        Route::post('fasilitas', [FasilitasController::class, 'store'])->name('fasilitas.store');
        Route::get('fasilitas/{fasilita}/edit', [FasilitasController::class, 'edit'])->name('fasilitas.edit');
        Route::put('fasilitas/{fasilita}', [FasilitasController::class, 'update'])->name('fasilitas.update');
        Route::delete('fasilitas/{fasilita}', [FasilitasController::class, 'destroy'])->name('fasilitas.destroy');
    });
});
