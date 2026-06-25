import { z } from 'zod';

export interface ToolOptions<P extends z.ZodObject<any> = z.ZodObject<any>> {
  name: string;
  description: string;
  parameters: P;
  execute: (args: z.infer<P>) => Promise<any>;
}

export class FunctionTool<P extends z.ZodObject<any> = z.ZodObject<any>> {
  public name: string;
  public description: string;
  public parameters: P;
  public execute: (args: z.infer<P>) => Promise<any>;

  constructor(options: ToolOptions<P>) {
    this.name = options.name;
    this.description = options.description;
    this.parameters = options.parameters;
    this.execute = options.execute;
  }

  // Generate OpenAI-compatible tool declaration (used by Gemini API)
  public getDeclaration() {
    // Generate JSON schema from Zod parameters
    const properties: Record<string, any> = {};
    const required: string[] = [];

    const shape = this.parameters.shape;
    for (const key in shape) {
      const field = shape[key];
      let typeStr = 'string';
      let descriptionStr = '';

      if (field instanceof z.ZodNumber) {
        typeStr = 'number';
      } else if (field instanceof z.ZodBoolean) {
        typeStr = 'boolean';
      } else if (field instanceof z.ZodArray) {
        typeStr = 'array';
      } else if (field instanceof z.ZodObject) {
        typeStr = 'object';
      }

      // Check description
      if (field.description) {
        descriptionStr = field.description;
      }

      properties[key] = {
        type: typeStr,
        description: descriptionStr,
      };

      if (!field.isOptional()) {
        required.push(key);
      }
    }

    return {
      name: this.name,
      description: this.description,
      parameters: {
        type: 'OBJECT',
        properties,
        required,
      },
    };
  }
}
