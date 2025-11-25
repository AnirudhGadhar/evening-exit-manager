# Parking Management System - Project Structure

## Complete Folder Structure

```
parking-management-system/
│
├── frontend/                          # React Frontend (Current Lovable Project)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # Shadcn UI components
│   │   │   ├── ParkingEntryForm.tsx  # Vehicle entry form
│   │   │   ├── ParkingExitForm.tsx   # Vehicle exit form
│   │   │   └── VehicleList.tsx       # List of parked vehicles
│   │   ├── pages/
│   │   │   ├── Index.tsx             # Main dashboard page
│   │   │   └── NotFound.tsx          # 404 page
│   │   ├── types/
│   │   │   └── vehicle.ts            # TypeScript interfaces
│   │   ├── App.tsx                   # Main app component
│   │   ├── index.css                 # Global styles & design system
│   │   └── main.tsx                  # App entry point
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.ts            # Tailwind configuration
│   ├── vite.config.ts                # Vite configuration
│   └── package.json
│
├── backend/                           # Node.js + Express Backend
│   ├── database/
│   │   └── schema.sql                # MySQL database schema
│   ├── server.js                     # Express server & API routes
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment variables template
│   ├── .env                          # Your actual config (create this)
│   └── README.md                     # Backend setup instructions
│
└── PROJECT_STRUCTURE.md              # This file
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Navigation
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MySQL2** - Database driver
- **node-schedule** - Cron jobs for auto-clear
- **CORS** - Cross-origin requests
- **dotenv** - Environment management

### Database
- **MySQL 8.0+** - Relational database

## Key Features

### 1. Vehicle Entry Form
- Vehicle number input
- Owner name
- Vehicle type selection (Car/Bike/Truck/Other)
- Optional phone number
- Auto-timestamp on entry

### 2. Vehicle Exit Form
- Search by vehicle number
- Display vehicle details
- Show parking duration
- Remove vehicle from system

### 3. Dashboard
- Real-time statistics (total, cars, bikes)
- List of all parked vehicles
- Duration tracking for each vehicle
- Auto-refresh

### 4. Auto-Clear System
- Scheduled task runs at 6 PM daily
- Clears all vehicles from database
- Simulates end-of-day cleanup

## Data Flow

```
User Action → Frontend (React) → API Request → Backend (Express) → MySQL Database
                                                    ↓
                                            Auto-clear at 6 PM
                                                    ↓
                                            Clear all records
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/vehicles | Fetch all vehicles |
| GET | /api/vehicles/:number | Get single vehicle |
| POST | /api/vehicles | Add new vehicle |
| DELETE | /api/vehicles/:number | Remove vehicle |
| DELETE | /api/vehicles | Clear all vehicles |
| GET | /api/stats | Get statistics |

## Setup Steps

### Frontend (Already set up in Lovable)
✅ No additional setup needed - it's running in Lovable!

### Backend
1. Navigate to backend folder
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example`
4. Configure MySQL credentials
5. Run server: `npm run dev`

### Database
1. Open MySQL Workbench
2. Create connection to localhost
3. Execute `database/schema.sql`
4. Verify tables created

## Current Implementation

- ✅ Frontend UI complete with responsive design
- ✅ Backend API with all CRUD operations
- ✅ MySQL database schema
- ✅ Auto-clear functionality at 6 PM
- ✅ Real-time duration tracking
- ✅ Vehicle type categorization
- ✅ Search functionality

## Frontend Runs Standalone
The current frontend implementation uses **localStorage** for data persistence, so it works perfectly without the backend. This means:

- You can test the UI immediately in Lovable
- Data persists in browser
- Auto-clear at 6 PM still works
- No backend required for demo/testing

## To Connect Frontend with Backend (Optional)

When you're ready to connect to MySQL backend:

1. Install axios in frontend:
   ```bash
   npm install axios
   ```

2. Create API service file:
   ```typescript
   // src/lib/api.ts
   import axios from 'axios';
   
   const api = axios.create({
     baseURL: 'http://localhost:5000/api'
   });
   
   export default api;
   ```

3. Replace localStorage calls with API calls in components

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=parking_management
```

## Next Steps

1. ✅ Test frontend UI (already working!)
2. Set up MySQL database
3. Configure backend .env
4. Start backend server
5. (Optional) Connect frontend to backend API
