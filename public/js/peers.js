import { socket, events_RTC, myStream } from "./index.js"
import { addVideoPlayer, setupDataChannel } from "./page.js";

const configurationsPeer = {
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
}

export function createPeer(user) {
    const peerConnection = new RTCPeerConnection(configurationsPeer);

    for (const track of myStream.getTracks()) {
        peerConnection.addTrack(track, myStream);
    }

    peerConnection.ontrack = (ev) => {
        if (user.playerVideo) {
            return
        }
        user.playerVideo = addVideoPlayer(ev.streams[0], user.userName)
    }


    peerConnection.onicecandidate = function ({ candidate }) {
        if (!candidate) {
            return
        }

        socket.emit(events_RTC.candidate, {
            id: user.id,
            candidate
        })
    }

    peerConnection.ondatachannel = function ({ channel }) {
        user.dataChannel = channel
        setupDataChannel(user.dataChannel)
    }

    return peerConnection;
}

export async function createOffer(user, userName) {
    user.dataChannel = user.peerConnection.createDataChannel("chat");
    const offer = await user.peerConnection.createOffer();
    await user.peerConnection.setLocalDescription(offer);

    socket.emit(events_RTC.offer, {
        id: user.id,
        offer: offer,
        userName
    })
}

export async function createAnswer(user, offer) {
    user.dataChannel = user.peerConnection.createDataChannel("chat");
    await user.peerConnection.setRemoteDescription(offer);
    const answer = await user.peerConnection.createAnswer();
    await user.peerConnection.setLocalDescription(answer);

    socket.emit(events_RTC.answer, {
        id: user.id,
        answer: answer
    })

}