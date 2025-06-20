# ZoCare Dashboard

A modern, production-ready admin dashboard built as a Micro Frontend (MFE) for managing ticketing system configurations.

## 🚀 Features

### Core Admin Panels

- **Fields Management**: Create and manage reusable form fields (text, select, date, etc.)
- **Forms Management**: Build forms using predefined fields with drag-and-drop configuration
- **Team Members**: User management with role-based permissions
- **Groups**: Organize users into logical groups with custom permissions
- **Tags**: Manage categorization tags for tickets
- **Views**: Create custom filtered ticket list views

### Technical Highlights

- **Micro Frontend Ready**: Generates `asset-manifest.json` for Omega Hub integration
- **Modern React Stack**: React 18, TypeScript, React Query, React Router
- **Beautiful UI**: Tailwind CSS with shadcn/ui components
- **Error Handling**: Comprehensive error boundaries and loading states
- **Responsive Design**: Mobile-first approach with dark mode support
- **Type Safety**: Full TypeScript coverage with strict type checking

## 🏗️ Architecture

### Micro Frontend Integration

- Built specifically for integration with Omega Hub (Node.js MFE host)
- Generates required `asset-manifest.json` format for S3 deployment
- Self-contained with all dependencies bundled

### Tech Stack

- **Build Tool**: Vite
- **Framework**: React 18 + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **Data Fetching**: React Query for server state management
- **Routing**: React Router 6 with nested routes
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build for MFE deployment
npm run build:mfe
```

### Project Structure

```
src/
├── components/
│   ├── layout/          # Dashboard layout components
│   ├── common/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── pages/              # Admin panel pages
├── types/              # TypeScript type definitions
└── lib/                # Utilities and helpers
```

## 🎯 Usage

### Navigation

The dashboard provides a clean sidebar navigation with organized sections:

- **Dashboard**: Overview and system status
- **Configuration**: Fields and Forms management
- **User Management**: Team Members and Groups
- **Content**: Tags and Views

### Data Management

All data operations use React Query for:

- Optimistic updates
- Background refetching
- Error handling
- Loading states
- Caching

### Form Patterns

Consistent form patterns across all admin panels:

- Input validation with clear error messages
- Loading states during submission
- Success/error notifications
- Auto-save capabilities where appropriate

## 🔧 Configuration

### Environment Variables

No environment variables required for basic operation. The app uses mock data that can be easily replaced with real API endpoints.

### Customization

- **Branding**: Update CSS variables in `src/index.css`
- **Colors**: Modify the ZoCare theme in `tailwind.config.ts`
- **API Integration**: Replace mock functions in `src/hooks/useApi.ts`

## 📦 Deployment

### MFE Deployment to S3

```bash
# Build the application
npm run build:mfe

# Upload dist/ contents to S3 bucket
# Ensure asset-manifest.json is accessible at bucket root
```

### Omega Hub Integration

The generated `asset-manifest.json` follows the required format:

```json
{
  "main.js": "assets/main.[hash].js",
  "main.css": "assets/main.[hash].css"
}
```

## 🎨 Design System

### Color Palette

- **Primary**: Purple (#8b5cf6) - ZoCare brand color
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **Font Family**: Inter (system font stack)
- **Headings**: Semibold weights for hierarchy
- **Body**: Regular weight for readability

### Spacing

- Consistent 4px grid system
- Generous whitespace for clean appearance
- Responsive breakpoints: sm, md, lg, xl

## 🔍 Code Quality

### Best Practices Implemented

- **Component Composition**: Small, focused components
- **Custom Hooks**: Reusable business logic
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loaders and spinners
- **TypeScript**: Strict type checking
- **Code Splitting**: Lazy loading for performance

### Testing

- Unit tests for utility functions
- Component testing with Vitest
- Type checking with TypeScript compiler

## 📈 Performance

### Optimizations

- Tree shaking for minimal bundle size
- Code splitting by route
- Optimized asset loading
- Efficient re-renders with React Query
- Memoized expensive calculations

### Bundle Analysis

Current build generates:

- ~865KB JavaScript (gzipped: ~236KB)
- ~64KB CSS (gzipped: ~11KB)

## 🤝 Contributing

### Development Guidelines

1. Follow the established component patterns
2. Use TypeScript for all new code
3. Implement proper error handling
4. Add loading states for async operations
5. Write descriptive commit messages
6. Test your changes thoroughly

### Code Style

- Use Prettier for formatting
- Follow React best practices
- Prefer composition over inheritance
- Keep components focused and single-purpose

## 📄 License

This project is proprietary software for ZoCare Dashboard.

---

Built with ❤️ using modern React patterns and best practices.
