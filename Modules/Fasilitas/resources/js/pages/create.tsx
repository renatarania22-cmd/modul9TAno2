import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FasilitasForm } from '../components/fasilitas-form';
import type { FasilitasFormData } from '../components/fasilitas-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Fasilitas Warga', href: '/fasilitas' },
    { title: 'Tambah Fasilitas', href: '/fasilitas/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FasilitasFormData>({
        nama_fasilitas: '',
        kategori: '',
        lokasi: '',
        kondisi: 'Baik',
        penanggung_jawab: '',
        keterangan: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/fasilitas');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Fasilitas" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Tambah Fasilitas Warga</h1>
                    <p className="text-sm text-muted-foreground">
                        Tambahkan fasilitas atau sarana prasarana baru di lingkungan warga.
                    </p>
                </div>

                <FasilitasForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    submitLabel="Simpan"
                    setData={setData}
                    onSubmit={submit}
                />
            </div>
        </AppLayout>
    );
}
