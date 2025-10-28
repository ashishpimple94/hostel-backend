# Security Features

This document outlines the security measures implemented in the Hostel Management System backend.

## Implemented Security Features

### 1. **Helmet - HTTP Security Headers**
- Protects against common web vulnerabilities by setting secure HTTP headers
- Content Security Policy (CSP) to prevent XSS attacks
- HSTS (HTTP Strict Transport Security) enabled with 1-year max age
- X-Frame-Options to prevent clickjacking
- X-Content-Type-Options to prevent MIME sniffing

### 2. **Rate Limiting**
- **Global Rate Limit**: 100 requests per 15 minutes per IP
- **Authentication Rate Limit**: 5 login attempts per 15 minutes per IP
- Prevents brute force attacks and DDoS attempts
- Configurable via environment variables

### 3. **MongoDB Injection Prevention**
- Sanitizes user input to prevent NoSQL injection attacks
- Replaces prohibited characters in query parameters
- Logs attempted injection attempts for monitoring

### 4. **HTTP Parameter Pollution (HPP) Protection**
- Prevents parameter pollution attacks
- Whitelisted parameters: room, floor, status, type, sort, fields, page, limit
- Ensures consistent parameter handling

### 5. **Request Size Limiting**
- Body payload limited to 10KB by default
- Prevents memory exhaustion attacks
- Configurable via environment variables

### 6. **Password Security**
- Passwords hashed using bcryptjs
- JWT-based authentication with configurable expiration
- Secure token storage recommended on client-side

### 7. **Input Validation**
- express-validator middleware for request validation
- Validates and sanitizes user inputs before processing

### 8. **CORS Configuration**
- Cross-Origin Resource Sharing properly configured
- Restricts API access to authorized domains

## Environment Variables for Security

```env
# Rate limiting (requests per 15 minutes)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# Body size limits
REQUEST_BODY_LIMIT=10kb

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_min_32_characters
JWT_EXPIRE=7d
```

## Security Best Practices

### For Production Deployment:

1. **Environment Variables**
   - Generate strong JWT_SECRET (minimum 32 characters)
   - Use environment-specific secrets
   - Never commit .env file to version control

2. **HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers (already configured)
   - Use valid SSL certificates

3. **Database Security**
   - Use MongoDB authentication
   - Restrict database access by IP
   - Regular backups
   - Keep MongoDB updated

4. **Monitoring & Logging**
   - Monitor rate limit violations
   - Log authentication attempts
   - Set up alerts for suspicious activities
   - Review logs regularly

5. **Dependencies**
   - Keep npm packages updated
   - Run `npm audit` regularly
   - Fix security vulnerabilities promptly

6. **API Security**
   - Validate all user inputs
   - Implement proper error handling
   - Don't expose sensitive error details
   - Use appropriate HTTP status codes

## Security Checklist

- [x] Helmet for HTTP headers
- [x] Rate limiting on all routes
- [x] Stricter rate limiting on authentication
- [x] MongoDB injection prevention
- [x] HTTP parameter pollution protection
- [x] Request size limiting
- [x] Password hashing with bcrypt
- [x] JWT authentication
- [x] Input validation
- [x] CORS configuration
- [ ] HTTPS enforcement (production)
- [ ] Security monitoring (recommended)
- [ ] Automated security scanning (recommended)

## Vulnerability Reporting

If you discover a security vulnerability, please email the security team immediately rather than creating a public issue.

## Additional Recommendations

### Future Enhancements:
1. **Two-Factor Authentication (2FA)**
   - Add SMS or email-based 2FA for admin accounts

2. **API Key Management**
   - Implement API keys for third-party integrations

3. **Session Management**
   - Add session timeout
   - Implement refresh tokens

4. **Audit Logging**
   - Log all sensitive operations
   - Maintain audit trail

5. **File Upload Security**
   - Scan uploaded files for malware
   - Restrict file types and sizes
   - Store files securely

6. **IP Whitelisting**
   - Allow admin access from specific IPs only

7. **Database Encryption**
   - Encrypt sensitive data at rest
   - Use field-level encryption for PII

## Security Testing

### Commands to run:
```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable vulnerabilities
npm audit fix

# Update packages
npm update

# Check outdated packages
npm outdated
```

## Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
