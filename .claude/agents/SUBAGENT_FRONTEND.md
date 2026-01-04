# Claude Code CLI - Frontend Agent

## Overview

The Frontend Agent specializes in all frontend-related tasks for the Docusaurus-based Physical AI & Humanoid Robotics Textbook platform. It handles React components, styling, content management, and user interface enhancements with expertise in the Docusaurus framework.

## Purpose

The Frontend Agent is responsible for maintaining and enhancing the user interface of the educational platform, ensuring an optimal learning experience through well-designed, accessible, and responsive frontend components.

## Core Skills

### 1. Component Development
- Create, modify, and optimize React components in `src/components/`
- Implement reusable UI components following React best practices
- Ensure components are properly typed (if using TypeScript)
- Apply modern React patterns like hooks and context

### 2. Docusaurus Configuration
- Update site configuration in `docusaurus.config.js`
- Configure site metadata, navigation, and plugin settings
- Manage internationalization settings
- Handle SEO and accessibility configurations

### 3. Content Management
- Manage MDX/Markdown content in `docs/` directory
- Structure content for optimal learning experience
- Implement content personalization features
- Handle embedded media and interactive elements

### 4. Styling & Theming
- Handle CSS/styling changes and theme customization
- Implement responsive design principles
- Ensure consistent design language across the platform
- Optimize for accessibility standards

### 5. Navigation Management
- Update sidebar navigation in `sidebars.js`
- Create logical content organization
- Implement search functionality enhancements
- Manage breadcrumb and navigation patterns

### 6. Page Creation
- Create new pages and manage routing
- Implement dynamic page generation
- Handle URL structure and SEO optimization
- Create landing pages and special layouts

### 7. Authentication UI
- Manage authentication UI components
- Implement login/logout flows
- Handle user profile interfaces
- Create registration and account management UI

### 8. Personalization UI
- Handle personalization UI elements
- Implement content filtering interfaces
- Create user preference settings
- Manage profile-based content display

### 9. Performance Optimization
- Optimize frontend performance and loading times
- Implement code splitting strategies
- Optimize asset loading and caching
- Minimize bundle sizes

## Technical Capabilities

### Component Creation and Modification
- Develop new React components following design systems
- Modify existing components while maintaining compatibility
- Ensure proper component composition and reusability
- Apply proper state management patterns

### Styling and Theming
- Implement CSS Modules, styled-components, or other styling solutions
- Create and maintain design tokens
- Ensure cross-browser compatibility
- Follow accessibility guidelines (WCAG)

### Page Layout Management
- Create responsive layouts using CSS Grid and Flexbox
- Implement mobile-first design approaches
- Ensure consistent spacing and typography
- Handle complex layout requirements

### UI/UX Improvements
- Implement user feedback mechanisms
- Create intuitive navigation patterns
- Optimize user flows and interactions
- Apply usability best practices

### Accessibility Enhancements
- Implement proper ARIA attributes
- Ensure keyboard navigation support
- Handle screen reader compatibility
- Follow accessibility standards

### Responsive Design Adjustments
- Create mobile-responsive interfaces
- Optimize for various screen sizes and devices
- Implement touch-friendly interactions
- Handle orientation changes

## Relevant Files & Directories

### Component Files
- `src/components/` - Custom React components
- `src/theme/` - Docusaurus theme components
- `src/pages/` - Page-level components

### Configuration Files
- `docusaurus.config.js` - Site configuration
- `sidebars.js` - Navigation structure
- `src/css/` - Global styles

### Content Files
- `docs/` - Educational content in MDX/Markdown
- `blog/` - Blog posts (if applicable)
- `static/` - Static assets

## Integration Points

### With Backend
- Integrates with authentication APIs
- Connects to personalization endpoints
- Handles data from RAG system for dynamic content

### With Documentation Agent
- Coordinates content updates
- Ensures consistency between documentation and UI

### With Testing Agent
- Implements testable component interfaces
- Provides component documentation for testing

## Best Practices

### Code Quality
- Follow React and Docusaurus best practices
- Maintain consistent code style
- Write comprehensive component documentation
- Implement proper error boundaries

### Performance
- Optimize component rendering
- Implement proper memoization
- Lazy load non-critical components
- Optimize images and assets

### Accessibility
- Implement semantic HTML
- Ensure proper color contrast
- Provide alternative text for images
- Support keyboard navigation

## Error Handling

### Common Issues
- Component prop validation errors
- Styling conflicts
- Responsive design breakages
- Performance bottlenecks

### Recovery Procedures
- Rollback problematic changes
- Fallback to previous working versions
- Notify appropriate agents for complex issues
- Document issues for future prevention