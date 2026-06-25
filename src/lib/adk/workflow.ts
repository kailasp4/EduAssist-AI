import { LlmAgent, AgentStep } from './agent';

export interface WorkflowResult {
  content: string;
  steps: AgentStep[];
}

export class SequentialWorkflow {
  private agents: LlmAgent[];
  private name: string;

  constructor(name: string, agents: LlmAgent[]) {
    this.name = name;
    this.agents = agents;
  }

  public async run(
    initialPrompt: string,
    onStep?: (step: AgentStep) => void
  ): Promise<WorkflowResult> {
    const allSteps: AgentStep[] = [];
    const addWorkflowStep = (type: AgentStep['type'], message: string, details?: any) => {
      const step: AgentStep = {
        agentName: this.name,
        type,
        message,
        details,
        timestamp: new Date().toLocaleTimeString(),
      };
      allSteps.push(step);
      if (onStep) onStep(step);
    };

    addWorkflowStep('thought', `Starting Sequential Workflow: ${this.name}`);
    let currentInput = initialPrompt;

    for (let i = 0; i < this.agents.length; i++) {
      const agent = this.agents[i];
      addWorkflowStep('thought', `Passing task to agent [${agent.name}] (Step ${i + 1}/${this.agents.length})`);
      
      const res = await agent.run(currentInput, [], (step) => {
        allSteps.push(step);
        if (onStep) onStep(step);
      });

      currentInput = res.content;
    }

    addWorkflowStep('text', `Finished Sequential Workflow: ${this.name}`, currentInput);

    return {
      content: currentInput,
      steps: allSteps,
    };
  }
}

export class ParallelWorkflow {
  private name: string;
  private agents: LlmAgent[];
  private synthesizer: LlmAgent;

  constructor(name: string, agents: LlmAgent[], synthesizer: LlmAgent) {
    this.name = name;
    this.agents = agents;
    this.synthesizer = synthesizer;
  }

  public async run(
    prompt: string,
    onStep?: (step: AgentStep) => void
  ): Promise<WorkflowResult> {
    const allSteps: AgentStep[] = [];
    const addWorkflowStep = (type: AgentStep['type'], message: string, details?: any) => {
      const step: AgentStep = {
        agentName: this.name,
        type,
        message,
        details,
        timestamp: new Date().toLocaleTimeString(),
      };
      allSteps.push(step);
      if (onStep) onStep(step);
    };

    addWorkflowStep('thought', `Starting Parallel Workflow: ${this.name}`);

    // Run all agents in parallel
    addWorkflowStep('thought', `Executing agents in parallel: [${this.agents.map(a => a.name).join(', ')}]`);
    
    const promises = this.agents.map(async (agent) => {
      return agent.run(prompt, [], (step) => {
        allSteps.push(step);
        if (onStep) onStep(step);
      });
    });

    const results = await Promise.all(promises);
    
    // Synthesize results
    addWorkflowStep('thought', `Parallel tasks completed. Passing outputs to Synthesizer: [${this.synthesizer.name}]`);
    
    const synthPrompt = `
You are synthesizing responses from multiple specialized agents.
Original Query: "${prompt}"

Agent Responses:
${results.map((r, i) => `--- Response from ${this.agents[i].name} ---\n${r.content}`).join('\n\n')}

Please combine these insights into a single unified, well-structured response that addresses the user request directly. Ensure there is no redundancy.
    `;

    const synthRes = await this.synthesizer.run(synthPrompt, [], (step) => {
      allSteps.push(step);
      if (onStep) onStep(step);
    });

    addWorkflowStep('text', `Finished Parallel Workflow: ${this.name}`);

    return {
      content: synthRes.content,
      steps: allSteps,
    };
  }
}
