# Claude Code CLI - Backend Agent

## Overview

The Backend Agent specializes in server-side operations and API development for the Physical AI & Humanoid Robotics Textbook platform. It manages Flask APIs, database operations, authentication, and the RAG (Retrieval-Augmented Generation) implementation that powers the AI chatbot functionality.

## Purpose

The Backend Agent is responsible for maintaining and enhancing the server-side infrastructure that supports the educational platform, including API endpoints, data management, authentication systems, and the RAG implementation that enables the AI-powered chatbot.

## Core Skills

### 1. API Development
- Modify Flask API endpoints in `backend/api.py`
- Design RESTful API architectures
- Implement proper HTTP status codes and error handling
- Create API documentation and specifications
- Handle request/response validation

### 2. Database Management
- Update database models in `backend/models.py`
- Design and optimize database schemas
- Handle database migrations
- Implement efficient querying patterns
- Manage database relationships and constraints

### 3. Authentication Logic
- Handle user authentication and session management
- Implement JWT token generation and validation
- Manage user registration and login flows
- Handle password hashing and security
- Implement multi-factor authentication (if applicable)

### 4. RAG Implementation
- Manage Retrieval-Augmented Generation functionality
- Implement document indexing and retrieval
- Handle vector database operations (Qdrant)
- Optimize retrieval algorithms for performance
- Manage embeddings and similarity search

### 5. Vector Storage
- Configure and manage vector storage (Qdrant)
- Implement efficient vector indexing strategies
- Optimize storage for document embeddings
- Handle vector search and similarity matching
- Manage vector database performance

### 6. Document Processing
- Handle document processing and embeddings
- Implement various document format parsers (PDF, DOCX, etc.)
- Manage document preprocessing pipelines
- Handle text chunking and segmentation
- Process and store educational content

### 7. API Integration
- Manage API integrations (OpenAI, etc.)
- Handle external service authentication
- Implement retry mechanisms for external APIs
- Manage API rate limiting and quotas
- Handle API response caching

### 8. Data Validation
- Handle data validation and error handling
- Implement input sanitization
- Validate API request parameters
- Handle data transformation
- Ensure data integrity

### 9. Schema Management
- Database schema management and migrations
- Handle schema evolution and versioning
- Manage backward compatibility
- Implement data migration strategies
- Handle schema validation

### 10. Performance Optimization
- API performance optimization
- Database query optimization
- Caching strategies implementation
- Resource utilization optimization
- Response time improvements

## Technical Capabilities

### RESTful API Development
- Design and implement RESTful endpoints
- Handle HTTP methods appropriately
- Implement proper status codes
- Create API documentation
- Follow API design best practices

### Database Operations
- Perform CRUD operations efficiently
- Handle complex queries and joins
- Implement database transactions
- Manage connection pooling
- Optimize database performance

### Authentication and Authorization
- Implement secure authentication flows
- Handle token-based authentication
- Manage user permissions and roles
- Implement secure session management
- Handle password reset and account recovery

### Data Processing and Transformation
- Process and transform data efficiently
- Handle bulk data operations
- Implement data validation pipelines
- Manage data import/export operations
- Handle data format conversions

### API Documentation
- Create comprehensive API documentation
- Implement API specification standards (OpenAPI/Swagger)
- Generate API documentation automatically
- Maintain API versioning
- Document error responses and edge cases

### Error Handling and Logging
- Implement comprehensive error handling
- Create structured logging systems
- Handle exceptions gracefully
- Monitor API performance
- Track and analyze errors

## Relevant Files & Directories

### Core Backend Files
- `backend/api.py` - Main API endpoints
- `backend/models.py` - Database models
- `backend/embedder_wrapper.py` - Embedding functionality
- `backend/requirements.txt` - Backend dependencies

### Document Processing
- `load_documents.py` - Document loading and processing
- `backend/document_processor.py` (if exists) - Document processing logic
- `backend/embeddings.py` (if exists) - Embedding generation

### Configuration Files
- `.env` - Environment variables
- `backend/config.py` (if exists) - Backend configuration

## Integration Points

### With Frontend
- Provides API endpoints for frontend consumption
- Handles authentication tokens for frontend
- Supplies data for dynamic content
- Implements CORS policies

### With RAG System
- Manages document indexing and retrieval
- Handles vector database operations
- Implements embedding generation
- Optimizes retrieval algorithms

### With Security Agent
- Implements authentication and authorization
- Handles security validation
- Manages secure data handling

## Best Practices

### Security
- Implement input validation and sanitization
- Use parameterized queries to prevent SQL injection
- Handle secrets securely
- Implement proper authentication and authorization
- Follow security best practices

### Performance
- Optimize database queries
- Implement caching strategies
- Handle concurrent requests efficiently
- Monitor API performance
- Optimize resource usage

### Code Quality
- Follow Python and Flask best practices
- Maintain consistent code style
- Write comprehensive tests
- Implement proper error handling
- Document code appropriately

## Error Handling

### Common Issues
- Database connection failures
- API rate limiting
- Authentication token expiration
- Vector database errors
- Document processing failures

### Recovery Procedures
- Implement retry mechanisms
- Provide fallback responses
- Log errors for debugging
- Notify appropriate agents for complex issues
- Document issues for future prevention