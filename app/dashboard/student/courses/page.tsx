'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth-provider';
import { useStudentData } from '@/hooks/use-student-data';
import {
    BookOpen, ArrowRight, Loader2, Plus, FlaskConical,
} from 'lucide-react';

export default function StudentCourses() {
    const { user, profile } = useAuth();
    const { enrollments, loading } = useStudentData();
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

    return (
        <DashboardLayout userRole="student" userName={userName}>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
                        <p className="text-muted-foreground mt-1">
                            View and continue your biotechnology learning journey.
                        </p>
                    </div>
                </div>

                {enrollments.length === 0 ? (
                    <Card className="p-16 border border-dashed border-border text-center">
                        <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No courses joined yet</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Go to your dashboard to enroll in a course using a code from your educator.
                        </p>
                        <Button variant="outline" onClick={() => window.location.href = '/dashboard/student'}>
                            Back to Dashboard
                        </Button>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <Card key={enrollment.courseId} className="p-6 border border-border bg-card hover:shadow-lg transition-all flex flex-col gap-4">
                                <div>
                                    <h3 className="font-bold text-foreground text-lg leading-tight">{enrollment.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">Instructor: {enrollment.educatorName}</p>
                                    {enrollment.description && (
                                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2 italic">"{enrollment.description}"</p>
                                    )}
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">{enrollment.completedLessons}/{enrollment.totalLessons} Lessons</span>
                                        <span className="font-bold text-primary">{enrollment.percent}%</span>
                                    </div>
                                    <Progress value={enrollment.percent} className="h-2.5 bg-muted" />
                                </div>

                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {enrollment.topics?.slice(0, 3).map((t, i) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/20">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-auto group">
                                    {enrollment.completedLessons === 0 ? 'Start Learning' : 'Continue Module'}
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
