const axios = require('axios');

class AIService {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
  }

  // Generate ideas using OpenAI
  async generateWithOpenAI(prompt, options = {}) {
    if (!this.openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: options.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a creative assistant helping teams brainstorm and generate innovative ideas for projects.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        generated_text: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate ideas with OpenAI');
    }
  }

  // Generate ideas using Google Gemini
  async generateWithGemini(prompt, options = {}) {
    if (!this.geminiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiKey}`,
        {
          contents: [{
            parts: [{
              text: `You are a creative assistant helping teams brainstorm. ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 500,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;

      return {
        generated_text: generatedText,
        model: 'gemini-pro'
      };
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate ideas with Gemini');
    }
  }

  // Main method to generate text (tries available services)
  async generateText(prompt, options = {}) {
    const preferredService = options.service || 'openai';

    try {
      if (preferredService === 'openai' && this.openaiKey) {
        return await this.generateWithOpenAI(prompt, options);
      } else if (preferredService === 'gemini' && this.geminiKey) {
        return await this.generateWithGemini(prompt, options);
      } else if (this.openaiKey) {
        return await this.generateWithOpenAI(prompt, options);
      } else if (this.geminiKey) {
        return await this.generateWithGemini(prompt, options);
      } else {
        throw new Error('No AI service configured. Please add API keys to environment variables.');
      }
    } catch (error) {
      console.error('AI Generation Error:', error.message);
      throw error;
    }
  }

  // Generate project insights
  async generateProjectInsights(projectData) {
    const prompt = `Analyze this project data and provide insights:
    - Project: ${projectData.name}
    - Tasks: ${projectData.taskCount} (${projectData.completedTasks} completed)
    - Team size: ${projectData.memberCount}
    - Duration: ${projectData.duration} days
    
    Provide:
    1. Overall project health assessment
    2. Productivity insights
    3. Potential bottlenecks
    4. Recommendations for improvement
    
    Keep it concise and actionable.`;

    return await this.generateText(prompt);
  }

  // Refine an existing idea
  async refineIdea(originalIdea, refinementPrompt) {
    const prompt = `Original idea: "${originalIdea}"
    
    Refinement request: ${refinementPrompt}
    
    Provide an improved version of this idea addressing the refinement request.`;

    return await this.generateText(prompt);
  }

  // Generate task suggestions
  async suggestTasks(projectDescription) {
    const prompt = `Given this project description: "${projectDescription}"
    
    Suggest 5 specific, actionable tasks that would help accomplish this project.
    Format each task as a brief sentence.`;

    return await this.generateText(prompt);
  }
}

module.exports = new AIService();