# Kozi

Kozi is a modern web application built with Next.js that helps you manage and track your tasks effectively.

## About This Project

This demo application was built as part of an article series for [Clerk](https://go.clerk.com/T5JbotA) and [Neon](https://fyi.neon.tech/clerk), demonstrating how to build modern web applications with authentication and user management.

To learn how to build this project from scratch, check out the following series of articles:

1. [Validate your SaaS idea while building an audience](https://clerk.com/blog/validate-saas)
2. [How to build a secure project management platform with Next.js, Clerk, and Neon](https://clerk.com/blog/build-secure-project-management-nextjs)
3. [How to enrich PostHog events with Clerk user data](https://clerk.com/blog/posthog-events-with-clerk)

## Prerequisites

- Node.js 18+ installed
- A [Neon](https://neon.tech) account for the database
- A [PostHog](https://posthog.com) account for analytics

## Setup Instructions

### 1. Neon Database Setup

1. Sign up for a free account at [neon.tech](https://neon.tech)
2. Create a new project from your dashboard
3. In the project dashboard:
   - Click "Connection Details"
   - Copy your database connection string
   - Save it for the environment variables setup

### 2. PostHog Setup

1. Sign up for a free account at [posthog.com](https://posthog.com)
2. Create a new project:
   - Click "Create new project" from your dashboard
   - Choose "Web" as your platform
   - Name your project
3. Get your PostHog API keys:
   - Go to Project Settings > Project API Keys
   - Copy your "Public Project API Key"
   - Save it for the environment variables setup

### 3. Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bmorrisondev/kozi.git
   cd kozi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_neon_connection_string
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_public_key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

4. Push the Prisma schema to your Neon database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- Task management
- Real-time analytics with PostHog
- Modern UI with Next.js
- Serverless database with Neon

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)