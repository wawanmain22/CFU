import { Link } from "@inertiajs/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu";
import { ModeToggle } from "@/Components/mode-toggle";
import { Button } from "@/Components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 border-b z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold">
                CFU
              </Link>
              {/* Desktop Navigation Menu */}
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/" className={navigationMenuTriggerStyle()}>
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/donation" className={navigationMenuTriggerStyle()}>
                        Donation
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/about" className={navigationMenuTriggerStyle()}>
                        About Us
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <div className="hidden md:flex gap-3">
                <Link href="/register">
                  <Button variant="default">Sign Up</Button>
                </Link>
                <Link href="/login">
                  <Button variant="default">Sign In</Button>
                </Link>
              </div>
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetHeader className="text-left">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigation menu for mobile devices
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                    <div className="flex flex-col space-y-3">
                      <Link
                        href="/"
                        className="flex items-center py-2 text-sm font-medium"
                      >
                        Home
                      </Link>
                      <Link
                        href="/donation"
                        className="flex items-center py-2 text-sm font-medium"
                      >
                        Donation
                      </Link>
                      <Link
                        href="/about"
                        className="flex items-center py-2 text-sm font-medium"
                      >
                        About Us
                      </Link>
                      <div className="my-3 h-px bg-border" />
                      <Link href="/register" className="w-full">
                        <Button className="w-full" variant="default">
                          Sign Up
                        </Button>
                      </Link>
                      <Link href="/login" className="w-full">
                        <Button className="w-full" variant="default">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">{children}</main>
    </div>
  );
}
