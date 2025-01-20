import { useEffect, FormEventHandler, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
import { GraduationCap, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Login - CrowdFunding University" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2">
                            <GraduationCap className="h-6 w-6" />
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Login to your account to continue your crowdfunding journey
                        </CardDescription>
                    </CardHeader>
                    {errors.email && (
                        <div className="px-6">
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="ml-6 text-base font-medium">
                                    {errors.email}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
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
                                        className="mt-1 block w-full pr-10"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-primary shadow-sm focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
                                </label>

                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-primary hover:text-primary/80"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button 
                                className="w-full" 
                                disabled={processing}
                                type="submit"
                            >
                                Log in
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-semibold text-primary hover:text-primary/80"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </GuestLayout>
    );
}
