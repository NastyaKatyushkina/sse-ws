const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const cors = require('@koa/cors');
const WS = require('ws');
const User = require('./user');

const app = new Koa();
const router = new Router();

app.use(cors());

app.use(koaBody({
    urlencoded: true,
    multipart: true,
    text: true,
    json: true,
}));

router.get('/index', async (ctx) => {
    ctx.response.body = 'hello';
});

const port = process.env.PORT || 8080;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });

wsServer.on('connection', (ws, req) => {
    ws.on('message', async (msg) => {
        
        const message = JSON.parse(msg);

        if(message.type === 'addUser') {
            const user = User.getByName(message.user);
            if(!user) {
            const newUser = new User(message.user);
            newUser.save();
                                
                const users = User.getAll();

                [...wsServer.clients]
                    .filter(o => o.readyState === WS.OPEN)
                    .forEach(o => o.send(JSON.stringify({ type: 'users', data: users })));

                return;
            }
            ws.send(JSON.stringify({ type: 'error'}));
            return;

        } else if(message.type === 'addMes') {
            [...wsServer.clients]
                .filter(o => o.readyState === WS.OPEN)
                .forEach(o => o.send(JSON.stringify({ type: 'addMes', data: message })));

        } else if(message.type === 'deleteUser') {

            User.deleteUser(message.user);
            const users = User.getAll();
            [...wsServer.clients]
                .filter(o => o.readyState === WS.OPEN)
                .forEach(o => o.send(JSON.stringify({ type: 'users', data: users })));

        }

    });
});

app.use(router.routes()).use(router.allowedMethods());
server.listen(port);





