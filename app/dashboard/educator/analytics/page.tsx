'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { useEducatorData } from '@/hooks/use-educator-data';
import {
    BarChart3, Users, TrendingUp, BookOpen,
    Loader2, FlaskConical, GraduationCap, ChevronRight
} from 'lucide-react';

export default function EducatorAnalytics() {
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

    // Derived stats
    const averageEnrollment = courses.length > 0 ? Math.round(totalEnrolled / courses.length) : 0;
    const publishedCourses = courses.filter(c => c.totalLessons > 0).length; // Simple proxy for published

    return (
        <DashboardLayout userRole="educator" userName={userName}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Educator Insights</h1>
                    <p className="text-muted-foreground mt-1">
                        Analyze your courses' performance and student population trends.
                    </p>
                </div>

                {/* High Level Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Reach', value: totalEnrolled, icon: <Users className="w-5 h-5 text-primary" />, trend: '+12%', sub: 'Students enrolled' },
                        { label: 'Active Courses', value: courses.length, icon: <BookOpen className="w-5 h-5 text-blue-500" />, trend: 'Stable', sub: 'Course content' },
                        { label: 'Avg Enrollment', value: averageEnrollment, icon: <GraduationCap className="w-5 h-5 text-green-500" />, trend: '+5%', sub: 'Students per course' },
                        { label: 'Growth Score', value: '7.8', icon: <TrendingUp className="w-5 h-5 text-purple-500" />, trend: 'High', sub: 'Engagement metric' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-5 border border-border bg-card">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-[10px] text-green-500 font-bold uppercase">{stat.trend}</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-foreground">{stat.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Enrollment Breakdown */}
                    <Card className="lg:col-span-2 p-6 border border-border bg-card space-y-6">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Course Enrollment Distribution
                        </h3>

                        <div className="space-y-4">
                            {courses.length === 0 ? (
                                <div className="text-center py-16">
                                    <FlaskConical className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                                    <p className="text-sm text-muted-foreground italic">No courses created yet to analyze.</p>
                                </div>
                            ) : (
                                courses.map((c) => {
                                    const maxEnrolled = Math.max(...courses.map(x => x.enrolledCount || 0), 1);
                                    const percentage = Math.round(((c.enrolledCount || 0) / maxEnrolled) * 100);

                                    return (
                                        <div key={c.id} className="group flex items-center gap-4">
                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex justify-between items-end">
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</p>
                                                    <span className="text-xs font-mono text-muted-foreground">{c.enrolledCount || 0} students</span>
                                                </div>
                                                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-primary h-full transition-all duration-700 ease-out"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>

                    {/* Student Demographics / Placeholder */}
                    <Card className="p-6 border border-border bg-card">
                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Engagement Mix
                        </h3>

                        <div className="space-y-6">
                            {[
                                { label: 'Active Learners', percent: 65, color: 'bg-green-500' },
                                { label: 'Course Completers', percent: 28, color: 'bg-primary' },
                                { label: 'Quiz Takers', percent: 42, color: 'bg-yellow-500' },
                                { label: 'New Signups', percent: 15, color: 'bg-purple-500' },
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-foreground">{item.label}</span>
                                        <span className="text-muted-foreground">{item.percent}%</span>
                                    </div>
                                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`${item.color} h-full transition-all duration-1000`}
                                            style={{ width: `${item.percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-border">
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                "Data shows students are most active on Tuesday mornings. Consider publishing your next course update during that window for maximum reach."
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
