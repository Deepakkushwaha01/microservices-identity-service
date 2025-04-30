"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    constructor(res) {
        this.res = res;
    } // make's it private
    badRequest({ success = false, message = 'Bad Request' }) {
        return this.res.status(400).json({
            success,
            message
        });
    }
    success({ success = true, message = 'Success' }) {
        return this.res.status(200).json({
            success,
            message
        });
    }
    notFound({ success = false, message = 'Not Found' }) {
        return this.res.status(404).json({
            success,
            message
        });
    }
    internalServerError({ success = false, message = 'Internal Server Error' }) {
        return this.res.status(500).json({
            success,
            message
        });
    }
    unauthorized({ success = false, message = 'Unauthorized' }) {
        return this.res.status(401).json({
            success,
            message
        });
    }
    forbidden({ success = false, message = 'Forbidden' }) {
        return this.res.status(403).json({
            success,
            message
        });
    }
    conflict({ success = false, message = 'Conflict' }) {
        return this.res.status(409).json({
            success,
            message
        });
    }
}
exports.Result = Result;
