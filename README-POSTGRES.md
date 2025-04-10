# PostgreSQL Setup for Sherlock

Follow these steps to set up PostgreSQL for the Sherlock Student Information System.

## Step 1: Install PostgreSQL

If you haven't already, install PostgreSQL:
- Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Mac: `brew install postgresql`
- Linux: `sudo apt install postgresql`

Make sure to remember the password you set for the `postgres` superuser!

## Step 2: Run the Setup Script

We've created a setup script to automate the database configuration. Here's how to run it:

### Windows

1. Open Command Prompt or PowerShell as administrator
2. Navigate to the PostgreSQL bin directory:
   ```
   cd "C:\Program Files\PostgreSQL\17\bin"
   ```
   (Change the version number if needed)

3. Run the setup script (from your project folder):
   ```
   psql -U postgres -f "C:\path\to\Sherlock_pro\scripts\setup-db.sql"
   ```
   
4. Enter your PostgreSQL superuser password when prompted

### Mac/Linux

1. Open Terminal
2. Run the setup script:
   ```
   sudo -u postgres psql -f /path/to/Sherlock_pro/scripts/setup-db.sql
   ```

## Step 3: Verify the Connection

After running the script, edit your `.env` file to use:

```
DATABASE_URL="postgresql://abhi:abhi@localhost:5432/postgres"
```

Then run:

```
npx prisma db push
```

If successful, you'll see a message about your database being in sync with the schema.

## Step 4: Import Student Data

Once connected, you can import the student data:

```
npm run migrate-data
```

## Troubleshooting

### Connection Issues

If you still face connection issues:

1. Check that PostgreSQL is running:
   - Windows: Check Services (services.msc)
   - Mac/Linux: `ps aux | grep postgres`

2. Verify your PostgreSQL installation directory:
   - The default is `C:\Program Files\PostgreSQL\17\bin` on Windows
   - You may have a different version number

3. Make sure the `postgres` user has the correct password in your command

4. Check the PostgreSQL logs for error messages:
   - Usually in `C:\Program Files\PostgreSQL\17\data\log` on Windows
   - `/var/log/postgresql/` on Linux

### Manual Setup

If the script doesn't work, you can perform the steps manually:

1. Connect to PostgreSQL as the superuser:
   ```
   psql -U postgres
   ```

2. Create the 'abhi' user:
   ```sql
   CREATE USER abhi WITH PASSWORD 'abhi';
   ALTER USER abhi WITH LOGIN CREATEDB;
   ```

3. Grant permissions:
   ```sql
   GRANT CONNECT ON DATABASE postgres TO abhi;
   \c postgres
   GRANT ALL ON SCHEMA public TO abhi;
   ```

4. Test the connection:
   ```
   psql -U abhi -d postgres
   ```

For more detailed PostgreSQL setup information, refer to our [POSTGRESQL-SETUP.md](./POSTGRESQL-SETUP.md) guide. 