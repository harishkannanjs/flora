'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    BookOpen, CheckCircle2, Circle,
    ArrowLeft, Loader2, Sparkles,
    ChevronRight, PlayCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Course, Lesson, updateProgress } from '@/lib/firestore';
import { AICompanion } from '@/components/ai-companion';
import Link from 'next/link';

export default function CourseDetailPage() {
    const { courseId } = useParams() as { courseId: string };
    const { user, profile } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            if (!courseId) return;

            try {
                // Fetch Course Meta
                const courseSnap = await getDoc(doc(db, 'courses', courseId));
                if (courseSnap.exists()) {
                    setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
                }

                // Fetch Lessons
                const lessonsQ = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order', 'asc'));
                const lessonsSnap = await getDocs(lessonsQ);
                const fetchedLessons = lessonsSnap.docs.map(d => d.data() as Lesson);
                setLessons(fetchedLessons);
                if (fetchedLessons.length > 0) {
                    setActiveLesson(fetchedLessons[0]);
                }

                // Fetch user enrollment info to get progress
                if (user) {
                    const enrollSnap = await getDoc(doc(db, 'enrollments', user.uid, 'courses', courseId));
                    if (enrollSnap.exists()) {
                        setCompletedLessons(enrollSnap.data().completedLessons || 0);
                    }
                }
            } catch (e) {
                console.error('Error fetching course:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [courseId, user]);

    const handleMarkComplete = async () => {
        if (!user || !course || !activeLesson) return;

        const newCompleted = Math.max(completedLessons, lessons.indexOf(activeLesson) + 1);
        setCompletedLessons(newCompleted);

        await updateProgress(
            user.uid,
            course.id,
            newCompleted,
            course.totalLessons,
            lessons[newCompleted]?.title || 'Course Completed!'
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-8 text-center bg-background min-h-screen">
                <h2 className="text-xl font-bold">Course not found</h2>
                <Link href="/dashboard/student" className="text-primary hover:underline mt-4 inline-block">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <DashboardLayout userRole="student" userName={profile?.name || 'Student'}>
            <div className="max-w-7xl mx-auto space-y-6 pb-20">
                {/* Breadcrumbs / Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/student" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Grounded Assistant Active</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar: Lesson List */}
                    <div className="lg:col-span-4 space-y-4">
                        <Card className="p-0 border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden sticky top-24">
                            <div className="p-6 bg-primary/10 border-b border-border">
                                <h2 className="text-lg font-bold text-foreground line-clamp-2">{course.title}</h2>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <span>Your Progress</span>
                                        <span>{Math.round((completedLessons / lessons.length) * 100)}%</span>
                                    </div>
                                    <Progress value={(completedLessons / lessons.length) * 100} className="h-2 bg-primary/20" />
                                </div>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto">
                                {lessons.map((lesson, idx) => {
                                    const isCompleted = idx < completedLessons;
                                    const isActive = activeLesson?.order === lesson.order;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`w-full flex items-center gap-3 p-4 text-left border-b border-border transition-all group ${isActive ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/30'
                                                }`}
                                        >
                                            <div className="shrink-0">
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/10" />
                                                ) : (
                                                    <Circle className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-bold uppercase tracking-tighter ${isActive ? 'text-primary' : 'text-muted-foreground opacity-60'}`}>Lesson {idx + 1}</p>
                                                <p className={`text-sm font-semibold truncate ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{lesson.title}</p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-primary' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>

                    {/* Main Content: Lesson View */}
                    <div className="lg:col-span-8 space-y-6">
                        {activeLesson ? (
                            <Card className="p-8 border-border bg-card shadow-lg min-h-[60vh] flex flex-col">
                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4">
                                    <PlayCircle className="w-4 h-4" /> Lesson Content
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-6">{activeLesson.title}</h1>

                                <div className="flex-1 prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {activeLesson.content}
                                </div>

                                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-muted-foreground italic">
                                        {lessons.indexOf(activeLesson) < completedLessons
                                            ? "You've already completed this lesson!"
                                            : "Finished reading? Mark it as complete to progress."}
                                    </p>
                                    <Button
                                        onClick={handleMarkComplete}
                                        disabled={lessons.indexOf(activeLesson) < completedLessons}
                                        className="bg-primary hover:bg-primary/90 text-white min-w-[160px] h-12 rounded-xl shadow-lg ring-offset-background hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {lessons.indexOf(activeLesson) < completedLessons ? (
                                            <><CheckCircle2 className="w-4 h-4 mr-2" /> Completed</>
                                        ) : (
                                            'Mark as Completed'
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-16 text-center border-dashed border-border opacity-50 grayscale">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                <h2 className="text-xl font-bold">Select a lesson to begin</h2>
                            </Card>
                        )}

                        {/* AI Advisor Context Tip */}
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground leading-tight">Grounded AI Lab Assistant</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Ask the BioBuddy in the bottom right anything about this course. It has been specifically grounded in the technical details of <strong>"{course.title}"</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Context Aware AI Companion */}
            <AICompanion
                role="student"
                courseContext={{
                    title: course.title,
                    topics: course.topics
                }}
            />
        </DashboardLayout>
    );
}
