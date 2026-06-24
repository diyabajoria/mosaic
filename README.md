# Mosaic

Mosaic is a Next.js application that turns natural-language prompts, Figma links, and optional reference images into downloadable React + Tailwind frontend prototypes. It includes authentication, user credit tracking, AI-powered generation through Google Gemini, saved project history, live preview, source inspection, and ZIP export.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [API Routes](#api-routes)
- [Data Model](#data-model)
- [Authentication](#authentication)
- [AI Generation Flow](#ai-generation-flow)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)

## Overview

Mosaic provides a prompt-to-frontend workflow for quickly creating polished UI prototypes. Users sign in, describe what they want to build or paste a Figma URL, and Mosaic sends a structured generation request to Gemini. The result is stored as a project with static preview markup, generated source files, notes, and metadata.

The generated project is represented as a Vite React + Tailwind file tree and can be viewed in the in-app preview, inspected file by file, edited through follow-up prompts, starred, renamed, and downloaded as a ZIP archive.

## Features

- Prompt-based frontend generation powered by Gemini.
- Figma URL import mode that converts a Figma design request into a React build prompt.
- Optional reference image attachment for visual guidance.
- Authenticated user accounts with email/password, Google, and GitHub sign-in.
- MongoDB-backed sessions, users, credits, and saved generations.
- Free signup credit allocation and per-generation credit reservation/refund flow.
- Recent generations sidebar with saved project loading.
- Workspace with live iframe preview, code viewer, generated file tree, and ZIP download.
- Follow-up edit flow that passes the current generation context back to Gemini.
- Project rename and starred status updates.
- Protected `/generate` and `/workspace` routes.
- Responsive marketing landing page and authentication screens.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **UI:** React 19, CSS modules/global CSS, Material UI icons, Lucide React
- **Auth:** NextAuth.js with Credentials, Google, and GitHub providers
- **Database:** MongoDB with `@next-auth/mongodb-adapter`
- **Validation:** Zod
- **AI Provider:** Google Gemini Generative Language API
- **Animation:** GSAP and Lenis
- **Password Hashing:** bcryptjs

## Project Structure

```text
.
|-- app/
|   |-- api/
|   |   |-- account/              # Current user credit summary
|   |   |-- auth/                 # NextAuth and signup endpoints
|   |   |-- generate/             # Gemini generation endpoint
|   |   `-- generations/          # Saved generation list and updates
|   |-- dashboard/                # Dashboard page
|   |-- generate/                 # Prompt composer experience
|   |-- learn-more/               # Informational page
|   |-- login/                    # Login page
|   |-- profile/                  # Profile page
|   |-- signup/                   # Signup page
|   |-- workspace/                # Preview, chat, code, and export workspace
|   |-- globals.css               # Global app styling
|   |-- layout.tsx                # Root layout and metadata
|   `-- providers.tsx             # Session and smooth scroll providers
|-- components/
|   |-- AuthForm.tsx              # Login/signup form
|   |-- SignOutButton.tsx         # Sign-out control
|   |-- SmoothScroll.tsx          # Lenis smooth scrolling
|   `-- UserMenu.tsx              # Account menu
|-- lib/
|   |-- account.ts                # Credit accounting helpers
|   |-- auth.ts                   # NextAuth configuration
|   `-- mongodb.ts                # MongoDB client singleton
|-- public/
|   `-- images/                   # Static brand and profile assets
|-- types/
|   `-- next-auth.d.ts            # NextAuth type augmentation
|-- proxy.ts                      # Route protection and auth redirects
|-- package.json
`-- tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB database or MongoDB Atlas cluster
- Google Gemini API key
- Optional Google OAuth credentials
- Optional GitHub OAuth credentials

### Installation

```bash
npm install
```

### Local Configuration

Create a `.env.local` file in the project root:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"

GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.5-flash"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_ID=""
GITHUB_SECRET=""
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string used by NextAuth, users, credits, and generations. |
| `NEXTAUTH_SECRET` | Required in production | Secret used to sign NextAuth JWTs. Development falls back to a local-only default if omitted. |
| `NEXTAUTH_URL` | Recommended | Canonical app URL for NextAuth callbacks. Use `http://localhost:3000` locally. |
| `GEMINI_API_KEY` | Yes | API key for the Google Gemini Generative Language API. |
| `GEMINI_MODEL` | No | Preferred Gemini model. The API route falls back through configured flash models if unavailable. |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret. |
| `GITHUB_ID` | Optional | GitHub OAuth app client ID. |
| `GITHUB_SECRET` | Optional | GitHub OAuth app client secret. |

Do not commit `.env.local` or any production secrets.

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs the configured Next.js lint command.

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Marketing landing page for Mosaic. |
| `/login` | Public only | Login form. Authenticated users are redirected to `/generate`. |
| `/signup` | Public only | Signup form. Authenticated users are redirected to `/generate`. |
| `/generate` | Authenticated | Prompt composer, Figma import mode, reference image attachment, credits, and recent projects. |
| `/workspace` | Authenticated | Live preview, chat/edit flow, file tree, code viewer, ZIP export, project actions. |
| `/profile` | Authenticated UI route | User profile page. |
| `/dashboard` | App route | Dashboard page. |
| `/learn-more` | Public/app route | Informational page. |

Route protection is implemented in `proxy.ts`.

## API Routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/account` | Returns the signed-in user's remaining credits and credit limit. |
| `POST` | `/api/auth/signup` | Creates an email/password account with initial credits. |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth authentication handlers. |
| `POST` | `/api/generate` | Reserves a credit, calls Gemini, stores or updates a generation, and returns the result. |
| `GET` | `/api/generations` | Returns the latest saved generations for the signed-in user. |
| `PATCH` | `/api/generations` | Updates a generation title or starred state. |

## Data Model

Mosaic uses MongoDB collections managed partly by NextAuth and partly by app-specific routes.

### `users`

User documents may include:

- `name`
- `email`
- `emailVerified`
- `image`
- `passwordHash` for credentials users
- `credits`
- `createdAt`
- `updatedAt`

New users receive `FREE_SIGNUP_CREDITS`, currently set to `10` in `lib/account.ts`.

### `generations`

Saved generation documents include:

- `userId`
- `title`
- `summary`
- `prompt`
- `figmaLink`
- `referenceImageName`
- `previewHtml`
- `previewCss`
- `previewJs`
- `files`
- `notes`
- `starred`
- `generatedAt`
- `createdAt`
- `updatedAt`

## Authentication

Authentication is configured in `lib/auth.ts`.

Supported providers:

- Credentials provider using email and password.
- Google OAuth.
- GitHub OAuth.

Sessions use the JWT strategy with a 30-day max age. The session callback adds the user ID, name, email, and profile image to `session.user`.

## AI Generation Flow

1. The user submits a prompt from `/generate` or `/workspace`.
2. `/workspace` sends the prompt, optional Figma link, optional reference image, and optional current project context to `/api/generate`.
3. The API route validates the request with Zod.
4. A generation credit is reserved from the signed-in user's account.
5. The server calls Gemini with strict JSON output instructions.
6. Gemini returns a project payload containing:
   - `title`
   - `summary`
   - `previewHtml`
   - `previewCss`
   - `previewJs`
   - `files`
   - `notes`
7. The response is parsed, validated, saved to MongoDB, and returned to the client.
8. If generation fails, the reserved credit is refunded.

The generated `files` array is expected to represent a Vite React + Tailwind project, including `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `tailwind.config.js`, `postcss.config.js`, and `README.md`.

## Deployment Notes

- Set all required environment variables in the hosting provider.
- Use a production MongoDB database and restrict database network access.
- Set a strong `NEXTAUTH_SECRET`.
- Configure `NEXTAUTH_URL` to the deployed application URL.
- Add deployed callback URLs to Google and GitHub OAuth app settings if those providers are enabled.
- Keep `GEMINI_API_KEY` server-side only. It is used only in `/api/generate`.

## Troubleshooting

### `Missing MONGODB_URI environment variable.`

Add `MONGODB_URI` to `.env.local` and restart the dev server.

### `Gemini API key is not configured.`

Add `GEMINI_API_KEY` to `.env.local` and restart the dev server.

### OAuth login redirects fail

Verify `NEXTAUTH_URL`, provider client IDs/secrets, and callback URLs in the provider console.

### Account is out of credits

New accounts receive 10 free credits. Each successful generation consumes one credit. Failed generation attempts refund the reserved credit.

### Generated preview is blank

The workspace includes fallback preview normalization, but blank previews can still happen if the model returns invalid or incomplete markup. Regenerate or submit a follow-up prompt asking Mosaic to fix the preview output.

## License

This project is private and does not currently declare an open-source license.
