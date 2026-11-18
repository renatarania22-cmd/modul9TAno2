import { Head } from '@inertiajs/react';
import {
    FileImage,
    FileText,
    LoaderCircle,
    Megaphone,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AlertMessage } from '@/components/alert-message';
import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { http, HttpError } from '@/lib/http';
import type { ValidationErrors } from '@/lib/http';
import type { BreadcrumbItem } from '@/types';

type Pengaduan = {
    id: number;
    nama_pelapor: string;
    jenis_kerusakan: string;
    lokasi: string;
    deskripsi: string;
    kontak: string;
    status: 'Menunggu Verifikasi' | 'Sedang Diproses' | 'Selesai' | 'Ditolak';
    foto_bukti: string | null;
    nama_file_foto: string | null;
    foto_bukti_url: string | null;
    created_at?: string;
};

type FormFields = Pick<
    Pengaduan,
    'nama_pelapor' | 'jenis_kerusakan' | 'lokasi' | 'deskripsi' | 'kontak' | 'status'
>;

type Message = { type: 'success' | 'error'; text: string } | null;

const emptyForm: FormFields = {
    nama_pelapor: '',
    jenis_kerusakan: '',
    lokasi: '',
    deskripsi: '',
    kontak: '',
    status: 'Menunggu Verifikasi',
};

const urls = {
    data: '/pengaduan/data',
    store: '/pengaduan',
    edit: (id: number) => `/pengaduan/${id}/edit`,
    update: (id: number) => `/pengaduan/${id}`,
    destroy: (id: number) => `/pengaduan/${id}`,
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaduan Warga', href: '/pengaduan' },
];

function FileLink({ url, name }: { url: string | null; name: string | null }) {
    if (!url) {
        return <span className="text-muted-foreground">-</span>;
    }

    const Icon = name?.toLowerCase().endsWith('.pdf') ? FileText : FileImage;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
        >
            <Icon className="size-4" /> {name ?? 'Lihat foto bukti'}
        </a>
    );
}

export default function Index() {
    const [records, setRecords] = useState<Pengaduan[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [message, setMessage] = useState<Message>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Pengaduan | null>(null);
    const [form, setForm] = useState<FormFields>(emptyForm);
    const [file, setFile] = useState<File | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState<Pengaduan | null>(null);
    const [processingDelete, setProcessingDelete] = useState(false);

    const showError = (error: unknown, fallback: string) => {
        const text =
            error instanceof HttpError ? (error.data?.message ?? fallback) : fallback;
        setMessage({ type: 'error', text });
    };

    const loadData = async () => {
        setLoading(true);
        try {
            setRecords(await http<Pengaduan[]>(urls.data));
        } catch (error) {
            showError(error, 'Gagal memuat data pengaduan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filtered = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (q === '') {
            return records;
        }

        return records.filter((item) =>
            [item.nama_pelapor, item.jenis_kerusakan, item.lokasi, item.status].some(
                (val) => val.toLowerCase().includes(q),
            ),
        );
    }, [records, keyword]);

    const resetFileAndErrors = () => {
        setFile(null);
        setFileInputKey((key) => key + 1);
        setErrors({});
    };

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        resetFileAndErrors();
        setDialogOpen(true);
    };

    const openEdit = async (id: number) => {
        try {
            const data = await http<Pengaduan>(urls.edit(id));
            setEditing(data);
            setForm({
                nama_pelapor: data.nama_pelapor,
                jenis_kerusakan: data.jenis_kerusakan,
                lokasi: data.lokasi,
                deskripsi: data.deskripsi,
                kontak: data.kontak,
                status: data.status,
            });
            resetFileAndErrors();
            setDialogOpen(true);
        } catch (error) {
            showError(error, 'Data pengaduan tidak ditemukan.');
        }
    };

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setErrors({});

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));

        if (file) {
            formData.append('foto_bukti', file);
        }

        if (editing) {
            formData.append('_method', 'PUT');
        }

        try {
            const result = await http<{ success: string }>(
                editing ? urls.update(editing.id) : urls.store,
                {
                    method: 'POST',
                    body: formData,
                },
            );

            setDialogOpen(false);
            setMessage({ type: 'success', text: result.success });
            await loadData();
        } catch (error) {
            if (error instanceof HttpError && error.status === 422) {
                setErrors(error.data?.errors ?? {});
            } else {
                showError(error, 'Terjadi kesalahan, silakan coba lagi.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleting) return;

        setProcessingDelete(true);
        try {
            const result = await http<{ success: string }>(
                urls.destroy(deleting.id),
                { method: 'DELETE' },
            );
            setMessage({ type: 'success', text: result.success });
            await loadData();
        } catch (error) {
            showError(error, 'Data pengaduan gagal dihapus.');
        } finally {
            setProcessingDelete(false);
            setDeleting(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Selesai':
                return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">Selesai</Badge>;
            case 'Sedang Diproses':
                return <Badge variant="default">Sedang Diproses</Badge>;
            case 'Ditolak':
                return <Badge variant="destructive">Ditolak</Badge>;
            default:
                return <Badge variant="outline">Menunggu Verifikasi</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaduan Warga" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-semibold">
                            <Megaphone className="size-5" />
                            Layanan Pengaduan & Keluhan <Badge variant="secondary">{records.length}</Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Penyampaian aspirasi dan laporan kerusakan fasilitas berbasis AJAX interaktif.
                        </p>
                    </div>

                    <Button onClick={openCreate}>
                        <Plus /> Buat Laporan Pengaduan
                    </Button>
                </div>

                <AlertMessage
                    type={message?.type ?? 'success'}
                    message={message?.text}
                    onClose={() => setMessage(null)}
                />

                <div className="relative max-w-sm">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Cari pelapor, masalah, lokasi..."
                        className="pl-9"
                    />
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">No</th>
                                <th className="px-4 py-3 font-medium">Pelapor</th>
                                <th className="px-4 py-3 font-medium">Jenis Masalah</th>
                                <th className="px-4 py-3 font-medium">Lokasi</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Bukti Foto</th>
                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        <LoaderCircle className="mx-auto size-5 animate-spin" />
                                    </td>
                                </tr>
                            )}

                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        {records.length === 0
                                            ? 'Belum ada laporan pengaduan.'
                                            : 'Laporan pengaduan tidak ditemukan.'}
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filtered.map((item, index) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium">
                                            {item.nama_pelapor}
                                            <p className="text-xs text-muted-foreground">{item.kontak}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.jenis_kerusakan}
                                            <p className="text-xs text-muted-foreground line-clamp-1">{item.deskripsi}</p>
                                        </td>
                                        <td className="px-4 py-3">{item.lokasi}</td>
                                        <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                                        <td className="px-4 py-3">
                                            <FileLink
                                                url={item.foto_bukti_url}
                                                name={item.nama_file_foto}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEdit(item.id)}
                                                >
                                                    <Pencil /> Edit
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
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={dialogOpen}
                onOpenChange={(open) => !saving && setDialogOpen(open)}
            >
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? 'Edit Pengaduan' : 'Form Pengaduan Warga'}
                            </DialogTitle>
                            <DialogDescription>
                                Sampaikan laporan masalah fasilitas lingkungan beserta foto bukti pendukung.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-2">
                            <Label htmlFor="nama_pelapor">
                                Nama Pelapor <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nama_pelapor"
                                name="nama_pelapor"
                                value={form.nama_pelapor}
                                onChange={handleChange}
                                placeholder="Nama lengkap warga"
                                aria-invalid={!!errors.nama_pelapor}
                            />
                            <InputError message={errors.nama_pelapor?.[0]} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="jenis_kerusakan">
                                    Jenis Masalah <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="jenis_kerusakan"
                                    name="jenis_kerusakan"
                                    value={form.jenis_kerusakan}
                                    onChange={handleChange}
                                    placeholder="Contoh: Lampu Jalan Mati"
                                    aria-invalid={!!errors.jenis_kerusakan}
                                />
                                <InputError message={errors.jenis_kerusakan?.[0]} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kontak">
                                    Kontak HP/WA <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="kontak"
                                    name="kontak"
                                    value={form.kontak}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                    aria-invalid={!!errors.kontak}
                                />
                                <InputError message={errors.kontak?.[0]} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="lokasi">
                                Lokasi Kejadian <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lokasi"
                                name="lokasi"
                                value={form.lokasi}
                                onChange={handleChange}
                                placeholder="Contoh: Depan Balai RW 05"
                                aria-invalid={!!errors.lokasi}
                            />
                            <InputError message={errors.lokasi?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">
                                Uraian / Deskripsi <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="deskripsi"
                                name="deskripsi"
                                value={form.deskripsi}
                                onChange={handleChange}
                                placeholder="Jelaskan detail kendala/kerusakan yang ditemukan"
                                aria-invalid={!!errors.deskripsi}
                            />
                            <InputError message={errors.deskripsi?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">
                                Status Penanganan <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                            >
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Sedang Diproses">Sedang Diproses</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                            <InputError message={errors.status?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="foto_bukti">
                                Foto / Berkas Bukti {!editing && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                                key={fileInputKey}
                                id="foto_bukti"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                aria-invalid={!!errors.foto_bukti}
                            />
                            <p className="text-xs text-muted-foreground">
                                Format jpg, jpeg, png, atau pdf, maksimal 2 MB.
                                {editing && ' Kosongkan jika tidak ingin mengganti file bukti.'}
                            </p>
                            {editing?.foto_bukti_url && (
                                <p className="text-xs">
                                    Berkas saat ini:{' '}
                                    <FileLink
                                        url={editing.foto_bukti_url}
                                        name={editing.nama_file_foto}
                                    />
                                </p>
                            )}
                            <InputError message={errors.foto_bukti?.[0]} />
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setDialogOpen(false)}
                                disabled={saving}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <LoaderCircle className="animate-spin" />}
                                {saving ? 'Mengirim...' : 'Kirim Laporan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleting !== null}
                description={`Yakin ingin menghapus laporan pengaduan dari "${deleting?.nama_pelapor}" beserta berkasnya?`}
                processing={processingDelete}
                onConfirm={handleDelete}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </AppLayout>
    );
}
