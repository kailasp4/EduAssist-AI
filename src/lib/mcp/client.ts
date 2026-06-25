import { FunctionTool } from '../adk/tool.ts';
import { globalMcpServer } from './server.ts';
import { z } from 'zod';

export class McpClient {
  public async callMcpTool(name: string, args: any): Promise<any> {
    const id = Math.random().toString(36).substring(7);
    const rpcRequest = {
      jsonrpc: '2.0',
      id,
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    };

    const rpcResponse = await globalMcpServer.handleRequest(rpcRequest);
    
    if (rpcResponse.error) {
      throw new Error(rpcResponse.error.message || `MCP Tool call to ${name} failed`);
    }

    const textContent = rpcResponse.result?.content?.[0]?.text;
    if (!textContent) {
      return [];
    }

    try {
      return JSON.parse(textContent);
    } catch {
      return textContent;
    }
  }

  public async getToolsAsAdkTools(): Promise<FunctionTool[]> {
    // 1. Get tools list from MCP Server
    const id = Math.random().toString(36).substring(7);
    const rpcResponse = await globalMcpServer.handleRequest({
      jsonrpc: '2.0',
      id,
      method: 'tools/list',
      params: {},
    });

    const mcpTools = rpcResponse.result?.tools || [];
    
    // 2. Wrap each MCP tool into an ADK FunctionTool
    return mcpTools.map((tool: any) => {
      let zodSchema: z.ZodObject<any>;

      // Determine Zod Schema based on tool name
      if (tool.name === 'web_search') {
        zodSchema = z.object({
          query: z.string().describe('The academic search query to look up.'),
        });
      } else if (tool.name === 'knowledge_retrieval') {
        zodSchema = z.object({
          subject: z.string().describe('The subject name (e.g. Mathematics, Computer Science).'),
          topic: z.string().optional().describe('Specific subtopic/chapter.'),
        });
      } else if (tool.name === 'quiz_generator') {
        zodSchema = z.object({
          subject: z.string().describe('The subject of the quiz.'),
          difficulty: z.string().describe('Difficulty level: Easy, Medium, or Hard.'),
          numQuestions: z.number().optional().describe('Number of questions (default 3).'),
        });
      } else if (tool.name === 'document_analysis') {
        zodSchema = z.object({
          content: z.string().describe('The text content of the document to analyze.'),
          focusArea: z.string().optional().describe('Grammar review, summary, logical flow, etc.'),
        });
      } else {
        zodSchema = z.object({}).passthrough() as any;
      }

      return new FunctionTool({
        name: tool.name,
        description: tool.description,
        parameters: zodSchema,
        execute: async (args) => {
          return this.callMcpTool(tool.name, args);
        },
      });
    });
  }
}

export const globalMcpClient = new McpClient();
