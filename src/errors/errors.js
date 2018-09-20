'use strict';

class AuthorizationError extends Error {
    constructor ( extra ) {
        super();
        this.status = 403;
        Error.captureStackTrace( this, this.constructor );
        this.name = 'AuthorizationError';
        this.message = 'You are not authorized to perform this action';
        if ( extra ) {
            this.extra = extra;
        }
    }
}

class DoesNotExistsError extends Error {
    constructor ( message, extra ) {
        super();
        this.status = 404;
        Error.captureStackTrace( this, this.constructor );
        this.name = 'DoesNotExistsError';
        this.message = message;
        if ( extra ) {
            this.extra = extra;
        }
    }
}

class SamlAuthenticationError extends Error {
    constructor ( url, extra ) {
        super();
        this.status = 401;
        Error.captureStackTrace( this, this.constructor );
        this.name = 'SamlAuthenticationError';
        this.message = {redirectUrl: url};
        if ( extra ) {
            this.extra = extra;
        }
    }
}

class ValidationError extends Error {
    constructor ( message, extra ) {
        super();
        this.status = 400;
        Error.captureStackTrace( this, this.constructor );
        this.name = 'ValidationError';
        this.message = message;
        if ( extra ) {
            this.extra = extra;
        }
    }
}

class ImageProcessingError extends Error {
    constructor ( message, extra ) {
        super();
        this.status = 400;
        Error.captureStackTrace( this, this.constructor );
        this.name = 'ImageProcessingError';
        this.message = message;
        if ( extra ) {
            this.extra = extra;
        }
    }
}

class NotAllowedError extends Error {
    constructor ( message, extra ) {
        super();
        this.status = 405;
        Error.captureStackTrace( this, this.constructor );
        this.name = 'NotAllowedError';
        this.message = message;
        if ( extra ) {
            this.extra = extra;
        }
    }
}

/**
 * For CSV format invalid exception
 */
class CsvFormatInvalidError extends Error {
    constructor ( message, extra ) {
        super();
        this.status = 400;
        Error.captureStackTrace( this, this.constructor );
        this.name = 'CsvFormatInvalidError';
        this.message = message;
        if ( extra ) {
            this.extra = extra;
        }
    }
}

module.exports = {
    AuthorizationError,
    DoesNotExistsError,
    SamlAuthenticationError,
    ValidationError,
    NotAllowedError,
    CsvFormatInvalidError,
    ImageProcessingError
};