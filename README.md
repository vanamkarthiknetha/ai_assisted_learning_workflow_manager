# AI-Assisted Learning Workflow Manager

A modern, production-quality full-stack web application that helps learners organize learning goals, track resources, monitor progress, and receive AI-assisted support for summarization and study planning.

## Project Overview

This application addresses a common problem: learners often consume content without structure, leading to poor retention, inconsistent progress, and lack of direction. The Learning Workflow Manager provides:

- **Goal-oriented learning** - Set clear objectives with target dates
- **Resource organization** - Track videos, articles, and courses
- **Progress visibility** - Visual progress tracking per goal
- **AI-powered assistance** - Smart summaries and personalized study plans

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth v5 (credentials provider)
- **AI**: Google Gemini
- **Deployment**: Vercel

## Architecture Decisions

### Server Actions Over API Routes

This project uses **Next.js Server Actions** for all mutations and AI calls instead of traditional API routes. Benefits include:

- Cleaner code with colocation of actions and components
- Automatic form handling with progressive enhancement
- Type-safe data mutations
- Reduced client-side JavaScript

### Server Components by Default

The application prioritizes **Server Components** for:
- Better initial page load performance
- Reduced client-side bundle size
- Direct database access without API layer
- Improved SEO

**Client Components** are used only when necessary:
- Interactive forms and dialogs
- Real-time UI updates (loading states, toasts)
- Browser-only features (clipboard API)

### Simple State Management

No external state management libraries (Redux, Zustand). State is managed through:
- Server state via React Server Components
- URL state for navigation
- Local component state for UI interactions

## Project Structure

```
├── app/
│   ├── (auth)/              # Auth layout group
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── (protected)/         # Protected layout group
│   │   ├── dashboard/       # Main dashboard
│   │   ├── goals/[id]/      # Goal detail page
│   │   └── ai/              # AI tools page
│   ├── actions/             # Server actions
│   │   ├── auth.ts          # Authentication actions
│   │   ├── goals.ts         # Goal CRUD actions
│   │   ├── resources.ts     # Resource CRUD actions
│   │   ├── notes.ts         # Notes CRUD actions
│   │   └── ai.ts            # AI feature actions
│   ├── api/auth/            # NextAuth API routes
│   └── generated/prisma/    # Generated Prisma client
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Authentication forms
│   ├── goals/               # Goal-related components
│   ├── resources/           # Resource-related components
│   ├── notes/               # Note-related components
│   └── ai/                  # AI feature components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # Prisma client singleton
│   ├── session.ts           # Session utilities
│   ├── ai.ts                # AI configuration
│   └── validations/         # Zod schemas
├── prisma/
│   └── schema.prisma        # Database schema
└── types/
    └── next-auth.d.ts       # Type augmentations
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  goals     Goal[]
}

model Goal {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      GoalStatus
  targetDate  DateTime?
  userId      String
  user        User       @relation(...)
  resources   Resource[]
  notes       Note[]
}

model Resource {
  id        String       @id @default(cuid())
  title     String
  type      ResourceType
  url       String
  completed Boolean
  goalId    String
  goal      Goal         @relation(...)
  notes     Note[]
}

model Note {
  id         String    @id @default(cuid())
  content    String
  goalId     String?
  resourceId String?
  goal       Goal?     @relation(...)
  resource   Resource? @relation(...)
}
```

## AI Integration

### Resource Summarization
- Input: Pasted learning content (50-10,000 characters)
- Output: Short summary (3-4 sentences) + bullet-point key takeaways
- Uses Gemini's `gemini-2.5-flash` model for fast responses

### Study Plan Generator
- Input: Goal title, optional description, target completion date
- Output: Week-by-week study plan with focus areas
- Calculates available weeks and distributes content appropriately

### Implementation Details
- All AI calls happen in Server Actions (never exposed to client)
- Clean prompt engineering with structured output formats
- Proper error handling with user-friendly messages
- Input validation with Zod before AI processing

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI API key (for Gemini)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai_assisted_learning_workflow_manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following in `.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# NextAuth
AUTH_SECRET="your-secure-secret-key"
AUTH_TRUST_HOST=true

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

### Getting API Keys

**Google Gemini API Key**:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create or select a project
3. Generate an API key
4. Add to `.env` as `GOOGLE_GENERATIVE_AI_API_KEY`

## Features

### Authentication
- Email/password registration and login
- Secure password hashing with bcrypt
- JWT-based session management
- Protected routes via middleware

### Learning Goals
- Create, read, update, delete goals
- Status tracking (Not Started, In Progress, Completed)
- Target completion dates
- Progress calculation based on resources

### Learning Resources
- Add videos, articles, or courses to goals
- Mark resources as complete
- External URL linking
- Resource type categorization

### Notes
- Free-form notes linked to goals
- Edit and delete functionality
- Timestamp tracking

### Progress Tracking
- Automatic progress calculation
- Visual progress bars
- Dashboard statistics

### AI Tools
- Content summarization with key takeaways
- Personalized study plan generation
- Copy-to-clipboard functionality

## Security Considerations

- All passwords hashed with bcrypt (12 rounds)
- Input validation with Zod on all server actions
- Auth checks in every protected server action
- Environment variables for sensitive data
- CSRF protection via NextAuth
- No secrets exposed to client

## Future Improvements

1. **Social Features**
   - Share goals and progress
   - Collaborative learning groups

2. **Enhanced AI**
   - Resource content extraction from URLs
   - Personalized learning recommendations
   - Progress-based plan adjustments

3. **Integrations**
   - Calendar sync for study sessions
   - Import resources from bookmarks
   - Export progress reports

4. **Gamification**
   - Achievement badges
   - Streak tracking
   - Learning milestones

## License

MIT License - see LICENSE file for details.
