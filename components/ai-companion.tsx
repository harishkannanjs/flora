'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sparkles, X, Send, Bot,
    Loader2, Minimize2
} from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AICompanionProps {
    role: 'student' | 'educator' | 'researcher';
    courseContext?: {
        title: string;
        topics: string[];
    };
}

const ROLE_CONFIG = {
    student: { name: 'BioBuddy', color: 'text-primary', icon: <Sparkles className="w-4 h-4" /> },
    educator: { name: 'CurriculumGenie', color: 'text-blue-500', icon: <Bot className="w-4 h-4" /> },
    researcher: { name: 'LabMate', color: 'text-purple-500', icon: <Sparkles className="w-4 h-4" /> },
};

export function AICompanion({ role, courseContext }: AICompanionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const config = ROLE_CONFIG[role] || ROLE_CONFIG.student;

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
                    role: role,
                    courseContext: courseContext
                }),
            });

            const data = await response.json();
            if (data.content) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-pulse"
            >
                <Sparkles className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-card/98 backdrop-blur-2xl border border-primary/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden rounded-2xl ${isMinimized ? 'h-[56px]' : 'h-[500px]'
            }`}>
            {/* Header - Perfectly flush with the top edge */}
            <div className={`relative p-3 flex items-center justify-between bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 transition-colors group rounded-t-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] ${!isMinimized ? 'border-b border-primary/10' : ''
                }`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shadow-inner ring-1 ring-primary/20">
                        {config.icon}
                    </div>
                    <div className="flex flex-col">
                        <p className={`text-sm font-bold tracking-tight ${config.color} leading-none mb-1`}>{config.name}</p>
                        {!isMinimized && <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">Biotech Intelligence</p>}
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 rounded-lg transition-all active:scale-90"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Sparkles className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all active:scale-90"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="text-center py-8 space-y-3">
                                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">Talk to {config.name}</h3>
                                    <p className="text-xs text-muted-foreground px-4">Ask anything about biotechnology, lab protocols, or your curriculum.</p>
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-muted text-foreground rounded-tl-none border border-border/50'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted p-3 rounded-2xl rounded-tl-none border border-border/50 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-border bg-muted/30">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <Input
                                placeholder="Ask your companion..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-background border-primary/20 focus-visible:ring-primary"
                                disabled={loading}
                            />
                            <Button size="icon" className="bg-primary hover:bg-primary/90 text-white shrink-0" disabled={loading || !input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
