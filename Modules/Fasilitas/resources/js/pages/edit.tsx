import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FasilitasForm } from '../components/fasilitas-form';
import type { FasilitasFormData } from '../components/fasilitas-form';

type EditProps = {
    fasilitas: {
        id: number;
        nama_fasilitas: string;
        kategori: string;
        lokasi: string;
        kondisi: string;
        penanggung_jawab: string;
        keterangan?: string | null;
    };
};

export default function Edit({ fasilitas }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fasilitas Warga', href: '/fasilitas' },
        { title: 'Edit Fasilitas', href: `/fasilitas/${fasilitas.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm<FasilitasFormData>({
        nama_fasilitas: fasilitas.nama_fasilitas,
        kategori: fasilitas.kategori,
        lokasi: fasilitas.lokasi,
        kondisi: fasilitas.kondisi,
        penanggung_jawab: fasilitas.penanggung_jawab,
        keterangan: fasilitas.keterangan ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(`/fasilitas/${fasilitas.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Fasilitas" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Edit Fasilitas</h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui data sarana fasilitas {fasilitas.nama_fasilitas}.
                    </p>
                </div>

                <FasilitasForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    isEdit
                    submitLabel="Simpan Perubahan"
                    setData={setData}
                    onSubmit={submit}
                />
            </div>
        </AppLayout>
    );
}
