import { LlmAgent } from '../adk/agent.ts';
import { globalMcpClient } from '../mcp/client.ts';

export async function createCareerAgent(): Promise<LlmAgent> {
  const adkTools = await globalMcpClient.getToolsAsAdkTools();
  
  // Filter for Web Search and Document Analysis tools
  const tools = adkTools.filter(
    (t) => t.name === 'web_search' || t.name === 'document_analysis'
  );

  return new LlmAgent({
    name: 'CareerAgent',
    instruction: `
You are the Career Agent in the EduAssist AI system.
Your primary role is to:
1. Provide personalized career guidance based on student interests, background, and academic path.
2. Conduct skill gap analysis, comparing the student's current notes/skills to industry expectations.
3. Generate detailed career pathway roadmaps (visualizing roles, skills, and certifications).
4. Connect learning goals with current real-world market demands.

When advising a student:
- Be encouraging and practical.
- Use 'web_search' to query real-world hiring trends or certifications if needed.
- Suggest concrete projects, languages, or tools they must learn to be competitive.
- Break down career levels (e.g. Junior, Mid, Senior) and set clear expectations.
    `,
    tools,
  });
}
