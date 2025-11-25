# Parking Management System - Backend

## Setup Instructions

### 1. Install MySQL
Download and install MySQL Server and MySQL Workbench from:
https://dev.mysql.com/downloads/

### 2. Connect to MySQL Workbench

1. Open MySQL Workbench
2. Click on "+" icon to create a new connection
3. Enter connection details:
   - **Connection Name**: Parking Management
   - **Hostname**: localhost (or 127.0.0.1)
   - **Port**: 3306 (default)
   - **Username**: root (or your MySQL username)
   - **Password**: Click "Store in Keychain/Vault" and enter your password
4. Click "Test Connection" to verify
5. Click "OK" to save

### 3. Create Database

1. In MySQL Workbench, click on your connection to open it
2. Open the file `database/schema.sql`
3. Click the lightning bolt icon (⚡) to execute the entire script
4. Verify the database was created:
   ```sql
   SHOW DATABASES;
   USE parking_management;
   SHOW TABLES;
   ```

### 4. Configure Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your MySQL credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=parking_management
   ```

### 5. Run the Backend

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:5000

### 6. Test the API

You can test the API using:
- **Postman** or **Insomnia**
- **curl** commands
- Browser for GET requests

Example curl commands:
```bash
# Get all vehicles
curl http://localhost:5000/api/vehicles

# Add a vehicle
curl -X POST http://localhost:5000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "MH12AB1234",
    "ownerName": "John Doe",
    "vehicleType": "Car",
    "phoneNumber": "9876543210"
  }'

# Get vehicle by number
curl http://localhost:5000/api/vehicles/MH12AB1234

# Remove vehicle
curl -X DELETE http://localhost:5000/api/vehicles/MH12AB1234

# Get statistics
curl http://localhost:5000/api/stats
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vehicles | Get all parked vehicles |
| GET | /api/vehicles/:vehicleNumber | Get specific vehicle |
| POST | /api/vehicles | Add new vehicle |
| DELETE | /api/vehicles/:vehicleNumber | Remove vehicle |
| DELETE | /api/vehicles | Clear all vehicles |
| GET | /api/stats | Get parking statistics |

## Features

- ✅ Vehicle entry and exit management
- ✅ Real-time vehicle tracking
- ✅ Auto-clear all vehicles at 6 PM daily
- ✅ Vehicle type categorization
- ✅ Duration tracking
- ✅ Statistics dashboard

## Database Structure

### vehicles table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Auto-increment primary key |
| vehicle_number | VARCHAR(20) | Unique vehicle registration number |
| owner_name | VARCHAR(100) | Vehicle owner name |
| vehicle_type | ENUM | Car, Bike, Truck, or Other |
| phone_number | VARCHAR(15) | Optional contact number |
| entry_time | TIMESTAMP | Auto-set on entry |

## Troubleshooting

### Connection Issues
- Verify MySQL is running
- Check credentials in `.env`
- Ensure port 3306 is not blocked
- Try using 127.0.0.1 instead of localhost

### Permission Issues
```sql
-- Grant privileges to user
GRANT ALL PRIVILEGES ON parking_management.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Auto-clear Not Working
The auto-clear runs at 6 PM (18:00) server time. Ensure:
- Server is running
- Timezone is correct
- Check server logs for confirmation
