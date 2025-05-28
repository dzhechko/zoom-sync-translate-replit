import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const translationRequests = pgTable("translation_requests", {
  id: serial("id").primaryKey(),
  sourceText: text("source_text").notNull(),
  translatedText: text("translated_text").notNull(),
  sourceLanguage: text("source_language").notNull(),
  targetLanguage: text("target_language").notNull(),
  model: text("model").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

export const insertTranslationRequestSchema = createInsertSchema(translationRequests).pick({
  sourceText: true,
  sourceLanguage: true,
  targetLanguage: true,
  model: true,
});

export type InsertTranslationRequest = z.infer<typeof insertTranslationRequestSchema>;
export type TranslationRequest = typeof translationRequests.$inferSelect;

// Client-side schemas for API communication
export const translateRequestSchema = z.object({
  text: z.string().min(1),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  model: z.string().default("gpt-4o"),
});

export type TranslateRequest = z.infer<typeof translateRequestSchema>;

export const translateResponseSchema = z.object({
  translatedText: z.string(),
  sourceText: z.string(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  model: z.string(),
});

export type TranslateResponse = z.infer<typeof translateResponseSchema>;
