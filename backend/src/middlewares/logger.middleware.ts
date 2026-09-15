import type { Request, Response, NextFunction } from "express";
import chalk from "chalk";

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  let logged = false;

  /**
   * Bound to both "finish" and "close" so every request gets logged
   * exactly once — "finish" covers normal completions, "close" covers
   * connections aborted before a response was ever sent (client
   * navigated away, request was cancelled, dev server restarted
   * mid-request), which "finish" alone would silently miss.
   */
  const logRequest = () => {
    if (logged) return;
    logged = true;

    const duration = Date.now() - start;

    const method = req.method;
    const ip = req.ip ?? "unknown";
    const route = req.originalUrl;

    if (!res.writableEnded) {
      console.log(
        `${getMethodColor(method)(method)} ${chalk.cyan(route)} ` +
        `${chalk.gray(`IP: ${ip}`)} ` +
        `${chalk.red("ABORTED")} ` +
        `${chalk.yellow(`${duration}ms`)}`
      );
      return;
    }

    const status = res.statusCode;

    console.log(
      `${getMethodColor(method)(method)} ${chalk.cyan(route)} ` +
      `${chalk.gray(`IP: ${ip}`)} ` +
      `${getStatusColor(status)(status)} ` +
      `${chalk.yellow(`${duration}ms`)}`
    );
  };

  res.on("finish", logRequest);
  res.on("close", logRequest);

  next();
};

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return chalk.green;
    case "POST":
      return chalk.blue;
    case "PUT":
      return chalk.yellow;
    case "PATCH":
      return chalk.magenta;
    case "DELETE":
      return chalk.red;
    default:
      return chalk.white;
  }
};

const getStatusColor = (status: number) => {
  if (status >= 500) return chalk.red;
  if (status >= 400) return chalk.yellow;
  if (status >= 300) return chalk.cyan;

  return chalk.green;
};