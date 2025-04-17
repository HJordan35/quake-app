# Auth0 Integration

This directory contains components related to Auth0 authentication integration.

## Environment Variables

Create a `.env` file at the root of your project with the following variables:

```
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_CALLBACK_URL=http://localhost:3000
```

## Auth0Provider

The `Auth0ProviderWithNavigate` component is a wrapper around Auth0's `Auth0Provider` that handles redirects after authentication using TanStack Router's navigation.

## Setup in Auth0 Dashboard

1. Create a new application in your Auth0 dashboard
2. Choose "Single Page Application" as the application type
3. Configure callback URLs (e.g., `http://localhost:3000`)
4. Configure logout URLs (e.g., `http://localhost:3000`)
5. Configure allowed web origins (e.g., `http://localhost:3000`)
6. Note down your Auth0 domain and client ID for use in environment variables 