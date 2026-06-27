export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}
