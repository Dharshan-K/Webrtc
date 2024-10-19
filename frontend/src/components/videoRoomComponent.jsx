import { useEffect, useState } from "react";
import './../App.css';
import { Socket, io } from "socket.io-client";
import axios from "axios";

export default function VideoRoom(){
	let localStream;
	let remoteStream;
	const [currentRoom, setCurrentRoom] = useState("")
	const [answer, setAnswer] = useState();
	const [offer, setOffer] = useState()
	let connection = new RTCPeerConnection(configuration);

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
	})

	useEffect(()=>{
		init()
		getDevices()
	})

	let init = async () => {
  	localStream = await navigator.mediaDevices.getUserMedia({
  	  video: true,
    	audio: true,
  	});		

		localStream.getTracks().forEach(track => {
			connection.addTrack(track, localStream)
		})
		let offer = await connection.createOffer();

		// console.log(offer.sdp);

		connection.setLocalDescription(offer);
		setOffer(offer)

		connection.ontrack((event)=>{
			console.log(event.streams)
			console.log("event received")
			document.getElementById("user2").srcObject = event.streams[0];
		})
				
  	document.getElementById("user1").srcObject = localStream;
  	document.getElementById("user2").srcObject = remoteStream;
	};

	async function getDevices() {
  	const devices = await navigator.mediaDevices.enumerateDevices();
  	// return devices.filter((device) => device.kind === "videoinput");
	}

	async function createConnection(){
		return RTCPeerConnection;
	}

	async function getOffer(){

	}

	async function getAnswer(){
		
	}

	return(
		<div id="videos">
			<video className="video-player" id="user1" autoPlay playsInline></video>
			<video className="video-player" id="user2" autoPlay playsInline></video>
		</div>
	) 
}

