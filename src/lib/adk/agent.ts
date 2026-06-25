import { GoogleGenerativeAI } from '@google/generative-ai';
import { FunctionTool } from './tool';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { ReadableStream } from 'stream/web';

if (!globalThis.ReadableStream) {
  (globalThis as any).ReadableStream = ReadableStream;
}

if (!(globalThis as any).fetch) {
  (globalThis as any).fetch = fetch;
}

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: any;
if (apiKey.startsWith('AQ')) {
  console.log('📢 AQ key detected. Using OAuthGenerativeAI.');
  const { OAuthGenerativeAI, FallbackGenerativeAI } = await import('./oauthModel.js');
  genAI = new FallbackGenerativeAI(new OAuthGenerativeAI(apiKey));
} else if (!apiKey) {
  console.warn('⚠️  No Gemini API key — using intelligent educational mock.');
  const { MockGenerativeAI } = await import('./mockModel.js');
  genAI = new MockGenerativeAI();
} else {
  const { FallbackGenerativeAI } = await import('./oauthModel.js');
  genAI = new FallbackGenerativeAI(new GoogleGenerativeAI(apiKey));
}

export interface AgentStep {
  agentName: string;
  type: 'thought' | 'tool_call' | 'tool_response' | 'text' | 'error';
  message: string;
  details?: any;
  timestamp: string;
}

export interface AgentOptions {
  name: string;
  instruction: string;
  tools?: FunctionTool[];
  model?: string;
}

export class LlmAgent {
  public name: string;
  public instruction: string;
  public tools: FunctionTool[];
  public modelName: string;

  constructor(options: AgentOptions) {
    this.name = options.name;
    this.instruction = options.instruction;
    this.tools = options.tools || [];
    this.modelName = options.model || 'gemini-1.5-flash';
  }

  public async run(
    prompt: string,
    history: any[] = [],
    onStep?: (step: AgentStep) => void
  ): Promise<{ content: string; steps: AgentStep[] }> {
    const steps: AgentStep[] = [];

    const addStep = (type: AgentStep['type'], message: string, details?: any) => {
      const step: AgentStep = {
        agentName: this.name,
        type,
        message,
        details,
        timestamp: new Date().toLocaleTimeString(),
      };
      steps.push(step);
      if (onStep) {
        onStep(step);
      }
    };

    try {
      addStep('thought', `Starting task: "${prompt}"`);

      // Initialize Gemini Model
      const declarations = this.tools.map((t) => t.getDeclaration());
      const model = genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: this.instruction,
        generationConfig: {
          temperature: 0.2,
        },
      });

      // Prepare contents history
      // Gemini structure: { role: 'user' | 'model', parts: [{ text: string } | { functionCall: ... } | { functionResponse: ... }] }
      const contents: any[] = [];

      // Convert history
      for (const h of history) {
        contents.push(h);
      }

      // Add current user prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });

      let maxIterations = 5;
      let iteration = 0;

      while (iteration < maxIterations) {
        iteration++;
        
        // Prepare API call config
        const reqConfig: any = { contents };
        if (declarations.length > 0) {
          reqConfig.tools = [{ functionDeclarations: declarations }];
        }

        addStep('thought', `Sending request to Gemini (${this.modelName})...`);
        let result;
        try {
          result = await model.generateContent(reqConfig);
        } catch (genErr: any) {
          // Generation failure fallback
          const fallbackText = 'Sorry, I could not generate a response.';
          addStep('text', `Fallback response`, fallbackText);
          return { content: fallbackText, steps };
        }

// @ts-ignore // Suppress TS error for candidates property
const candidate = result?.candidates?.[0];
        if (!candidate?.content) {
          const fallbackText = 'Sorry, I could not generate a response.';
          addStep('text', `Fallback response`, fallbackText);
          return { content: fallbackText, steps };
        }

        // Add model's candidate content to conversation history
        const candidateContent = candidate.content;
        if (candidateContent) {
          contents.push(candidateContent);
        }

        // Check for function calls
        const functionCalls = candidate?.content?.parts?.filter((p: any) => p.functionCall);
        if (functionCalls && functionCalls.length > 0) {
          const functionCall = functionCalls[0].functionCall;
          if (functionCall) {
            const toolName = functionCall.name;
            const toolArgs = functionCall.args;
            addStep('tool_call', `Executing tool: ${toolName}`, toolArgs);
            const tool = this.tools.find((t) => t.name === toolName);
            let toolResult: any;
            if (tool) {
              try {
                toolResult = await tool.execute(toolArgs as any);
                addStep('tool_response', `Tool ${toolName} response`, toolResult);
              } catch (err: any) {
                toolResult = { error: err.message || 'Error executing tool' };
                addStep('error', `Tool ${toolName} failed: ${err.message}`, err);
              }
            } else {
              toolResult = { error: `Tool ${toolName} not found` };
              addStep('error', `Tool ${toolName} not found`, { name: toolName });
            }
            // Append tool response for next iteration
            contents.push({
              role: 'user',
              parts: [{ functionResponse: { name: toolName, response: toolResult } }],
            });
            continue; // Proceed to next iteration
          }
        }

        // Final text response
        let responseText = '';
        const parts = candidate?.content?.parts || [];
        for (const p of parts) {
          if (p.text) {
            responseText += typeof p.text === 'string' ? p.text : '';
          }
        }
        if (!responseText || responseText.trim() === '') {
          responseText = 'Sorry, I could not generate a response.';
        }
        addStep('text', `Finished task successfully`, responseText);
        return { content: responseText, steps };
      }

      throw new Error('Exceeded maximum agent execution iterations');
    } catch (error: any) {
      addStep('error', `Agent execution failed: ${error.message}`, error);
      return {
        content: `Sorry, I encountered an error while processing your request: ${error.message}`,
        steps,
      };
    }
  }
}
