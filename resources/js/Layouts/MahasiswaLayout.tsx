import { PropsWithChildren, useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import { ModeToggle } from "@/Components/mode-toggle";

export default function MahasiswaLayout({
  children,
  title,
  user,
}: PropsWithChildren<{
  title?: string;
  user: {
    name: string;
    email: string;
  };
}>) {
  // Get initial collapsed state from localStorage or default to false
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-background">
      <Head title={title} />
      <div className="flex">
        {/* Sidebar for desktop */}
        <aside
          className={cn(
            "hidden lg:flex h-screen border-r bg-sidebar-background fixed",
            "transition-[width] duration-300 ease-in-out",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex w-full flex-col">
            <div className="flex h-14 items-center border-b px-3 justify-between">
              <span className={cn(
                "text-lg font-semibold",
                "transition-[opacity,width] duration-300 ease-in-out",
                collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}>
                Student Panel
              </span>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12 p-0",
                  collapsed && "w-16 ml-0",
                  "transition-[width,margin] duration-300 ease-in-out"
                )}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-6 w-6 transition-transform duration-300" />
                ) : (
                  <ChevronLeft className="h-6 w-6 transition-transform duration-300" />
                )}
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className={cn(
                "flex flex-col gap-4",
                "transition-[padding] duration-300 ease-in-out",
                collapsed ? "px-0" : "px-2"
              )}>
                <div className="space-y-1">
                  <Link href={route('student.dashboard')} as="div">
                    <div
                      className={cn(
                        "flex items-center w-full py-1.5 text-sm font-medium rounded-md",
                        "transition-all duration-200 ease-in-out",
                        "hover:bg-accent hover:text-accent-foreground",
                        collapsed ? "px-5 justify-center" : "px-2",
                        route().current('student.dashboard') && "bg-sidebar-accent"
                      )}
                    >
                      <LayoutDashboard className={cn(
                        "h-4 w-4",
                        collapsed ? "" : "min-w-[16px]"
                      )} />
                      <span className={cn(
                        "ml-2 transition-all duration-300",
                        collapsed ? "hidden" : "inline-flex"
                      )}>
                        Dashboard
                      </span>
                    </div>
                  </Link>
                  <Link href={route('student.pengajuan')} as="div">
                    <div
                      className={cn(
                        "flex items-center w-full py-1.5 text-sm font-medium rounded-md",
                        "transition-all duration-200 ease-in-out",
                        "hover:bg-accent hover:text-accent-foreground",
                        collapsed ? "px-5 justify-center" : "px-2",
                        route().current('student.pengajuan') && "bg-sidebar-accent"
                      )}
                    >
                      <ClipboardList className={cn(
                        "h-4 w-4",
                        collapsed ? "" : "min-w-[16px]"
                      )} />
                      <span className={cn(
                        "ml-2 transition-all duration-300",
                        collapsed ? "hidden" : "inline-flex"
                      )}>
                        Pengajuan Saya
                      </span>
                    </div>
                  </Link>
                  <Link href={route('student.profile')} as="div">
                    <div
                      className={cn(
                        "flex items-center w-full py-1.5 text-sm font-medium rounded-md",
                        "transition-all duration-200 ease-in-out",
                        "hover:bg-accent hover:text-accent-foreground",
                        collapsed ? "px-5 justify-center" : "px-2",
                        route().current('student.profile') && "bg-sidebar-accent"
                      )}
                    >
                      <Settings className={cn(
                        "h-4 w-4",
                        collapsed ? "" : "min-w-[16px]"
                      )} />
                      <span className={cn(
                        "ml-2 transition-all duration-300",
                        collapsed ? "hidden" : "inline-flex"
                      )}>
                        Profile
                      </span>
                    </div>
                  </Link>
                  <Link href={route('logout')} method="post" as="div">
                    <div className={cn(
                      "flex items-center w-full py-1.5 text-sm font-medium rounded-md",
                      "transition-all duration-200 ease-in-out",
                      "hover:bg-accent hover:text-accent-foreground",
                      collapsed ? "px-5 justify-center" : "px-2",
                      route().current('logout') && "bg-sidebar-accent",
                      "text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900",
                      "mt-4"
                    )}>
                      <LogOut className={cn(
                        "h-4 w-4",
                        collapsed ? "" : "min-w-[16px]"
                      )} />
                      <span className={cn(
                        "ml-2 transition-all duration-300",
                        collapsed ? "hidden" : "inline-flex"
                      )}>
                        Logout
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Main content wrapper with padding for fixed sidebar */}
        <div className={cn(
          "flex-1",
          "transition-[margin] duration-300 ease-in-out",
          "lg:ml-64",
          collapsed && "lg:ml-16"
        )}>
          <header className="flex h-14 items-center border-b px-4 lg:px-6">
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>

        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 lg:hidden fixed left-4 top-3"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar-background p-0">
            <SheetHeader className="h-14 border-b px-3">
              <SheetTitle>Dashboard</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-2">
                <div className="space-y-1">
                  <Link href={route('student.dashboard')} as="div">
                    <div
                      className={cn(
                        "flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-md",
                        "transition-all duration-200 ease-in-out",
                        "hover:bg-accent hover:text-accent-foreground",
                        route().current('student.dashboard') && "bg-sidebar-accent"
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </div>
                  </Link>
                  <Link href={route('student.pengajuan')} as="div">
                    <div
                      className={cn(
                        "flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-md",
                        "transition-all duration-200 ease-in-out",
                        "hover:bg-accent hover:text-accent-foreground",
                        route().current('student.pengajuan') && "bg-sidebar-accent"
                      )}
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Pengajuan Saya
                    </div>
                  </Link>
                  <Link href={route('student.profile')} as="div">
                    <div
                      className={cn(
                        "flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-md",
                        "transition-all duration-200 ease-in-out",
                        "hover:bg-accent hover:text-accent-foreground",
                        route().current('student.profile') && "bg-sidebar-accent"
                      )}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile
                    </div>
                  </Link>
                  <Link href={route('logout')} method="post" as="div">
                    <div className={cn(
                      "flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-md",
                      "transition-all duration-200 ease-in-out",
                      "text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
                    )}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
