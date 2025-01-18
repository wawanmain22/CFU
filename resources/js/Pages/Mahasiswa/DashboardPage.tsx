import { Head } from "@inertiajs/react";
import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { PageProps } from "@/types";

export default function DashboardPage({ auth }: PageProps) {
  return (
    <MahasiswaLayout user={auth.user}>
      <Head title="Dashboard - Student Panel" />

      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {auth.user.name}</h2>
        <p className="text-muted-foreground">
          Here's an overview of your crowdfunding activities
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Pengajuan</CardTitle>
              <CardDescription>Jumlah pengajuan yang Anda buat</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
              <CardDescription>Pengajuan yang sedang diproses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved</CardTitle>
              <CardDescription>Pengajuan yang disetujui</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MahasiswaLayout>
  );
}
