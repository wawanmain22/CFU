import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { GraduationCap, Heart, Users, ArrowRight, HandHeart, School, Trophy } from "lucide-react";

export default function Index() {
  return (
    <GuestLayout>
      <Head title="Welcome to CFU" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="relative z-10 mx-auto max-w-2xl lg:mx-0">
              <div className="relative">
                <h1 className="inline bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                  Crowd Funding University
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  Platform penggalangan dana untuk membantu mahasiswa yang membutuhkan dukungan finansial dalam mengejar pendidikan tinggi mereka.
                </p>
                <div className="mt-8 flex gap-4">
                  <Link href="/donation">
                    <Button size="lg">
                      Donasi Sekarang
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Mengapa CFU?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Platform yang menghubungkan donatur dengan mahasiswa yang membutuhkan
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <blockquote className="relative">
            <div className="relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xl font-medium italic text-muted-foreground">
                  "Pendidikan adalah kunci untuk membuka pintu kesuksesan. Mari bersama-sama membantu mahasiswa yang membutuhkan untuk meraih mimpi mereka melalui pendidikan tinggi."
                </p>
                <footer className="mt-8">
                  <div className="flex items-center justify-center space-x-4 text-base">
                    <HandHeart className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Crowd Funding University</span>
                  </div>
                </footer>
              </div>
            </div>
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-500/80 via-purple-500/80 to-pink-500/80 px-6 py-24 text-center shadow-2xl sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white">
              Jadilah Bagian dari Perubahan
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">
              Setiap donasi Anda membantu mahasiswa untuk tetap melanjutkan pendidikan mereka. Mari bersama menciptakan masa depan yang lebih baik.
            </p>
            <div className="mt-8">
              <Link href="/donation">
                <Button size="lg" variant="secondary">
                  Mulai Berdonasi
                  <Heart className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}

const features = [
  {
    title: "Transparan",
    description: "Proses penggalangan dana yang transparan dan dapat dipertanggungjawabkan.",
    icon: <Users className="h-5 w-5 text-primary" />,
  },
  {
    title: "Terverifikasi",
    description: "Setiap mahasiswa penerima bantuan telah melalui proses verifikasi yang ketat.",
    icon: <School className="h-5 w-5 text-primary" />,
  },
  {
    title: "Dampak Nyata",
    description: "Donasi Anda langsung membantu mahasiswa untuk melanjutkan pendidikan mereka.",
    icon: <Trophy className="h-5 w-5 text-primary" />,
  },
];
