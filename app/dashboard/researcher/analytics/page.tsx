'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const mockCohortData = [
  { cohort: 'Spring 2024', students: 2847, avgScore: 78, completion: 82 },
  { cohort: 'Winter 2023', students: 2156, avgScore: 75, completion: 79 },
  { cohort: 'Fall 2023', students: 3124, avgScore: 76, completion: 80 },
  { cohort: 'Summer 2023', students: 1890, avgScore: 74, completion: 77 },
];

const mockMisconceptionData = [
  { name: 'DNA Replication', value: 342 },
  { name: 'Gene Expression', value: 289 },
  { name: 'Cell Division', value: 267 },
  { name: 'Protein Synthesis', value: 245 },
  { name: 'Photosynthesis', value: 198 },
];

const mockPerformanceByTopic = [
  { topic: 'Molecular Biology', students: 450, avgScore: 82, engagement: 88 },
  { topic: 'Genetics', students: 420, avgScore: 79, engagement: 85 },
  { topic: 'Cell Biology', students: 380, avgScore: 76, engagement: 82 },
  { topic: 'Biochemistry', students: 340, avgScore: 73, engagement: 79 },
  { topic: 'Microbiology', students: 290, avgScore: 75, engagement: 81 },
];

const COLORS = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'];

export default function ResearcherAnalytics() {
  const [dateRange, setDateRange] = useState('all');
  const [selectedCohort, setSelectedCohort] = useState('all');

  return (
    <DashboardLayout userRole="researcher" userName="Dr. Michael Kumar">
      <div className="space-y-8">
        {/* Header with Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Advanced Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive learning patterns and research insights
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Time</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="6m">Last 6 Months</option>
                <option value="3m">Last 3 Months</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Cohort
              </label>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Cohorts</option>
                <option value="spring2024">Spring 2024</option>
                <option value="winter2023">Winter 2023</option>
                <option value="fall2023">Fall 2023</option>
                <option value="summer2023">Summer 2023</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total Participants
                </p>
                <p className="text-3xl font-bold text-foreground">10.0K</p>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Avg Completion
                </p>
                <p className="text-3xl font-bold text-foreground">79.5%</p>
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
                  Avg Score
                </p>
                <p className="text-3xl font-bold text-foreground">76.3%</p>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Common Misconceptions
                </p>
                <p className="text-3xl font-bold text-foreground">24</p>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Cohort Performance */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Cohort Performance Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockCohortData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="cohort" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Legend />
              <Bar dataKey="avgScore" fill="var(--color-primary)" name="Avg Score %" />
              <Bar dataKey="completion" fill="var(--color-accent)" name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Misconception Distribution */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 border border-border bg-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Top Misconceptions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockMisconceptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockMisconceptionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Misconception Details
            </h2>
            <div className="space-y-4">
              {mockMisconceptionData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground font-semibold">
                    {item.value} instances
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance by Topic */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Performance by Topic Area
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Topic
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">
                    Students
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">
                    Avg Score
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockPerformanceByTopic.map((topic, idx) => (
                  <tr
                    key={topic.topic}
                    className={`border-b border-border ${
                      idx === mockPerformanceByTopic.length - 1
                        ? 'border-b-0'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-foreground">
                      {topic.topic}
                    </td>
                    <td className="text-right py-3 px-4 text-muted-foreground">
                      {topic.students}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${topic.avgScore}%`,
                            }}
                          />
                        </div>
                        <span className="text-foreground">
                          {topic.avgScore}%
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent"
                            style={{
                              width: `${topic.engagement}%`,
                            }}
                          />
                        </div>
                        <span className="text-muted-foreground">
                          {topic.engagement}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Custom Query Builder */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Custom Query Builder
          </h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Metrics
              </label>
              <div className="space-y-2">
                {[
                  'Completion Rate',
                  'Average Score',
                  'Time Spent',
                  'Misconceptions',
                  'Engagement Score',
                ].map((metric) => (
                  <label
                    key={metric}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={
                        metric === 'Completion Rate' ||
                        metric === 'Average Score'
                      }
                      className="w-4 h-4 rounded border-input"
                    />
                    <span className="text-sm text-foreground">{metric}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Group By
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Cohort</option>
                <option>Topic</option>
                <option>Time Period</option>
                <option>Student Demographics</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="bg-primary hover:bg-primary/90">
                Generate Report
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
