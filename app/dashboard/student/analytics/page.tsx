'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth-provider';
import { useStudentData } from '@/hooks/use-student-data';
import {
    BarChart3, TrendingUp, Award, Clock,
    CheckCircle2, BookOpen, Loader2, FlaskConical
} from 'lucide-react';

export default function StudentAnalytics() {
    const { user, profile } = useAuth();
    const { enrollments, activity, totalCompleted, totalProgress, loading } = useStudentData();
    const userName = profile?.name || user?.displayName || 'Student';

    if (loading) {
        return (
            <DashboardLayout userRole="student" userName={userName}>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    // Derived stats
    const coursesInPogress = enrollments.filter(e => e.percent > 0 && e.percent < 100).length;
    const coursesCompleted = enrollments.filter(e => e.percent === 100).length;

    // Group activity by type for a simple distribution chart
    const activityDistribution = activity.reduce((acc: Record<string, number>, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {});

    return (
        <DashboardLayout userRole="student" userName={userName}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Learning Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your progress, achievements, and learning patterns.
                    </p>
                </div>

                {/* High Level Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Progress', value: `${totalProgress}%`, icon: <TrendingUp className="w-5 h-5 text-blue-500" />, sub: 'Across all courses' },
                        { label: 'Lessons Done', value: totalCompleted, icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, sub: 'Modules completed' },
                        { label: 'Courses Finished', value: coursesCompleted, icon: <Award className="w-5 h-5 text-purple-500" />, sub: '100% completion' },
                        { label: 'Active Sessions', value: activity.length, icon: <Clock className="w-5 h-5 text-amber-500" />, sub: 'Recent activities' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-5 border border-border bg-card">
                            <div className="flex items-start justify-between mb-2">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Progress Breakdown */}
                    <Card className="lg:col-span-2 p-6 border border-border bg-card space-y-6">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Course Progress Breakdown
                        </h3>

                        <div className="space-y-6">
                            {enrollments.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                                    <p className="text-sm text-muted-foreground italic">No course data to display yet.</p>
                                </div>
                            ) : (
                                enrollments.map((e) => (
                                    <div key={e.courseId} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="font-bold text-foreground">{e.title}</p>
                                                <p className="text-xs text-muted-foreground">{e.completedLessons} of {e.totalLessons} modules finished</p>
                                            </div>
                                            <span className="text-sm font-bold text-primary">{e.percent}%</span>
                                        </div>
                                        <Progress value={e.percent} className="h-2" />
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Activity distribution */}
                    <Card className="p-6 border border-border bg-card">
                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Activity Mix
                        </h3>

                        <div className="space-y-5">
                            {[
                                { label: 'Lessons', type: 'lesson_completed', color: 'bg-green-500' },
                                { label: 'Enrolled', type: 'enrolled', color: 'bg-primary' },
                                { label: 'Quizzes', type: 'quiz_passed', color: 'bg-yellow-500' },
                                { label: 'Achievements', type: 'achievement', color: 'bg-purple-500' },
                            ].map((item) => {
                                const count = activityDistribution[item.type] || 0;
                                const total = activity.length || 1;
                                const percentage = Math.round((count / total) * 100);

                                return (
                                    <div key={item.label} className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-medium text-foreground">{item.label}</span>
                                            <span className="text-muted-foreground font-bold">{count}</span>
                                        </div>
                                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`${item.color} h-full transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {activity.length === 0 && (
                            <div className="mt-8 text-center">
                                <FlaskConical className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                                <p className="text-xs text-muted-foreground italic">Start learning to see your activity mix!</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
