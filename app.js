// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
// --- OCR Integration Below ---

cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    const context = cameraSensor.getContext("2d");
    context.drawImage(cameraView, 0, 0);

    // CROP: Change these values to match the region you want to scan
    const x = 50, y = 100, width = 200, height = 50;
    const cropped = context.getImageData(x, y, width, height);

    // Create a temporary canvas for the cropped region
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCanvas.getContext("2d").putImageData(cropped, 0, 0);

    // OCR with Tesseract.js
    Tesseract.recognize(
        tempCanvas,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log("OCR Result:", text);
        alert("OCR result: " + text);
        // You can now search for text in the variable 'text'
    });

    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};

window.addEventListener("load", cameraStart, false);

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
