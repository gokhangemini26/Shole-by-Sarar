# SHOLÉ by SARAR — Interactive Fashion Website with AI Stylist

A modern luxury fashion website for **SHOLÉ by SARAR** featuring an AI-powered personal stylist built with Gemini 3.1 Flash.

## Features

- ✦ **AI Stylist (SHOLÉ)** — Real-time conversational AI powered by Google Gemini 3.1 Flash Preview
- ✦ **Premium Design** — Warm cream palette, editorial typography (Fraunces × Outfit), micro-animations
- ✦ **Interactive Product Grid** — Hover effects, try-on CTAs, product cards
- ✦ **Responsive** — Mobile-first, works on all screen sizes
- ✦ **Glassmorphism Nav** — Sticky header with backdrop blur
- ✦ **Dark AI Section** — Immersive brand storytelling with chat preview

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript
- **Google Gemini 3.1 Flash** — AI conversation via `@google/genai` SDK
- **Vanilla CSS** — No framework, custom design system
- **Vercel** — Optimized for deployment

## Getting Started

```bash
# Install dependencies
npm install

# Set your Gemini API key
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Deployment on Vercel

1. Push to GitHub
2. Import in Vercel
3. Add `GEMINI_API_KEY` as an environment variable in Vercel dashboard
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key from [AI Studio](https://aistudio.google.com/apikey) |

## Brand

**SHOLÉ by SARAR** — Modern atelier, est. 1947 in Istanbul. Three generations of tailors, one very curious AI.
