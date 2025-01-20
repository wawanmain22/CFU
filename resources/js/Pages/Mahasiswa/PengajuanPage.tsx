import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Info, Send, ClipboardList, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { useEffect, useState } from "react";

interface Props extends PageProps {
  canSubmit: boolean;
  currentBatch: {
    id: number;
    name: string;
    status: 'open' | 'closed';
  };
  hasSubmitted: boolean;
  flash: {
    success?: string;
  };
}

export default function PengajuanPage({ auth, canSubmit, currentBatch, hasSubmitted, flash }: Props) {
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(3);

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

  const { data, setData, post, processing, errors } = useForm({
    batch_id: currentBatch?.id || '',
    dokumen_pengajuan: null as File | null,
    note_user: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('student.pengajuan.store'));
  };

  const renderContent = () => {
    // Jika batch closed
    if (currentBatch?.status === 'closed') {
      return (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <p className="font-medium mb-1">Pengajuan Saat Ini Belum Dibuka</p>
            <p>
              Mohon maaf, periode pengajuan crowdfunding saat ini belum dibuka. 
              Kami akan membuka batch pengajuan baru dalam waktu dekat. 
              Silakan pantau terus informasi terbaru mengenai pembukaan batch selanjutnya.
            </p>
          </AlertDescription>
        </Alert>
      );
    }

    // Jika sudah submit di batch ini
    if (hasSubmitted) {
      return (
        <Alert className="bg-blue-50 border-blue-200">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <p className="font-medium mb-1">Pengajuan Sudah Terkirim</p>
            <p>
              Anda telah mengirimkan pengajuan untuk batch saat ini. 
              Jika Anda ingin mengajukan proposal lain, silakan tunggu pembukaan batch selanjutnya. 
              Terima kasih atas partisipasi Anda.
            </p>
          </AlertDescription>
        </Alert>
      );
    }

    // Form pengajuan (jika bisa submit)
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Send className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Form Pengajuan Crowdfunding</CardTitle>
              <CardDescription>
                Silakan lengkapi form pengajuan di bawah ini dengan teliti.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Batch Pengajuan
              </Label>
              <Input
                value={currentBatch?.name || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dokumen_pengajuan" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Dokumen Pengajuan (PDF)
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Download template dokumen pengajuan sebagai acuan</span>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.open('/storage/pengajuan/TemplatePengajuan.pdf', '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Template Dokumen
                </Button>
              </div>
              <Input
                id="dokumen_pengajuan"
                type="file"
                accept=".pdf"
                onChange={e => setData('dokumen_pengajuan', e.target.files?.[0] || null)}
                required
              />
              {errors.dokumen_pengajuan && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.dokumen_pengajuan}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note_user" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Catatan Pengajuan
              </Label>
              <Textarea
                id="note_user"
                value={data.note_user}
                onChange={e => setData('note_user', e.target.value)}
                placeholder="Tuliskan catatan atau keterangan tambahan untuk pengajuan Anda..."
                required
              />
              {errors.note_user && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.note_user}
                </p>
              )}
            </div>

            <Button type="submit" disabled={processing} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {processing ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <MahasiswaLayout user={auth.user}>
      <Head title="Pengajuan Crowdfunding" />
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Send className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Pengajuan Crowdfunding</h2>
          </div>
          <p className="text-muted-foreground">
            Ajukan proposal crowdfunding Anda untuk mendapatkan pendanaan.
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

        {renderContent()}
      </div>
    </MahasiswaLayout>
  );
}
