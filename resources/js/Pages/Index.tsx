import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

export default function Index() {
  return (
    <GuestLayout>
      <Head title="Welcome" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Our App</CardTitle>
              <CardDescription>
                This is a sample page to test our theme implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The theme system is working if you can see the dark/light mode toggle in the navigation
                and the colors are changing when you switch themes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </GuestLayout>
  );
}
