'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth-provider';
import { useEducatorData } from '@/hooks/use-educator-data';
import { useToast } from '@/hooks/use-toast';
import {
  BookOpen, Plus, Copy, Check, Users, Loader2,
  AlertCircle, GraduationCap, X, TrendingUp, ArrowRight,
  Sparkles,
} from 'lucide-react';
import { AICourseDesigner } from '@/components/ai-course-designer';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

interface CreateCourseModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; totalLessons: number; topics: string[] }) => Promise<any>;
}

function CreateCourseModal({ onClose, onStartDesign }: { onClose: () => void; onStartDesign: (data: { title: string; description: string }) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    onStartDesign({ title, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <Card className="w-full max-w-lg p-8 bg-card border border-primary/20 shadow-2xl space-y-6 rounded-3xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Create New Course</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Enter a few basic details to get started. You'll then use the AI companion to design the full curriculum.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest opacity-70">Course Title *</Label>
            <Input id="title" placeholder="e.g. CRISPR Gene Editing 101"
              className="h-12 bg-muted/30 border-primary/10 focus-visible:ring-primary rounded-xl"
              value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest opacity-70">Initial Description</Label>
            <textarea
              id="desc"
              rows={3}
              placeholder="What is the main objective of this course?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl border border-primary/10 bg-muted/30 px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background resize-none"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 group">
            Start Designing with AI <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function EducatorDashboard() {
  const { user, profile } = useAuth();
  const { courses, loading, totalEnrolled, addCourse } = useEducatorData();
  const [showModal, setShowModal] = useState(false);
  const [showAIDesigner, setShowAIDesigner] = useState(false);
  const [aiInitialData, setAiInitialData] = useState<{ title: string; description: string } | null>(null);
  const { toast } = useToast();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `Enrollment code ${code} copied to clipboard.`,
    });
  };

  const userName = profile?.name || user?.displayName || 'Educator';

  return (
    <DashboardLayout userRole="educator" userName={userName}>
      {showModal && (
        <CreateCourseModal
          onClose={() => setShowModal(false)}
          onStartDesign={(data) => {
            setShowModal(false);
            setAiInitialData(data);
            setShowAIDesigner(true);
          }}
        />
      )}

      {showAIDesigner && (
        <AICourseDesigner
          initialData={aiInitialData || undefined}
          onClose={() => {
            setShowAIDesigner(false);
            setAiInitialData(null);
          }}
          onSave={async (course) => {
            try {
              await addCourse(course);
              setShowAIDesigner(false);
              setAiInitialData(null);
              toast({
                title: "Course Created!",
                description: `Successfully generated and saved "${course.title}".`,
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to save the AI-generated course.",
                variant: "destructive"
              });
            }
          }}
        />
      )}

      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, {userName.split(' ')[0]}!</h2>
            <p className="text-muted-foreground mt-1">
              You have {courses.length} active courses with {totalEnrolled} students enrolled.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary/90 text-white w-fit h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group font-bold"
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Create New Course
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Courses Created', value: courses.length, icon: <BookOpen className="w-5 h-5 text-primary" />, trend: 'Live' },
            { label: 'Total Students', value: totalEnrolled, icon: <Users className="w-5 h-5 text-blue-500" />, trend: 'Enrolled' },
            { label: 'Avg. Lessons', value: courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.totalLessons || 0), 0) / courses.length) : 0, icon: <TrendingUp className="w-5 h-5 text-green-500" />, trend: 'Per Course' },
            { label: 'Active Codes', value: courses.length, icon: <GraduationCap className="w-5 h-5 text-amber-500" />, trend: 'Unique' },
          ].map((stat, i) => (
            <Card key={i} className="p-5 border border-border bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-green-500 mt-2 font-medium">{stat.trend}</p>
                </div>
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Course Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Recent Courses</h3>
              <Link href="/dashboard/educator/courses" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : courses.length === 0 ? (
              <Card className="p-12 border border-dashed border-border text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm text-muted-foreground italic text-pretty">No courses created yet. Start by creating your first biotechnology course.</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="p-5 border border-primary/10 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 group rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-foreground text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">{course.title}</h4>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 px-3 py-1.5 rounded-xl text-sm font-mono font-bold text-primary border border-primary/20 shadow-sm">
                          {course.enrollCode}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(course.enrollCode);
                            toast({
                              title: "Code Copied!",
                              description: `Enrollment code ${course.enrollCode} copied to clipboard.`,
                            });
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {course.enrolledCount || 0} Students
                      </div>
                      <Link href={`/dashboard/educator/courses/${course.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary hover:bg-primary/5 px-2">
                          Manage <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions / Tips */}
          <Card className="p-6 border border-border bg-card h-fit">
            <h3 className="font-bold text-foreground mb-4">Quick Insights</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-tighter">Educator Tip</p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  {courses.length === 0
                    ? "Start by creating your first course with the AI Architect to reach students."
                    : "Regularly update your course topics to keep the AI companion grounded in the latest biotech trends."}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">Milestone</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                  {totalEnrolled === 0
                    ? "Share your course codes to see your first enrollment!"
                    : `You have successfully enrolled ${totalEnrolled} students across ${courses.length} courses.`}
                </p>
              </div>
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary mt-2" onClick={() => window.location.href = '/dashboard/educator'}>
                Refresh Dashboard <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
