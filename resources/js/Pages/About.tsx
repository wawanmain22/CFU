import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Users, Code2, Laptop2, GraduationCap, Rocket, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <GuestLayout>
      <Head title="About Us - CFU" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Tim Dibalik{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Crowd Funding University
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Kami adalah sekelompok mahasiswa yang berkomitmen untuk membantu sesama mahasiswa dalam mengejar pendidikan tinggi mereka.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card 
                key={member.name} 
                className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-75 blur transition-all duration-300 group-hover:opacity-100" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-muted transition-transform duration-300 hover:scale-110">
                        {member.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-b from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8">
            <div className="relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold">Misi Kami</h2>
                <p className="mt-6 text-lg text-muted-foreground">
                  Kami percaya bahwa setiap mahasiswa berhak mendapatkan kesempatan untuk mengejar pendidikan tinggi tanpa terkendala masalah finansial. Melalui platform ini, kami berkomitmen untuk:
                </p>
                <ul className="mt-8 space-y-4 text-left text-muted-foreground">
                  <li className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="rounded-full bg-primary/10 p-1">
                        <Rocket className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p>Membangun platform crowdfunding yang transparan dan terpercaya</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="rounded-full bg-primary/10 p-1">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p>Menghubungkan donatur dengan mahasiswa yang membutuhkan</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="rounded-full bg-primary/10 p-1">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p>Membantu mahasiswa mencapai impian mereka melalui pendidikan</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}

const teamMembers = [
  {
    name: "Ridwan",
    role: "Project Lead & Backend Developer",
    description: "Mengkoordinasikan tim dan mengembangkan backend sistem dengan Laravel.",
    icon: <Code2 className="h-12 w-12 text-primary" />,
  },
  {
    name: "Rangga",
    role: "Frontend Developer",
    description: "Membangun antarmuka pengguna yang menarik dan responsif dengan React.",
    icon: <Laptop2 className="h-12 w-12 text-primary" />,
  },
  {
    name: "Darwan",
    role: "Backend Developer",
    description: "Mengembangkan fitur-fitur backend dan API untuk platform.",
    icon: <Code2 className="h-12 w-12 text-primary" />,
  },
  {
    name: "Faris",
    role: "UI/UX Designer",
    description: "Merancang pengalaman pengguna yang intuitif dan menarik.",
    icon: <Lightbulb className="h-12 w-12 text-primary" />,
  },
  {
    name: "Fadly",
    role: "Frontend Developer",
    description: "Mengimplementasikan desain ke dalam kode yang bersih dan efisien.",
    icon: <Laptop2 className="h-12 w-12 text-primary" />,
  },
  {
    name: "Dhika",
    role: "Full Stack Developer",
    description: "Mengembangkan fitur-fitur full stack untuk platform.",
    icon: <Code2 className="h-12 w-12 text-primary" />,
  },
];
