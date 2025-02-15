# Session Handling Guide

This guide explains how to handle user sessions in our Next.js application using NextAuth.js.

## Available Methods

We provide two methods for session handling:

### 1. Client-side: `useCurrentUser()`

```typescript
import { useCurrentUser } from "@/hooks/use-current-user";

// In your React component
const Component = () => {
  const user = useCurrentUser();
  
  if (!user) return null;
  return <div>Welcome {user.name}</div>;
};
```

- Use in React components
- Non-async implementation
- Automatically updates with session changes
- Best for interactive UI elements

### 2. Server-side: `currentUser()`

```typescript
import { currentUser } from "@/lib/auth";

// In your Server Component or API route
async function getData() {
  const user = await currentUser();
  
  if (!user) throw new Error("Unauthorized");
  return db.data.findMany({ where: { userId: user.id }});
}
```

- Use in Server Components and API routes
- Async implementation
- More secure for data operations
- Best for database queries and protected actions

## When to Use Each Method

Use **client-side** `useCurrentUser()` when:
- Building interactive UI components
- Showing/hiding elements based on auth state
- Displaying user information in the interface
- Handling real-time session updates

Use **server-side** `currentUser()` when:
- Performing database operations
- Protecting API routes
- Handling sensitive operations
- Working with Server Components

## Best Practices

1. **Security**: Use server-side method for any data operations
2. **Performance**: Use client-side method for UI updates
3. **Consistency**: Don't mix methods in the same component/function
4. **Error Handling**: Always handle both authenticated and unauthenticated states

## Type Safety

Both methods return the same user type for consistency:

```typescript
type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // ... any custom fields
};
