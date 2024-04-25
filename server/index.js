import { Server } from '@hapi/hapi';
import * as io from "socket.io"

const server = new Server({
    port: 3000,
    host: "localhost"
});

const events_RTC = {
    offer: "offer",
    answer: "answer",
    candidate: "candidate",
    call: "call",
    disconnect: "disconnect",
    disconnectUser: "disconnect-user",
}

const sockete = new io.Server(server.listener)

sockete.on('connection', function (socket) {
    const room = socket.handshake.query.room;
    const userName = socket.handshake.query.userName;
    if (!room) {
        socket.disconnect();
    } else {
        console.log(`a new socket enter in room ${room}`);

        socket.join(room);
        socket.to(room).emit(events_RTC.call, { id: socket.id, userName });

        socket.on(events_RTC.offer, ({ id, offer, userName }) => {
            console.log(`user ${id} sending offer to ${socket.id}`);

            socket.to(id).emit(events_RTC.offer, {
                id: socket.id,
                userName,
                offer
            })
        })

        socket.on(events_RTC.answer, ({ id, answer }) => {
            console.log(`user ${id} sending answer to ${socket.id}`);

            socket.to(id).emit(events_RTC.answer, {
                id: socket.id,
                answer
            })
        })

        socket.on(events_RTC.candidate, ({ id, candidate }) => {
            console.log(`user ${id} send cantidature to ${socket.id}`);

            socket.to(id).emit(events_RTC.candidate, {
                id: socket.id,
                candidate
            })
        })

        socket.on(events_RTC.disconnect,function(){
            sockete.emit(events_RTC.disconnectUser,{
                id:socket.id
            })
        })
    }
});

server.start();
console.log("server is runnig");