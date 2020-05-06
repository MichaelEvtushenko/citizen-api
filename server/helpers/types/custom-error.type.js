module.exports = class CustomError extends Error {
    constructor(message, status) {
        super(message || 'Internal Server Error');
        this.name = 'CustomError';
        this.status = status || 500;
    }

    static badRequest(message) {
        return new CustomError(message || 'Bad Request', 400);
    }

    static unauthorized(message) {
        return new CustomError(message || 'Unauthorized', 401);
    }

    static forbidden(message) {
        return new CustomError(message || 'Forbidden', 403);
    }

    static notFound(message) {
        return new CustomError(message || 'Not Found', 404);
    }
};
