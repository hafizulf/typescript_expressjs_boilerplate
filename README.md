# TypeScript Express.js API Boilerplate

## Overview

This is a TypeScript Express.js API Boilerplate built with modern technologies to deliver a scalable, real-time API with efficient caching and communication capabilities.

## Technologies Used

- **TypeScript**: Provides static typing for enhanced code reliability and maintainability.
- **Express.js**: A minimalist web framework for Node.js to build RESTful APIs.
- **Node.js 20**: The runtime environment for executing JavaScript on the server.
- **Socket.IO**: Enables real-time, bidirectional communication between clients and the server.
- **Redis**: An in-memory data store used for caching.

## Features

- RESTful API endpoints for seamless client-server communication.
- Comprehensive user, role, access, and permission management system.
- Support for future real-time backend features using Socket.IO.
- Type-safe codebase with TypeScript for robust development.

## Prerequisites

- Node.js 20.x
- Redis server
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   yarn install --frozen-lockfile
   ```

   > **Important:**  
   > Using `--frozen-lockfile` ensures that dependencies are installed exactly as specified in the `yarn.lock` file, preventing unexpected changes.  
   > 
   > If you intentionally want to apply updates or allow breaking changes (e.g., updating versions), you can skip the flag and run:
   > 
   > ```bash
   > yarn install
   > ```
   > 
   > _(Be careful: skipping `--frozen-lockfile` may modify your `yarn.lock` and update packages.)_

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add necessary configurations (e.g., Redis connection, port, etc.):

   ```env
   APP_PORT=3000
   DB_USER=postgres
   ```

4. Start the Redis server (if not already running with docker):

   ```bash
   docker compose -f docker-compose-development.yaml up
   ```

5. Compile and run the application in development:

   ```bash
   yarn dev
   ```

## Socket Usage

- dsadsa

## Project Structure Overview

```plaintext
.
├── src/                      # Application source code
│
│   ├── config/               # Configuration files
│   │   ├── cors.ts           # CORS setup
│   │   ├── database.ts       # DB connection and ORM initialization
│   │   └── env.ts            # Environment variable loader/parser
│
│   ├── container.ts          # Dependency injection container (IoC) setup
│
│   ├── exceptions/           # Global error handling
│   │   ├── app-error.ts      # Custom base error class
│   │   └── error-handler.ts  # Express error middleware
│
│   ├── helpers/              # Utility functions and shared logic
│   │   └── schema-validator.ts  # Validation helpers (e.g., Zod)
│
│   ├── index.ts              # Application entry point (starts Express, loads DI)
│
│   ├── libs/                 # Infrastructure and low-level utilities
│   │   ├── cron-job/         # Scheduled job definitions
│   │   ├── exit-handler.ts   # Graceful shutdown logic
│   │   ├── file-system.ts    # File handling utilities
│   │   ├── formatters.ts     # Formatter utilities (dates, numbers)
│   │   ├── logger.ts         # Logger configuration (e.g., Winston)
│   │   ├── mqtt/             # MQTT messaging helpers
│   │   ├── redis/            # Redis integration (cache/pubsub)
│   │   ├── standard-response.ts  # Standardized API responses
│   │   └── websocket/        # WebSocket server/handlers
│
│   ├── modules/              # Domain modules (DDD bounded contexts)
│   │   ├── access-managements/  # Role/permission and ACL logic
│   │   ├── announcements/       # Announcement domain
│   │   ├── authentications/     # Auth handling (login, JWT)
│   │   ├── common/              # Shared entities, interfaces, or use-cases
│   │   ├── dashboard-totals/    # Dashboard-specific logic
│   │   ├── refresh-tokens/      # Refresh token handling
│   │   ├── roles/               # Role definitions and assignments
│   │   ├── user-logs/           # User activity logging
│   │   └── users/               # User logic
│
│   ├── presentation/         # Handles delivery layer 
│   │   ├── bootstrap.ts      # Application bootstrap/init logic
│   │   ├── middlewares/      # Express middlewares (auth, logging, etc.)
│   │   ├── routes.ts         # Maps HTTP routes to module controllers
│   │   └── server.ts         # Express app/server setup
│
│   └── types.ts              # Global/shared TypeScript types
├── docker-compose.yaml       # Docker service definitions (e.g., DB, Redis)
├── package.json              # Project metadata and npm scripts
├── README.md                 # Project documentation
├── tsconfig.json             # TypeScript compiler configuration
├── yarn.lock                 # Yarn dependency lockfile
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.