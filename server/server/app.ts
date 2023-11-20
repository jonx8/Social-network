import http from "http"
import {Server} from 'socket.io';
import express, {Application, Router} from 'express';
import {__publicDir, PORT, ROLLBAR_POST_TOKEN} from "./config";
import friendsAPIRouter from "./routes/api/friends";
import usersRouter from "./routes/admin/users";
import friendsRouter from "./routes/admin/friends";
import newsRouter from "./routes/admin/news";
import messagesRouter from "./routes/admin/messages";
import fileUploadRouter from "./routes/api/uploads";
import usersAPIRouter from "./routes/api/users";
import newsAPIRouter from "./routes/api/news";
import messagesAPIRouter from "./routes/api/messages";
import authAPIRouter from "./routes/api/auth";
import cookieParser from "cookie-parser";
import cors from 'cors';
import Rollbar from "rollbar";

export const app: Application = express();

app.use(cors({
    origin: 'http://localhost:4200',
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    allowedHeaders: "Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept"
}));

app.use(cookieParser());
app.use(express.json());


export const router: Router = Router();

router.get('/', (_: express.Request, res: express.Response) => {
    res.redirect(301, '/admin')
})

router.get('*', (_: express.Request, res: express.Response) => {
    res.sendStatus(404);
})


app.use('/public', express.static(__publicDir));
app.use('/admin', usersRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/news', newsRouter);
app.use('/admin/messages', messagesRouter);
app.use('/admin/friends', friendsRouter);
app.use('/api/auth', authAPIRouter);
app.use('/api/users', usersAPIRouter);
app.use('/api/friends', friendsAPIRouter);
app.use('/api/news', newsAPIRouter);
app.use('/api/messages', messagesAPIRouter);
app.use('/api/upload', fileUploadRouter);
app.use(router)

export const rollbar: Rollbar = new Rollbar({
    accessToken: ROLLBAR_POST_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
});


if (process.argv.includes('server')) {

    const httpServer: http.Server = http.createServer(app);
    const io: Server = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        socket.on('message', (msg) => {
            socket.emit("message", msg);
            socket.broadcast.emit("message", msg);
        });
        socket.on('post', (post => {
            socket.emit('post', post);
            socket.broadcast.emit("post", post);

        }))
    });


    httpServer.listen(PORT, async () => {
        console.log(`Server is running on port ${PORT}...`);
        rollbar.log('Server started');

    });

}
