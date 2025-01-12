# Restaurant Order Management System

## System Overview

A full-stack restaurant order management system with real-time updates, comprising the following key components:

- Admin Dashboard (Frontend)
- Customer Application
- Backend Service
- Database (PostgreSQL) and Redis in Docker for better portability and scalability

## Tech Stack

### Backend (Spring Boot)

- Java 17
- Spring Boot 3.2.3
- Spring Security
- Spring WebSocket
- JUnit 5 & Mockito for testing
- Lombok (to reduce boilerplate code)
- Actuator & Prometheus for monitoring

### Admin Dashboard (Frontend)

- React 18.3
- TypeScript 5.6
- Vite 6.0
- TailwindCSS 3.4
- Radix UI components
- Playwright E2E testing
- STOMP WebSocket client
- ShadcnUI components

### Customer Application

- React 18.3
- TypeScript 5.6
- Vite 6.0
- TailwindCSS 3.4
- Radix UI components
- STOMP WebSocket client
- ShadcnUI components

## Architecture and Features

### Backend Architecture

- RESTful API endpoints for CRUD operations
- WebSocket integration using STOMP protocol
- Thread-safe order handling with ConcurrentHashMap
- Asynchronous order processing simulation
- Comprehensive security configuration
- Rate limiting using Guava
- Caching support
- Monitoring endpoints with Spring Actuator

### Admin Dashboard Features

- Real-time order management dashboard
- Category-wise menu item management
- Order status updates
- Detailed order tracking
- Category management
- Responsive design
- Form validation
- Error boundaries
- E2E testing with Playwright

### Customer Application Features

- Menu browsing and ordering
- Real-time order status tracking
- Order history
- Category-based menu filtering
- Responsive design
- Form validation
- Error handling

## Application Setup

### Backend

1. Prerequisites:
   - JDK 17 or higher
   - Gradle 7.x or higher
   - Docker for running the database and Redis

2. Running the db, redis and the application:

```sh
cd backend
docker-compose up -d
./gradlew bootRun
```

The server will start at `http://localhost:8080`.

### Admin Dashboard

1. Prerequisites:
   - Node.js 18.x or higher
   - npm 9.x or higher

2. Run the application:

```sh
cd frontend
npm install
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`.

### Customer Application

1. Prerequisites:
   - Node.js 18.x or higher
   - npm 9.x or higher

2. Run the application:

```sh
cd customer
npm install
npm run dev
```

The customer application will be available at `http://localhost:5174`.

## Testing

### Backend Testing

Run unit and integration tests:

```sh
cd backend
./gradlew test
```

### Admin Dashboard Testing

Before running tests, ensure that the Playwright browser is installed. While the required browser is installed automatically during test execution, you can install it manually to save time:

```sh
cd frontend
npx playwright install
```

Run E2E tests:

```sh
cd frontend
npm run test:e2e # Run tests in headless mode
npm run test:e2e:ui # Display UI during test execution
```

## Development Requirements

### Key Package Versions

- Node.js: ≥ 18.x
- Java: ≥ 17
- React: 18.3.x
- TypeScript: ~5.6.2
- Vite: ^6.0.3
- TailwindCSS: ^3.4.17
- Spring Boot: 3.2.3

### Development Tools

- TypeScript-supported IDE (recommended: VS Code)
- Java IDE (recommended: IntelliJ IDEA)
- Git
- Postman or similar API testing tool
- WebSocket client for testing (e.g., WebSocket King)

### Environment Setup

1. Install Node.js and npm.
2. Install JDK 17.
3. Install Gradle.
4. Set up the `JAVA_HOME` environment variable.
5. Install recommended IDE extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense

## Additional Notes

- The backend uses in-memory storage in the development environment.
- WebSocket connections are configured for local development.
- CORS is configured for local development.
- The system uses real-time communication for order updates.
- Both frontend applications use the same UI component library for consistency.
- The application is divided into two frontend applications for restaurant use: one for customers and one for administrators.
