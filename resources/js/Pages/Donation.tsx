import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Heart, CreditCard, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

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

export default function Donation() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'idle' });
  
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

  const { data, setData, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    amount: "",
    description: "",
  });

  // Function to check payment status
  const checkPaymentStatus = async (donation_code: string) => {
    try {
      const response = await axios.get(`/donation/${donation_code}/status`);
      const status = response.data.data.transaction_status;
      
      setPaymentStatus({
        donation_code,
        status: status === 'settlement' ? 'success' 
          : status === 'pending' ? 'pending'
          : status === 'expire' ? 'expired'
          : 'failed',
        message: response.data.data.status_message
      });
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  // Function to cancel payment
  const cancelPayment = async (donation_code: string) => {
    try {
      await axios.post(`/donation/${donation_code}/cancel`);
      setPaymentStatus({
        status: 'idle'
      });
      reset();
    } catch (error) {
      console.error('Error canceling payment:', error);
    }
  };

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
          console.log("Success:", result);
          // Check payment type
          const paymentType = result.payment_type;
          let successMessage = "Pembayaran berhasil! Terima kasih atas donasi Anda.";
          
          // Add specific messages based on payment type
          if (paymentType === 'bank_transfer') {
            successMessage = "Transfer bank berhasil! Terima kasih atas donasi Anda.";
          } else if (paymentType === 'qris') {
            successMessage = "Pembayaran QRIS berhasil! Terima kasih atas donasi Anda.";
          } else if (paymentType === 'cstore') {
            successMessage = "Pembayaran di counter berhasil! Terima kasih atas donasi Anda.";
          }
          
          alert(successMessage);
          // Reset form
          setData({
            name: "",
            email: "",
            phone: "",
            amount: "",
            description: "",
          });
          setIsAnonymous(false);
        },
        onPending: function(result: any) {
          console.log("Pending:", result);
          // Check payment type for specific pending messages
          const paymentType = result.payment_type;
          let pendingMessage = "Menunggu pembayaran Anda!";
          
          if (paymentType === 'bank_transfer') {
            pendingMessage = "Silakan lakukan transfer bank sesuai instruksi yang diberikan.";
          } else if (paymentType === 'cstore') {
            const paymentCode = result.payment_code;
            pendingMessage = `Silakan lakukan pembayaran di Alfamart terdekat.\n\nKode Pembayaran: ${paymentCode}\n\nTunjukkan kode ini ke kasir Alfamart.`;
          }
          
          alert(pendingMessage);
          // Save payment status
          setPaymentStatus({
            status: 'pending',
            donation_code: result.order_id,
            message: pendingMessage
          });
        },
        onError: function(result: any) {
          console.error("Error:", result);
          alert("Pembayaran gagal! Silakan coba lagi.");
        },
        onClose: function() {
          alert("Anda menutup popup sebelum menyelesaikan pembayaran");
        }
      });
    } catch (error: any) {
      console.error("Error:", error.response?.data || error);
      alert("Terjadi kesalahan! Silakan coba lagi.");
    }
  };

  const formatAmount = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  return (
    <GuestLayout>
      <Head title="Donation - CFU" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Payment Status Alert */}
          {paymentStatus.status !== 'idle' && (
            <div className="mb-6">
              <Alert variant={
                paymentStatus.status === 'success' ? 'default' :
                paymentStatus.status === 'pending' ? 'default' :
                'destructive'
              }>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {paymentStatus.status === 'success' ? 'Pembayaran Berhasil' :
                   paymentStatus.status === 'pending' ? 'Menunggu Pembayaran' :
                   paymentStatus.status === 'expired' ? 'Pembayaran Kedaluwarsa' :
                   'Pembayaran Gagal'}
                </AlertTitle>
                <AlertDescription>
                  {paymentStatus.message}
                  {paymentStatus.status === 'pending' && paymentStatus.donation_code && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelPayment(paymentStatus.donation_code!)}
                      className="mt-2"
                    >
                      Batalkan Pembayaran
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

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

