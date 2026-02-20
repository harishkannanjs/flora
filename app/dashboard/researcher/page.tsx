'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Database,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Mock data - in a real app this would come from a database
const mockLearningTrends = [
  { week: 'Week 1', avgCompletion: 42, avgScore: 68 },
  { week: 'Week 2', avgCompletion: 55, avgScore: 72 },
  { week: 'Week 3', avgCompletion: 61, avgScore: 75 },
  { week: 'Week 4', avgCompletion: 68, avgScore: 78 },
  { week: 'Week 5', avgCompletion: 72, avgScore: 79 },
  { week: 'Week 6', avgCompletion: 78, avgScore: 82 },
];

const mockTopicPerformance = [
  { topic: 'DNA Basics', performance: 85, misconceptions: 2 },
  { topic: 'Protein Synthesis', performance: 78, misconceptions: 4 },
  { topic: 'Cell Division', performance: 82, misconceptions: 3 },
  { topic: 'Photosynthesis', performance: 75, misconceptions: 5 },
  { topic: 'Metabolism', performance: 79, misconceptions: 3 },
];

const mockDatasets = [
  {
    id: 1,
    name: 'Spring 2024 Cohort Study',
    records: 2847,
    lastUpdated: '2024-02-10',
    status: 'active',
  },
  {
    id: 2,
    name: 'Misconception Patterns Q4',
    records: 1263,
    lastUpdated: '2024-01-28',
    status: 'completed',
  },
  {
    id: 3,
    name: 'Learning Velocity Analysis',
    records: 5124,
    lastUpdated: '2024-02-08',
    status: 'active',
  },
  {
    id: 4,
    name: 'CRISPR Module Effectiveness',
    records: 891,
    lastUpdated: '2024-02-05',
    status: 'completed',
  },
];

const mockPublications = [
  {
    id: 1,
    title: 'Adaptive Learning Systems in Biology Education',
    journal: 'Journal of Educational Technology',
    date: 'Jan 2024',
    citations: 12,
  },
  {
    id: 2,
    title: 'Misconception Detection in Biotechnology Learning',
    journal: 'Computers & Education',
    date: 'Dec 2023',
    citations: 8,
  },
];

export default function ResearcherDashboard() {
  const totalRecords = mockDatasets.reduce(
    (acc, dataset) => acc + dataset.records,
    0
  );

  return (
    <DashboardLayout userRole="researcher" userName="Dr. Michael Kumar">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total Data Records
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {(totalRecords / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Active Datasets
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {mockDatasets.filter((d) => d.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Publications
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {mockPublications.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total Citations
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {mockPublications.reduce((acc, pub) => acc + pub.citations, 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Trends */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Learning Trends Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockLearningTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgCompletion"
                stroke="var(--color-primary)"
                name="Avg Completion %"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="var(--color-accent)"
                name="Avg Score"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Topic Performance */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Topic Performance Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTopicPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="topic" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Legend />
              <Bar
                dataKey="performance"
                fill="var(--color-primary)"
                name="Performance %"
              />
              <Bar
                dataKey="misconceptions"
                fill="var(--color-accent)"
                name="Misconceptions"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Datasets & Publications */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 border border-border bg-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              My Datasets
            </h2>
            <div className="space-y-4">
              {mockDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="flex items-start justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {dataset.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {dataset.records.toLocaleString()} records
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {dataset.lastUpdated}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          dataset.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {dataset.status === 'active'
                          ? 'Active'
                          : 'Completed'}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex flex-col items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-xs">Export</span>
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Recent Publications
            </h2>
            <div className="space-y-4">
              {mockPublications.map((publication) => (
                <div
                  key={publication.id}
                  className="pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <p className="font-medium text-foreground mb-2">
                    {publication.title}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {publication.journal} • {publication.date}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">
                      {publication.citations} citations
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs p-0 h-auto"
                    >
                      View →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Research Tools
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <Download className="w-5 h-5 mb-2 text-primary" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <BarChart3 className="w-5 h-5 mb-2 text-primary" />
              <span>Custom Query</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <FileText className="w-5 h-5 mb-2 text-primary" />
              <span>New Dataset</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <Users className="w-5 h-5 mb-2 text-primary" />
              <span>Collaborate</span>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
