import { LlmAgent, AgentStep } from '../adk/agent.ts';
import { SequentialWorkflow, ParallelWorkflow } from '../adk/workflow.ts';
import { createLearningAgent } from './learningAgent.ts';
import { createAssessmentAgent } from './assessmentAgent.ts';
import { createCareerAgent } from './careerAgent.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
// Load environment variables safely
import * as dotenv from 'dotenv';
dotenv.config();

const rawApiKey = process.env.GEMINI_API_KEY?.trim() || '';

// Route by key type
let genAI: any;
if (rawApiKey.startsWith('AQ')) {
  console.log('📢 AQ key detected in coordinator. Using OAuthGenerativeAI.');
  const { OAuthGenerativeAI, FallbackGenerativeAI } = await import('../adk/oauthModel.js');
  genAI = new FallbackGenerativeAI(new OAuthGenerativeAI(rawApiKey));
} else if (!rawApiKey) {
  console.warn('⚠️  No Gemini API key — using intelligent educational mock.');
  const { MockGenerativeAI } = await import('../adk/mockModel.js');
  genAI = new MockGenerativeAI();
} else {
  const { FallbackGenerativeAI } = await import('../adk/oauthModel.js');
  genAI = new FallbackGenerativeAI(new GoogleGenerativeAI(rawApiKey));
}

export class CoordinatorAgent {
  private learningAgent!: LlmAgent;
  private assessmentAgent!: LlmAgent;
  private careerAgent!: LlmAgent;
  private rootAgent!: LlmAgent;

  constructor() {
    // We will initialize specialized agents asynchronously before execution
  }

  public async initialize() {
    this.learningAgent = await createLearningAgent();
    this.assessmentAgent = await createAssessmentAgent();
    this.careerAgent = await createCareerAgent();
    
    // An agent to analyze and route requests
    this.rootAgent = new LlmAgent({
      name: 'CoordinatorRouter',
      instruction: `
You are the Routing Coordinator in the EduAssist AI multi-agent system.
Your job is to read the student request and determine the routing strategy:
- "LEARNING": If the request is primarily about learning concepts, explaining a topic, recommending courses, or requesting a personalized study plan.
- "ASSESSMENT": If the request is primarily about taking a quiz, testing knowledge, scoring a quiz response, or checking progress.
- "CAREER": If the request is about job roles, career choices, skill gap analysis, or professional roadmaps.
- "COMBINED_CAREER_LEARNING": If the request is about preparing for a specific career path AND asks for a custom learning plan/timeline (requires sequential flow: Career guidance then Study plan).
- "COMBINED_LEARNING_ASSESSMENT": If the request asks to learn a subject AND immediately generate a quiz to test it (requires parallel execution or multi-agent workflow).
- "GENERAL": If the query is just a greeting, basic chat, or general assistance.

Response Format:
Return ONLY a JSON object with:
- routingStrategy: one of the strings above.
- explanation: A short 1-sentence reason.
Return ONLY valid JSON.
      `,
    });
  }

  public async run(
    prompt: string,
    history: any[] = [],
    onStep?: (step: AgentStep) => void
  ): Promise<{ content: string; steps: AgentStep[] }> {
    const allSteps: AgentStep[] = [];
    const addCoordinatorStep = (type: AgentStep['type'], message: string, details?: any) => {
      const step: AgentStep = {
        agentName: 'Coordinator',
        type,
        message,
        details,
        timestamp: new Date().toLocaleTimeString(),
      };
      allSteps.push(step);
      if (onStep) onStep(step);
    };

    if (!this.learningAgent) {
      addCoordinatorStep('thought', 'Initializing specialized sub-agents...');
      await this.initialize();
    }

    addCoordinatorStep('thought', `Analyzing student request: "${prompt}"`);

    // Determine routing strategy
    const routeRes = await this.rootAgent.run(prompt, []);
    let strategy = 'GENERAL';
    try {
      const parsed = JSON.parse(routeRes.content.replace(/```json/g, '').replace(/```/g, '').trim());
      strategy = parsed.routingStrategy || 'GENERAL';
      addCoordinatorStep('thought', `Determined routing strategy: ${strategy}. Reason: ${parsed.explanation}`);
    } catch {
      addCoordinatorStep('thought', 'Failed to parse JSON routing strategy. Defaulting to general direct response.');
    }

    switch (strategy) {
      case 'LEARNING':
        addCoordinatorStep('thought', 'Routing task to [LearningAgent]...');
        const learnResult = await this.learningAgent.run(prompt, history, (step) => {
          allSteps.push(step);
          if (onStep) onStep(step);
        });
        return { content: learnResult.content, steps: allSteps };

      case 'ASSESSMENT':
        addCoordinatorStep('thought', 'Routing task to [AssessmentAgent]...');
        const assessResult = await this.assessmentAgent.run(prompt, history, (step) => {
          allSteps.push(step);
          if (onStep) onStep(step);
        });
        return { content: assessResult.content, steps: allSteps };

      case 'CAREER':
        addCoordinatorStep('thought', 'Routing task to [CareerAgent]...');
        const careerResult = await this.careerAgent.run(prompt, history, (step) => {
          allSteps.push(step);
          if (onStep) onStep(step);
        });
        return { content: careerResult.content, steps: allSteps };

      case 'COMBINED_CAREER_LEARNING':
        addCoordinatorStep('thought', 'Orchestrating Sequential Workflow: Career path analysis followed by Study Plan...');
        const seqWorkflow = new SequentialWorkflow('CareerToStudyPlan', [
          this.careerAgent,
          this.learningAgent,
        ]);
        const seqResult = await seqWorkflow.run(
          `For the following request, first analyze the career requirements/skills needed, and then generate a day-by-day learning plan based on that guidance: "${prompt}"`,
          (step) => {
            allSteps.push(step);
            if (onStep) onStep(step);
          }
        );
        return { content: seqResult.content, steps: allSteps };

      case 'COMBINED_LEARNING_ASSESSMENT':
        addCoordinatorStep('thought', 'Orchestrating Parallel Workflow: Explaining concept and preparing practice assessment simultaneously...');
        const synthAgent = new LlmAgent({
          name: 'Synthesizer',
          instruction: 'You synthesize study notes and quizzes into a unified lesson page. Present the conceptual study material clearly, followed by the quiz, and conclude with learning advice.',
        });
        const parWorkflow = new ParallelWorkflow(
          'LearnAndAssess',
          [this.learningAgent, this.assessmentAgent],
          synthAgent
        );
        const parResult = await parWorkflow.run(prompt, (step) => {
          allSteps.push(step);
          if (onStep) onStep(step);
        });
        return { content: parResult.content, steps: allSteps };

      case 'GENERAL':
      default:
        // Handle generally using Gemini
        addCoordinatorStep('thought', 'Handling request directly as general assistance...');
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: 'You are the primary EduAssist support assistant. Greet the student, offer help with learning, study planning, testing knowledge, or career roadmaps. Be welcoming and concise.',
        });
        const res = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
        const text = res.response.text() || '';
        addCoordinatorStep('text', 'Coordinator response generated.', text);
        return { content: text, steps: allSteps };
    }
  }
}

export const globalCoordinator = new CoordinatorAgent();
