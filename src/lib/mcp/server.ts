import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim() || '';

// Route by key type
let genAI: any;
if (apiKey.startsWith('AQ')) {
  console.log('📢 AQ key detected in MCP server. Using OAuthGenerativeAI.');
  const { OAuthGenerativeAI, FallbackGenerativeAI } = await import('../adk/oauthModel.js');
  genAI = new FallbackGenerativeAI(new OAuthGenerativeAI(apiKey));
} else if (!apiKey) {
  console.warn('⚠️  No Gemini API key — MCP server using intelligent mock.');
  const { MockGenerativeAI } = await import('../adk/mockModel.js');
  genAI = new MockGenerativeAI();
} else {
  const { FallbackGenerativeAI } = await import('../adk/oauthModel.js');
  genAI = new FallbackGenerativeAI(new GoogleGenerativeAI(apiKey));
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface McpLog {
  id: string;
  direction: 'in' | 'out';
  timestamp: string;
  message: string;
  data: any;
}

export class McpServer {
  private tools: McpTool[] = [];
  public logs: McpLog[] = [];

  constructor() {
    this.registerTools();
  }

  private registerTools() {
    this.tools = [
      {
        name: 'web_search',
        description: 'Performs an educational web search for academic topics, courses, definitions, and tutorials.',
        inputSchema: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'The search query to look up.' },
          },
          required: ['query'],
        },
      },
      {
        name: 'knowledge_retrieval',
        description: 'Retrieves curated textbooks, syllabus guidelines, and textbook chapters for a specific educational subject.',
        inputSchema: {
          type: 'OBJECT',
          properties: {
            subject: { type: 'STRING', description: 'The subject name (e.g., Mathematics, Computer Science, Biology).' },
            topic: { type: 'STRING', description: 'The specific subtopic to query.' },
          },
          required: ['subject'],
        },
      },
      {
        name: 'quiz_generator',
        description: 'Generates a structured multiple-choice quiz on any subject to assess the student.',
        inputSchema: {
          type: 'OBJECT',
          properties: {
            subject: { type: 'STRING', description: 'The subject of the quiz.' },
            difficulty: { type: 'STRING', description: 'Difficulty level: Easy, Medium, or Hard.' },
            numQuestions: { type: 'NUMBER', description: 'Number of questions to generate (usually 3 to 5).' },
          },
          required: ['subject', 'difficulty'],
        },
      },
      {
        name: 'document_analysis',
        description: 'Analyzes uploaded study notes or essays, providing key summaries, concepts, and corrective feedback.',
        inputSchema: {
          type: 'OBJECT',
          properties: {
            content: { type: 'STRING', description: 'The text content of the document to analyze.' },
            focusArea: { type: 'STRING', description: 'What to focus on, e.g., grammatical errors, summary, logical flaws.' },
          },
          required: ['content'],
        },
      },
      {
        name: 'career_navigator',
        description: 'Generates a structured career pathway roadmap for any technology, role, or profession.',
        inputSchema: {
          type: 'OBJECT',
          properties: {
            role: { type: 'STRING', description: 'The target career role or technology (e.g. iOS Developer, Java Backend, DevOps).' },
          },
          required: ['role'],
        },
      },
    ];
  }

  private addLog(direction: 'in' | 'out', message: string, data: any) {
    this.logs.push({
      id: Math.random().toString(36).substring(7),
      direction,
      timestamp: new Date().toISOString(),
      message,
      data,
    });
    // Cap logs at 100 entries
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  public getToolsList(): McpTool[] {
    return this.tools;
  }

  public async handleRequest(rpcRequest: any): Promise<any> {
    const { id, method, params } = rpcRequest;
    this.addLog('in', `JSON-RPC Request: ${method}`, rpcRequest);

    if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          tools: this.tools,
        },
      };
      this.addLog('out', `JSON-RPC Response: tools/list`, response);
      return response;
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params;
      try {
        const result = await this.executeTool(name, args);
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result) }],
          },
        };
        this.addLog('out', `JSON-RPC Response: tools/call (${name})`, response);
        return response;
      } catch (error: any) {
        const response = {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32603,
            message: error.message || 'Internal tool execution error',
          },
        };
        this.addLog('out', `JSON-RPC Error: tools/call (${name})`, response);
        return response;
      }
    }

    const response = {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Method not found: ${method}`,
      },
    };
    this.addLog('out', `JSON-RPC Error: Method not found`, response);
    return response;
  }

  private async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'web_search':
        return this.runWebSearch(args.query);
      case 'knowledge_retrieval':
        return this.runKnowledgeRetrieval(args.subject, args.topic);
      case 'quiz_generator':
        return this.runQuizGenerator(args.subject, args.difficulty, args.numQuestions || 3);
      case 'document_analysis':
        return this.runDocumentAnalysis(args.content, args.focusArea || 'general');
      case 'career_navigator':
        return this.runCareerNavigator(args.role);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async runCareerNavigator(role: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Generate a structured career pathway roadmap for the role: "${role}".
Format the output as a JSON object containing:
- role: Official title of the role (e.g. "Senior iOS Developer")
- salary: Expected average salary range (e.g. "$90,000 - $140,000")
- description: A concise 1-2 sentence description of the role responsibilities.
- stages: An array of exactly 3 progressive stages. Each stage has:
  - title: The name of the stage (e.g. "Stage 1: Core Swift Fundamentals")
  - skills: An array of 3-4 skill objects. Each skill object has:
    - name: The name of the skill, language, framework, or tool (e.g. "SwiftUI")
    - type: The category, which must be exactly one of: "language", "framework", "tool", or "concept"
    - status: The priority, which must be exactly one of: "mandatory", "recommended", or "optional"

Return ONLY valid JSON. Do not include markdown wraps.
    `;
    const res = await model.generateContent(prompt);
    try {
      const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      // Fallback: use MockGenerativeAI from mockModel.ts
      const { MockGenerativeAI } = await import('../adk/mockModel.js');
      const mock = new MockGenerativeAI();
      const mockModel = mock.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const mockPrompt = `Generate a structured career pathway roadmap for the role: "${role}" as JSON.`;
      const mockRes = await mockModel.generateContent(mockPrompt);
      const mockText = mockRes.response.text();
      try {
        return JSON.parse(mockText);
      } catch {
        return JSON.parse(mockText.replace(/```json/g, '').replace(/```/g, '').trim());
      }
    }
  }

  private async runWebSearch(query: string): Promise<any> {
    // We simulate a web search using Gemini 1.5 Flash to fetch structured learning links and summaries
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are acting as an academic search engine. Provide a structured search results page for the query: "${query}".
Format the response as a JSON object with:
- summary: A 2-3 sentence overview of the search topic.
- results: An array of 3 objects, each containing:
  - title: Name of resource (e.g. MDN Web Docs, Khan Academy).
  - url: A logical dummy URL (e.g. https://developer.mozilla.org/react).
  - description: A short sentence summarizing what the resource offers.
Return ONLY valid JSON. Do not include markdown wraps like \`\`\`json.
    `;
    const res = await model.generateContent(prompt);
    try {
      const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return {
        summary: `Search results for "${query}" describing key details.`,
        results: [
          { title: `${query} Overview`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`, description: 'General introductory article.' },
          { title: `${query} Tutorial`, url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(query)}`, description: 'Comprehensive video tutorials and exercises.' },
          { title: `${query} Reference`, url: `https://docs.microsoft.com/search?terms=${encodeURIComponent(query)}`, description: 'Developer references and technical docs.' }
        ]
      };
    }
  }

  private async runKnowledgeRetrieval(subject: string, topic?: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const query = topic ? `${subject} - ${topic}` : subject;
    const prompt = `
You are a knowledge retrieval system fetching textbook summary content for: "${query}".
Provide a JSON object containing:
- subject: "${subject}"
- topic: "${topic || 'General'}"
- keyConcepts: An array of 3 key educational concepts with descriptions.
- contentSummary: A detailed explanation (150-200 words) of the core principles.
Return ONLY valid JSON. Do not include markdown wraps.
    `;
    const res = await model.generateContent(prompt);
    try {
      const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return {
        subject,
        topic: topic || 'Overview',
        keyConcepts: [
          { concept: 'Core Foundation', description: 'The fundamental rules governing this topic.' },
          { concept: 'Application', description: 'How these concepts are applied in practice.' }
        ],
        contentSummary: `This study guide explains the fundamental concepts of ${subject}. Students should focus on understanding the primary definitions, formulas, and historical context.`
      };
    }
  }

  private async runQuizGenerator(subject: string, difficulty: string, numQuestions: number): Promise<any> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Generate a multiple choice quiz about "${subject}" at a "${difficulty}" level.
Generate exactly ${numQuestions} questions. Return questions that are factually accurate,
specific to "${subject}", and NOT generic. Each question must have 4 distinct, plausible options.
Format the output as a JSON object containing:
- quizTitle: Title of the quiz
- questions: An array of objects, where each object has:
  - id: number (1, 2, 3...)
  - questionText: string (specific factual question about ${subject})
  - options: array of 4 strings (realistic, plausible options — NOT "Option A")
  - correctAnswerIndex: number (0, 1, 2, or 3)
  - explanation: string explaining why the answer is correct
Return ONLY valid JSON. Do not include markdown wraps.
    `;
    const res = await model.generateContent(prompt);
    try {
      const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      // Validate that we got real questions, not placeholders
      if (parsed?.questions?.[0]?.options?.some((o: string) => /^option [a-d]$/i.test(o.trim()))) {
        throw new Error('Received placeholder options');
      }
      return parsed;
    } catch (_e) {
      // Fallback: use real question bank from mockModel
      const { MockGenerativeAI } = await import('../adk/mockModel.js');
      const mock = new MockGenerativeAI();
      const mockModel = mock.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const mockPrompt = `Generate a multiple choice quiz about "${subject}" at a "${difficulty}" level with exactly ${numQuestions} questions as JSON.`;
      const mockRes = await mockModel.generateContent(mockPrompt);
      const mockText = mockRes.response.text();
      try {
        return JSON.parse(mockText);
      } catch {
        return JSON.parse(mockText.replace(/```json/g, '').replace(/```/g, '').trim());
      }
    }
  }

  private async runDocumentAnalysis(content: string, focusArea: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Analyze the following student study notes or document.
Focus area: "${focusArea}"
Document Content:
"""
${content}
"""

Provide a JSON object containing:
- summary: A brief summary of the document.
- keyConceptsIdentified: Array of key concepts mentioned.
- weaknessesOrGaps: Array of topics/concepts the student missed or got wrong.
- recommendations: Array of specific recommendations or improvements.
Return ONLY valid JSON. Do not include markdown wraps.
    `;
    const res = await model.generateContent(prompt);
    try {
      const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return {
        summary: 'Analyzed study notes.',
        keyConceptsIdentified: ['General topic'],
        weaknessesOrGaps: ['More detail needed on advanced subtopics'],
        recommendations: ['Supplement notes with external references.']
      };
    }
  }
}
export const globalMcpServer = new McpServer();

