import { Server } from '@hapi/hapi';
import * as io from "socket.io"

const server = new Server({
    port:4000,
    host:"localhost"
});

const events_RTC = {
    offer:"offer",
    answer:"answer",
    candidate:"candidate",
    call:"call",
    disconect:"disconect"
}

const sockete = new io.Server(server.listener)

sockete.on('connection', function (socket) {
   
});

server.start();
console.log("server is runnig");