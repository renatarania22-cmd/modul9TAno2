import { Head, Link } from '@inertiajs/react';
import { Building2, Megaphone, ShieldCheck, Users } from 'lucide-react';
import { useSharedProps } from '@/hooks/use-shared-props';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type DashboardProps = {
    totalFasilitas: number;
    totalPengaduan: number;
    totalUsers: number | null;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({
    totalFasilitas,
    totalPengaduan,
    totalUsers,
}: DashboardProps) {
    const { user, isAdmin } = useSharedProps();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h1 className="text-xl font-semibold">Selamat datang di SmartResident, {user.name}!</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="size-4" />
                        Anda login sebagai {isAdmin ? 'Pengurus / Admin RT' : 'Warga Lingkungan'}.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Link
                        href="/fasilitas"
                        className="rounded-xl border border-sidebar-border/70 p-6 transition hover:bg-accent dark:border-sidebar-border"
                    >
                        <Building2 className="size-6 text-muted-foreground" />
                        <p className="mt-4 text-3xl font-bold">{totalFasilitas}</p>
                        <p className="text-sm text-muted-foreground">Fasilitas Lingkungan</p>
                    </Link>

                    <Link
                        href="/pengaduan"
                        className="rounded-xl border border-sidebar-border/70 p-6 transition hover:bg-accent dark:border-sidebar-border"
                    >
                        <Megaphone className="size-6 text-muted-foreground" />
                        <p className="mt-4 text-3xl font-bold">{totalPengaduan}</p>
                        <p className="text-sm text-muted-foreground">Laporan Pengaduan</p>
                    </Link>

                    {isAdmin && totalUsers !== null && (
                        <Link
                            href="/admin/users"
                            className="rounded-xl border border-sidebar-border/70 p-6 transition hover:bg-accent dark:border-sidebar-border"
                        >
                            <Users className="size-6 text-muted-foreground" />
                            <p className="mt-4 text-3xl font-bold">{totalUsers}</p>
                            <p className="text-sm text-muted-foreground">Pengguna Terdaftar</p>
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
