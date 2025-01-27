import StaffLayout from "@/Layouts/StaffLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Button } from "@/Components/ui/button";
import { PlusIcon, PencilIcon, SearchIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { useState } from "react";
import { format } from "date-fns";
import AlertSuccess from "@/Components/AlertSuccess";
import AlertError from "@/Components/AlertError";
import { Input } from "@/Components/ui/input";

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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [localFlash, setLocalFlash] = useState(flash);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { post, put } = useForm();

  const filteredBatches = batches.filter((batch) =>
    batch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    post(route('staff.batch.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page: any) => {
        setShowCreateDialog(false);
        setLocalFlash(page.props.flash);
      },
    });
  };

  const handleUpdate = (id: number) => {
    put(route('staff.batch.update', id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page: any) => {
        setSelectedBatchId(null);
        setLocalFlash(page.props.flash);
      },
    });
  };

  return (
    <StaffLayout user={auth.user}>
      <Head title="Batch Management" />
      
      <div className="space-y-4 p-8">
        {localFlash.success && (
          <AlertSuccess message={localFlash.success} />
        )}

        {localFlash.error && (
          <AlertError message={localFlash.error} />
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

        <div className="flex items-center space-x-2 mb-4">
          <SearchIcon className="w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by batch name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
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
              {filteredBatches.map((batch, index) => (
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
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
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
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
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
