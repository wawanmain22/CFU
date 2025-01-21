import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { GraduationCap, Heart, Users, ArrowRight, HandHeart, School, Trophy, Gift, Image, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/Components/ui/carousel";
import { type CarouselApi } from "@/Components/ui/carousel";

interface Donation {
  name: string | null;
  email: string | null;
  phone: string | null;
  amount: number;
  description: string | null;
  created_at: string;
}

interface Batch {
  id: number;
  name: string;
}

interface Pengajuan {
  id: number;
  user: {
    name: string;
  };
  batch: {
    id: number;
    name: string;
  };
  foto_dokumentasi_approved: string;
}

interface Props {
  donations: Donation[];
  batches: Batch[];
  pengajuans: Pengajuan[];
}

export default function Index({ donations, batches, pengajuans }: Props) {
  const [selectedBatch, setSelectedBatch] = useState<number | null>(batches[0]?.id || null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const filteredPengajuans = selectedBatch 
    ? pengajuans.filter(p => p.batch.id === selectedBatch)
    : pengajuans;

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-scroll effect
  useEffect(() => {
    if (!api || count <= 1) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId);
  }, [api, count]);

  const getInitials = (name: string | null) => {
    if (!name) return "OB"; // "Orang Baik"
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDefaultDescription = (name: string | null) => {
    if (!name) return "Semoga bantuan ini bermanfaat untuk pendidikan adik-adik mahasiswa.";
    return null;
  };

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

      {/* Para Donatur Section */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Para Donatur Kami</h2>
            <p className="text-muted-foreground">
              Terima kasih kepada para donatur yang telah berpartisipasi
            </p>
          </div>

          <div className="space-y-6">
            {donations.map((donation, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {(donation.name || "Anonim").charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{donation.name || "Anonim"}</h3>
                      <span className="text-xs text-muted-foreground">
                        • {new Date(donation.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      Rp {new Intl.NumberFormat('id-ID').format(donation.amount)}
                    </p>
                    {donation.description && (
                      <p className="text-sm text-muted-foreground italic">
                        "{donation.description}"
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Divider */}
                {index < donations.length - 1 && (
                  <div className="absolute bottom-0 left-16 right-4 h-px bg-border" />
                )}
              </div>
            ))}

            {donations.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Belum Ada Donatur</h3>
                <p className="text-sm text-muted-foreground">
                  Jadilah yang pertama memberikan donasi
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recipients Gallery Section */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Galeri Penerima Donasi</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Lihat dampak nyata dari donasi Anda
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Select
              value={selectedBatch?.toString()}
              onValueChange={(value) => setSelectedBatch(parseInt(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih Batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredPengajuans.length > 0 ? (
            <div className="mt-8">
              <Carousel
                setApi={setApi}
                className="w-full max-w-5xl mx-auto"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {filteredPengajuans.map((pengajuan) => (
                    <CarouselItem key={pengajuan.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={pengajuan.foto_dokumentasi_approved}
                              alt={`Foto dokumentasi ${pengajuan.user.name}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="mt-4">
                            <h3 className="font-semibold">{pengajuan.user.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {pengajuan.batch.name}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {count > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
              <div className="py-2 text-center text-sm text-muted-foreground">
                Slide {current} dari {count}
              </div>
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-muted-foreground">
                {selectedBatch 
                  ? "Tidak ada penerima donasi untuk batch ini"
                  : "Belum ada penerima donasi"}
              </p>
            </div>
          )}
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
