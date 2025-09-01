# MerchApp Client

Modern React e-commerce client with Firebase authentication and Cloudinary image management.

## Features

- **React 18** with TypeScript and Vite
- **Dark-first design** with TailwindCSS
- **Firebase Authentication** (Email/Password + Google)
- **Cloudinary** image uploads with preview
- **Zustand** state management with persistence
- **TanStack Query** for server state
- **React Hook Form + Zod** for forms
- **Framer Motion** animations
- **shadcn/ui** component system

## Environment Variables

Create a `.env` file in the `apps/client` directory with the following variables:

### Firebase Configuration
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Cloudinary Configuration
```env
# For demo/development (unsigned uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# Note: For production, implement signed uploads via server endpoint
# See src/lib/cloudinary.ts for detailed implementation notes
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start development server:
   ```bash
   npm run dev
   ```

4. Visit `/theme-preview` to see all components and design tokens

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run clean` - Clean build artifacts and node_modules

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppShell, Navbar, Footer
│   └── ui/              # Reusable UI components
├── lib/
│   ├── firebase.ts      # Firebase auth helpers
│   ├── cloudinary.ts    # Image upload utilities
│   ├── api.ts           # API client with axios
│   └── utils.ts         # Utility functions
├── pages/               # Route components
├── store/               # Zustand stores
├── styles/              # Global styles
└── types/               # TypeScript definitions
```

## Authentication

Firebase authentication is configured for:
- Email/Password sign-in
- Google OAuth
- Automatic token refresh
- Persistent auth state

## Image Uploads

Cloudinary integration supports:
- **Development**: Unsigned uploads with upload preset
- **Production**: Signed uploads via server endpoint (recommended)

See `src/lib/cloudinary.ts` for production setup instructions.

## State Management

- **Auth Store**: Firebase user state with token management
- **Cart Store**: Shopping cart with localStorage persistence
- **TanStack Query**: Server state caching and synchronization

## API Integration

The API client is configured to:
- Proxy requests to `/api/*` endpoints
- Automatically include Firebase auth tokens
- Handle 401 redirects to login
- Provide typed API methods for products, orders, etc.