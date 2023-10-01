import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const responseLogger = (
    req: Request,
    res: Response & { write: any; end: any },
    next: NextFunction,
) => {
    const start = Date.now();

    console.log(
        `[요청] IP${req.ip} ${req.method} ${req.path}?query=${JSON.stringify(
            req.query,
        )}  DATA${JSON.stringify(req.body)}`,
    );
    logger.info(
        `[요청] IP${req.ip} ${req.method} ${req.path}?query=${JSON.stringify(
            req.query,
        )}  DATA${JSON.stringify(req.body)}`,
    );
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks: any[] = [];

    res.write = (...restArgs: any[]) => {
        chunks.push(Buffer.from(restArgs[0]));
        oldWrite.apply(res, restArgs);
    };

    res.end = (...restArgs: any[]) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString("utf8");
        const duration = Date.now() - start;

        if (res.statusCode >= 400) {
            console.log(`[응답] ⚠️ ${body} ${duration}ms`);
            logger.warn(`[응답] ⚠️ ${body} ${duration}ms`);
        } else {
            console.log(`[info][응답] ${body} ${duration}ms`);
            logger.info(`[응답] ${body} ${duration}ms`);
        }

        oldEnd.apply(res, restArgs);
    };

    next();
};

export default responseLogger;
