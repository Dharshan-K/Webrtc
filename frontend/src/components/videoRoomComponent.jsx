import { useEffect } from "react";
import './../App.css';
import { io } from "socket.io-client";

export default function VideoRoom(){
	let localStream;
	let remoteStream;
	let configuration = {
		iceServers: [
			{ urls: 'stun:stun.l.google.com:19302' },
			{ urls: 'stun:stun1.l.google.com:19302' },
			{ urls: 'stun:stun2.l.google.com:19302' },
			{ urls: 'stun:stun3.l.google.com:19302' },
			{ urls: 'stun:stun4.l.google.com:19302' }
		]	
	}

	useEffect(()=>{
		init()
		getDevices()
	})

	let init = async () => {
  	localStream = await navigator.mediaDevices.getUserMedia({
  	  video: true,
    	audio: true,
  	});

		let connection = new RTCPeerConnection(configuration);

		localStream.getTracks().forEach(track => {
			connection.addTrack(track, localStream)
		})

		let offer = await connection.createOffer();

		console.log(offer.sdp);

		connection.setLocalDescription(offer);
		console.log(connection.connectionState)

		connection.onicecandidate = (event) => {
			//send the event to the remote peer
			//send the offer to the remote peer
			if(event.candidate){
				console.log("event", event.candidate);
			}
			
		}

				
  	document.getElementById("user1").srcObject = localStream;
  	document.getElementById("user2").srcObject = localStream;
	};

	async function getDevices() {
  	const devices = await navigator.mediaDevices.enumerateDevices();
  	console.log(
    	"devices",
    	devices
  	);
  	// return devices.filter((device) => device.kind === "videoinput");
	}

	async function createConnection(){
		return RTCPeerConnection;
	}

	async function getOffer(){}

	async function getAnswer(){}

	return(
		<div id="videos">
			<video className="video-player" id="user1" autoPlay playsInline></video>
			<video className="video-player" id="user2" autoPlay playsInline></video>
		</div>
	)
}