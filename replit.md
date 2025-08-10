# Rubik's Cube Solver

## Overview

This is a frontend-only web application that provides an interactive Rubik's cube solver with client-side solving algorithms. The application allows users to input their cube configuration through a step-by-step face-by-face interface and receive solving instructions with visual feedback. It features a dark theme throughout and is optimized for deployment to GitHub Pages as a static site.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, using Vite as the build tool. The application follows a component-based architecture with:

- **UI Framework**: Utilizes Radix UI components with shadcn/ui styling for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: React hooks for local state, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **3D Visualization**: Three.js integration for rendering interactive 3D cube representations

### Backend Architecture
The backend uses Express.js with TypeScript, following a RESTful API design:

- **Server Framework**: Express.js with middleware for JSON parsing and request logging
- **API Routes**: Modular route handlers for cube configuration and solving operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation (expandable to database)
- **Development Tools**: Vite integration for hot module replacement in development

### Data Storage Solutions
- **Client-Side Storage**: All data stored locally in browser memory during session
- **No Database Required**: Frontend-only implementation for static hosting compatibility
- **Cube State Management**: React state for cube configurations and solving progress

### Cube Solving Engine
- **Client-Side Algorithm**: Local JavaScript implementation with realistic solving algorithms
- **Move Notation**: Standard Rubik's cube notation (F, B, L, R, U, D with modifiers)
- **Move Descriptions**: Human-readable descriptions for each solving step
- **Random Generation**: Built-in random cube generator for testing and practice

### External Dependencies

**Frontend Libraries:**
- React ecosystem (React, React DOM, React Router via Wouter)
- TanStack Query for server state management
- Radix UI component primitives for accessible UI components
- Three.js for 3D cube visualization and animations
- Tailwind CSS with class-variance-authority for styling
- React Hook Form with Zod resolvers for form validation

**Backend Libraries:**
- Express.js web framework with TypeScript support
- Drizzle ORM with PostgreSQL dialect for database operations
- Neon Database serverless driver for cloud database connectivity
- Zod for runtime type validation and schema validation

**Development Tools:**
- Vite for fast development and building with React plugin
- TypeScript for type safety across the full stack
- ESBuild for server-side bundling
- Replit-specific plugins for development environment integration

**GitHub Pages Deployment:**
- Static site generation with Vite build system
- GitHub Actions workflow for automatic deployment
- Root-level index.html for GitHub Pages compatibility
- Optimized asset bundling and code splitting