# ZoCare Dashboard - Client-Server Architecture

A modern, production-ready admin dashboard built with client-server architecture using a Node.js BFF (Backend for Frontend) layer and React frontend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │    │      Server     │    │     Shared      │
│   (Frontend)    │◄──►│    (BFF API)    │    │     (Types)     │
│                 │    │                 │    │                 │
│  React + Vite   │    │   Node.js +     │    │   TypeScript    │
│  TypeScript     │    │   Express       │    │   Interfaces    │
│  TailwindCSS    │    │   TypeScript    │    │   Constants     │
│  React Query    │    │   Zod           │    │   Utilities     │
│  shadcn/ui      │    │   Winston       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

- **Client**: React SPA with modern tooling and UI components
- **Server**: Node.js BFF layer providing RESTful APIs
- **Shared**: Common TypeScript types and utilities between client and server

## 🚀 Features

### Frontend (Client)

- **Modern React Stack**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui + TailwindCSS
- **State Management**: React Query for server state
- **Routing**: React Router 6 with nested routes
- **Form Handling**: React Hook Form with Zod validation
- **Real-time Updates**: Optimistic updates and cache invalidation
- **Responsive Design**: Mobile-first with dark mode support

### Backend (Server)

- **Node.js + Express**: RESTful API with TypeScript
- **Input Validation**: Zod schemas with comprehensive error handling
- **Caching**: In-memory caching with TTL support
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Logging**: Winston with structured logging
- **Error Handling**: Global error handling with proper HTTP status codes
- **Health Checks**: Monitoring endpoints for system health

### Admin Panels

1. **📋 Fields Management**: Create and manage reusable form fields
2. **📝 Forms Management**: Build forms using predefined fields
3. **👥 Team Members**: User management with role-based permissions
4. **🎭 Groups**: Organize users with custom permissions
5. **🏷️ Tags**: Manage categorization tags for tickets
6. **👀 Views**: Create custom filtered ticket list views

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd zocare-dashboard

# Install all dependencies
npm run setup

# Start development servers (both client and server)
npm run dev
```

This will start:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001

### Individual Services

```bash
# Start only the client
npm run dev:client

# Start only the server
npm run dev:server

# Build everything
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck
```

## 📁 Project Structure

```
zocare-dashboard/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   └── lib/           # Utilities
│   ├── public/            # Static assets
│   └── package.json       # Client dependencies
├── server/                # Backend BFF API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── repositories/  # Data access layer
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route definitions
│   │   ├���─ services/      # Business logic
│   │   ├── validation/    # Input validation schemas
│   │   └── config/        # Configuration
│   ├── logs/              # Application logs
│   └── package.json       # Server dependencies
├── shared/                # Shared types and utilities
│   ├── types.ts          # TypeScript interfaces
│   ├── constants.ts      # Shared constants
│   └── utils.ts          # Utility functions
└── package.json          # Root monorepo configuration
```

## 🔌 API Endpoints

### Dashboard

- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/dashboard/activity` - Recent activity
- `GET /api/v1/dashboard/overview` - Complete overview

### Fields

- `GET /api/v1/fields` - List fields with pagination
- `POST /api/v1/fields` - Create new field
- `GET /api/v1/fields/:id` - Get field by ID
- `PUT /api/v1/fields/:id` - Update field
- `DELETE /api/v1/fields/:id` - Delete field
- `PATCH /api/v1/fields/:id/toggle-active` - Toggle field status

### Forms, Users, Groups, Tags, Views

Similar RESTful patterns for all entities.

## 🔧 Configuration

### Environment Variables

**Server (.env)**:

```env
NODE_ENV=development
PORT=3001
HOST=localhost
CORS_ORIGIN=http://localhost:8080
API_PREFIX=/api/v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL_SECONDS=300
LOG_LEVEL=info
```

**Client**:
API base URL is configured in `shared/constants.ts`

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run client tests only
npm run test:client

# Run server tests only
npm run test:server

# Type checking
npm run typecheck
```

## 📦 Building & Deployment

### Development Build

```bash
npm run build
```

### Micro Frontend Build

```bash
npm run build:mfe
```

Generates the required `asset-manifest.json` for Omega Hub integration.

### Production Deployment

1. **Server Deployment**:

   ```bash
   cd server
   npm run build
   npm start
   ```

2. **Client Deployment**:
   ```bash
   cd client
   npm run build:mfe
   # Upload dist/ contents to S3
   ```

## 🔒 Security Features

- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: Configurable request rate limits
- **CORS**: Strict origin validation
- **Helmet**: Security headers
- **Input Sanitization**: XSS protection
- **Error Handling**: No sensitive data exposure

## 📊 Monitoring & Logging

- **Structured Logging**: Winston with JSON format
- **Health Checks**: `/health` endpoint
- **Performance Monitoring**: Request timing and caching stats
- **Error Tracking**: Comprehensive error logging

## 🚀 Performance Optimizations

- **Caching**: Multi-level caching with TTL
- **Code Splitting**: Lazy loading and dynamic imports
- **Bundle Optimization**: Tree shaking and minification
- **API Optimization**: Pagination and filtering
- **React Query**: Smart caching and background updates

## 🤝 Development Guidelines

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Zod**: Runtime type validation

### Commit Standards

- Use conventional commit messages
- Include type checking before commits
- Test critical functionality

### API Design

- RESTful endpoints with consistent patterns
- Proper HTTP status codes
- Comprehensive error responses
- Input validation on all endpoints

## 📈 Scaling Considerations

- **Database**: Currently uses mock data, ready for database integration
- **Authentication**: JWT token structure prepared
- **Microservices**: BFF pattern allows easy service decomposition
- **Caching**: Redis integration ready
- **Load Balancing**: Stateless server design

## 🔄 CI/CD Pipeline (Ready)

```yaml
# Suggested pipeline stages
1. Install dependencies
2. Type checking
3. Linting
4. Testing
5. Build client & server
6. Generate MFE manifest
7. Deploy to staging/production
```

## 📚 Documentation

- **API Documentation**: Generated from route definitions
- **Component Library**: Storybook ready
- **Type Documentation**: Generated from TypeScript

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Check `CORS_ORIGIN` environment variable
2. **API Connection**: Verify server is running on port 3001
3. **Cache Issues**: Clear cache with `/api/v1/dashboard/cache` DELETE
4. **Build Errors**: Check TypeScript compilation

### Logs Location

- Server logs: `server/logs/`
- Console logs in development mode

---

**Built with ❤️ using modern React and Node.js best practices.**
