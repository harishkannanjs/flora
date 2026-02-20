'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Play,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const lesson = {
  id: '1',
  title: 'DNA Replication Mechanisms',
  course: 'Molecular Biology Fundamentals',
  duration: 25,
  progress: 60,
  content: `
    DNA replication is the process by which DNA makes a copy of itself. This is an essential process because every time a cell divides, the two new daughter cells must contain the same genetic information as the parent cell.

    Key points:
    - DNA replication occurs during the S phase of the cell cycle
    - The process is semi-conservative, meaning each new DNA molecule contains one old strand and one new strand
    - DNA polymerase is the enzyme responsible for synthesizing new DNA strands
    - The process begins at origins of replication and proceeds in both directions
  `,
  sections: [
    { id: 1, title: 'Overview', completed: true },
    { id: 2, title: 'The Role of DNA Polymerase', completed: true },
    { id: 3, title: 'Leading and Lagging Strands', completed: false },
    { id: 4, title: 'Priming and Okazaki Fragments', completed: false },
    { id: 5, title: 'Proofreading and Error Correction', completed: false },
  ],
  misconceptions: [
    {
      id: 1,
      misconception: 'Both strands of DNA are synthesized continuously',
      correction:
        'Only the leading strand is synthesized continuously. The lagging strand is synthesized in short fragments called Okazaki fragments.',
      severity: 'high',
    },
    {
      id: 2,
      misconception: 'DNA polymerase can start DNA synthesis from scratch',
      correction:
        'DNA polymerase cannot initiate synthesis on its own. Primase must first synthesize a short RNA primer.',
      severity: 'medium',
    },
  ],
  quiz: {
    title: 'DNA Replication Knowledge Check',
    questions: [
      {
        id: 1,
        question: 'What enzyme is primarily responsible for DNA synthesis?',
        options: [
          'Helicase',
          'DNA Polymerase',
          'Ligase',
          'Topoisomerase',
        ],
        correct: 1,
      },
      {
        id: 2,
        question: 'What are the short DNA fragments synthesized on the lagging strand called?',
        options: [
          'RNA primers',
          'Helical fragments',
          'Okazaki fragments',
          'Base pairs',
        ],
        correct: 2,
      },
    ],
  },
};

export default function LessonPage({ params }: { params: { id: string } }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleQuizAnswer = (questionIdx: number, answerIdx: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIdx] = answerIdx;
    setQuizAnswers(newAnswers);
  };

  const calculateQuizScore = () => {
    let correct = 0;
    lesson.quiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / lesson.quiz.questions.length) * 100);
  };

  const quizScore = quizSubmitted ? calculateQuizScore() : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/5 border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={`/dashboard/student`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {lesson.course}
            </p>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {lesson.title}
            </h1>
            <Progress value={lesson.progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Sections */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="p-6 border border-border bg-card sticky top-32">
              <h3 className="font-bold text-foreground mb-4">
                Lesson Sections
              </h3>
              <div className="space-y-2">
                {lesson.sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      currentSection === idx
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <span className="text-sm font-medium">{section.title}</span>
                    {section.completed && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-8">
            {/* Lesson Content */}
            {!showQuiz ? (
              <>
                <Card className="p-8 border border-border bg-card">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {lesson.sections[currentSection].title}
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {lesson.content}
                    </p>
                  </div>

                  {/* Interactive Element Placeholder */}
                  <div className="mt-8 p-6 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        Interactive Simulation Available
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Visualize DNA replication in real-time
                      </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                      <Play className="w-4 h-4" />
                      Launch
                    </Button>
                  </div>
                </Card>

                {/* Misconceptions */}
                <Card className="p-8 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="flex items-start gap-4 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                    <h3 className="text-lg font-bold text-foreground">
                      Common Misconceptions
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {lesson.misconceptions.map((item) => (
                      <div
                        key={item.id}
                        className="border-l-4 border-amber-400 pl-4 py-2"
                      >
                        <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                          ✗ {item.misconception}
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          ✓ {item.correction}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    disabled={currentSection === 0}
                    onClick={() => setCurrentSection(currentSection - 1)}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentSection === lesson.sections.length - 1 ? (
                    <Button
                      className="bg-primary hover:bg-primary/90 gap-2"
                      onClick={() => setShowQuiz(true)}
                    >
                      Take Quiz
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-primary hover:bg-primary/90 gap-2"
                      onClick={() => setCurrentSection(currentSection + 1)}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Quiz Section */}
                <Card className="p-8 border border-border bg-card">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {lesson.quiz.title}
                  </h2>

                  {quizSubmitted ? (
                    <div className="space-y-6">
                      <div className="p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                          Your Score
                        </p>
                        <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                          {quizScore}%
                        </p>
                      </div>

                      <div className="space-y-4">
                        {lesson.quiz.questions.map((question, qIdx) => (
                          <div
                            key={question.id}
                            className={`p-4 rounded-lg border ${
                              quizAnswers[qIdx] === question.correct
                                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20'
                                : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'
                            }`}
                          >
                            <p className="font-semibold text-foreground mb-3">
                              {question.question}
                            </p>
                            <div className="text-sm">
                              {quizAnswers[qIdx] === question.correct ? (
                                <p className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Correct: {question.options[question.correct]}
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  <p className="text-red-700 dark:text-red-300 font-medium">
                                    Your answer: {question.options[quizAnswers[qIdx]]}
                                  </p>
                                  <p className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Correct: {question.options[question.correct]}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          setShowQuiz(false);
                          setQuizSubmitted(false);
                          setQuizAnswers([]);
                        }}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Back to Lesson
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {lesson.quiz.questions.map((question, qIdx) => (
                        <div key={question.id}>
                          <p className="font-semibold text-foreground mb-3">
                            {qIdx + 1}. {question.question}
                          </p>
                          <div className="space-y-2">
                            {question.options.map((option, optIdx) => (
                              <label
                                key={optIdx}
                                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={quizAnswers[qIdx] === optIdx}
                                  onChange={() =>
                                    handleQuizAnswer(qIdx, optIdx)
                                  }
                                  className="w-4 h-4"
                                />
                                <span className="text-foreground">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => setQuizSubmitted(true)}
                        disabled={quizAnswers.length < lesson.quiz.questions.length}
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  )}
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
