# Restaurant Order Processing System

## System Design

- Frontend: React + TypeScript + Vite with Tailwind CSS
- Backend: Spring Boot with WebSocket support
- Real-time Communication: STOMP over WebSocket

## Implementation Details

1. **Backend Architecture**:
   - In-memory order storage using ConcurrentHashMap
   - WebSocket integration for real-time updates
   - Async order processing simulation
   - CORS configuration for local development

2. **Frontend Features**:
   - Real-time order dashboard
   - Form validation
   - Error handling
   - Loading states
   - Responsive design

## Performance Optimization

1. **Backend**:
   - Using ConcurrentHashMap for thread-safe operations
   - Async order processing
   - WebSocket for efficient real-time updates

2. **Frontend**:
   - React's virtual DOM for efficient updates
   - Debounced form submissions
   - Optimized re-renders using proper React hooks
   - Error boundaries for fault isolation

## Running the Application

1. Backend:   ```bash
   cd backend
   ./gradlew bootRun```

2. Frontend:   ```bash
   cd frontend
   npm install
   npm run dev```

Access the application at [http://localhost:5173](http://localhost:5173)
