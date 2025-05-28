import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { translateRequestSchema, translateResponseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/translate", async (req, res) => {
    try {
      // Validate request body
      const { text, sourceLanguage, targetLanguage, model } = translateRequestSchema.parse(req.body);
      
      // Get API key from headers
      const apiKey = req.headers['x-openai-api-key'] as string;
      if (!apiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      // Initialize OpenAI with user's API key
      const openai = new OpenAI({ 
        apiKey: apiKey 
      });

      // Create translation prompt
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Return only the translated text without any additional formatting or explanations:

${text}`;

      // Call OpenAI API
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: model || "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional translator. Translate the text accurately and naturally while preserving the original meaning and tone."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const translatedText = response.choices[0].message.content?.trim() || "";

      const result = {
        translatedText,
        sourceText: text,
        sourceLanguage,
        targetLanguage,
        model: model || "gpt-4o"
      };

      // Validate response
      const validatedResult = translateResponseSchema.parse(result);
      
      res.json(validatedResult);
    } catch (error) {
      console.error("Translation error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      
      if (error instanceof OpenAI.APIError) {
        return res.status(error.status || 500).json({ 
          error: "OpenAI API error", 
          details: error.message 
        });
      }
      
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
