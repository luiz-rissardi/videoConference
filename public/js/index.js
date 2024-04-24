

const socket = io.connect("http://localhost:4000", {
    path: '/socket.io',
    transports: ['websocket']
});