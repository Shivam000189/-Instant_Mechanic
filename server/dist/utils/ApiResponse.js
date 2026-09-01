"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    data;
    error;
    constructor(success, payload) {
        this.success = success;
        if (success) {
            this.data = payload;
        }
        else {
            this.error = payload;
        }
    }
}
exports.ApiResponse = ApiResponse;
