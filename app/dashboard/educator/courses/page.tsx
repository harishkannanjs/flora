'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  lessons: number;
  students: number;
  published: boolean;
  lastModified: string;
  status: 'draft' | 'published';
}

// Mock data - in a real app this would come from a database
const initialCourses: Course[] = [
  {
    id: 1,
    title: 'Molecular Biology Fundamentals',
    description: 'Essential concepts in molecular biology and gene expression',
    lessons: 12,
    students: 28,
    published: true,
    lastModified: '2024-02-08',
    status: 'published',
  },
  {
    id: 2,
    title: 'Cell Signaling Pathways',
    description: 'Understanding cellular communication and signal transduction',
    lessons: 15,
    students: 18,
    published: true,
    lastModified: '2024-02-05',
    status: 'published',
  },
  {
    id: 3,
    title: 'CRISPR & Gene Editing',
    description: 'Modern gene editing techniques and applications',
    lessons: 10,
    students: 0,
    published: false,
    lastModified: '2024-02-10',
    status: 'draft',
  },
  {
    id: 4,
    title: 'Advanced Microbiology',
    description: 'Microbial genetics, pathogenesis, and biotechnology',
    lessons: 8,
    students: 35,
    published: true,
    lastModified: '2024-01-20',
    status: 'published',
  },
];

export default function EducatorCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>(
    'all'
  );

  const filteredCourses =
    filterStatus === 'all'
      ? courses
      : courses.filter((c) => c.status === filterStatus);

  const deleteCourse = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const publishCourse = (id: number) => {
    setCourses(
      courses.map((c) =>
        c.id === id
          ? { ...c, status: 'published', published: true }
          : c
      )
    );
  };

  return (
    <DashboardLayout userRole="educator" userName="Dr. Patricia Smith">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Course Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your biotechnology courses
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowNewCourseForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
            className={
              filterStatus === 'all'
                ? 'bg-primary hover:bg-primary/90'
                : ''
            }
          >
            All Courses ({courses.length})
          </Button>
          <Button
            variant={filterStatus === 'published' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('published')}
            className={
              filterStatus === 'published'
                ? 'bg-primary hover:bg-primary/90'
                : ''
            }
          >
            Published ({courses.filter((c) => c.status === 'published').length})
          </Button>
          <Button
            variant={filterStatus === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('draft')}
            className={
              filterStatus === 'draft'
                ? 'bg-primary hover:bg-primary/90'
                : ''
            }
          >
            Draft ({courses.filter((c) => c.status === 'draft').length})
          </Button>
        </div>

        {/* Courses List */}
        <div className="grid gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="p-6 border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {course.title}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {course.status === 'published'
                          ? 'Published'
                          : 'Draft'}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {course.lessons} lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {course.students} enrolled
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          Updated {course.lastModified}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      title="View course"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      title="Edit course"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    {course.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => publishCourse(course.id)}
                        title="Publish course"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Publish</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => deleteCourse(course.id)}
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 border border-border bg-card text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                {filterStatus === 'all'
                  ? 'No courses yet. Create your first course to get started!'
                  : `No ${filterStatus} courses found.`}
              </p>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowNewCourseForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </Card>
          )}
        </div>

        {/* Create New Course Form */}
        {showNewCourseForm && (
          <Card className="p-6 border border-border bg-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Create New Course
            </h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Advanced Bioinformatics"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe what students will learn..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Target Audience
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Graduate</option>
                    <option>Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 6 weeks"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setShowNewCourseForm(false)}
                >
                  Create Course
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewCourseForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Start Guide */}
        <Card className="p-6 border border-primary/30 bg-primary/5">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Quick Start: Creating a Course
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Click "New Course" and fill in the course details</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Add lessons with content, videos, and interactive elements</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Create quizzes and assessments for each module</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span>Publish the course and enroll your students</span>
            </li>
          </ol>
        </Card>
      </div>
    </DashboardLayout>
  );
}
