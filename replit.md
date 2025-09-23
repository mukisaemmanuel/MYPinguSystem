# Overview

This is a Life RPG System mobile web application that gamifies real-life tasks and habits. The app allows users to create customizable quests (daily tasks), earn XP by completing them, level up, maintain streaks, and unlock rewards. Built as a full-stack TypeScript application, it features a React frontend with shadcn/ui components and an Express.js backend with in-memory storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod schema validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming, dark mode by default
- **Mobile-First Design**: Responsive layout optimized for mobile with bottom navigation

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **Data Storage**: In-memory storage implementation (MemStorage class) for development/MVP
- **API Design**: RESTful API endpoints for CRUD operations on users, quests, rewards, achievements, and categories
- **Validation**: Zod schemas shared between frontend and backend for consistent validation
- **Development Server**: Integrated Vite middleware for hot reloading in development

## Data Models
The application uses a schema-first approach with the following core entities:
- **Users**: Profile information, XP tracking, level progression, and streak management
- **Quests**: Customizable tasks with categories, XP values, completion status, and time estimates
- **Rewards**: Unlockable items based on XP thresholds or streak achievements
- **Achievements**: Special accomplishments that provide XP bonuses
- **Categories**: Grouping system for quests (Health, Work, Personal, Study)

## Key Features Implementation
- **Gamification Elements**: XP system, level progression with visual progress bars, streak tracking with fire emoji indicators
- **Quest Management**: CRUD operations for tasks with category filtering and completion tracking
- **Reward System**: Unlockable rewards based on XP or streak requirements with claim functionality
- **Achievement System**: Automatic achievement unlocking based on user actions and milestones
- **Progress Tracking**: Daily summary statistics and category-based analytics

## Development Workflow
- **Build Process**: Vite builds the frontend, esbuild bundles the backend for production
- **Development**: Hot reloading for both frontend and backend changes
- **Type Safety**: Shared TypeScript interfaces and Zod schemas ensure type consistency across the stack
- **Database Migration Ready**: Drizzle ORM configuration prepared for PostgreSQL migration from in-memory storage

# External Dependencies

## Database
- **Current**: In-memory storage for MVP development
- **Planned**: PostgreSQL with Neon serverless database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations and schema management

## UI Framework
- **Radix UI**: Comprehensive set of unstyled, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Pre-built components combining Radix UI with Tailwind styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Frontend build tool with Replit-specific plugins for development banners and error overlays
- **TanStack Query**: Server state management with caching and background updates
- **React Hook Form**: Form handling with performance optimization
- **date-fns**: Date manipulation utilities for streak and completion tracking

## Styling and Theming
- **Fonts**: Google Fonts integration (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Color System**: CSS custom properties for consistent theming
- **Class Variance Authority**: Type-safe variant handling for component styling
- **clsx & tailwind-merge**: Conditional class name utilities