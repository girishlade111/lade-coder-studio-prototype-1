# Lade Coder Studio (Prototype 1)

An AI-powered **coding-studio prototype** built with Next.js 15, GenKit, and Google Gemini — it generates websites and offers AI suggestions and chat assistance from inside the studio UI. Started as a Firebase Studio (formerly Project IDX) starter and extended with AI flows.

## Features

- 🤖 **AI website generation** (`src/ai/flows/website-generation.ts`) — describe a site, get generated code
- 💡 **AI suggestions** (`src/ai/flows/ai-suggestions.ts`) — contextual code/design suggestions
- 💬 **AI chat assistant** (`src/ai/flows/chat.ts`) — conversational help inside the studio
- 🖥️ Studio workspace UI (`src/components/main-view`) with shadcn/ui components
- ⚡ Next.js App Router + Turbopack dev server on port 9002

## Tech Stack

- **Framework:** Next.js 15 (App Router), React, TypeScript
- **AI:** GenKit (`genkit`, `@genkit-ai/googleai`, `@genkit-ai/next`) with `googleai/gemini-2.0-flash`
- **Styling:** Tailwind CSS, shadcn/ui (Radix UI primitives)
- **Forms:** React Hook Form + Zod

## Quick Start

```bash
npm install
npm run dev        # http://localhost:9002
```

### Required: Google AI API key

The AI flows call Gemini server-side via GenKit. Create a `.env` file:

```bash
GOOGLE_GENAI_API_KEY="your-google-ai-api-key"
```

Get a key at https://aistudio.google.com/app/apikey.

Run the GenKit dev UI alongside the app to inspect flows:

```bash
npm run genkit:dev
```

## Project Structure

```
src/
  ai/
    genkit.ts             # GenKit init (googleAI plugin, gemini-2.0-flash)
    dev.ts                # GenKit dev entry
    flows/
      website-generation.ts
      ai-suggestions.ts
      chat.ts
  app/
    page.tsx              # entry -> <MainView />
    actions.ts            # server actions invoking the AI flows
  components/
    main-view.tsx         # studio workspace UI
    ui/                   # shadcn/ui primitives
docs/                     # additional docs
apphosting.yaml           # Firebase App Hosting config
```

## Deployment

This is a **dynamic** app — it needs a Node server (API routes/server actions) and the `GOOGLE_GENAI_API_KEY` secret. Deploy to a platform that supports Next.js server functions (Vercel, Netlify, Firebase App Hosting) with the env var set. It cannot be statically exported.

## Status

🚧 Prototype — experimental AI studio concept; expect rough edges.

---

Built by Girish Lade — https://ladestack.in
