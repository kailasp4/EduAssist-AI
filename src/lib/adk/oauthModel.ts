/**
 * OAuthGenerativeAI
 * Drop-in replacement for GoogleGenerativeAI that authenticates using
 * an OAuth 2.0 Bearer token (keys starting with "AQ.").
 *
 * Usage: new OAuthGenerativeAI(token).getGenerativeModel({ model: 'gemini-1.5-flash' })
 */
export class OAuthGenerativeAI {
  private token: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(token: string) {
    this.token = token;
  }

  getGenerativeModel(options: {
    model: string;
    systemInstruction?: string;
    generationConfig?: any;
  }) {
    const { model, systemInstruction, generationConfig } = options;
    const token = this.token;
    const baseUrl = this.baseUrl;

    return {
      async generateContent(input: any) {
        const body: any = {};

        // Normalize input — can be a string or a full request object
        if (typeof input === 'string') {
          body.contents = [{ role: 'user', parts: [{ text: input }] }];
        } else {
          body.contents = input.contents || [];
          if (input.tools) body.tools = input.tools;
        }

        if (systemInstruction) {
          body.systemInstruction = { parts: [{ text: systemInstruction }] };
        }

        if (generationConfig) {
          body.generationConfig = generationConfig;
        }

        const url = `${baseUrl}/models/${model}:generateContent`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(
            `[OAuthGenerativeAI Error]: Error fetching from ${url}: [${res.status} ${res.statusText}] ${errText}`
          );
        }

        const data = (await res.json()) as any;

        // Return shape compatible with both the SDK and agent.ts usage
        return {
          ...data,
          response: {
            text: () => {
              const candidate = data.candidates?.[0];
              return (
                candidate?.content?.parts
                  ?.map((p: any) => p.text || '')
                  .join('') || ''
              );
            },
          },
        };
      },
    };
  }
}

export class FallbackGenerativeAI {
  private primaryAI: any;

  constructor(primaryAI: any) {
    this.primaryAI = primaryAI;
  }

  getGenerativeModel(options: any) {
    const realModel = this.primaryAI.getGenerativeModel(options);
    return {
      async generateContent(input: any) {
        try {
          return await realModel.generateContent(input);
        } catch (error: any) {
          const errorMsg = error.message || '';
          const isAuthOrKeyError =
            errorMsg.includes('API_KEY') ||
            errorMsg.includes('unauthenticated') ||
            errorMsg.includes('authentication') ||
            errorMsg.includes('credentials') ||
            errorMsg.includes('API_KEY_SERVICE_BLOCKED') ||
            errorMsg.includes('401') ||
            errorMsg.includes('403') ||
            errorMsg.includes('400');

          if (isAuthOrKeyError) {
            console.warn(
              '⚠️ Gemini API call failed with auth/key error. Falling back to intelligent mock model:',
              errorMsg
            );
            const { MockGenerativeAI } = await import('./mockModel.js');
            const mockAI = new MockGenerativeAI();
            const mockModel = mockAI.getGenerativeModel(options);
            return await mockModel.generateContent(input);
          }
          throw error;
        }
      },
    };
  }
}
