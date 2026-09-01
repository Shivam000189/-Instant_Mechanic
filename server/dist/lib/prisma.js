"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
exports.prisma = prisma_1.default;
exports.default = prisma_1.default;
