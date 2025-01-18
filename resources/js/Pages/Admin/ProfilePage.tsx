import StaffLayout from "@/Layouts/StaffLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function ProfilePage({ auth }: PageProps) {
  return (
    <StaffLayout user={auth.user}>
      <Head title="Profile Settings" />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>

        {/* Content will be added here */}
        <div className="rounded-lg border p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Personal Information</h3>
              <p className="text-muted-foreground">Name: {auth.user.name}</p>
              <p className="text-muted-foreground">Email: {auth.user.email}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Security</h3>
              <p className="text-muted-foreground">Password change form will be implemented here.</p>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
