import { Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FasilitasFormData = {
    nama_fasilitas: string;
    kategori: string;
    lokasi: string;
    kondisi: string;
    penanggung_jawab: string;
    keterangan: string;
};

type FasilitasFormProps = {
    data: FasilitasFormData;
    errors: Partial<Record<keyof FasilitasFormData, string>>;
    processing: boolean;
    isEdit?: boolean;
    submitLabel: string;
    setData: (key: keyof FasilitasFormData, value: string) => void;
    onSubmit: (event: FormEvent) => void;
};

export function FasilitasForm({
    data,
    errors,
    processing,
    submitLabel,
    setData,
    onSubmit,
}: FasilitasFormProps) {
    return (
        <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-5 rounded-xl border p-6">
            <div className="grid gap-2">
                <Label htmlFor="nama_fasilitas">
                    Nama Fasilitas <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="nama_fasilitas"
                    value={data.nama_fasilitas}
                    onChange={(e) => setData('nama_fasilitas', e.target.value)}
                    placeholder="Contoh: Taman Bermain Blok A"
                    autoFocus
                />
                <InputError message={errors.nama_fasilitas} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="kategori">
                    Kategori <span className="text-red-500">*</span>
                </Label>
                <select
                    id="kategori"
                    value={data.kategori}
                    onChange={(e) => setData('kategori', e.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                >
                    <option value="">Pilih Kategori</option>
                    <option value="Fasilitas Umum">Fasilitas Umum</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Keamanan">Keamanan</option>
                    <option value="Sosial & Budaya">Sosial & Budaya</option>
                </select>
                <InputError message={errors.kategori} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="lokasi">
                    Lokasi <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="lokasi"
                    value={data.lokasi}
                    onChange={(e) => setData('lokasi', e.target.value)}
                    placeholder="Contoh: RT 02 / RW 05, Samping Pos 1"
                />
                <InputError message={errors.lokasi} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="kondisi">
                    Kondisi <span className="text-red-500">*</span>
                </Label>
                <select
                    id="kondisi"
                    value={data.kondisi}
                    onChange={(e) => setData('kondisi', e.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                >
                    <option value="">Pilih Kondisi</option>
                    <option value="Baik">Baik</option>
                    <option value="Perlu Pemeliharaan">Perlu Pemeliharaan</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                </select>
                <InputError message={errors.kondisi} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="penanggung_jawab">
                    Penanggung Jawab <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="penanggung_jawab"
                    value={data.penanggung_jawab}
                    onChange={(e) => setData('penanggung_jawab', e.target.value)}
                    placeholder="Contoh: Ketua RT 02 / Seksi Sarpras"
                />
                <InputError message={errors.penanggung_jawab} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan Tambahan</Label>
                <Input
                    id="keterangan"
                    value={data.keterangan}
                    onChange={(e) => setData('keterangan', e.target.value)}
                    placeholder="Catatan jadwal pakai, kapasitas, dsb."
                />
                <InputError message={errors.keterangan} />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : submitLabel}
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/fasilitas">Batal</Link>
                </Button>
            </div>
        </form>
    );
}
