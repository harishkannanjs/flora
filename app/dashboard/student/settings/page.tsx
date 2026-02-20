'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { updateUserProfile } from '@/lib/firestore';
import {
    User, Mail, Shield, Bell,
    Save, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function StudentSettings() {
    const { user, profile } = useAuth();
    const [name, setName] = useState(profile?.name || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const userName = profile?.name || user?.displayName || 'Student';

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        if (!name.trim()) {
            setMessage({ type: 'error', text: 'Name cannot be empty.' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            await updateUserProfile(user.uid, { name: name.trim() });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardLayout userRole="student" userName={userName}>
            <div className="max-w-4xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar Tabs (Visual only for now) */}
                    <div className="space-y-1">
                        {[
                            { label: 'Profile', icon: <User className="w-4 h-4" />, active: true },
                            { label: 'Account', icon: <Mail className="w-4 h-4" />, active: false },
                            { label: 'Security', icon: <Shield className="w-4 h-4" />, active: false },
                            { label: 'Notifications', icon: <Bell className="w-4 h-4" />, active: false },
                        ].map((tab) => (
                            <button
                                key={tab.label}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab.active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6 border border-border bg-card">
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-border pb-6">
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Profile Picture</h3>
                                        <p className="text-xs text-muted-foreground mt-1">Avatar is based on your name initials.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2 opacity-70">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-muted cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> Email cannot be changed here.
                                        </p>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
                                        }`}>
                                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {message.text}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white gap-2" disabled={loading || name === profile?.name}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <Card className="p-6 border border-border bg-card space-y-4">
                            <div>
                                <h3 className="font-bold text-foreground">Membership</h3>
                                <p className="text-sm text-muted-foreground mt-1">You are currently on the <span className="text-primary font-bold">Standard Student Plan</span>.</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs border-primary/30 text-primary hover:bg-primary/5">
                                Upgrade to Researcher Pro
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
