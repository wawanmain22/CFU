import StaffLayout from "@/Layouts/StaffLayout";
import { Head, useForm, router } from "@inertiajs/react";
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
  DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { FileText, Eye, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import axios from "axios";
import AlertSuccess from "@/Components/AlertSuccess";
import AlertError from "@/Components/AlertError";

interface Pengajuan {
  id: number;
  user: {
    name: string;
    email: string;
    birthdate: string;
    gender: 'male' | 'female';
    phone: string;
    religion: string;
    address: string;
    mahasiswa?: {
      student_id: string;
      university_name: string;
      faculty: string;
      study_program: string;
      current_semester: number;
    };
  };
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
  reviewed_by?: string;
}

interface Props extends PageProps {
  pengajuans: Pengajuan[];
  flash: {
    success?: string;
  };
}

interface FormData {
  status: string;
  note_reviewer: string;
  dokumen_approved: File | null;
  foto_dokumentasi_approved: File | null;
  [key: string]: string | File | null;
}

export default function PengajuanPage({ auth, pengajuans, flash }: Props) {
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, setData, put, processing, errors, reset } = useForm<FormData>({
    status: '',
    note_reviewer: '',
    dokumen_approved: null,
    foto_dokumentasi_approved: null,
  });

  const filteredPengajuans = pengajuans.filter((pengajuan) =>
    pengajuan.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (pengajuan: Pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setShowActionDialog(true);
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPengajuan || !actionType) return;
    // Prepare form data
    const formData = new FormData();
    
    // Append method override for Laravel
    formData.append('_method', 'PUT');
    
    // Append basic data
    formData.append('status', actionType === 'approve' ? 'approved' : 'rejected');
    formData.append('note_reviewer', data.note_reviewer);

    // Append files for approval
    if (actionType === 'approve' && data.dokumen_approved && data.foto_dokumentasi_approved) {
      formData.append('dokumen_approved', data.dokumen_approved);
      formData.append('foto_dokumentasi_approved', data.foto_dokumentasi_approved);
    }
    // Submit form
    router.post(route('staff.pengajuan.update', selectedPengajuan.id), formData, {
      onSuccess: () => {
        setShowActionDialog(false);
        setSelectedPengajuan(null);
        setActionType(null);
        reset();
      },
      preserveScroll: true,
    });
  };

  const handleShowDetail = async (pengajuan: Pengajuan) => {
    try {
      const response = await axios.get<{ pengajuan: Pengajuan }>(route('staff.pengajuan.show', pengajuan.id));
      setSelectedPengajuan(response.data.pengajuan);
      setShowDetailDialog(true);
    } catch (error) {
      console.error('Error fetching pengajuan details:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Pengajuan['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusText = {
      pending: 'Pending',
      approved: 'Approved', 
      rejected: 'Rejected'
    };
    
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}>{statusText[status]}</span>;
  };

  return (
    <StaffLayout user={auth.user}>
      <Head title="Pengajuan Management" />
      
      <div className="space-y-6 p-8">
        <div className="border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Pengajuan Management</h2>
          </div>
          <p className="text-muted-foreground">
            Review and manage student crowdfunding submissions.
          </p>
        </div>

        {flash.success && <AlertSuccess message={flash.success} />}

        <div className="flex items-center space-x-2 mb-4">
          <SearchIcon className="w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPengajuans.map((pengajuan, index) => (
                <TableRow key={pengajuan.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pengajuan.user.name}</p>
                      <p className="text-sm text-muted-foreground">{pengajuan.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{pengajuan.batch.name}</TableCell>
                  <TableCell>{getStatusBadge(pengajuan.status)}</TableCell>
                  <TableCell>{new Date(pengajuan.created_at).toLocaleString('id-ID', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</TableCell>
                  <TableCell className="text-right">
                    {pengajuan.status === 'pending' ? (
                      <Button
                        onClick={() => handleAction(pengajuan)}
                        variant="outline"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Review Pengajuan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleShowDetail(pengajuan)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Action Dialog (Review) */}
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Pengajuan</DialogTitle>
              <DialogDescription>
                Review dan berikan keputusan untuk pengajuan ini
              </DialogDescription>
            </DialogHeader>

            {selectedPengajuan && (
              <div className="space-y-6">
                {/* Preview Data Pengajuan */}
                <div className="rounded-lg border p-4 space-y-4 bg-muted/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Informasi Mahasiswa</h4>
                      <div className="space-y-1">
                        <p className="text-sm">Nama: {selectedPengajuan.user.name}</p>
                        <p className="text-sm">Email: {selectedPengajuan.user.email}</p>
                        <p className="text-sm">Tanggal Lahir: {new Date(selectedPengajuan.user.birthdate).toLocaleDateString()}</p>
                        <p className="text-sm">Jenis Kelamin: {selectedPengajuan.user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                        <p className="text-sm">No. Telepon: {selectedPengajuan.user.phone}</p>
                        <p className="text-sm">Agama: {selectedPengajuan.user.religion}</p>
                        <p className="text-sm">Alamat: {selectedPengajuan.user.address}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Informasi Akademik</h4>
                      <div className="space-y-1">
                        {selectedPengajuan.user.mahasiswa ? (
                          <>
                            <p className="text-sm">NIM: {selectedPengajuan.user.mahasiswa.student_id}</p>
                            <p className="text-sm">Universitas: {selectedPengajuan.user.mahasiswa.university_name}</p>
                            <p className="text-sm">Fakultas: {selectedPengajuan.user.mahasiswa.faculty}</p>
                            <p className="text-sm">Program Studi: {selectedPengajuan.user.mahasiswa.study_program}</p>
                            <p className="text-sm">Semester: {selectedPengajuan.user.mahasiswa.current_semester}</p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">Data akademik tidak tersedia</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Catatan Mahasiswa</h4>
                    <div className="bg-background/50 p-3 rounded-md border">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedPengajuan.note_user || 'Tidak ada catatan'}
                      </p>
                    </div>
                  </div>

                  {errors.note_reviewer && (
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">
                      {errors.note_reviewer}
                    </p>
                  )}

                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(route('staff.pengajuan.download', {
                      pengajuan: selectedPengajuan.id,
                      type: 'dokumen_pengajuan'
                    }), '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Dokumen Pengajuan
                  </Button>
                </div>

                {/* Form Review */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Keputusan</Label>
                    <Select
                      value={actionType || ''}
                      onValueChange={(value: 'approve' | 'reject') => {
                        setActionType(value);
                        reset();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih keputusan pengajuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approve">Setujui Pengajuan</SelectItem>
                        <SelectItem value="reject">Tolak Pengajuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {actionType === 'reject' && (
                    <div className="space-y-2">
                      <Label htmlFor="note_reviewer">Alasan Penolakan</Label>
                      <Textarea
                        id="note_reviewer"
                        name="note_reviewer"
                        value={data.note_reviewer}
                        onChange={e => setData('note_reviewer', e.target.value)}
                        placeholder="Berikan alasan penolakan"
                      />
                    </div>
                  )}

                  {actionType === 'approve' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="note_reviewer">Catatan Approval</Label>
                        <Textarea
                          id="note_reviewer"
                          name="note_reviewer"
                          value={data.note_reviewer}
                          onChange={e => setData('note_reviewer', e.target.value)}
                          placeholder="Berikan catatan untuk approval"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dokumen_approved">Dokumen Approval</Label>
                        <Input
                          id="dokumen_approved"
                          name="dokumen_approved"
                          type="file"
                          accept=".pdf"
                          onChange={e => setData('dokumen_approved', e.target.files?.[0] || null)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="foto_dokumentasi_approved">Foto Dokumentasi</Label>
                        <Input
                          id="foto_dokumentasi_approved"
                          name="foto_dokumentasi_approved"
                          type="file"
                          accept="image/*"
                          onChange={e => setData('foto_dokumentasi_approved', e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowActionDialog(false);
                        setActionType(null);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    {actionType && (
                      <Button 
                        type="submit"
                        disabled={processing || !data.note_reviewer}
                        variant={actionType === 'approve' ? 'default' : 'destructive'}
                      >
                        {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
                      </Button>
                    )}
                  </DialogFooter>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pengajuan</DialogTitle>
              <DialogDescription>
                Informasi lengkap tentang pengajuan crowdfunding
              </DialogDescription>
            </DialogHeader>

            {selectedPengajuan && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Informasi Mahasiswa</h4>
                    <div className="space-y-1">
                      <p className="text-sm">Nama: {selectedPengajuan.user.name}</p>
                      <p className="text-sm">Email: {selectedPengajuan.user.email}</p>
                      <p className="text-sm">Tanggal Lahir: {new Date(selectedPengajuan.user.birthdate).toLocaleDateString()}</p>
                      <p className="text-sm">Jenis Kelamin: {selectedPengajuan.user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                      <p className="text-sm">No. Telepon: {selectedPengajuan.user.phone}</p>
                      <p className="text-sm">Agama: {selectedPengajuan.user.religion}</p>
                      <p className="text-sm">Alamat: {selectedPengajuan.user.address}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Informasi Akademik</h4>
                    <div className="space-y-1">
                      {selectedPengajuan.user.mahasiswa ? (
                        <>
                          <p className="text-sm">NIM: {selectedPengajuan.user.mahasiswa.student_id}</p>
                          <p className="text-sm">Universitas: {selectedPengajuan.user.mahasiswa.university_name}</p>
                          <p className="text-sm">Fakultas: {selectedPengajuan.user.mahasiswa.faculty}</p>
                          <p className="text-sm">Program Studi: {selectedPengajuan.user.mahasiswa.study_program}</p>
                          <p className="text-sm">Semester: {selectedPengajuan.user.mahasiswa.current_semester}</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Data akademik tidak tersedia</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Informasi Pengajuan</h4>
                  <div className="space-y-1">
                    <p className="text-sm">Batch: {selectedPengajuan.batch.name}</p>
                    <p className="text-sm">Status: <span className="ml-1">{getStatusBadge(selectedPengajuan.status)}</span></p>
                    <p className="text-sm">Tanggal Pengajuan: {formatDateTime(selectedPengajuan.created_at)}</p>
                    {selectedPengajuan.updated_at !== selectedPengajuan.created_at && (
                      <p className="text-sm">Terakhir Diupdate: {formatDateTime(selectedPengajuan.updated_at)}</p>
                    )}
                    {selectedPengajuan.reviewed_by && (
                      <p className="text-sm">Direview oleh: {selectedPengajuan.reviewed_by}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Catatan Mahasiswa</h4>
                  <p className="text-sm">{selectedPengajuan.note_user}</p>
                </div>

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
                    onClick={() => window.open(route('staff.pengajuan.download', {
                      pengajuan: selectedPengajuan.id,
                      type: 'dokumen_pengajuan'
                    }), '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Dokumen Pengajuan
                  </Button>

                  {selectedPengajuan.status === 'approved' && (
                    <>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => window.open(route('staff.pengajuan.download', {
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
                        onClick={() => window.open(route('staff.pengajuan.download', {
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
    </StaffLayout>
  );
}
