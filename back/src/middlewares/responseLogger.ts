import morgan from "morgan";
import logger from "../config/logger";
import { Request, Response } from "express";

const responseLogger = morgan((tokens, req: Request, res: Response) => {
    const logMessage = `[${tokens.method(req, res)}] ${tokens.url(
        req,
        res,
    )} | ${tokens.status(req, res)} | ${tokens.res(
        req,
        res,
        "content-length",
    )} - ${tokens["response-time"](req, res)} ms | [Response] ${JSON.stringify(
        req.body,
    )}`;

    if (res.statusCode < 400) {
        logger.info(logMessage);
    }
    return null;
});

export default responseLogger;
