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
   yarn install
   ```

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

5. 🛠️ Database Setup

   Before running the app for the first time, you need to migrate and seed the database.

   - Run Migrations, This will create all necessary tables:

      ```bash
      yarn db:migrate
      ```

   - Run Seeders, This will insert initial data (roles, users, menus, permissions, etc.):

      ```bash
      yarn db:seed
      ```

   ------------------------------------------------------------

   - 🔐 Secure the Superadmin Role

      By default, the superadmin role is created with a fixed UUID from the seeder.
      For security reasons, you should replace it with your own UUID.

      ⚠️ Replace `your-uuid` with a freshly generated UUID (for example using uuidgen or uuidv7).

      Run this SQL in your Postgres instance:

      ```bash
      DO $$
         DECLARE
         v_old_role_id UUID;
         v_new_role_id UUID := 'your-uuid'; -- new secure ID
         BEGIN
         -- Find the existing role (superadmin)
         SELECT id INTO v_old_role_id
         FROM roles
         WHERE name = 'superadmin';

         IF v_old_role_id IS NULL THEN
            RAISE EXCEPTION 'Superadmin role not found';
         END IF;

         -- Update roles table
         UPDATE roles
         SET id = v_new_role_id
         WHERE id = v_old_role_id;

         -- Update users referencing old role
         UPDATE users
         SET role_id = v_new_role_id
         WHERE role_id = v_old_role_id;

         -- Update role_menu_permissions referencing old role
         UPDATE role_menu_permissions
         SET role_id = v_new_role_id
         WHERE role_id = v_old_role_id;

         RAISE NOTICE 'Superadmin role id updated from % to %', v_old_role_id, v_new_role_id;
      END $$;
      ```

   - Default username & password for credentials, change later:

      ```bash
         #username
         superadmin

         #password
         superadmin123
      ```

6. Compile and run the application in development:

   ```bash
   yarn dev
   ```

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
