import { FormEventHandler, useState, useEffect } from 'react';
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
import { Mail, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';

interface Props extends PageProps {
    token: string;
    email: string;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function FormResetPassword({ token, email, flash }: Props) {
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

    const { data, setData, post, processing, errors } = useForm({
        email: email,
        password: '',
        password_confirmation: '',
        token: token,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.password !== data.password_confirmation) {
            setData('password_confirmation', '');
            return;
        }

        post(route('password.update'), {
            preserveScroll: true
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password - Crowd Funding University" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    {flash.success && (
                        <Alert className="mb-4 border-green-500">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription>
                                {flash.success} Redirecting to login in {countdown} seconds...
                            </AlertDescription>
                        </Alert>
                    )}
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Please enter your new password
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="bg-gray-100 dark:bg-gray-800"
                                        readOnly
                                    />
                                    {errors.email && (
                                        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" /> New Password
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
                                    {errors.password && (
                                        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" /> Confirm New Password
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
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                disabled={processing || (data.password !== data.password_confirmation)}
                                type="submit"
                            >
                                {processing ? 'Processing...' : 'Reset Password'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </GuestLayout>
    );
}
