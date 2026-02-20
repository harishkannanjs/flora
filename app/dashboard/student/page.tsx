'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth-provider';
import { useStudentData } from '@/hooks/use-student-data';
import {
  BookOpen, ArrowRight, Loader2, CheckCircle2,
  Award, FlaskConical, TrendingUp, Plus, AlertCircle, X,
} from 'lucide-react';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  enrolled: <BookOpen className="w-4 h-4 text-primary" />,
  lesson_completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  quiz_passed: <Award className="w-4 h-4 text-yellow-500" />,
  achievement: <Award className="w-4 h-4 text-purple-500" />,
};

function timeAgo(ts: unknown): string {
  if (!ts) return 'Just now';
  const ms = (ts as { toDate?: () => Date }).toDate?.().getTime() ?? 0;
  const diff = (Date.now() - ms) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function EnrollModal({ onClose, onEnroll }: { onClose: () => void; onEnroll: (code: string) => Promise<{ success: boolean; error?: string }> }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setError('');
    setLoading(true);
    const result = await onEnroll(code.trim());
    if (result.success) {
      onClose();
    } else {
      setError(result.error ?? 'Something went wrong.');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <Card className="w-full max-w-sm p-6 bg-card border border-border shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Enroll in a Course</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Ask your educator for the 6-character course code, then enter it below.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="e.g. AB3C7X"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            disabled={loading}
            className="text-center text-2xl font-mono tracking-widest uppercase h-14"
            maxLength={7}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading || !code.trim()}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Enrolling…</> : 'Enroll'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const { enrollments, activity, totalCompleted, totalProgress, loading, enroll } = useStudentData();
  const [showEnroll, setShowEnroll] = useState(false);

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
      {showEnroll && (
        <EnrollModal
          onClose={() => setShowEnroll(false)}
          onEnroll={enroll}
        />
      )}

      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, {userName.split(' ')[0]}! 👋</h2>
            <p className="text-muted-foreground mt-1">
              {enrollments.length === 0
                ? 'Enroll in a course using a code from your educator to get started.'
                : `You're enrolled in ${enrollments.length} course${enrollments.length === 1 ? '' : 's'}.`}
            </p>
          </div>
          <Button onClick={() => setShowEnroll(true)} className="bg-primary hover:bg-primary/90 text-white shrink-0 w-fit sm:self-center">
            <Plus className="w-4 h-4 mr-2" /> Enroll with Code
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Enrolled Courses', value: enrollments.length, icon: <BookOpen className="w-5 h-5 text-primary" /> },
            { label: 'Lessons Completed', value: totalCompleted, icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
            { label: 'Overall Progress', value: `${totalProgress}%`, icon: <TrendingUp className="w-5 h-5 text-blue-500" /> },
          ].map((stat) => (
            <Card key={stat.label} className="p-4 border border-border bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">My Courses</h2>
          {enrollments.length === 0 ? (
            <Card className="p-16 border border-dashed border-border text-center">
              <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Get an enrollment code from your educator and use it to join a course.
              </p>
              <Button onClick={() => setShowEnroll(true)} className="bg-primary hover:bg-primary/90 text-white w-fit mx-auto px-8">
                <Plus className="w-4 h-4 mr-2" /> Enroll with Code
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.courseId} className="p-5 border border-border bg-card hover:shadow-md transition-shadow flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-snug">{enrollment.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">by {enrollment.educatorName}</p>
                    {enrollment.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{enrollment.description}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{enrollment.completedLessons}/{enrollment.totalLessons} lessons</span>
                      <span className="font-semibold text-foreground">{enrollment.percent}%</span>
                    </div>
                    <Progress value={enrollment.percent} className="h-2" />
                  </div>

                  {enrollment.lastTopic && (
                    <p className="text-sm text-muted-foreground border-t border-border pt-3">
                      <span className="text-primary font-medium">Next: </span>
                      {enrollment.lastTopic}
                    </p>
                  )}

                  {enrollment.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {enrollment.topics.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                      {enrollment.topics.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{enrollment.topics.length - 3}</span>
                      )}
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-white mt-auto"
                    onClick={() => window.location.href = `/dashboard/student/courses/${enrollment.courseId}`}
                  >
                    {enrollment.completedLessons === 0 ? 'Start Course' : 'Continue'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <Card className="p-6 border border-border bg-card">
            {activity.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No activity yet — enroll in a course to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activity.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                      {ACTIVITY_ICONS[event.type] ?? <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(event.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
