# MySQL Workbench Setup Guide

## Step 1: Download and Install MySQL

### For Windows
1. Go to https://dev.mysql.com/downloads/mysql/
2. Download **MySQL Installer for Windows**
3. Run the installer
4. Choose "Full" installation (includes MySQL Server + Workbench)
5. Set root password during installation (remember this!)

### For macOS
1. Go to https://dev.mysql.com/downloads/mysql/
2. Download **MySQL Community Server** for macOS
3. Install the .dmg file
4. Note the temporary root password shown during installation
5. Download **MySQL Workbench** separately:
   - https://dev.mysql.com/downloads/workbench/

### For Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server mysql-workbench
sudo mysql_secure_installation
```

## Step 2: Start MySQL Server

### Windows
- MySQL runs as a service automatically
- Check in Task Manager → Services → MySQL80

### macOS
```bash
# Start MySQL
sudo /usr/local/mysql/support-files/mysql.server start

# Or use System Preferences → MySQL → Start
```

### Linux
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

## Step 3: Open MySQL Workbench

1. Launch MySQL Workbench application
2. You should see the MySQL Connections panel

## Step 4: Create New Connection

1. Click the **"+"** icon next to "MySQL Connections"
2. Fill in the connection details:

```
Connection Name: Parking Management System
Hostname: localhost
Port: 3306
Username: root
Password: [Click "Store in Vault" and enter your MySQL root password]
```

3. Click **"Test Connection"** to verify
4. If successful, click **"OK"**

## Step 5: Execute Database Schema

1. Double-click your new connection to open it
2. Click **File → Open SQL Script**
3. Navigate to `backend/database/schema.sql`
4. Click **Open**
5. Click the **Lightning Bolt** icon (⚡) to execute
6. You should see "Action Output" showing success messages

## Step 6: Verify Database Creation

Run these commands in the Workbench query panel:

```sql
-- Check if database exists
SHOW DATABASES;

-- Switch to the database
USE parking_management;

-- Check if table exists
SHOW TABLES;

-- View table structure
DESCRIBE vehicles;

-- Check current data (should be empty initially)
SELECT * FROM vehicles;
```

## Step 7: Configure Backend Connection

1. Go to `backend/` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD
   DB_NAME=parking_management
   ```

## Step 8: Test Backend Connection

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

## Common Issues & Solutions

### Issue 1: "Access denied for user 'root'@'localhost'"
**Solution**: Wrong password in .env file
```bash
# Reset root password (MySQL Workbench)
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Issue 2: "Can't connect to MySQL server"
**Solution**: MySQL service not running
```bash
# Windows: Start service in Services panel
# Mac: sudo /usr/local/mysql/support-files/mysql.server start
# Linux: sudo systemctl start mysql
```

### Issue 3: Port 3306 already in use
**Solution**: Another MySQL instance running
```bash
# Find process using port
# Windows: netstat -ano | findstr :3306
# Mac/Linux: lsof -i :3306
```

### Issue 4: "Unknown database 'parking_management'"
**Solution**: Schema not executed
- Re-run the schema.sql file in MySQL Workbench

### Issue 5: Authentication plugin error
**Solution**: Update authentication method
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

## Useful MySQL Workbench Tips

### View Connection Status
Bottom left corner shows: 🟢 Connected or 🔴 Disconnected

### Execute Selected SQL
- Highlight SQL code
- Press `Ctrl+Shift+Enter` (Windows/Linux) or `Cmd+Shift+Enter` (Mac)

### Save Query Results
- Right-click on result grid
- "Export" → Choose format (CSV, JSON, etc.)

### View Server Status
- Click "Server Status" in Navigator panel
- Shows uptime, connections, traffic

## Database Management Commands

```sql
-- Create backup
mysqldump -u root -p parking_management > backup.sql

-- Import backup
mysql -u root -p parking_management < backup.sql

-- Show all users
SELECT user, host FROM mysql.user;

-- Create new user
CREATE USER 'parking_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON parking_management.* TO 'parking_user'@'localhost';
FLUSH PRIVILEGES;

-- Check table size
SELECT 
    table_name,
    round(((data_length + index_length) / 1024 / 1024), 2) as 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'parking_management';
```

## Security Best Practices

1. **Don't use root in production**
   - Create a dedicated user for the app
   
2. **Use strong passwords**
   - Mix letters, numbers, symbols
   
3. **Limit remote access**
   - Keep host as 'localhost' unless needed
   
4. **Regular backups**
   - Schedule daily backups
   
5. **Never commit .env file**
   - Already in .gitignore

## Next Steps

Once MySQL is set up and backend is running:

1. Test API with Postman/curl
2. Verify data persistence
3. Test auto-clear at 6 PM (or change time for testing)
4. (Optional) Connect frontend to backend API

---

**Need Help?**
- MySQL Documentation: https://dev.mysql.com/doc/
- MySQL Workbench Manual: https://dev.mysql.com/doc/workbench/en/
- Stack Overflow: https://stackoverflow.com/questions/tagged/mysql
