"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageQuerySchema = exports.uuidSchema = void 0;
const zod_1 = require("zod");
exports.uuidSchema = zod_1.z.string().uuid();
exports.pageQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
});
