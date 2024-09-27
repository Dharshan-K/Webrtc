import { Socket } from "socket.io"


export type User = {
    id : String
    socket: Socket        
}

export type Offer = {
    type: "offer" | "answer"
    sdp: String
}

export type IceCandidate = {
    
}

