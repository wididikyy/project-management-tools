'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<LoginFormValues>({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState<Partial<LoginFormValues>>({});
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validateForm = () => {
        const result = loginSchema.safeParse(formValues);
        if (!result.success) {
            const errors: Partial<LoginFormValues> = {};
            result.error.errors.forEach((err) => {
                errors[err.path[0] as keyof LoginFormValues] = err.message;
            });
            setFormErrors(errors);
            return false;
        }
        setFormErrors({});
        return true;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true); // Start loading
        const result = await signIn('credentials', {
            redirect: false,
            email: formValues.email,
            password: formValues.password,
        });

        setIsLoading(false); // End loading

        if (result?.error) {
            setError('Invalid email or password');
        } else {
            const session = await getSession();
            if (session?.user?.role === 'admin') {
                router.push('/admin');
            } else if (session?.user?.role === 'member') {
                router.push('/member');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formValues.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                            {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formValues.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                            {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full">
                        Don`t have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}