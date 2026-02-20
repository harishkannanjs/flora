'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useEducatorData } from '@/hooks/use-educator-data';
import {
    Users, UserPlus, Mail, MessageSquare,
    Search, Loader2, MoreVertical, FlaskConical
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function EducatorClasses() {
    const { user, profile } = useAuth();
    const { courses, loading, totalEnrolled } = useEducatorData();
    const userName = profile?.name || user?.displayName || 'Educator';

    if (loading) {
        return (
            <DashboardLayout userRole="educator" userName={userName}>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout userRole="educator" userName={userName}>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Class Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage student enrollments and engagement across your courses.
                        </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                        <UserPlus className="w-4 h-4 mr-2" /> Invite Students
                    </Button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 border border-border bg-card flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-foreground">{totalEnrolled}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Active Students</p>
                        </div>
                    </Card>
                    <Card className="p-6 border border-border bg-card flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-foreground">12</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending Questions</p>
                        </div>
                    </Card>
                    <Card className="p-6 border border-border bg-card flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-foreground">100%</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Inbox Response Rate</p>
                        </div>
                    </Card>
                </div>

                {/* Class List by Course */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">Your Classes</h2>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search courses or students..." className="pl-9 h-9 text-sm" />
                        </div>
                    </div>

                    {courses.length === 0 ? (
                        <Card className="p-16 border border-dashed border-border text-center">
                            <FlaskConical className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                            <p className="text-sm text-muted-foreground italic">You haven't created any courses yet. Classes will appear here once you have enrollments.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {courses.map((course) => (
                                <Card key={course.id} className="p-5 border border-border bg-card hover:border-primary/30 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center font-bold text-primary group-hover:bg-primary/5 transition-colors">
                                                {course.title.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground">{course.title}</h3>
                                                <p className="text-xs text-muted-foreground font-medium">Enrolled: <span className="text-primary font-bold">{course.enrolledCount || 0} students</span> • Code: <span className="font-mono bg-muted px-1 rounded uppercase">{course.enrollCode}</span></p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Feature Teaser */}
                <Card className="p-8 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10 overflow-hidden relative">
                    <div className="relative z-10 max-w-lg">
                        <h3 className="text-lg font-bold text-foreground">Advanced Student Tracking</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            Coming Soon: Individual student progress drill-downs, attendance tracking, and AI-powered performance prediction for each of your classes.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <div className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Beta Testing</div>
                            <div className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">Q3 2026</div>
                        </div>
                    </div>
                    <Users className="absolute -right-8 -bottom-8 w-48 h-48 text-primary/5 -rotate-12" />
                </Card>
            </div>
        </DashboardLayout>
    );
}
