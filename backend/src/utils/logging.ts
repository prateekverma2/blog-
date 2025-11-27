import { Signale } from 'signale';

const options = {
    scope: 'AuthApp',
    types: {
        success: { badge: '✅', color: 'green', label: 'success' },
        error: { badge: '❌', color: 'red', label: 'error' },
        warn: { badge: '⚠️', color: 'yellow', label: 'warning' },
        info: { badge: 'ℹ️', color: 'blue', label: 'info' },
        debug: { badge: '🐛', color: 'magenta', label: 'debug' }
    }
};

const logger = new Signale(options);

export default logger;
