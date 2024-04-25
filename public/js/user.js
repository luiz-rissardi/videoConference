

export class User{

    userName;
    id;
    peerConnection;
    dataChannel;
    playerVideo;

    constructor(id,userName) {
        this.id = id;
        this.userName = userName;
    }

    selfDestroy(){
        if(this.playerVideo){
            this.playerVideo.remove()
        }

        if(this.peerConnection){
            this.peerConnection.close();
            this.peerConnection.onicecandidate = null
            this.peerConnection.ontrack = null
            this.peerConnection = null
        }
    }

    sendMessage(message){
        this.dataChannel.send(message);
    }
}