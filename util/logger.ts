import pino, {stdTimeFunctions} from 'pino'

export default pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:isoUtcDateTime',
        },
    },
    formatters: {
        bindings: function () {
            return {}
        },
    },
    timestamp: stdTimeFunctions.isoTime,
})