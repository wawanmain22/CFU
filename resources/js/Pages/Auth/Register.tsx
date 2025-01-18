import { FormEventHandler, useState, useEffect } from 'react';
import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { GraduationCap, User, Mail, Lock, Calendar, Phone, Home, School, Building2, BookOpen, Cross, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { DatePicker } from "@/Components/ui/date-picker";
import { PageProps } from '@/types';

interface Props extends PageProps {
    flash: {
        success?: string;
        error?: string;
    };
}

// Definisi tipe untuk fakultas dan program studi
type Faculty = {
    name: string;
    programs: string[];
};

// Data fakultas dan program studi
const faculties: Faculty[] = [
    {
        name: "Fakultas Teknik",
        programs: [
            "Teknik Informatika",
            "Sistem Informasi",
            "Teknik Sipil",
            "Teknik Elektro",
            "Teknik Mesin",
            "Teknik Industri",
            "Teknik Kimia",
            "Teknik Arsitektur",
            "Teknik Lingkungan",
            "Teknik Geologi",
            "Teknik Pertambangan",
            "Teknik Perkapalan",
            "Teknik Komputer",
            "Teknik Telekomunikasi"
        ]
    },
    {
        name: "Fakultas Ekonomi dan Bisnis",
        programs: [
            "Manajemen",
            "Akuntansi",
            "Ilmu Ekonomi",
            "Ekonomi Pembangunan",
            "Bisnis Digital",
            "Keuangan dan Perbankan",
            "Ekonomi Syariah"
        ]
    },
    {
        name: "Fakultas Kedokteran",
        programs: [
            "Pendidikan Dokter",
            "Keperawatan",
            "Kebidanan",
            "Kesehatan Masyarakat",
            "Gizi",
            "Farmasi",
            "Kedokteran Gigi"
        ]
    },
    {
        name: "Fakultas Hukum",
        programs: [
            "Ilmu Hukum",
            "Hukum Bisnis",
            "Hukum Internasional",
            "Hukum Tata Negara"
        ]
    },
    {
        name: "Fakultas Ilmu Sosial dan Politik",
        programs: [
            "Ilmu Politik",
            "Hubungan Internasional",
            "Administrasi Publik",
            "Administrasi Bisnis",
            "Sosiologi",
            "Antropologi",
            "Ilmu Komunikasi",
            "Ilmu Pemerintahan"
        ]
    },
    {
        name: "Fakultas Psikologi",
        programs: [
            "Psikologi",
            "Psikologi Klinis",
            "Psikologi Industri dan Organisasi"
        ]
    },
    {
        name: "Fakultas Pertanian",
        programs: [
            "Agribisnis",
            "Agroteknologi",
            "Ilmu Tanah",
            "Proteksi Tanaman",
            "Teknologi Pangan",
            "Peternakan",
            "Kehutanan"
        ]
    },
    {
        name: "Fakultas Pendidikan",
        programs: [
            "Pendidikan Guru Sekolah Dasar",
            "Pendidikan Anak Usia Dini",
            "Pendidikan Matematika",
            "Pendidikan Bahasa Inggris",
            "Pendidikan Bahasa Indonesia",
            "Pendidikan Biologi",
            "Pendidikan Fisika",
            "Pendidikan Kimia",
            "Bimbingan dan Konseling"
        ]
    },
    {
        name: "Fakultas Ilmu Budaya",
        programs: [
            "Sastra Indonesia",
            "Sastra Inggris",
            "Sastra Jepang",
            "Sastra Mandarin",
            "Sejarah",
            "Arkeologi",
            "Ilmu Perpustakaan"
        ]
    },
    {
        name: "Fakultas Seni dan Desain",
        programs: [
            "Desain Komunikasi Visual",
            "Desain Interior",
            "Seni Rupa",
            "Seni Musik",
            "Seni Tari",
            "Fotografi",
            "Animasi"
        ]
    },
    {
        name: "Fakultas MIPA",
        programs: [
            "Matematika",
            "Fisika",
            "Kimia",
            "Biologi",
            "Statistika",
            "Geofisika",
            "Astronomi"
        ]
    },
    {
        name: "Fakultas Perikanan dan Ilmu Kelautan",
        programs: [
            "Ilmu Kelautan",
            "Perikanan",
            "Teknologi Hasil Perikanan",
            "Budidaya Perairan",
            "Manajemen Sumberdaya Perairan"
        ]
    },
    {
        name: "Fakultas Pariwisata",
        programs: [
            "Perhotelan",
            "Manajemen Pariwisata",
            "Usaha Perjalanan Wisata",
            "Kuliner"
        ]
    },
    {
        name: "Fakultas Kedokteran Hewan",
        programs: [
            "Kedokteran Hewan",
            "Teknologi Veteriner"
        ]
    },
    {
        name: "Fakultas Farmasi",
        programs: [
            "Farmasi",
            "Analisis Farmasi",
            "Farmasi Klinis"
        ]
    }
];

export default function Register({ flash }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (flash.success) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.visit(route('login'));
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [flash.success]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        birthdate: '',
        gender: '',
        phone: '',
        religion: '',
        address: '',
        student_id: '',
        university_name: '',
        faculty: '',
        study_program: '',
        current_semester: '',
    });

    // State untuk menyimpan program studi yang tersedia berdasarkan fakultas yang dipilih
    const [availablePrograms, setAvailablePrograms] = React.useState<string[]>([]);

    // Update program studi ketika fakultas berubah
    const handleFacultyChange = (value: string) => {
        setData('faculty', value);
        setData('study_program', ''); // Reset program studi
        const faculty = faculties.find(f => f.name === value);
        setAvailablePrograms(faculty?.programs || []);
    };

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.password !== data.password_confirmation) {
            setData('password_confirmation', '');
            return;
        }

        post(route('register.store'), {
            onSuccess: () => {
                console.log('Registration successful');
            },
            onError: (errors) => {
                console.error('Registration failed:', errors);
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Register - Crowd Funding University" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-4xl">
                    {flash.success && (
                        <Alert className="mb-4 border-green-500">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription>
                                {flash.success} Redirecting to login in {countdown} seconds...
                            </AlertDescription>
                        </Alert>
                    )}
                    {flash.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2">
                            <GraduationCap className="h-6 w-6" />
                            Join Crowd Funding University
                        </CardTitle>
                        <CardDescription>
                            Fill in your information to create an account and start your crowdfunding journey
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="h-4 w-4" /> Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" /> Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className={errors.password ? "border-red-500 dark:border-red-500 pr-10" : "pr-10"}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-sm font-semibold text-red-500 dark:text-red-400 mt-1">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" /> Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className={errors.password_confirmation || (data.password && data.password_confirmation && data.password !== data.password_confirmation) ? "border-red-500 dark:border-red-500 pr-10" : "pr-10"}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mt-1">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                    {data.password && data.password_confirmation && data.password !== data.password_confirmation && (
                                        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mt-1">
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="birthdate" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Birthdate
                                    </Label>
                                    <DatePicker
                                        value={data.birthdate ? new Date(data.birthdate) : undefined}
                                        onChange={(date) => setData('birthdate', date ? date.toISOString().split('T')[0] : '')}
                                    />
                                    {errors.birthdate && <p className="text-sm text-destructive">{errors.birthdate}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender" className="flex items-center gap-2">
                                        <User className="h-4 w-4" /> Gender
                                    </Label>
                                    <Select name="gender" onValueChange={(value) => setData('gender', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="student_id" className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" /> Student ID
                                    </Label>
                                    <Input
                                        id="student_id"
                                        name="student_id"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        required
                                    />
                                    {errors.student_id && <p className="text-sm text-destructive">{errors.student_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="university_name" className="flex items-center gap-2">
                                        <School className="h-4 w-4" /> University Name
                                    </Label>
                                    <Input
                                        id="university_name"
                                        name="university_name"
                                        value={data.university_name}
                                        onChange={(e) => setData('university_name', e.target.value)}
                                        required
                                    />
                                    {errors.university_name && <p className="text-sm text-destructive">{errors.university_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="faculty" className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4" /> Faculty
                                    </Label>
                                    <Select name="faculty" onValueChange={handleFacultyChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select faculty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {faculties.map((faculty) => (
                                                <SelectItem key={faculty.name} value={faculty.name}>
                                                    {faculty.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.faculty && <p className="text-sm text-destructive">{errors.faculty}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="study_program" className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Study Program
                                    </Label>
                                    <Select 
                                        name="study_program" 
                                        onValueChange={(value) => setData('study_program', value)}
                                        disabled={!data.faculty}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={data.faculty ? "Select study program" : "Please select faculty first"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availablePrograms.map((program) => (
                                                <SelectItem key={program} value={program}>
                                                    {program}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.study_program && <p className="text-sm text-destructive">{errors.study_program}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="current_semester" className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Current Semester
                                    </Label>
                                    <Input
                                        id="current_semester"
                                        type="number"
                                        name="current_semester"
                                        value={data.current_semester}
                                        onChange={(e) => setData('current_semester', e.target.value)}
                                        required
                                    />
                                    {errors.current_semester && <p className="text-sm text-destructive">{errors.current_semester}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                    />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="religion" className="flex items-center gap-2">
                                        <Cross className="h-4 w-4" /> Religion
                                    </Label>
                                    <Select name="religion" onValueChange={(value) => setData('religion', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="islam">Islam</SelectItem>
                                            <SelectItem value="christian">Christian</SelectItem>
                                            <SelectItem value="catholic">Catholic</SelectItem>
                                            <SelectItem value="hindu">Hindu</SelectItem>
                                            <SelectItem value="buddha">Buddha</SelectItem>
                                            <SelectItem value="konghucu">Konghucu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.religion && <p className="text-sm text-destructive">{errors.religion}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="flex items-center gap-2">
                                        <Home className="h-4 w-4" /> Address
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        required
                                    />
                                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button 
                                className="w-full" 
                                disabled={processing}
                                type="submit"
                            >
                                {processing ? 'Processing...' : 'Register'}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-primary hover:text-primary/80"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </GuestLayout>
    );
}
