# TripPlanner

An AI-powered application that enables users to create personalized trip plans based on curated guides from various creators.

[![Node.js Version](https://img.shields.io/badge/node-22.14.0-brightgreen.svg)](https://nodejs.org/)
[![Astro Version](https://img.shields.io/badge/astro-5.5.5-orange.svg)](https://astro.build/)
[![React Version](https://img.shields.io/badge/react-19.0.0-blue.svg)](https://reactjs.org/)

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

TripPlanner is a responsive web application (PWA) that allows users to create customized travel itineraries based on existing guides created by various authors. Unlike solutions focused solely on "cities," each guide can cover a specific location (e.g., Warsaw) and contain detailed, author-curated descriptions of attractions and sightseeing suggestions.

The app's key feature is integration with OpenAI's API, which generates engaging and optimized routes. Users select a guide (e.g., "A tour of Warsaw's history" or "Warsaw for street art fans") and create a personalized plan based on the guide's data.

### Key Features

- Access to a library of available creator guides
- AI-powered trip plan generation based on selected guides
- Intuitive, responsive web interface (PWA)
- User authentication and storage of generated plans

## Tech Stack

### Frontend
- **Astro 5**: For creating fast, efficient pages and applications with minimal JavaScript
- **React 19**: Provides interactivity where needed
- **Vite PWA**: Enables mobile app-like experience
- **TypeScript 5**: For static typing and better IDE support
- **Tailwind 4**: For convenient application styling
- **Shadcn/ui**: Library of accessible React components for UI

### Backend
- **Supabase**: Comprehensive backend solution providing:
  - PostgreSQL database
  - SDK in multiple languages (Backend-as-a-Service)
  - Open-source solution that can be hosted locally or on your own server
  - Built-in user authentication

### AI Integration
- **OpenAI API**: For communication with AI models
  - Access to a wide range of OpenAI models
  - Financial limit settings for API keys

### Testing
- **Vitest/Jest**: For unit testing components and utilities
- **React Testing Library**: For testing React components
- **Cypress**: For end-to-end (E2E) and integration testing
- **Playwright**: For cross-browser testing
- **MSW (Mock Service Worker)**: For API mocking during tests
- **Lighthouse**: For performance, accessibility and PWA testing

### CI/CD & Hosting
- **GitHub Actions**: For CI/CD pipelines
- **DigitalOcean**: For application hosting via Docker image

## Getting Started Locally

### Prerequisites

- Node.js 22.14.0 (we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions)
- [Supabase](https://supabase.io/) account
- [OpenAI API](https://openai.com/api/) key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/trip-planner.git
   cd trip-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Supabase
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:4321`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier

## Project Scope

### MVP Features
- User registration and authentication
- Browsing and selecting from available guides
- Generating optimized trip plans using AI based on selected guides
- Saving and managing personal trip plans
- Responsive web interface with PWA capabilities

### Future Roadmap (Beyond MVP)
- Advanced real-time personalization (e.g., weather-based recommendations)
- Text-to-speech functionality for attraction descriptions
- Integration with reservation and payment systems (Stripe)
- Enhanced communication system with guide creators (comments, reviews, content moderation)
- Extended offline mode
- Automated database consistency tests and content verification

## Project Status

The project is currently in MVP development phase. Success is being measured by:

1. Number of daily generated and saved plans based on different guides
2. User retention (returns, guide usage)
3. Average time spent in the application, particularly while browsing guide content and generated plans
4. Operational stability: minimal error rates in OpenAI communication and Supabase read/write operations

## License

This project is currently unlicensed. Please contact the repository owner for licensing information.

---

© 2024 TripPlanner. All rights reserved.
