"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.DatabaseError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(400, 'VALIDATION_ERROR', message);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(401, 'AUTHENTICATION_ERROR', message);
    }
}
exports.AuthenticationError = AuthenticationError;
class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(500, 'DATABASE_ERROR', message);
    }
}
exports.DatabaseError = DatabaseError;
class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(500, 'INTERNAL_SERVER_ERROR', message);
    }
}
exports.InternalServerError = InternalServerError;
