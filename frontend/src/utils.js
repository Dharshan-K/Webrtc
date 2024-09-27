async function getOffer(){

}

async function getDevices(){
	try{
        const devices = await navigator.mediaDevices.getUserMedia({'audio': false, 'video': true})

        const videoElement = document.getElementById('videoStream');
        // videoElement.style.backgroundColor = 'black';
        if(videoElement.srcObject){
            videoElement.srcObject = devices;
        }
    }catch{
        console.log("devices not found")
    }
}