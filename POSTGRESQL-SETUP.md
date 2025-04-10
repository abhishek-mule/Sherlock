# PostgreSQL Setup Guide for Sherlock

This guide will help you set up your PostgreSQL database for the Sherlock Student Information System.

## Prerequisites

- PostgreSQL 12 or later installed on your machine
- Administrative access to your PostgreSQL server

## Step 1: Connect to PostgreSQL

Open a PostgreSQL shell or pgAdmin, and connect with your administrative account (usually `postgres`).

**Using psql (CLI):**
```bash
# On Windows
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
# On Mac/Linux
psql -U postgres
```

You'll be prompted for the password you set during PostgreSQL installation.

## Step 2: Create the Sherlock Database

Once connected, create the database:

```sql
CREATE DATABASE "Sherlock";
```

## Step 3: Create the User (if needed)

If you want to use a specific user for this application (recommended for security):

```sql
CREATE USER abhi WITH PASSWORD 'your_secure_password';
ALTER USER abhi WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE "Sherlock" TO abhi;
```

## Step 4: Connect to the Sherlock Database

Connect to the newly created database:

```sql
\c Sherlock
```

## Step 5: Grant Schema Permissions

Grant permissions to the user:

```sql
-- Switch to the Sherlock database first
\c Sherlock

-- Grant permissions
GRANT ALL ON SCHEMA public TO abhi;
```

## Step 6: Update Your Environment Variables

Update your `.env` file with the correct connection string:

```
# If using the postgres superuser
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/Sherlock"

# If using the abhi user (after creating it)
DATABASE_URL="postgresql://abhi:your_secure_password@localhost:5432/Sherlock"
```

Replace `your_postgres_password` or `your_secure_password` with the actual password.

## Step 7: Test the Connection

Run the Prisma database push command to test the connection:

```bash
npx prisma db push
```

If successful, you should see a message about your database being in sync with the Prisma schema.

## Step 8: Import the Student Data

Now you can import your student data:

```bash
npm run migrate-data
```

## Troubleshooting

### Connection Issues

1. **Authentication Error**: Check that the username and password in your connection string match your PostgreSQL credentials.

2. **Database Does Not Exist**: Make sure you've created the "Sherlock" database.

3. **Permission Denied**: Ensure your user has proper permissions on the database.

4. **Connection Refused**: Make sure PostgreSQL service is running.

### Checking PostgreSQL Status

**Windows:**
1. Open Services (services.msc)
2. Look for "PostgreSQL Server" and ensure it's running

**Mac/Linux:**
```bash
sudo service postgresql status
# or
pg_isready
```

### Logging

Check PostgreSQL logs for more detailed error information:

**Windows:** 
- Typically located at `C:\Program Files\PostgreSQL\17\data\log`

**Mac/Linux:**
- Typically at `/var/log/postgresql/`

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation for PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql) 