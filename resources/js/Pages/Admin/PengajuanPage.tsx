import StaffLayout from "@/Layouts/StaffLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function PengajuanPage({ auth }: PageProps) {
  return (
    <StaffLayout user={auth.user}>
      <Head title="Pengajuan Management" />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Pengajuan Management</h2>
        <p className="text-muted-foreground">
          Review and manage student crowdfunding submissions.
        </p>

        {/* Content will be added here */}
        <div className="rounded-lg border p-4">
          <p>Submission list and management interface will be implemented here.</p>
        </div>
      </div>
    </StaffLayout>
  );
}
