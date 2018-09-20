const convict = require('convict');

//Define configuration schema
const conf = convict({
    self: {
        port: {
            doc: 'Port for hosting API server',
            format: 'port',
            default: 3000,
            env: 'APP_PORT'
        },
        hostname: {
            doc: 'The hostname to use for the application',
            format: String,
            default: 'localhost',
            env: 'APP_HOSTNAME'
        },
        secure: {
            doc: 'Whether to use HTTPS or HTTP',
            format: Boolean,
            default: false,
            env: 'APP_SECURE'
        }
    }
});

// Load environment dependent configuration if available
if (process.env.APP_CONFIG) {
    conf.loadFile(process.env.APP_CONFIG);
}

// Perform validation
conf.validate({allowed: 'strict'});

module.exports = conf;
