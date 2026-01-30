import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    try {
      const apiKey = (typeof process !== 'undefined' && process.env && process.env['API_KEY']) ? process.env['API_KEY'] : '';
      if (apiKey) {
        this.ai = new GoogleGenAI({ apiKey });
      } else {
        console.warn('Gemini API Key missing');
      }
    } catch (e) {
      console.error('Error initializing Gemini', e);
    }
  }

  async generateText(prompt: string, systemInstruction: string): Promise<string | null> {
    if (!this.ai) return null;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  }
}
