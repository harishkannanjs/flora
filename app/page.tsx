import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Zap,
  BookOpen,
  BarChart3,
  Users,
  Microscope,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Brain,
  Beaker,
  LineChart,
  AlertCircle,
} from 'lucide-react';
import { TypewriterText } from '@/components/typewriter-text';

const CTA_PHRASES = ["Stop Studying", "Start Thinking"];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-40">
        <div className="space-y-12 text-center flex flex-col items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                Ai-Powered Cognitive Science
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-tight text-balance">
              Train Like a Biotech Scientist.
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Not Just a Student.
              </span>
            </h1>

            <center> <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl text-balance leading-relaxed text-center font-light">
              An AI-powered biotechnology reasoning engine that detects misconceptions, simulates real-world challenges, and builds research-ready thinking.
            </p></center>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base text-white font-medium px-8 w-full sm:w-auto">
                Start Training
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="text-base font-medium px-8 w-full sm:w-auto"
              >
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-y border-border py-20 sm:py-28 bg-muted/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight text-balance">
            Memorization Doesn't Survive the Lab.
          </h2>

          <div className="space-y-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            <p>
              Students can define PCR. But can they troubleshoot a failed one? Can they choose the right method under constraints?
            </p>
            <p className="font-medium">
              Most AI tools explain. They don't train thinking.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Feature 1: Mistake Intelligence */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 w-fit">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium uppercase tracking-wider text-primary">AI-Powered Cognitive Analysis</span>
              </div>
              <h3 className="text-4xl font-bold text-foreground leading-tight">
                Fix the Thinking Behind the Mistake.
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our system doesn't just mark answers wrong. It detects conceptual confusion patterns and corrects them intelligently.
              </p>
              <ul className="space-y-3">
                {['Identifies recurring misconceptions', 'Detects concept mix-ups (CRISPR vs RNAi, Transcription vs Translation)', 'Triggers targeted correction modules', 'Builds deep understanding'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground italic pt-4 border-t border-border">
                Because wrong answers have patterns.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl p-12 aspect-square flex items-center justify-center">
                <Brain className="w-32 h-32 text-primary/30" />
              </div>
            </div>
          </div>

          {/* Feature 2: Decision Simulator */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl p-12 aspect-square flex items-center justify-center">
                <Microscope className="w-32 h-32 text-accent/30" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
                <Beaker className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium uppercase tracking-wider text-accent">Real-World Scenario Engine</span>
              </div>
              <h3 className="text-4xl font-bold text-foreground leading-tight">
                Think Like You're Already in the Industry.
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Face biotech challenges that mirror research labs and startups. Choose methods. Justify decisions. Evaluate risks.
              </p>
              <ul className="space-y-3">
                {['Industry-level biotech problems', 'Structured reasoning evaluation', 'Budget & time constraints', 'Ethical impact analysis'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground italic pt-4 border-t border-border">
                Train your scientific judgment under pressure.
              </p>
            </div>
          </div>

          {/* Feature 3: Failure Lab */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 w-fit">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-orange-500">Experimental Troubleshooting Mode</span>
              </div>
              <h3 className="text-4xl font-bold text-foreground leading-tight">
                Learn From Experiments That Go Wrong.
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Simulated failed experiments. Your job? Diagnose and fix them.
              </p>
              <ul className="space-y-3">
                {['PCR failure diagnosis', 'Contamination analysis', 'Protocol troubleshooting', 'Root cause evaluation'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground italic pt-4 border-t border-border">
                Real scientists debug. They don't guess.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-xl p-12 aspect-square flex items-center justify-center">
                <Beaker className="w-32 h-32 text-orange-500/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Thinking Profile */}
      <section className="bg-muted/40 border-y border-border py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Your Scientific Thinking Profile.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We don't just show scores. We analyze how you think.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'Concept Knowledge', icon: '📚' },
              { label: 'Application Strength', icon: '⚙️' },
              { label: 'Experimental Reasoning', icon: '🧪' },
              { label: 'Diagnostic Skill', icon: '🔍' },
              { label: 'Strategic Decision Ability', icon: '🎯' },
            ].map((metric) => (
              <Card key={metric.label} className="p-6 text-center border border-border bg-card">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <p className="font-semibold text-foreground">{metric.label}</p>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground italic pt-8">
            Measure intelligence. Not just accuracy.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Assess', description: 'Take a diagnostic test.' },
              { step: '2', title: 'Learn', description: 'Adaptive AI modules tailored to your level.' },
              { step: '3', title: 'Simulate', description: 'Solve real biotech scenarios.' },
              { step: '4', title: 'Analyze', description: 'Receive deep cognitive feedback.' },
            ].map((item) => (
              <div key={item.step} className="space-y-4 text-center">
                <div className="w-12 h-12 bg-primary text-background rounded-full flex items-center justify-center font-bold text-lg mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="border-y border-border py-20 sm:py-32 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="flex flex-row items-center justify-center gap-x-4 sm:gap-x-6 lg:gap-x-8 font-bold text-foreground leading-none tracking-tight">
            <div className="flex flex-col items-end text-2xl sm:text-3xl lg:text-4xl min-w-[200px] sm:min-w-[250px] lg:min-w-[300px]">
              <TypewriterText
                phrases={CTA_PHRASES}
                className="whitespace-nowrap text-primary"
                waitDelay={3000}
              />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl text-left">
              Biotechnology.
            </div>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From memorization to mastery. From theory to decision-making.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base text-white font-medium px-8 w-full sm:w-auto">
                Start Your Simulation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="text-base font-medium px-8 w-full sm:w-auto"
              >
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/5 border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:text-left text-center">
              <div className="flex items-center gap-2 mb-4 md:justify-start justify-center">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">F</span>
                </div>
                <span className="font-semibold text-foreground">Flora</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Adaptive biotechnology learning for the next generation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Discussion Forum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2024 Flora. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
}
