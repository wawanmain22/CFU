import { Head } from "@inertiajs/react";
import StaffLayout from "@/Layouts/StaffLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { PageProps } from "@/types";
import { FileText, Clock, CheckCircle2, Coins, Users } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

interface Props extends PageProps {
  stats: {
    total_pengajuan: number;
    pending_pengajuan: number;
    approved_pengajuan: number;
    total_donasi: number;
    total_donatur: number;
  };
  recentDonations: {
    id: number;
    name: string | null;
    amount: number;
    message: string | null;
    created_at: string;
  }[];
}

export default function DashboardPage({ auth, stats, recentDonations }: Props) {
  return (
    <StaffLayout user={auth.user}>
      <Head title="Dashboard - Staff Panel" />

      <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat datang kembali, <span className="text-purple-500">{auth.user.name}</span>! 👋
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Berikut ringkasan aktivitas platform CFU
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card className="bg-card/50 dark:bg-card/50 shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                  <FileText className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                </div>
                Total Pengajuan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.total_pengajuan}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 dark:bg-card/50 shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/10">
                  <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                </div>
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.pending_pengajuan}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 dark:bg-card/50 shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                </div>
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.approved_pengajuan}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 dark:bg-card/50 shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                  <Coins className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                </div>
                Total Donasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl sm:text-2xl font-bold">
                Rp {new Intl.NumberFormat('id-ID').format(stats.total_donasi)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 dark:bg-card/50 shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                  <Users className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                </div>
                Total Donatur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.total_donatur}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Donations */}
        <Card className="bg-card/50 dark:bg-card/50 shadow-sm">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg">Donasi Terbaru</CardTitle>
            <CardDescription>
              5 donasi terakhir yang berhasil
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {recentDonations.length > 0 ? (
              <div className="divide-y divide-border">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-start justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{donation.name || "Anonim"}</p>
                        <span className="text-xs text-muted-foreground">
                          • {new Date(donation.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {donation.message && (
                        <p className="text-sm text-muted-foreground italic">"{donation.message}"</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20">
                      Rp {new Intl.NumberFormat('id-ID').format(donation.amount)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Belum ada donasi yang diterima</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  );
}
