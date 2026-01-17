import pino from 'pino';
import pinoHttp from 'pino-http';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        },
});

export const httpLogger = pinoHttp({
    logger,
    // Custom request mapping if needed
    customProps: (req, res) => ({
        userId: (req as any).user?.id,
    }),
    // Suppress default logs for health checks
    autoLogging: {
        ignore: (req) => req.url === '/health',
    },
});
