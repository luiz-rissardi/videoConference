import { createAnswer, createOffer, createPeer } from "./peers.js";
import { User } from "./user.js";
import { handlerAudioMic, handlerWebCam, showPlayer } from "./page.js"

const users = new Map();
let socket;
const audioBtn = document.getElementById("audiobtn");
const videoBtn = document.getElementById("videobtn");
const userNameInput = document.getElementById("name");
const roomInput = document.getElementById("room");
document.getElementById("players").classList.remove("d-flex")
document.getElementById("players").classList.add("hiden")

const myStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
});
const events_RTC = {
    offer: "offer",
    answer: "answer",
    candidate: "candidate",
    call: "call",
    disconnect: "disconnect",
    disconnectUser: "disconnect-user"
}

document.getElementById("enterRoomBtn").addEventListener("click", enterInRoom)

document.getElementById("leave").addEventListener("click", leaveRoom)

audioBtn.addEventListener("click", handlerAudioMic)

videoBtn.addEventListener("click", handlerWebCam)

document.getElementById("WebCamPreview").srcObject = myStream

function enterInRoom() {
    const userName = userNameInput.value
    const room = roomInput.value;
    if (userName && room) {
        showPlayer(userNameInput.value);
        initServerSocket(userName, room)
    } else {
        window.alert("informe o seu nome e a sala")
    }
}

function initServerSocket(userName, room) {
    socket = io.connect("http://localhost:3000", {
        path: '/socket.io',
        transports: ['websocket'],
        query: {
            room,
            userName
        }
    });

    socket.on(events_RTC.disconnectUser, ({ id }) => {
        const user = users.get(id);
        if (user) {
            user.selfDestroy();
            users.delete(user.id)
        }
    })

    socket.on(events_RTC.call, ({ id, userName }) => {
        const user = new User(id, userName);
        user.peerConnection = createPeer(user);
        users.set(user.id, user);
        createOffer(user, userNameInput.value);
    })

    socket.on("offer", ({ id, offer, userName }) => {
        console.log("offer");
        const user = users.get(id);
        if (user) {
            createAnswer(user, offer);
        } else {
            const user = new User(id, userName);
            user.peerConnection = createPeer(user);
            users.set(user.id, user);
            createAnswer(user, offer);
        }
    })

    socket.on(events_RTC.answer, ({ id, answer }) => {
        console.log("answer");
        const user = users.get(id);
        if (user) {
            user.peerConnection.setRemoteDescription(answer)
        }
    })

    socket.on(events_RTC.candidate, ({ id, candidate }) => {
        console.log("candidate");
        const user = users.get(id);
        if (user) {
            user.peerConnection.addIceCandidate(candidate);
        } else {
            const user = new User(id, "user" + Math.floor(Math.random() * 10000 + 1));
            user.peerConnection = createPeer(user)
            user.peerConnection.addIceCandidate(data.candidate)
            users.set(data.id, user)
        }
    })

}

function leaveRoom() {
    socket.close();
    for (const user of users.values()) {
        user.selfDestroy();
    }
    users.clear();
    console.log(users);
    document.getElementById("enterRoom").classList.add("d-flex")
    document.getElementById("enterRoom").classList.remove("hiden")
    document.getElementById("players").classList.add("hiden")
    document.getElementById("players").classList.remove("show")

}


export {
    socket,
    events_RTC,
    myStream
}