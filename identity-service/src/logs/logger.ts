import winston from "winston";
import chalk from "chalk";

const customFormat = winston.format.printf(({ level, message, service }) => {
  const serviceLabel = chalk.cyan(`${service}:`);
  const date = new Date();
  const timeLabel = chalk.yellow(
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  );
  const levelLabel = level === 'info' ? chalk.green(level) :
                     level === 'error' ? chalk.red(level) :
                     chalk.magenta(level);

  return `${serviceLabel} ${timeLabel} : ${levelLabel}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.metadata(),
    winston.format((info) => {
      info.service = "identity-service";
      return info;
    })(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
