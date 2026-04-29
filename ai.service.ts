import Anthropic from '@anthropic-ai/sdk';

export class AIService {
  private static anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  static async getChatCompletion(messages: any[], contextFiles: { path: string, content: string }[]) {
    const systemPrompt = `You are a world-class Android Developer assistant inside a web-based Android IDE. 
    Current project context includes the following files:
` + 
    contextFiles.map(f => `--- ${f.path} ---
${f.content}`).join('

');

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
    });

    return response.content[0];
  }
}