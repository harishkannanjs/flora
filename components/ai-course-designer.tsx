'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    Sparkles, X, Send, Bot,
    Loader2, Check, ArrowRight,
    LayoutGrid, BookOpen
} from 'lucide-react';

interface Lesson {
    title: string;
    content: string;
}

interface CourseStructure {
    title: string;
    description: string;
    totalLessons: number;
    topics: string[];
    lessons: Lesson[];
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AICourseDesignerProps {
    onClose: () => void;
    onSave: (course: CourseStructure) => Promise<void>;
    initialData?: {
        title: string;
        description: string;
    };
}

export function AICourseDesigner({ onClose, onSave, initialData }: AICourseDesignerProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [structure, setStructure] = useState<CourseStructure | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasPrimed = useRef(false);

    useEffect(() => {
        if (initialData && !hasPrimed.current) {
            hasPrimed.current = true;
            setMessages([
                { role: 'assistant', content: `Great choice! Let's design the course "${initialData.title}". ${initialData.description ? `I see you've described it as: "${initialData.description}".` : ''} \n\nI'm thinking we could structure this into about 10 lessons. Should we focus on foundational concepts first, or dive straight into practical simulations?` }
            ]);
        } else if (!initialData && messages.length === 0) {
            setMessages([
                { role: 'assistant', content: "Hello! I'm your Biotech Course Architect. What kind of course would you like to design today? Tell me the subject or a specific topic you'd like to cover." }
            ]);
        }
    }, [initialData]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    role: 'educator',
                    mode: 'designer'
                }),
            });

            const data = await response.json();
            if (data.content) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);

                // Try to parse JSON from the response
                const jsonMatch = data.content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const parsed = JSON.parse(jsonMatch[0]);
                        if (parsed.title && parsed.lessons) {
                            setStructure(parsed);
                        }
                    } catch (e) {
                        console.error('Failed to parse course JSON:', e);
                    }
                }
            }
        } catch (error) {
            console.error('Designer error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <Card className="w-full max-w-5xl h-[85vh] bg-card border-primary/20 shadow-2xl flex flex-col overflow-hidden rounded-3xl">
                {/* Header */}
                <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shadow-inner ring-1 ring-primary/20">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">AI Course Architect</h2>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest opacity-70">Design unique educational paths</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Chat Panel */}
                    <div className="flex-1 flex flex-col border-r border-border min-w-0">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] p-4 rounded-3xl text-sm whitespace-pre-wrap ${m.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none shadow-lg'
                                        : 'bg-muted/50 text-foreground rounded-tl-none border border-border/50 backdrop-blur-sm'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted/50 p-4 rounded-3xl rounded-tl-none border border-border/50 text-sm">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-border bg-muted/20">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                                <Input
                                    placeholder="Tell the AI what course you want to build..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="bg-background border-primary/20 focus-visible:ring-primary h-12 text-base rounded-2xl px-6"
                                    disabled={loading}
                                />
                                <Button size="icon" className="h-12 w-12 bg-primary hover:bg-primary/90 text-white shrink-0 rounded-2xl shadow-lg" disabled={loading || !input.trim()}>
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="w-[400px] bg-muted/10 flex flex-col hidden lg:flex">
                        <div className="p-6 border-b border-border">
                            <h3 className="flex items-center gap-2 font-bold text-foreground">
                                <LayoutGrid className="w-4 h-4 text-primary" />
                                Course Preview
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">The AI will generate the structure here as you chat.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {structure ? (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-primary">{structure.title}</h4>
                                        <p className="text-sm text-muted-foreground mt-2">{structure.description}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Curriculum Outline</p>
                                        {structure.lessons.map((lesson, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl shadow-sm group hover:border-primary/30 transition-colors">
                                                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">{lesson.title}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg group"
                                        disabled={saving}
                                        onClick={async () => {
                                            setSaving(true);
                                            await onSave(structure);
                                            setSaving(false);
                                        }}
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                        Finalize & Create Course
                                    </Button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
                                    <Sparkles className="w-12 h-12 mb-4 text-primary" />
                                    <p className="text-sm font-medium">Chat with the AI to<br />begin designing your course</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
