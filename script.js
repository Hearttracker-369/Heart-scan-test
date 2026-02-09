document.querySelector("button").addEventListener("click", async () => {

  // MIC PART
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function updateMic() {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    let average = sum / dataArray.length;
    document.getElementById("micLevel").innerText = average.toFixed(2);
    requestAnimationFrame(updateMic);
  }

  updateMic();

  // ACCELEROMETER PART
  window.addEventListener("devicemotion", function(event) {
    if (event.acceleration) {
      document.getElementById("accX").innerText =
        event.acceleration.x?.toFixed(2);
      document.getElementById("accY").innerText =
        event.acceleration.y?.toFixed(2);
      document.getElementById("accZ").innerText =
        event.acceleration.z?.toFixed(2);
    }
  });

});
