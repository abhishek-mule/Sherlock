# PostgreSQL Setup for Sherlock Project

This document explains how to set up and work with PostgreSQL for the Sherlock student information system.

## Database Connection

The project uses Railway as a PostgreSQL host. There are two connection URLs:

1. Internal URL (For Railway deployment): 
   `postgresql://postgres:iWKyBzjNiiTbjeWqyisWrHEvMSzQBoAe@postgres.railway.internal:5432/railway`

2. Public URL (For local development):
   `postgresql://postgres:iWKyBzjNiiTbjeWqyisWrHEvMSzQBoAe@turntable.proxy.rlwy.net:59936/railway`

## Environment Configuration

The database connection URLs are stored in two environment files:

1. `.env` - Used by Prisma and other tools
2. `.env.local` - Used by Next.js

Make sure both files have the correct URLs.

## Database Schema

The database schema is defined in `prisma/schema.prisma`. It contains a `Student` model with fields for all student information.

### Key Entity: Student

The main entity is the `Student` model which contains:
- Personal information (name, contact info, etc.)
- Family information (parents, guardian)
- Address information
- Academic information
- Previous education details

## Working with the Database

### Prisma CLI Commands

- Generate Prisma Client: `npx prisma generate`
- Push Schema to Database: `npx prisma db push`
- Run Database Migrations: `npx prisma migrate dev`
- Open Prisma Studio: `npx prisma studio`
- Seed the Database: `npm run db:seed`

### NPM Scripts

The following scripts are available:

```json
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev",
"prisma:studio": "prisma studio",
"db:push": "prisma db push",
"db:seed": "node prisma/seed.js"
```

## Seeding the Database

The project includes a seed script (`prisma/seed.js`) that:
1. Checks if students already exist in the database
2. Reads student data from `data/students.csv`
3. Parses and transforms the data to match the Prisma model
4. Inserts the student records into the database

## API Integration

The API route at `src/app/api/data/route.ts` uses Prisma to:
1. Connect to the PostgreSQL database
2. Query student data based on parameters
3. Return the results in JSON format
4. Fall back to CSV if database connection fails

## Deployment Considerations

When deploying to Railway or other platforms:
1. Use the internal connection URL for the deployed application
2. Use the public connection URL for local development
3. Ensure all environment variables are properly set

## Troubleshooting

Common issues:

1. **Database Connection Failed**: Make sure you're using the correct connection URL for your environment.
2. **Cannot Find Module '@prisma/client'**: Run `npx prisma generate` to generate the client.
3. **Invalid Schema**: Fix any errors in the schema and run `npx prisma db push` again.
4. **Data Not Loading**: Check the API route error handling and make sure the database connection is working.

## Next Steps

1. Implement more complex queries
2. Add authentication and authorization for database access
3. Create admin interfaces for data management
4. Set up automated backups 