import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPTS: Record<string, string> = {
  student: `You are "BioBuddy", an adaptive biotech learning companion for students. 
  
  RESPONSE GUIDELINES:
  - STRUCTURE: Always provide structured, point-by-point explanations. Use clear headings or bullet points.
  - TONE: High-empathy, encouraging, and easy to understand. Use natural analogies.
  - ADAPTIVITY: Adjust your complexity based on the student's question. If they seem confused, simplify further.
  - FORMAT: Avoid long blocks of text. Break information into digestible "bites".
  - FOCUS: Biotechnology and life sciences.`,

  educator: `You are "CurriculumGenie", a strategic and adaptive assistant for biotech educators. 
  
  RESPONSE GUIDELINES:
  - STRUCTURE: Provide clear, actionable, point-by-point advice. Use structured outlines for curriculum or lesson ideas.
  - TONE: Professional, resourceful, and supportive.
  - ADAPTIVITY: Tailor your suggestions to the specific educational level or context mentioned by the educator.
  - FORMAT: Use lists, tables (in text), or numbered steps to organize complex teaching strategies.
  - FOCUS: Pedagogy, curriculum standards, and practical lab activities.`,

  researcher: `You are "LabMate", a high-precision technical partner for biotech researchers. 
  
  RESPONSE GUIDELINES:
  - STRUCTURE: Deliver precise, structured, and technical point-by-point explanations.
  - TONE: Professional, objective, and detail-oriented.
  - ADAPTIVITY: Respond with technical depth matching the researcher's query. If they ask about a protocol, provide it in clear experimental steps.
  - FORMAT: Use numbered lists for protocols and bullet points for data interpretation or technical pros/cons.
  - FOCUS: Advanced protocols, data science in biotech, molecular biology, and industry standards.`
};

export async function POST(req: Request) {
  try {
    const { messages, role, mode, courseContext } = await req.json();

    let systemPrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.student;

    // Specialized prompt for Course Design mode
    if (mode === 'designer' && role === 'educator') {
      const { title, description } = courseContext || {};
      systemPrompt = `You are the "Flora Course Architect". 
        Your goal is to help educators design professional, high-impact biotechnology courses for the Flora platform.
        
        ${title ? `IMPORTANT: The user wants to design a course titled "${title}".` : ''}
        ${description ? `INITIAL DESCRIPTION PROVIDED: "${description}"` : ''}
        ${(title || description) ? `Always prioritize and build upon these initial details.` : ''}

        PHASES OF INTERACTION:
        1. STRATEGIZE: Brainstorm topics, target audience, and learning objectives.
        2. DRAFT: Outline the lesson structure and key concepts.
        3. FINALIZE: Generate the complete course JSON.
        
        OUTPUT RULES:
        - Use Markdown for all lesson content (Bold, Lists, Headers).
        - Ensure scientific accuracy and depth.
        - When ready, output ONLY the final JSON block:
        {
          "title": "${title || 'Course Title'}",
          "description": "${description || 'Engaging summary'}",
          "totalLessons": 10,
          "topics": ["Gene Editing", "CRISPR", ...],
          "lessons": [
            {"title": "Lesson 1: Intro", "content": "Comprehensive markdown content..."}
            ...
          ]
        }`;
    }

    // Grounding for specific course context
    if (courseContext && courseContext.title) {
      systemPrompt += `\n\nCURRENT CONTEXT: You are currently assisting the user within the course "${courseContext.title}".`;
      if (courseContext.topics && Array.isArray(courseContext.topics) && courseContext.topics.length > 0) {
        systemPrompt += ` Focus your answers specifically on the topics: ${courseContext.topics.join(', ')}.`;
      }
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const lastMessage = messages[messages.length - 1].content;
    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Gemini API requirement: History must start with a user message
    if (history.length > 0 && history[0].role === 'model') {
      history.unshift({
        role: 'user',
        parts: [{ text: "Hello! Let's get started." }],
      });
    }

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessageStream(lastMessage);

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
