# Claude Code CLI - Frontend Skills

## Overview

This document details the frontend-specific skills within the Claude Code CLI agent system. These skills are primarily utilized by the Frontend Agent but may be leveraged by other agents when frontend tasks are required.

## Skill Directory

### 1. Component Development
**Description**: Create, modify, and optimize React components in `src/components/`
**Agent**: Frontend Agent
**Capabilities**:
- Implement reusable UI components following React best practices
- Ensure components are properly typed (if using TypeScript)
- Apply modern React patterns like hooks and context
- Follow component composition principles

**Files & Directories**:
- `src/components/`

**Best Practices**:
- Maintain consistent component interfaces
- Implement proper error boundaries
- Follow accessibility standards
- Write comprehensive component documentation

### 2. Docusaurus Configuration
**Description**: Update site configuration in `docusaurus.config.js`
**Agent**: Frontend Agent
**Capabilities**:
- Configure site metadata, navigation, and plugin settings
- Manage internationalization settings
- Handle SEO and accessibility configurations
- Configure search and analytics

**Files & Directories**:
- `docusaurus.config.js`

**Best Practices**:
- Maintain consistent site configuration
- Follow Docusaurus best practices
- Ensure proper SEO configuration
- Implement proper analytics tracking

### 3. Content Management
**Description**: Manage MDX/Markdown content in `docs/` directory
**Agent**: Frontend Agent
**Capabilities**:
- Structure content for optimal learning experience
- Implement content personalization features
- Handle embedded media and interactive elements
- Manage content versioning and organization

**Files & Directories**:
- `docs/`

**Best Practices**:
- Maintain consistent content structure
- Implement proper metadata
- Follow accessibility guidelines
- Use appropriate content formatting

### 4. Styling & Theming
**Description**: Handle CSS/styling changes and theme customization
**Agent**: Frontend Agent
**Capabilities**:
- Implement responsive design principles
- Ensure consistent design language across the platform
- Optimize for accessibility standards
- Create and maintain design tokens

**Files & Directories**:
- `src/css/`
- `src/theme/`

**Best Practices**:
- Follow consistent styling patterns
- Implement responsive design
- Maintain accessibility standards
- Use semantic class naming

### 5. Navigation Management
**Description**: Update sidebar navigation in `sidebars.js`
**Agent**: Frontend Agent
**Capabilities**:
- Create logical content organization
- Implement search functionality enhancements
- Manage breadcrumb and navigation patterns
- Handle dynamic navigation updates

**Files & Directories**:
- `sidebars.js`

**Best Practices**:
- Maintain intuitive navigation structure
- Implement proper information architecture
- Follow accessibility standards for navigation
- Ensure responsive navigation behavior

### 6. Page Creation
**Description**: Create new pages and manage routing
**Agent**: Frontend Agent
**Capabilities**:
- Implement dynamic page generation
- Handle URL structure and SEO optimization
- Create landing pages and special layouts
- Manage page metadata and routing

**Files & Directories**:
- `src/pages/`

**Best Practices**:
- Follow consistent page structure
- Implement proper SEO practices
- Maintain responsive design
- Optimize page loading performance

### 7. Authentication UI
**Description**: Manage authentication UI components
**Agent**: Frontend Agent
**Capabilities**:
- Implement login/logout flows
- Handle user profile interfaces
- Create registration and account management UI
- Manage authentication state in UI

**Files & Directories**:
- `src/components/Authentication/`
- `src/context/`

**Best Practices**:
- Implement secure authentication UI
- Follow UX best practices for authentication
- Maintain consistent authentication flows
- Handle authentication errors gracefully

### 8. Personalization UI
**Description**: Handle personalization UI elements
**Agent**: Frontend Agent
**Capabilities**:
- Implement content filtering interfaces
- Create user preference settings
- Manage profile-based content display
- Handle personalization state management

**Files & Directories**:
- `src/components/PersonalizedContent/`
- `src/context/`

**Best Practices**:
- Implement intuitive personalization controls
- Maintain consistent personalization experience
- Follow privacy best practices
- Optimize personalized content rendering

### 9. Performance Optimization
**Description**: Optimize frontend performance and loading times
**Agent**: Frontend Agent
**Capabilities**:
- Implement code splitting strategies
- Optimize asset loading and caching
- Minimize bundle sizes
- Optimize component rendering

**Files & Directories**:
- All frontend files

**Best Practices**:
- Implement proper lazy loading
- Optimize images and assets
- Minimize unnecessary re-renders
- Use performance monitoring tools