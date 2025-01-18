import { FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
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
import { Mail, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/Components/ui/alert";

interface Props {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ForgotPassword({ flash }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            onSuccess: () => {
                reset('email');
            },
            preserveScroll: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password - Crowd Funding University" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    {flash.success && (
                        <Alert className="mb-4 border-green-500">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={errors.email ? "border-red-500 dark:border-red-500" : ""}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm font-semibold text-red-500 dark:text-red-400 mt-1">{errors.email}</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                disabled={processing}
                                type="submit"
                            >
                                {processing ? 'Processing...' : 'Send Reset Link'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </GuestLayout>
    );
}
