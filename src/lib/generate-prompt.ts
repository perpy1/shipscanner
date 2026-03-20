import { Idea, Category } from "@/types";

const stackSuggestions: Partial<Record<Category, string>> = {
  SaaS: "Next.js + Supabase + Stripe",
  "Developer Tool": "Node.js CLI or VS Code extension + TypeScript",
  Marketplace: "Next.js + Supabase + Stripe Connect",
  "AI/ML": "Next.js + Anthropic Claude API + Vercel AI SDK",
  Productivity: "Next.js + localStorage or Supabase + PWA",
  Social: "Next.js + Supabase Realtime + Auth",
  Fintech: "Next.js + Plaid API + Stripe",
  Health: "Next.js + Supabase + PWA + Chart.js",
  Education: "Next.js + Supabase + MDX for content",
  "E-commerce": "Next.js + Shopify API or Stripe",
};

export function generateClaudePrompt(idea: Idea): string {
  const stack = stackSuggestions[idea.category] ?? "Next.js + Supabase";

  return `I want to build an app called "${idea.name}".

## The Problem
${idea.pain_point}

## Target Audience
${idea.target_audience}

## Core Idea
${idea.one_liner}

${idea.description}

## Monetization Strategy
${idea.monetization}

## Requirements
- Category: ${idea.category}
- Difficulty: ${idea.difficulty}
- Suggested stack: ${stack}

Please help me build this step by step. Start with:
1. A project structure and initial setup
2. The core data models
3. The main feature implementation
4. A simple but polished UI

Keep it lean — MVP first, ship fast. Use modern best practices and make it production-ready.`;
}
