import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function PengajuanPage({ auth }: PageProps) {
  return (
    <MahasiswaLayout user={auth.user}>
      <Head title="Pengajuan Saya" />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Pengajuan Saya</h2>
        <p className="text-muted-foreground">
          Lihat status dan riwayat pengajuan crowdfunding Anda.
        </p>

        {/* Content will be added here */}
        <div className="rounded-lg border p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Pengajuan Aktif</h3>
              <p className="text-muted-foreground">Daftar pengajuan yang sedang dalam proses.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Riwayat Pengajuan</h3>
              <p className="text-muted-foreground">Riwayat pengajuan yang sudah selesai.</p>
            </div>
          </div>
        </div>
      </div>
    </MahasiswaLayout>
  );
}
