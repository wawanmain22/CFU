import StaffLayout from "@/Layouts/StaffLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Batch {
  id: number;
  name: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string | null;
}

interface Props extends PageProps {
  batches: Batch[];
  flash: {
    success?: string;
    error?: string;
  };
}

export default function BatchPage({ auth, batches, flash }: Props) {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  
  const { post, put } = useForm();

  useEffect(() => {
    if (flash.success) {
      setShowSuccessAlert(true);
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }
    if (flash.error) {
      setShowErrorAlert(true);
      const timer = setTimeout(() => setShowErrorAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleCreate = () => {
    post(route('staff.batch.store'));
    setShowCreateDialog(false);
  };

  const handleUpdate = (id: number) => {
    put(route('staff.batch.update', id));
    setSelectedBatchId(null);
  };

  return (
    <StaffLayout user={auth.user}>
      <Head title="Batch Management" />
      
      <div className="space-y-4">
        {showSuccessAlert && flash.success && (
          <Alert className="border-2 border-green-500 bg-green-100 dark:bg-transparent dark:border-green-500">
            <AlertDescription className="text-green-800 font-medium dark:text-green-400">
              {flash.success}
            </AlertDescription>
          </Alert>
        )}

        {showErrorAlert && flash.error && (
          <Alert className="border-2 border-red-500 bg-red-100 dark:bg-transparent dark:border-red-500">
            <AlertDescription className="text-red-800 font-medium dark:text-red-400">
              {flash.error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Batch Management</h2>
            <p className="text-muted-foreground">
              Manage crowdfunding batches and their settings.
            </p>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Data Batch
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Tanggal Diperbarui</TableHead>
                <TableHead className="w-16">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch, index) => (
                <TableRow key={batch.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      batch.status === 'open' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-400/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-400/20 dark:text-gray-400'
                    }`}>
                      {batch.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(batch.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
                  <TableCell>
                    {(() => {
                      return batch.updated_at === null ? (
                        <span className="text-muted-foreground text-sm">On Open</span>
                      ) : (
                        format(new Date(batch.updated_at), 'dd MMM yyyy HH:mm')
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => batch.status === 'open' && setSelectedBatchId(batch.id)}
                      disabled={batch.status === 'closed'}
                      className={batch.status === 'closed' ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Batch Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tambah Data Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membuat batch baru? Pastikan tidak ada batch yang masih terbuka.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreate}>
              Tambah
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Batch Dialog */}
      <AlertDialog 
        open={selectedBatchId !== null} 
        onOpenChange={(open) => !open && setSelectedBatchId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tutup Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menutup batch ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedBatchId && handleUpdate(selectedBatchId)}
            >
              Tutup Batch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </StaffLayout>
  );
}
