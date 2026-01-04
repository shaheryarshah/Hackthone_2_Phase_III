# Claude Code CLI - Skills Directory

## Overview

This document provides a comprehensive directory of all skills across the agent system for the Physical AI & Humanoid Robotics Textbook platform. It serves as a reference for understanding the capabilities of each agent and how they contribute to the overall development workflow.

## Agent Skills Summary

### Main Agent Orchestrator
- Task Routing
- Context Management
- Workflow Coordination
- Communication Hub
- Result Aggregation

### Frontend Agent
- Component Development
- Docusaurus Configuration
- Content Management
- Styling & Theming
- Navigation Management
- Page Creation
- Authentication UI
- Personalization UI
- Performance Optimization

### Backend Agent
- API Development
- Database Management
- Authentication Logic
- RAG Implementation
- Vector Storage
- Document Processing
- API Integration
- Data Validation
- Schema Management
- Performance Optimization

### Deployment Agent
- Deployment Scripts
- Environment Management
- CI/CD Pipeline
- Cloud Deployment
- Containerization
- Security Setup
- Monitoring
- Multi-environment Management
- Infrastructure as Code (IaC)

### Documentation Agent
- README Management
- Technical Writing
- API Documentation
- User Guides
- Specifications
- Code Documentation
- Tutorial Creation
- Changelog Maintenance

### Testing Agent
- Unit Testing
- Integration Testing
- Code Quality
- Linting & Formatting
- Test Execution
- Report Generation
- Performance Testing
- Security Testing

### Security Agent
- Authentication Implementation
- Token Management
- API Security
- Input Validation
- Secrets Management
- Security Audits
- Vulnerability Scanning
- Security Configuration

## Detailed Skills Directory

### 1. Task Routing
**Agent**: Main Agent Orchestrator
**Description**: Directs user requests to the appropriate subagent based on the nature of the task
**Capabilities**:
- Evaluates task requirements and matches them to agent capabilities
- Implements intelligent routing algorithms to optimize task assignment
- Maintains a registry of agent capabilities and availability

### 2. Context Management
**Agent**: Main Agent Orchestrator
**Description**: Maintains state and context across agent interactions
**Capabilities**:
- Preserves project context during multi-step operations
- Manages shared data between agents
- Ensures consistency of project state throughout operations

### 3. Workflow Coordination
**Agent**: Main Agent Orchestrator
**Description**: Manages complex multi-step operations that require multiple agents
**Capabilities**:
- Coordinates sequential and parallel execution of agent tasks
- Handles dependencies between different agent operations
- Ensures proper sequencing of operations to avoid conflicts

### 4. Communication Hub
**Agent**: Main Agent Orchestrator
**Description**: Facilitates inter-agent communication and data exchange
**Capabilities**:
- Provides standardized communication protocols between agents
- Manages message passing and data sharing
- Ensures secure and efficient communication channels

### 5. Result Aggregation
**Agent**: Main Agent Orchestrator
**Description**: Combines outputs from multiple agents into coherent responses
**Capabilities**:
- Validates and reconciles results from different agents
- Formats outputs for user consumption
- Handles conflicts or inconsistencies in agent outputs

### 6. Component Development
**Agent**: Frontend Agent
**Description**: Create, modify, and optimize React components in `src/components/`
**Capabilities**:
- Implement reusable UI components following React best practices
- Ensure components are properly typed (if using TypeScript)
- Apply modern React patterns like hooks and context

### 7. Docusaurus Configuration
**Agent**: Frontend Agent
**Description**: Update site configuration in `docusaurus.config.js`
**Capabilities**:
- Configure site metadata, navigation, and plugin settings
- Manage internationalization settings
- Handle SEO and accessibility configurations

### 8. Content Management
**Agent**: Frontend Agent
**Description**: Manage MDX/Markdown content in `docs/` directory
**Capabilities**:
- Structure content for optimal learning experience
- Implement content personalization features
- Handle embedded media and interactive elements

### 9. Styling & Theming
**Agent**: Frontend Agent
**Description**: Handle CSS/styling changes and theme customization
**Capabilities**:
- Implement responsive design principles
- Ensure consistent design language across the platform
- Optimize for accessibility standards

### 10. Navigation Management
**Agent**: Frontend Agent
**Description**: Update sidebar navigation in `sidebars.js`
**Capabilities**:
- Create logical content organization
- Implement search functionality enhancements
- Manage breadcrumb and navigation patterns

### 11. Page Creation
**Agent**: Frontend Agent
**Description**: Create new pages and manage routing
**Capabilities**:
- Implement dynamic page generation
- Handle URL structure and SEO optimization
- Create landing pages and special layouts

### 12. Authentication UI
**Agent**: Frontend Agent
**Description**: Manage authentication UI components
**Capabilities**:
- Implement login/logout flows
- Handle user profile interfaces
- Create registration and account management UI

### 13. Personalization UI
**Agent**: Frontend Agent
**Description**: Handle personalization UI elements
**Capabilities**:
- Implement content filtering interfaces
- Create user preference settings
- Manage profile-based content display

### 14. Performance Optimization
**Agent**: Frontend Agent
**Description**: Optimize frontend performance and loading times
**Capabilities**:
- Implement code splitting strategies
- Optimize asset loading and caching
- Minimize bundle sizes

### 15. API Development
**Agent**: Backend Agent
**Description**: Modify Flask API endpoints in `backend/api.py`
**Capabilities**:
- Design RESTful API architectures
- Implement proper HTTP status codes and error handling
- Create API documentation and specifications

### 16. Database Management
**Agent**: Backend Agent
**Description**: Update database models in `backend/models.py`
**Capabilities**:
- Design and optimize database schemas
- Handle database migrations
- Implement efficient querying patterns

### 17. Authentication Logic
**Agent**: Backend Agent
**Description**: Handle user authentication and session management
**Capabilities**:
- Implement JWT token generation and validation
- Manage user registration and login flows
- Handle password hashing and security

### 18. RAG Implementation
**Agent**: Backend Agent
**Description**: Manage Retrieval-Augmented Generation functionality
**Capabilities**:
- Implement document indexing and retrieval
- Handle vector database operations (Qdrant)
- Optimize retrieval algorithms for performance

### 19. Vector Storage
**Agent**: Backend Agent
**Description**: Configure and manage vector storage (Qdrant)
**Capabilities**:
- Implement efficient vector indexing strategies
- Optimize storage for document embeddings
- Handle vector search and similarity matching

### 20. Document Processing
**Agent**: Backend Agent
**Description**: Handle document processing and embeddings
**Capabilities**:
- Implement various document format parsers (PDF, DOCX, etc.)
- Manage document preprocessing pipelines
- Handle text chunking and segmentation

### 21. API Integration
**Agent**: Backend Agent
**Description**: Manage API integrations (OpenAI, etc.)
**Capabilities**:
- Handle external service authentication
- Implement retry mechanisms for external APIs
- Manage API rate limiting and quotas

### 22. Data Validation
**Agent**: Backend Agent
**Description**: Handle data validation and error handling
**Capabilities**:
- Implement input sanitization
- Validate API request parameters
- Handle data transformation

### 23. Schema Management
**Agent**: Backend Agent
**Description**: Database schema management and migrations
**Capabilities**:
- Handle schema evolution and versioning
- Manage backward compatibility
- Implement data migration strategies

### 24. Deployment Scripts
**Agent**: Deployment Agent
**Description**: Configure deployment scripts and automation
**Capabilities**:
- Create environment-specific deployment configurations
- Implement deployment validation checks
- Manage deployment rollback procedures

### 25. Environment Management
**Agent**: Deployment Agent
**Description**: Manage environment variables and secrets
**Capabilities**:
- Handle configuration differences between environments
- Implement environment-specific optimizations
- Manage environment provisioning

### 26. CI/CD Pipeline
**Agent**: Deployment Agent
**Description**: Set up and maintain CI/CD pipelines
**Capabilities**:
- Configure automated testing in pipelines
- Implement deployment triggers and conditions
- Manage pipeline security and access

### 27. Cloud Deployment
**Agent**: Deployment Agent
**Description**: Configure cloud platform deployments (Vercel, Render, etc.)
**Capabilities**:
- Manage cloud resource allocation
- Handle platform-specific configurations
- Implement cloud security measures

### 28. Containerization
**Agent**: Deployment Agent
**Description**: Manage Docker configurations
**Capabilities**:
- Create optimized Docker images
- Handle multi-stage builds
- Manage container orchestration

### 29. Security Setup
**Agent**: Deployment Agent
**Description**: Handle SSL certificates and domain setup
**Capabilities**:
- Implement security headers and policies
- Manage firewall configurations
- Handle security scanning in deployment

### 30. Monitoring
**Agent**: Deployment Agent
**Description**: Monitor deployment status and logs
**Capabilities**:
- Implement health checks and alerts
- Track deployment metrics
- Monitor application performance post-deployment

### 31. Multi-environment Management
**Agent**: Deployment Agent
**Description**: Manage dev, staging, and production environments
**Capabilities**:
- Handle environment-specific configurations
- Implement environment promotion strategies
- Manage environment isolation

### 32. Infrastructure as Code (IaC)
**Agent**: Deployment Agent
**Description**: Infrastructure as Code (IaC) management
**Capabilities**:
- Version control for infrastructure
- Automated infrastructure provisioning
- Infrastructure testing and validation

### 33. README Management
**Agent**: Documentation Agent
**Description**: Update README files and project documentation
**Capabilities**:
- Maintain project overview and setup instructions
- Keep usage instructions current
- Document project architecture and components

### 34. Technical Writing
**Agent**: Documentation Agent
**Description**: Create technical documentation
**Capabilities**:
- Write clear and concise explanations
- Document code architecture and design decisions
- Create implementation guides

### 35. API Documentation
**Agent**: Documentation Agent
**Description**: Maintain API documentation
**Capabilities**:
- Document endpoints, parameters, and responses
- Create API usage examples
- Keep documentation synchronized with code changes

### 36. User Guides
**Agent**: Documentation Agent
**Description**: Update user guides and tutorials
**Capabilities**:
- Create step-by-step instructions
- Document user workflows and features
- Create onboarding materials

### 37. Specifications
**Agent**: Documentation Agent
**Description**: Handle specification documents
**Capabilities**:
- Document system requirements
- Create technical specifications
- Maintain architectural decision records (ADRs)

### 38. Code Documentation
**Agent**: Documentation Agent
**Description**: Generate code documentation
**Capabilities**:
- Maintain inline code comments
- Create developer guides
- Document code patterns and conventions

### 39. Tutorial Creation
**Agent**: Documentation Agent
**Description**: Create tutorials and examples
**Capabilities**:
- Develop educational content
- Create progressive learning materials
- Document best practices

### 40. Changelog Maintenance
**Agent**: Documentation Agent
**Description**: Maintain changelogs and release notes
**Capabilities**:
- Document feature additions and changes
- Track bug fixes and improvements
- Maintain version history

### 41. Unit Testing
**Agent**: Testing Agent
**Description**: Write unit tests for Python and JavaScript
**Capabilities**:
- Create isolated tests for individual components
- Implement test-driven development (TDD) practices
- Maintain high test coverage

### 42. Integration Testing
**Agent**: Testing Agent
**Description**: Create integration tests
**Capabilities**:
- Test interactions between components
- Validate API integrations
- Test database connections and operations

### 43. Code Quality
**Agent**: Testing Agent
**Description**: Perform code quality checks
**Capabilities**:
- Implement static analysis
- Check for code style compliance
- Identify potential bugs and vulnerabilities

### 44. Linting & Formatting
**Agent**: Testing Agent
**Description**: Run linting and formatting tools
**Capabilities**:
- Enforce coding standards
- Identify style inconsistencies
- Format code automatically

### 45. Test Execution
**Agent**: Testing Agent
**Description**: Execute test suites
**Capabilities**:
- Run tests in different environments
- Execute parallel test execution
- Handle test dependencies

### 46. Report Generation
**Agent**: Testing Agent
**Description**: Generate test reports
**Capabilities**:
- Create coverage reports
- Document test results
- Generate quality metrics

### 47. Performance Testing
**Agent**: Testing Agent
**Description**: Conduct performance testing
**Capabilities**:
- Execute load testing
- Perform stress testing
- Analyze system performance

### 48. Security Testing
**Agent**: Testing Agent
**Description**: Perform security testing
**Capabilities**:
- Identify security vulnerabilities
- Test for common security issues
- Validate authentication and authorization

### 49. Authentication Implementation
**Agent**: Security Agent
**Description**: Implement authentication and authorization
**Capabilities**:
- Design secure authentication flows
- Manage multi-factor authentication
- Handle password policies and security

### 50. Token Management
**Agent**: Security Agent
**Description**: Handle JWT token management
**Capabilities**:
- Implement secure token generation
- Manage token expiration and refresh
- Handle token validation and verification

### 51. API Security
**Agent**: Security Agent
**Description**: Secure API endpoints
**Capabilities**:
- Implement rate limiting and throttling
- Handle API authentication and authorization
- Validate and sanitize API inputs

### 52. Input Validation
**Agent**: Security Agent
**Description**: Validate user inputs
**Capabilities**:
- Implement sanitization procedures
- Prevent injection attacks (SQL, XSS, etc.)
- Validate file uploads and content

### 53. Secrets Management
**Agent**: Security Agent
**Description**: Manage secrets and environment variables
**Capabilities**:
- Implement secure storage for sensitive data
- Handle key rotation procedures
- Manage access to sensitive information

### 54. Security Audits
**Agent**: Security Agent
**Description**: Perform security audits
**Capabilities**:
- Identify potential vulnerabilities
- Review code for security issues
- Assess security configurations

### 55. Vulnerability Scanning
**Agent**: Security Agent
**Description**: Conduct vulnerability scanning
**Capabilities**:
- Identify security weaknesses
- Assess potential threats
- Prioritize security issues

### 56. Security Configuration
**Agent**: Security Agent
**Description**: Apply security configurations
**Capabilities**:
- Implement security headers
- Configure firewall rules
- Set up intrusion detection

## Skills by Technology Domain

### Frontend Skills (React/Docusaurus)
- Component Development (Skill #6)
- Docusaurus Configuration (Skill #7)
- Styling & Theming (Skill #9)
- Page Creation (Skill #11)
- Authentication UI (Skill #12)
- Personalization UI (Skill #13)
- Performance Optimization (Skill #14)

### Backend Skills (Flask/Python)
- API Development (Skill #15)
- Database Management (Skill #16)
- Authentication Logic (Skill #17)
- RAG Implementation (Skill #18)
- Vector Storage (Skill #19)
- Document Processing (Skill #20)
- API Integration (Skill #21)
- Data Validation (Skill #22)
- Schema Management (Skill #23)

### Deployment Skills
- Deployment Scripts (Skill #24)
- Environment Management (Skill #25)
- CI/CD Pipeline (Skill #26)
- Cloud Deployment (Skill #27)
- Containerization (Skill #28)
- Security Setup (Skill #29)
- Monitoring (Skill #30)
- Multi-environment Management (Skill #31)
- Infrastructure as Code (Skill #32)

### Documentation Skills
- README Management (Skill #33)
- Technical Writing (Skill #34)
- API Documentation (Skill #35)
- User Guides (Skill #36)
- Specifications (Skill #37)
- Code Documentation (Skill #38)
- Tutorial Creation (Skill #39)
- Changelog Maintenance (Skill #40)

### Testing Skills
- Unit Testing (Skill #41)
- Integration Testing (Skill #42)
- Code Quality (Skill #43)
- Linting & Formatting (Skill #44)
- Test Execution (Skill #45)
- Report Generation (Skill #46)
- Performance Testing (Skill #47)
- Security Testing (Skill #48)

### Security Skills
- Authentication Implementation (Skill #49)
- Token Management (Skill #50)
- API Security (Skill #51)
- Input Validation (Skill #52)
- Secrets Management (Skill #53)
- Security Audits (Skill #54)
- Vulnerability Scanning (Skill #55)
- Security Configuration (Skill #56)

## Skills by Project Component

### Authentication & Security
- Authentication Implementation (Skill #49)
- Token Management (Skill #50)
- API Security (Skill #51)
- Input Validation (Skill #52)
- Authentication UI (Skill #12)
- Authentication Logic (Skill #17)

### Content & Learning Platform
- Content Management (Skill #8)
- Personalization UI (Skill #13)
- RAG Implementation (Skill #18)
- Document Processing (Skill #20)
- Tutorial Creation (Skill #39)

### Performance & Optimization
- Performance Optimization (Skill #14)
- Performance Testing (Skill #47)
- Database Management (Skill #16)
- Vector Storage (Skill #19)

### Deployment & Infrastructure
- Deployment Scripts (Skill #24)
- CI/CD Pipeline (Skill #26)
- Cloud Deployment (Skill #27)
- Containerization (Skill #28)
- Monitoring (Skill #30)