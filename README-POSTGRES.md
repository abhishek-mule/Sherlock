# Sherlock - PostgreSQL Database Integration

This document provides information on the PostgreSQL database integration in the Sherlock student information system using Railway.

## Overview

Sherlock uses a PostgreSQL database hosted on Railway for data storage. The application is configured to connect to this database using the connection string provided by Railway.

## Connection Details

Railway provides two types of connection URLs:

1. **Internal URL** - For use within the Railway environment:
   ```
   postgresql://postgres:******@postgres.railway.internal:5432/railway
   ```

2. **Public URL** - For external connections (local development):
   ```
   postgresql://postgres:******@turntable.proxy.rlwy.net:59936/railway
   ```

## Environment Configuration

To connect to the PostgreSQL database, set the following environment variables:

### For Railway Deployment

In the Railway dashboard, create a new variable:
```
DATABASE_URL=${{ Postgres.DATABASE_URL }}
```

This uses Railway's built-in environment variable linking feature to automatically use the correct internal connection string.

### For Local Development

In your `.env` or `.env.local` file:
```
DATABASE_URL="postgresql://postgres:password@turntable.proxy.rlwy.net:port/railway"
```

Use the external/public connection string provided by Railway.

## Database Schema

The database schema is defined in `prisma/schema.prisma`. It includes the following models:

- `Student` - Contains comprehensive student information including personal details, family information, academic records, etc.

## Data Access

The application uses Prisma ORM to interact with the PostgreSQL database. Key files:

- `prisma/schema.prisma` - Defines the database schema
- `src/app/api/data/route.ts` - API endpoint for fetching student data
- `prisma/seed.js` - Script for seeding the database with initial data

## Useful Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Seed the database with initial data
npm run db:seed

# Open Prisma Studio to view and edit data
npx prisma studio

# Check database connection
node scripts/check-db.js
```

## Deployment Considerations

When deploying to Railway:

1. The application will automatically use the internal connection URL
2. Make sure the `DATABASE_URL` environment variable is correctly set using the Railway linking syntax
3. For Vercel deployments, add the external PostgreSQL URL to the environment variables

## Troubleshooting

Common issues:

1. **Connection Error**: Check that you're using the correct connection URL for your environment.
2. **Schema Mismatch**: Run `npx prisma db push` to sync your schema with the database.
3. **Authentication Error**: Verify your database credentials are correct.
4. **Data Seeding Issues**: Run the seed script with `npm run db:seed`.

For more detailed PostgreSQL setup information, refer to our [POSTGRESQL-SETUP.md](./POSTGRESQL-SETUP.md) guide. 