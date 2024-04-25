
import { myStream } from "./index.js";


export function setupDataChannel(dataChannel) {
    dataChannel.onmessage = addMessage
}


function addMessage({ data }) {
    console.log(data);
}

export function addVideoPlayer(stream, userName) {
    const template = new DOMParser().parseFromString(`
    <div class="player">
            <video autoplay autocapitalize></video>
            <p></p>
        </div>`, "text/html");
    template.getElementsByTagName("video")[0].srcObject = stream;
    template.getElementsByTagName("p")[0].innerText = userName;
    const divPlayer = template.body.childNodes[0];
    document.getElementById("players").appendChild(divPlayer);
    return divPlayer;
}

export function showPlayer(userName) {
    document.getElementById("enterRoom").classList.add("hiden")
    document.getElementById("enterRoom").classList.remove("d-flex")
    document.getElementById("players").classList.add("show")

    document.getElementById("myPlayerVideo").srcObject = myStream;
    document.getElementById("myPlayerName").innerText = userName;
}


export function handlerWebCam() {
    const mutedEl = document.getElementById("mutedVideo");
    if (mutedEl.classList.contains("hiden")) {
        document.getElementById("WebCamPreview").classList.add("hiden")
        document.getElementById("WebCamPreview").classList.remove("show")
        document.getElementById("camDisable").classList.add("show")
        document.getElementById("camDisable").classList.remove("hiden")
        myStream.getVideoTracks()[0].enabled = false
        mutedEl.classList.add("show");
        mutedEl.classList.remove("hiden");
    } else {
        document.getElementById("WebCamPreview").classList.add("show")
        document.getElementById("WebCamPreview").classList.remove("hiden")
        document.getElementById("camDisable").classList.add("hiden")
        document.getElementById("camDisable").classList.remove("show")
        myStream.getVideoTracks()[0].enabled = true
        mutedEl.classList.remove("show");
        mutedEl.classList.add("hiden");
    }
}

export function handlerAudioMic() {
    const mutedEl = document.getElementById("mutedAudio");
    if (mutedEl.classList.contains("hiden")) {
        myStream.getAudioTracks()[0].enabled = false
        mutedEl.classList.add("show");
        mutedEl.classList.remove("hiden");
    } else {
        myStream.getAudioTracks()[0].enabled = true
        mutedEl.classList.remove("show");
        mutedEl.classList.add("hiden");
    }
}