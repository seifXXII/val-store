/**
 * Better Auth Type Extensions
 *
 * Extends Better Auth client types to include custom user fields
 * (phone, birthday) defined in our auth configuration.
 */

// Better Auth signup input with custom fields
export interface ExtendedSignUpInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  birthday?: string;
  image?: string;
  callbackURL?: string;
}

// Better Auth response types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  birthday: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  data?: {
    user: AuthUser;
    session: AuthSession;
  };
  error?: AuthError;
}

// Export a properly typed signUp function signature without any
export type ExtendedSignUpEmail = (
  input: ExtendedSignUpInput
) => Promise<AuthResponse>;
