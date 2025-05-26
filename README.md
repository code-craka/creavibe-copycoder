# CreaVibe - AI-Powered Content Creation Platform

CreaVibe is a modern web application built with Next.js that provides AI-powered content creation tools, project management, and analytics capabilities.

## Features

- 🤖 AI-powered content generation
- 📊 Analytics dashboard
- 🔑 API token management
- 👤 User authentication
- 💳 Subscription management
- 📱 Responsive design
- 🌓 Dark mode support
- 📧 Email integration
- 🔍 SEO optimization

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Analytics**: PostHog
- **Email**: Resend
- **Payments**: Stripe
- **Caching**: Upstash Redis
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Resend account (for email functionality)
- PostHog account (for analytics)
- Stripe account (for payments)
- Upstash Redis account (for caching)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/creavibe.git
   cd creavibe
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   Then fill in the values in `.env.local` with your actual API keys and credentials.

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new project in Supabase
2. Run the SQL migrations in the `db/migrations` directory
3. Set up Row Level Security (RLS) policies as needed

## Project Structure

\`\`\`
creavibe/
├── app/                  # Next.js App Router
│   ├── actions/          # Server Actions
│   ├── api/              # API Routes
│   ├── (routes)/         # App Routes
│   └── layout.tsx        # Root Layout
├── components/           # React Components
│   ├── analytics/        # Analytics Components
│   ├── api-keys/         # API Key Management
│   ├── auth/             # Authentication Components
│   ├── billing/          # Billing Components
│   ├── dashboard/        # Dashboard Components
│   ├── emails/           # Email Templates
│   ├── help/             # Help Center Components
│   ├── layout/           # Layout Components
│   ├── providers/        # Context Providers
│   ├── ui/               # UI Components (shadcn/ui)
│   └── ...
├── data/                 # Static Data
├── db/                   # Database Migrations
├── hooks/                # Custom React Hooks
├── lib/                  # Utility Functions
│   ├── supabase/         # Supabase Client
│   ├── stripe.ts         # Stripe Integration
│   ├── email.ts          # Email Integration
│   └── ...
├── public/               # Static Assets
├── scripts/              # Build Scripts
├── styles/               # Global Styles
├── tests/                # Test Files
├── types/                # TypeScript Types
├── .env.local.example    # Environment Variables Example
├── .eslintrc.json        # ESLint Configuration
├── .gitignore            # Git Ignore
├── jest.config.js        # Jest Configuration
├── next.config.js        # Next.js Configuration
├── package.json          # Dependencies
├── postcss.config.js     # PostCSS Configuration
├── tailwind.config.js    # Tailwind Configuration
├── tsconfig.json         # TypeScript Configuration
└── README.md             # Project Documentation
\`\`\`

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run end-to-end tests with UI
- `npm run test:a11y` - Run accessibility tests

### Adding New Components

1. Create a new component in the appropriate directory
2. Use TypeScript for type safety
3. Follow the project's naming conventions
4. Add tests for the component
5. Document the component with JSDoc comments

### Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_APP_URL` - Application URL
- `RESEND_API_KEY` - Resend API key
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set up environment variables
4. Deploy

### Docker

1. Build the Docker image:
   \`\`\`bash
   docker build -t creavibe .
   \`\`\`

2. Run the container:
   \`\`\`bash
   docker run -p 3000:3000 creavibe
   \`\`\`

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Resend](https://resend.com/)
- [PostHog](https://posthog.com/)
- [Stripe](https://stripe.com/)
- [Upstash](https://upstash.com/)
\`\`\`

## Help Section Components
