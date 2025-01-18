import StaffLayout from "@/Layouts/StaffLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function BatchPage({ auth }: PageProps) {
  return (
    <StaffLayout user={auth.user}>
      <Head title="Batch Management" />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Batch Management</h2>
        <p className="text-muted-foreground">
          Manage crowdfunding batches and their settings.
        </p>

        {/* Content will be added here */}
        <div className="rounded-lg border p-4">
          <p>Batch content will be implemented here.</p>
        </div>
      </div>
    </StaffLayout>
  );
}
