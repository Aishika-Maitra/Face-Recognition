const video = document.getElementById('video')
// var faceapi = "D:/webdev/face recognition/face-api.min.js"
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),  //to detect in real time, smaller and faster
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), //detects the parts of the face
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //detects where the face is
    faceapi.nets.faceExpressionNet.loadFromUri('/models')// read expressions
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        {   video: {} },
            stream => video.srcObject = stream, 
            err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults (detections, displaySize)
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})