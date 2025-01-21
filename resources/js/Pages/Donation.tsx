import { Head, useForm, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Heart, CreditCard, Clock, AlertCircle, Wallet, QrCode, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import AlertSuccess from "@/Components/AlertSuccess";
import AlertError from "@/Components/AlertError";

// Add type definition for page props
interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  flash: {
    success?: string;
    error?: string;
  };
  [key: string]: any; // Add index signature
}

// Declare window type for Midtrans
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

const DONATION_AMOUNTS = [
  { value: 10000, label: "10rb" },
  { value: 20000, label: "20rb" },
  { value: 50000, label: "50rb" },
  { value: 100000, label: "100rb" },
  { value: 500000, label: "500rb" },
  { value: 1000000, label: "1jt" },
];

interface PaymentStatus {
  donation_code?: string;
  status: 'idle' | 'pending' | 'success' | 'failed' | 'expired';
  message?: string;
}

// Add payment methods constant
const PAYMENT_METHODS = [
    {
        id: "direct_debit",
        name: "E-Wallet",
        description: "DANA, GoPay, ShopeePay, OVO",
        icon: <Wallet className="h-6 w-6" />
    },
    {
        id: "va",
        name: "Transfer Bank",
        description: "BCA, BNI, BRI, Mandiri",
        icon: <Building2 className="h-6 w-6" />
    },
    {
        id: "qris",
        name: "QRIS",
        description: "Scan untuk bayar dengan QRIS",
        icon: <QrCode className="h-6 w-6" />
    },
    {
        id: "credit_card",
        name: "Kartu Kredit",
        description: "Visa, Mastercard, JCB",
        icon: <CreditCard className="h-6 w-6" />
    }
];

export default function Donation() {
  const { flash } = usePage<PageProps>().props;
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentStatus] = useState<PaymentStatus>({ status: 'idle' });
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  // Add useEffect to load Midtrans script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Handle flash messages from redirect
  useEffect(() => {
    if (flash.success || flash.error) {
      setAlert({
        type: flash.success ? 'success' : 'error',
        message: flash.success || flash.error || ''
      });

      // Auto dismiss after 1.5 seconds
      const timer = setTimeout(() => {
        setAlert({ type: null, message: '' });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [flash]);

  const { data, setData, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    amount: "",
    description: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format amount to plain number
      const formattedData = {
        ...data,
        amount: parseInt(data.amount.replace(/\D/g, ""))
      };

      // If anonymous, clear personal info
      const submitData = isAnonymous 
        ? { ...formattedData, name: "", email: "", phone: "" } 
        : formattedData;

      // Get SNAP token from backend
      const response = await axios.post("/donation", submitData);
      const snapToken = response.data.snap_token;

      // Show SNAP popup
      window.snap.pay(snapToken, {
        onSuccess: function(result: any) {
          // console.log("Success Response:", result);
          reset();
          setIsAnonymous(false);
          setAlert({
            type: 'success',
            message: 'Pembayaran berhasil! Terima kasih atas donasi Anda.'
          });
        },
        onPending: function(result: any) {
          // console.log("Pending Response:", result);
          setAlert({
            type: 'success',
            message: 'Silakan selesaikan pembayaran sesuai instruksi yang diberikan.'
          });
        },
        onError: function(result: any) {
          // console.error("Error Response:", result);
          setAlert({
            type: 'error',
            message: 'Pembayaran gagal: ' + result.status_message
          });
        },
        onClose: function() {
          // console.log("Customer closed the popup without finishing the payment");
        }
      });
    } catch (error: any) {
      // console.error("Error:", error.response?.data || error);
      setAlert({
        type: 'error',
        message: 'Terjadi kesalahan: ' + (error.response?.data?.message || 'Silakan coba lagi')
      });
    }
  };

  const formatAmount = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  return (
    <GuestLayout>
      <Head title="Donation - CFU" />

      {alert.type === 'success' && (
        <AlertSuccess
          message={alert.message}
          onClose={() => setAlert({ type: null, message: '' })}
        />
      )}

      {alert.type === 'error' && (
        <AlertError
          message={alert.message}
          onClose={() => setAlert({ type: null, message: '' })}
        />
      )}

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Form Donasi
                </CardTitle>
                <CardDescription>
                  Bantu mahasiswa mencapai impian mereka melalui pendidikan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anonymous" className="font-medium">
                      Donasi Tanpa Identitas
                    </Label>
                    <Switch
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                  </div>

                  {!isAnonymous && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                          id="name"
                          value={data.name}
                          onChange={e => setData('name', e.target.value)}
                          placeholder="Masukkan nama Anda"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={data.email}
                          onChange={e => setData('email', e.target.value)}
                          placeholder="Masukkan email Anda"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor HP</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={data.phone}
                          onChange={e => setData('phone', e.target.value.replace(/\D/g, ""))}
                          placeholder="Masukkan nomor HP Anda"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="amount">Nominal Donasi</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {DONATION_AMOUNTS.map((amount) => (
                        <Button
                          key={amount.value}
                          type="button"
                          variant={data.amount === amount.value.toString() ? "default" : "outline"}
                          onClick={() => setData('amount', amount.value.toString())}
                          className="w-full"
                        >
                          Rp {amount.label}
                        </Button>
                      ))}
                    </div>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        Rp
                      </span>
                      <Input
                        id="amount"
                        value={data.amount ? formatAmount(data.amount) : ""}
                        onChange={e => setData('amount', e.target.value.replace(/\D/g, ""))}
                        className="pl-10"
                        placeholder="Nominal lainnya"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Pesan (Opsional)</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      placeholder="Tulis pesan dukungan Anda"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={paymentStatus.status !== 'idle'}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Lanjutkan Pembayaran
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Donation Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Tata Cara Donasi
                </CardTitle>
                <CardDescription>
                  Ikuti langkah-langkah berikut untuk melakukan donasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {donationSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
const donationSteps = [
  {
    title: "Isi Form Donasi",
    description: "Lengkapi form donasi dengan data diri (opsional) dan nominal donasi yang diinginkan.",
  },
  {
    title: "Pilih Metode Pembayaran",
    description: "Pilih metode pembayaran yang tersedia melalui Midtrans (Transfer Bank, E-Wallet, dll).",
  },
  {
    title: "Lakukan Pembayaran",
    description: "Ikuti instruksi pembayaran sesuai metode yang dipilih.",
  },
  {
    title: "Konfirmasi Otomatis",
    description: "Sistem akan otomatis mengkonfirmasi donasi Anda setelah pembayaran berhasil.",
  },
];

