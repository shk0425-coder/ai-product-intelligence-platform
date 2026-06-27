export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(400, 'VALIDATION_ERROR', message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, 'AUTHENTICATION_ERROR', message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(500, 'DATABASE_ERROR', message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'INTERNAL_SERVER_ERROR', message);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid token') {
    super(401, 'AUTH_INVALID_TOKEN', message);
  }
}

export class ExpiredTokenError extends AppError {
  constructor(message: string = 'Token has expired') {
    super(401, 'AUTH_EXPIRED_TOKEN', message);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid email or password') {
    super(401, 'AUTH_INVALID_CREDENTIALS', message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class WorkspaceNotFoundError extends AppError {
  constructor(message: string = 'Workspace not found') {
    super(404, 'WORKSPACE_NOT_FOUND', message);
  }
}

export class WorkspaceAlreadyExistsError extends AppError {
  constructor(message: string = 'Workspace name already exists') {
    super(409, 'WORKSPACE_ALREADY_EXISTS', message);
  }
}

export class WorkspaceForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access to workspace') {
    super(403, 'WORKSPACE_FORBIDDEN', message);
  }
}


