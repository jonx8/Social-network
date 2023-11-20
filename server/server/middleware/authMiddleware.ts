import express from "express";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../config";

export default function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        // @ts-ignore
        req["user"] = user;
        next();
    });
}