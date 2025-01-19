import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Eye, FileText, Info } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Pengajuan {
  id: number;
  batch: {
    name: string;
  };
  dokumen_pengajuan: string;
  note_user: string;
  note_reviewer: string | null;
  status: 'pending' | 'approved' | 'rejected';
  dokumen_approved: string | null;
  foto_dokumentasi_approved: string | null;
  created_at: string;
  updated_at: string;
  reviewer?: {
    name: string;
  } | null;
}

interface Props extends PageProps {
  pengajuans: Pengajuan[];
  flash: {
    success?: string;
  };
}

export default function HistoryPage({ auth, pengajuans, flash }: Props) {
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    if (flash.success) {
      setShowAlert(true);
      setCountdown(3);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => {
              setShowAlert(false);
              window.location.reload();
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [flash.success]);

  const handleShowDetail = async (pengajuan: Pengajuan) => {
    try {
      const response = await axios.get<{ pengajuan: Pengajuan }>(route('student.history.show', pengajuan.id));
      setSelectedPengajuan(response.data.pengajuan);
      setShowDetailDialog(true);
    } catch (error) {
      console.error('Error fetching pengajuan details:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Pengajuan['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}>{status}</span>;
  };

  return (
    <MahasiswaLayout user={auth.user}>
      <Head title="History Pengajuan" />
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">History Pengajuan</h2>
          </div>
          <p className="text-muted-foreground">
            Lihat riwayat pengajuan crowdfunding Anda.
          </p>
        </div>

        {showAlert && flash.success && (
          <Alert className="bg-green-50 border-green-200">
            <Info className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 font-medium flex items-center justify-between">
              <span>{flash.success}</span>
              <span className="text-sm text-green-600">({countdown}s)</span>
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pengajuans.map((pengajuan, index) => (
                <TableRow key={pengajuan.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{pengajuan.batch.name}</TableCell>
                  <TableCell>{getStatusBadge(pengajuan.status)}</TableCell>
                  <TableCell>{new Date(pengajuan.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleShowDetail(pengajuan)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detail Pengajuan</DialogTitle>
              <DialogDescription>
                Informasi lengkap tentang pengajuan crowdfunding
              </DialogDescription>
            </DialogHeader>

            {selectedPengajuan && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Informasi Pengajuan</h4>
                  <div className="space-y-1">
                    <p className="text-sm">Batch: {selectedPengajuan.batch.name}</p>
                    <p className="text-sm">Status: <span className="ml-1">{getStatusBadge(selectedPengajuan.status)}</span></p>
                    <p className="text-sm">Tanggal Pengajuan: {formatDateTime(selectedPengajuan.created_at)}</p>
                    {selectedPengajuan.updated_at !== selectedPengajuan.created_at && (
                      <p className="text-sm">Terakhir Diupdate: {formatDateTime(selectedPengajuan.updated_at)}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Catatan Saya</h4>
                  <p className="text-sm">{selectedPengajuan.note_user}</p>
                </div>

                {selectedPengajuan.reviewer && (
                  <div>
                    <h4 className="font-medium mb-2">Reviewer</h4>
                    <p className="text-sm">Nama: {selectedPengajuan.reviewer.name}</p>
                  </div>
                )}

                {selectedPengajuan.note_reviewer && (
                  <div>
                    <h4 className="font-medium mb-2">Catatan Reviewer</h4>
                    <p className="text-sm">{selectedPengajuan.note_reviewer}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(route('student.history.download', {
                      pengajuan: selectedPengajuan.id,
                      type: 'dokumen_pengajuan'
                    }), '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Dokumen Pengajuan Saya
                  </Button>

                  {selectedPengajuan.status === 'approved' && (
                    <>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => window.open(route('student.history.download', {
                          pengajuan: selectedPengajuan.id,
                          type: 'dokumen_approved'
                        }), '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Lihat Dokumen Approval
                      </Button>

                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => window.open(route('student.history.download', {
                          pengajuan: selectedPengajuan.id,
                          type: 'foto_dokumentasi'
                        }), '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Lihat Foto Dokumentasi
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MahasiswaLayout>
  );
}
