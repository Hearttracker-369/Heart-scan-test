let accData = [];
let micData = [];
let scanDuration = 30; // seconds
let scanTimer;
async function startScan() {
  accData = [];
  micData = [];

  console.log("Scan started");

  // ---- ACCELEROMETER ----
  function onMotion(event) {
    const x = event.accelerationIncludingGravity.x || 0;
    const y = event.accelerationIncludingGravity.y || 0;
    const z = event.accelerationIncludingGravity.z || 0;

    const magnitude = Math.sqrt(x*x + y*y + z*z);
    accData.push(magnitude);
  }

  window.addEventListener("devicemotion", onMotion);

  // ---- MICROPHONE ----
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  source.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function captureMic() {
    analyser.getByteFrequencyData(dataArray);
    let avg = dataArray.reduce((a,b) => a+b, 0) / dataArray.length;
    micData.push(avg);
  }

  scanTimer = setInterval(captureMic, 200);

  // ---- STOP AFTER 30 SECONDS ----
  setTimeout(() => {
    window.removeEventListener("devicemotion", onMotion);
    clearInterval(scanTimer);
    stream.getTracks().forEach(track => track.stop());

    analyzeScan();
  }, scanDuration * 1000);
}
function analyzeScan() {
  const accMax = Math.max(...accData);
  const micMax = Math.max(...micData);

  console.log("ACC max:", accMax);
  console.log("MIC max:", micMax);

  if (accMax > 25 || micMax > 80) {
    console.log("❌ Invalid Scan: Too much noise or movement");
  } else {
    console.log("✅ Valid Scan: Data usable");
  }
}