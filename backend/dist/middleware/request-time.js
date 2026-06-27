"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTimeHook = void 0;
const requestTimeHook = async (request) => {
    request.startTime = Date.now();
};
exports.requestTimeHook = requestTimeHook;
