"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const sensible_1 = __importDefault(require("@fastify/sensible"));
const logger_js_1 = require("@/config/logger.js");
const error_handler_js_1 = require("@/middleware/error-handler.js");
const index_js_1 = require("@/common/constants/index.js");
// Import Plugins
const cors_js_1 = __importDefault(require("@/plugins/cors.js"));
const logger_js_2 = __importDefault(require("@/plugins/logger.js"));
const supabase_js_1 = __importDefault(require("@/plugins/supabase.js"));
// Import Routes
const health_js_1 = __importDefault(require("@/routes/v1/health.js"));
const createApp = async () => {
    const app = (0, fastify_1.default)({
        logger: logger_js_1.loggerConfig,
        disableRequestLogging: true, // Custom request logging is handled in loggerPlugin
    });
    // Register Fastify Sensible for HTTP errors and utility responses
    await app.register(sensible_1.default);
    // Register Plugins
    await app.register(cors_js_1.default);
    await app.register(logger_js_2.default);
    await app.register(supabase_js_1.default);
    // Register Global Error Handler
    app.setErrorHandler(error_handler_js_1.errorHandler);
    // Register API Routes
    await app.register(health_js_1.default, { prefix: index_js_1.API_PREFIX });
    return app;
};
exports.createApp = createApp;
exports.default = exports.createApp;
