# Database Seeding in Sherlock

This document outlines how to seed the PostgreSQL database with student data for the Sherlock Student Information System.

## Prerequisites

- PostgreSQL database connection set up (see [README-POSTGRES.md](./README-POSTGRES.md))
- CSV file with student data in the `data/` directory
- Node.js and npm installed

## Automatic Seeding

The system includes scripts to automate the seeding process:

### Basic Seeding

To seed the database with initial student data (will skip if students already exist):

```bash
npm run db:seed
```

This command will:
1. Check if students already exist in the database
2. If no students exist, it will import all records from `data/students.csv`
3. Log progress during the import process

### Force Reseeding

To force reseed the database (delete existing students and import all data again):

```bash
npm run db:reseed
```

This command will:
1. Delete all existing student records from the database
2. Import all records from `data/students.csv`
3. Log progress during the import process

This is useful for refreshing test data or starting with a clean slate.

## Manual Seeding

You can also run the seed scripts directly with specific options:

```bash
# Basic seeding
node prisma/seed.js

# Force reseeding
FORCE_RESEED=true node prisma/seed.js

# Cross-platform force reseeding
npx cross-env FORCE_RESEED=true node prisma/seed.js
```

## CSV Data Format

The seed script expects a CSV file with specific column headers:

- `SRNO` - Serial number
- `NAME` - Full name of the student
- `ENROLLMENT NUMBER` - Unique enrollment number
- `ROLLNO` - Roll number
- `REGISTRATION_NO` - Registration number
- ... and other fields matching the Student model

If a required field is missing or the CSV format is incorrect, the seeding may fail or result in incomplete data.

## Verification

To verify the seeding process was successful:

1. Use Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Run the verification script:
   ```bash
   node scripts/check-student-count.js
   ```
   
3. Check through the application interface

## Troubleshooting

Common issues and solutions:

### CSV File Not Found

Ensure your CSV file is located at `data/students.csv`. The error message will indicate the expected path.

### Database Connection Issues

Verify your database connection settings in `.env` and make sure the PostgreSQL service is running.

### Field Mapping Errors

If the CSV headers don't match what the seed script expects, you may need to modify the field mapping in `prisma/seed.js`.

### Unique Constraint Violations

If you're seeing errors about duplicate enrollment numbers or other unique fields, check your CSV data for duplicates.

## Seeding in Production

For production environments:

1. Make sure to use a secure database connection string
2. Consider using a more robust data validation process
3. Backup your database before running any seed operations
4. Use a staged process to test data import on a non-production database first

## Data Privacy

Remember that student information is sensitive. Ensure:

1. Test/sample data doesn't contain real student information
2. Production data is handled according to appropriate data protection regulations
3. Database access is properly secured 