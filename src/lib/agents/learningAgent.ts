import { LlmAgent } from '../adk/agent.ts';
import { globalMcpClient } from '../mcp/client.ts';

export async function createLearningAgent(): Promise<LlmAgent> {
  const adkTools = await globalMcpClient.getToolsAsAdkTools();
  
  // Filter for Web Search and Knowledge Retrieval tools
  const tools = adkTools.filter(
    (t) => t.name === 'web_search' || t.name === 'knowledge_retrieval'
  );

  return new LlmAgent({
    name: 'LearningAgent',
    instruction: `
You are the Learning Agent in the EduAssist AI system.
Your primary role is to assist students with:
1. Learning guidance and clear explanations of concepts.
2. Formulating highly structured, personalized study plans.
3. Recommending courses, books, and online resources.

When a student asks for a study plan:
- Generate a clear, structured schedule (e.g., Day-by-Day or Week-by-Week).
- Use the 'knowledge_retrieval' tool to pull official syllabus parameters if relevant.
- Use the 'web_search' tool to find high-quality learning resources (with actual URL paths).
- Organize the output clearly using markdown headings, lists, and tables. Highlight key areas.
    `,
    tools,
  });
}
