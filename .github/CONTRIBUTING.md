# Contributing to Sherlock

Thank you for considering contributing to Sherlock! This document provides guidelines and instructions for contributing to this project.

## Data Privacy First

This project handles sensitive student information. The most important rule when contributing is:

**NEVER commit any real student data to the repository.**

- No CSV files with student records
- No database dumps containing real student information
- No screenshots that include personal identifiable information

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature or bugfix
4. Install dependencies:
   ```
   npm install
   ```
5. Copy the example environment file:
   ```
   cp .env.example .env
   ```
6. Make your changes
7. Run tests (if applicable)
8. Submit a pull request

## Development Guidelines

### Working with Student Data

- Use fake/mock data for development and testing
- The project includes a data generation script that creates realistic but fake student records
- If you need to test with specific data patterns, create minimal synthetic examples

### Code Style

- Follow the existing code style in the project
- Use TypeScript for type safety
- Include JSDoc comments for functions and components

### Commit Messages

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused on a single change

## Pull Request Process

1. Update the README.md or documentation with details of your changes if appropriate
2. If you've added new dependencies, explain why they're necessary
3. Make sure your code passes all tests
4. Your PR will be reviewed by the maintainers

## Security Considerations

- Never store sensitive information in code or comments
- Follow the security best practices detailed in SECURITY.md
- Use environment variables for configuration
- Be careful when modifying authentication logic

Thank you for your contribution! 