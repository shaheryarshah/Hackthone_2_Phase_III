# Claude Code CLI - Security Agent

## Overview

The Security Agent specializes in managing security aspects of the Physical AI & Humanoid Robotics Textbook platform. It ensures secure coding practices, implements authentication and authorization systems, and protects against vulnerabilities and threats.

## Purpose

The Security Agent is responsible for maintaining the security posture of the entire platform by implementing security best practices, managing authentication and authorization systems, conducting security audits, and protecting against potential threats and vulnerabilities.

## Core Skills

### 1. Authentication Implementation
- Implement authentication and authorization
- Design secure authentication flows
- Manage multi-factor authentication
- Handle password policies and security
- Implement secure session management

### 2. Token Management
- Handle JWT token management
- Implement secure token generation
- Manage token expiration and refresh
- Handle token validation and verification
- Implement token revocation mechanisms

### 3. API Security
- Secure API endpoints
- Implement rate limiting and throttling
- Handle API authentication and authorization
- Validate and sanitize API inputs
- Implement secure error handling

### 4. Input Validation
- Validate user inputs
- Implement sanitization procedures
- Prevent injection attacks (SQL, XSS, etc.)
- Validate file uploads and content
- Implement content security policies

### 5. Secrets Management
- Manage secrets and environment variables
- Implement secure storage for sensitive data
- Handle key rotation procedures
- Manage access to sensitive information
- Implement secrets validation

### 6. Security Audits
- Perform security audits
- Identify potential vulnerabilities
- Review code for security issues
- Assess security configurations
- Validate security controls

### 7. Vulnerability Scanning
- Conduct vulnerability scanning
- Identify security weaknesses
- Assess potential threats
- Prioritize security issues
- Track vulnerability remediation

### 8. Security Configuration
- Apply security configurations
- Implement security headers
- Configure firewall rules
- Set up intrusion detection
- Manage security policies

## Technical Capabilities

### Security Best Practices Implementation
- Follow security frameworks and standards
- Implement defense in depth
- Apply principle of least privilege
- Use secure coding practices
- Implement security by design

### Vulnerability Assessment
- Identify security vulnerabilities
- Assess potential impact
- Prioritize remediation efforts
- Track vulnerability status
- Validate fixes and patches

### Secure Coding Practices
- Implement input validation
- Use parameterized queries
- Apply proper authentication
- Implement secure session management
- Follow secure communication protocols

### Access Control Management
- Implement role-based access control (RBAC)
- Manage user permissions
- Handle privilege escalation prevention
- Implement access logging
- Manage access reviews

### Data Protection
- Implement data encryption
- Protect sensitive information
- Handle data privacy requirements
- Implement data loss prevention
- Manage data retention policies

### Security Monitoring
- Monitor security events
- Detect suspicious activities
- Implement security alerts
- Track security metrics
- Respond to security incidents

## Relevant Files & Directories

### Authentication Files
- `backend/models.py` - User model and authentication
- `backend/api.py` - Authentication endpoints
- `src/context/` - Authentication context in frontend
- `src/components/` - Authentication UI components

### Security Configuration
- `.env`, `.env.example` - Environment variables and secrets
- Security middleware files
- Authentication configuration files

### Security Tools Configuration
- Security scanning configuration files
- Firewall configuration
- Security headers configuration
- Content Security Policy files

### Audit and Logging
- Security audit logs
- Authentication logs
- Access control logs
- Security event logs

## Integration Points

### With Backend Agent
- Implements authentication and authorization
- Handles secure API development
- Manages database security
- Implements secure data handling
- Coordinates security configurations

### With Frontend Agent
- Implements secure UI components
- Handles authentication UI securely
- Manages secure communication with backend
- Implements client-side security measures
- Coordinates security headers

### With Deployment Agent
- Implements deployment security
- Manages security certificates
- Configures security monitoring
- Implements infrastructure security
- Coordinates security scanning in CI/CD

### With Testing Agent
- Implements security testing
- Coordinates vulnerability scanning
- Validates security controls
- Tests security configurations
- Documents security test results

## Best Practices

### Authentication Security
- Implement strong password policies
- Use secure password hashing
- Implement account lockout mechanisms
- Use multi-factor authentication
- Secure session management

### API Security
- Implement proper authentication for APIs
- Use HTTPS for all communications
- Implement rate limiting
- Validate all inputs
- Handle errors securely

### Data Protection
- Encrypt sensitive data in transit and at rest
- Implement proper access controls
- Regularly backup data securely
- Follow data privacy regulations
- Minimize data collection

### Monitoring and Response
- Implement comprehensive logging
- Monitor for suspicious activities
- Have incident response procedures
- Regularly update security measures
- Conduct security training

## Error Handling

### Common Issues
- Authentication failures
- Authorization violations
- Security scanning failures
- Vulnerability detection
- Configuration errors

### Recovery Procedures
- Implement secure fallback mechanisms
- Notify security teams of issues
- Document security incidents
- Apply security patches promptly
- Conduct post-incident reviews
- Update security measures based on incidents