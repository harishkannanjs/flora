'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, UserRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, GraduationCap, BookOpen, Microscope } from 'lucide-react';

const ROLES: { value: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
    {
        value: 'student',
        label: 'Student',
        description: 'Learn biotechnology through adaptive challenges',
        icon: <GraduationCap className="w-5 h-5" />,
    },
    {
        value: 'educator',
        label: 'Educator',
        description: 'Create and manage courses for your students',
        icon: <BookOpen className="w-5 h-5" />,
    },
    {
        value: 'researcher',
        label: 'Researcher',
        description: 'Access advanced analytics and simulations',
        icon: <Microscope className="w-5 h-5" />,
    },
];

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            await signUp({ name, email, password, role });
            router.push(`/dashboard/${role}`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to create account';
            setError(
                msg.includes('email-already-in-use')
                    ? 'An account with this email already exists.'
                    : msg.includes('invalid-email')
                        ? 'Please enter a valid email address.'
                        : 'Failed to create account. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg space-y-6">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="text-primary font-bold text-xl">F</span>
                        </div>
                        <span className="font-semibold text-xl text-foreground">Flora</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                    <p className="text-muted-foreground text-sm">Join Flora and start your journey</p>
                </div>

                <Card className="p-6 space-y-5 border border-border shadow-sm">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Hari Kumar"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label>I am a…</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {ROLES.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        disabled={loading}
                                        className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-all ${role === r.value
                                            ? 'border-primary bg-primary/5 text-foreground'
                                            : 'border-border hover:border-primary/50 text-muted-foreground'
                                            }`}
                                    >
                                        <span className={role === r.value ? 'text-primary' : ''}>{r.icon}</span>
                                        <span className="font-medium text-sm text-foreground">{r.label}</span>
                                        <span className="text-xs text-muted-foreground leading-tight">{r.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
