import { Head, Link, router } from '@inertiajs/react';
import { Building2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/alert-message';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSharedProps } from '@/hooks/use-shared-props';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type FasilitasRow = {
    id: number;
    nama_fasilitas: string;
    kategori: string;
    lokasi: string;
    kondisi: string;
    penanggung_jawab: string;
    keterangan?: string | null;
    created_at?: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type IndexProps = {
    fasilitas: {
        data: FasilitasRow[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Fasilitas Warga', href: '/fasilitas' },
];

export default function Index({ fasilitas, filters }: IndexProps) {
    const { isAdmin } = useSharedProps();
    const [search, setSearch] = useState(filters.search);
    const [deleting, setDeleting] = useState<FasilitasRow | null>(null);
    const [processing, setProcessing] = useState(false);

    const applyFilters = (params: { search?: string }) => {
        router.get('/fasilitas', { ...filters, search, ...params }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        applyFilters({ search });
    };

    const handleDelete = () => {
        if (!deleting) return;

        router.delete(`/fasilitas/${deleting.id}`, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setDeleting(null);
            },
        });
    };

    const getKondisiVariant = (kondisi: string) => {
        if (kondisi === 'Baik') return 'default';
        if (kondisi === 'Perlu Pemeliharaan') return 'outline';
        return 'destructive';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fasilitas Warga" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-semibold">
                            <Building2 className="size-5" />
                            Data Fasilitas Lingkungan <Badge variant="secondary">{fasilitas.total}</Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Katalog fasilitas dan sarana prasarana perumahan warga SmartResident.
                        </p>
                    </div>

                    {isAdmin && (
                        <Button asChild>
                            <Link href="/fasilitas/create">
                                <Plus /> Tambah Fasilitas
                            </Link>
                        </Button>
                    )}
                </div>

                <FlashMessage />

                <div className="flex flex-wrap gap-2">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2 max-w-sm">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari fasilitas, lokasi, kondisi..."
                        />
                        <Button type="submit" variant="secondary">
                            <Search /> Cari
                        </Button>
                    </form>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">No</th>
                                <th className="px-4 py-3 font-medium">Nama Fasilitas</th>
                                <th className="px-4 py-3 font-medium">Kategori</th>
                                <th className="px-4 py-3 font-medium">Lokasi</th>
                                <th className="px-4 py-3 font-medium">Kondisi</th>
                                <th className="px-4 py-3 font-medium">Penanggung Jawab</th>
                                {isAdmin && (
                                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {fasilitas.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 7 : 6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        Data fasilitas tidak ditemukan.
                                    </td>
                                </tr>
                            )}

                            {fasilitas.data.map((item, index) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-3">{(fasilitas.from ?? 1) + index}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {item.nama_fasilitas}
                                        {item.keterangan && (
                                            <p className="text-xs text-muted-foreground">
                                                {item.keterangan}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{item.kategori}</td>
                                    <td className="px-4 py-3">{item.lokasi}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={getKondisiVariant(item.kondisi)}>
                                            {item.kondisi}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">{item.penanggung_jawab}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/fasilitas/${item.id}/edit`}>
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setDeleting(item)}
                                                >
                                                    <Trash2 /> Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="text-muted-foreground">
                        Menampilkan {fasilitas.from ?? 0}-{fasilitas.to ?? 0} dari {fasilitas.total} data
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {fasilitas.links.map((link, index) =>
                            link.url ? (
                                <Button
                                    key={index}
                                    asChild
                                    size="sm"
                                    variant={link.active ? 'default' : 'outline'}
                                >
                                    <Link href={link.url} preserveScroll>
                                        {cleanLabel(link.label)}
                                    </Link>
                                </Button>
                            ) : (
                                <Button key={index} size="sm" variant="outline" disabled>
                                    {cleanLabel(link.label)}
                                </Button>
                            ),
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={deleting !== null}
                description={`Yakin ingin menghapus fasilitas "${deleting?.nama_fasilitas}"? Tindakan ini tidak dapat dibatalkan.`}
                processing={processing}
                onConfirm={handleDelete}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </AppLayout>
    );
}

function cleanLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}
