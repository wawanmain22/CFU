import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function ProfilePage({ auth }: PageProps) {
  return (
    <MahasiswaLayout user={auth.user}>
      <Head title="Profile Settings" />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Kelola informasi akun dan preferensi Anda.
        </p>

        {/* Content will be added here */}
        <div className="rounded-lg border p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Informasi Personal</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p>{auth.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{auth.user.email}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Informasi Akademik</h3>
              <p className="text-muted-foreground">Detail informasi akademik akan ditampilkan di sini.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Keamanan</h3>
              <p className="text-muted-foreground">Form untuk mengubah password akan ditampilkan di sini.</p>
            </div>
          </div>
        </div>
      </div>
    </MahasiswaLayout>
  );
}
