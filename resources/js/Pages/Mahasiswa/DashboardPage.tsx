import { Head } from "@inertiajs/react";
import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { PageProps } from "@/types";
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

interface Props extends PageProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  recentSubmissions: {
    id: number;
    batch: {
      name: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
  }[];
}

export default function DashboardPage({ auth, stats, recentSubmissions }: Props) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Menunggu Review',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300'
        };
      case 'approved':
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: 'Disetujui',
          color: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300'
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: 'Ditolak',
          color: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300'
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300'
        };
    }
  };

  return (
    <MahasiswaLayout user={auth.user}>
      <Head title="Dashboard - Student Panel" />

      <div className="max-w-[85rem] mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat datang kembali, <span className="text-primary">{auth.user.name}</span>! 👋
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Berikut ringkasan aktivitas crowdfunding Anda
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Total Pengajuan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Clock className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.approved}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xl sm:text-2xl font-bold">{stats.rejected}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Pengajuan Terakhir</CardTitle>
            <CardDescription className="text-sm">
              5 pengajuan terakhir yang Anda ajukan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => {
                  const status = getStatusDetails(submission.status);
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between rounded-lg border p-3 sm:p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{submission.batch.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Diajukan pada: {new Date(submission.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn("flex items-center gap-1.5 px-2.5 py-1", status.color)}
                      >
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Belum ada pengajuan yang dibuat</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MahasiswaLayout>
  );
}
