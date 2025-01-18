import { Head } from "@inertiajs/react";
import StaffLayout from "@/Layouts/StaffLayout";
import { PageProps } from "@/types";

export default function ProfilePage({
  auth,
}: PageProps<{ auth: { user: { name: string; email: string } } }>) {
  return (
    <StaffLayout
      title="Profile"
      user={auth.user}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences here.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="space-y-1">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{auth.user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{auth.user.email}</p>
            </div>
          </div>

          {/* Password change form can be added here later */}
        </div>
      </div>
    </StaffLayout>
  );
} 