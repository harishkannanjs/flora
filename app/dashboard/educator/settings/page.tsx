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
    User, Mail, Shield, Bell, GraduationCap,
    Save, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function EducatorSettings() {
    const { user, profile } = useAuth();
    const [name, setName] = useState(profile?.name || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const userName = profile?.name || user?.displayName || 'Educator';

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
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardLayout userRole="educator" userName={userName}>
            <div className="max-w-4xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Educator Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Configure your educator profile and institutional details.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                        {[
                            { label: 'Profile', icon: <User className="w-4 h-4" />, active: true },
                            { label: 'Institution', icon: <GraduationCap className="w-4 h-4" />, active: false },
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

                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6 border border-border bg-card">
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-border pb-6">
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl ring-4 ring-background border border-primary/10 transition-all">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-lg">Educator Profile</h3>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Verified Educator Account
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Dr. Jane Smith"
                                            disabled={loading}
                                        />
                                        <p className="text-[10px] text-muted-foreground">This name will be shown to all your students.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-muted/50 cursor-not-allowed border-dashed"
                                        />
                                    </div>

                                    <div className="space-y-2 opacity-60">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <textarea
                                            id="bio"
                                            rows={3}
                                            placeholder="Share your expertise in biotechnology..."
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none cursor-not-allowed"
                                            disabled
                                        />
                                        <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Bio updates are currently available in the Researcher tier.
                                        </p>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success'
                                            ? 'bg-green-500/5 text-green-600 border-green-500/20'
                                            : 'bg-destructive/5 text-destructive border-destructive/20'
                                        }`}>
                                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {message.text}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white gap-2 px-6" disabled={loading || name === profile?.name}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Update Educator Profile
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <Card className="p-6 border border-border bg-card border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-foreground">Institutional Access</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Configure your university or laboratory affiliation.</p>
                                </div>
                                <div className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-bold rounded uppercase">Coming Soon</div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
