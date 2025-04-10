# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email instead of using the public issue tracker. All security vulnerabilities will be promptly addressed.

## Data Protection

This project handles sensitive student data. We take the following measures to protect this information:

1. **No Sensitive Data in Repository**: Student data files (CSV, JSON, etc.) are never committed to the repository.

2. **Database Security**: All student data is stored in a secure database, not in public files.

3. **API Authentication**: All API endpoints that access student data require authentication.

4. **Environment Variables**: Sensitive configuration, such as database connection strings and API keys, are stored in environment variables that are not committed to the repository.

## Best Practices for Contributors

If you contribute to this project, please follow these security practices:

1. **Never commit sensitive data** - Even temporarily. This includes:
   - Student information files
   - Private keys or credentials
   - Database dumps
   - Environment files (.env)

2. **Review code for security issues** before submitting PRs:
   - Validate and sanitize user inputs
   - Check for potential SQL injection vulnerabilities
   - Ensure proper authentication is required for sensitive operations

3. **Keep dependencies updated** to avoid known vulnerabilities

## Deployment Security

When deploying this application:

1. Use environment variables for all sensitive configuration
2. Ensure database connections use secure passwords and restricted network access
3. Implement proper backups of student data
4. Use HTTPS for all communications

Thank you for helping keep this project and its data secure. 