import pkg from 'winston';
const { createLogger, format, transports } = pkg;
const { combine, timestamp, printf, colorize, errors, json } = format;

// Define custom log format with built-in colorization
const customFormat = printf(({ level, message, timestamp, stack, filename }) => {
  // Use ANSI escape codes directly for yellow color
  const yellowFilename = `\x1b[33m[${filename || 'unknown'}]\x1b[0m`;
  return `${timestamp} ${yellowFilename} [${level}]: ${stack || message}`;
});

// Create a logger instance
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    format((info) => {
      // Get caller file info
      const getCallerFile = () => {
        const error = new Error();
        const stack = error.stack.split('\n');
        // Get the file path from the stack
        // We use index 3 because: 0 is Error, 1 is getCallerFile, 2 is the logger call, 3 is the actual caller
        const callerLine = stack[3];
        if (callerLine) {
          const match = callerLine.match(/\((.+?):\d+:\d+\)/) || callerLine.match(/at (.+?):\d+:\d+/);
          if (match) {
            const fullPath = match[1];
            const pathParts = fullPath.split('/');
            const reversedPath = [];
            
            // Find tirumala_backend index
            const tbIndex = pathParts.findIndex(part => part === 'tirumala_backend');
            if (tbIndex !== -1) {
              // Get path from file up to tirumala_backend
              for (let i = pathParts.length - 1; i >= tbIndex; i--) {
                reversedPath.push(pathParts[i]);
              }
              return reversedPath.join('/');
            }
          }
        }
        return 'unknown';
      };

      // Use error stack for errors, otherwise use caller file
      if (info.stack) {
        const stackLines = info.stack.split('\n');
        const fileLine = stackLines.find(line => line.includes('at '));
        if (fileLine) {
          const match = fileLine.match(/\((.+?):\d+:\d+\)/) || fileLine.match(/at (.+?):\d+:\d+/);
          if (match) {
            const fullPath = match[1];
            const pathParts = fullPath.split('/');
            const reversedPath = [];
            
            const tbIndex = pathParts.findIndex(part => part === 'tirumala_backend');
            if (tbIndex !== -1) {
              for (let i = pathParts.length - 1; i >= tbIndex; i--) {
                reversedPath.push(pathParts[i]);
              }
              info.filename = reversedPath.join('/');
            }
          }
        }
      } else {
        info.filename = getCallerFile();
      }
      return info;
    })(),
    customFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        customFormat
      ),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        json()
      ),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(
        json()
      ),
    }),
  ],
});

// Enable debug logs in development environment
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: combine(
        colorize(),
        customFormat
      ),
    })
  );
}

export default logger;
