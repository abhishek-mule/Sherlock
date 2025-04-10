# Sherlock - Student Information System with OSINT Tools

![Sherlock Logo](/public/images/sherlock-logo.svg)

A comprehensive student information system with secure data management, modern UI, and integrated OSINT tools for educational purposes.

> Sherlock includes OSINT tools developed by Abhi

## Security Features

This application has been configured with security best practices:

- **Private Student Data**: All sensitive student information is stored in a database, not in the repository
- **Environment Variables**: Sensitive configuration is stored in `.env` files which are excluded from version control
- **Database Authentication**: API endpoints require authentication to access student data
- **Local Development**: Sample data is automatically generated for local development

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL or SQLite database

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/abhishek-mule/Sherlock.git
   cd Sherlock
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the example environment file and update it:
   ```
   cp .env.example .env
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Data Security

The application is designed to keep student data secure:

1. Student data is stored in a secure database
2. CSV files are excluded from the git repository
3. API endpoints require authentication
4. Database connection strings are kept in environment variables

## Deploying to Production

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables:
   - `DATABASE_URL`: Your database connection string
   - `API_SECRET_KEY`: A strong, random API key

### Database Options

- **SQLite**: For small deployments (data stored locally)
- **PostgreSQL**: For production use (with Railway, Supabase, or Neon)
- **MySQL**: Alternative option for production

## License

This project is licensed under the MIT License - see the LICENSE file for details.
