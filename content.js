let transcriptBuffer = ""; // stores the full final transcript

// Create overlay (fixed version)
let overlay = document.createElement("div");
overlay.id = "caption-overlay";
overlay.innerText = "Waiting for captions...";

document.body.appendChild(overlay);

// Dragging logic
let isDragging = false, offsetX = 0, offsetY = 0;
overlay.addEventListener("mousedown", (e) => {
  isDragging = true;
  const rect = overlay.getBoundingClientRect();
  offsetX = e.clientX - rect.left - rect.width / 2;
  offsetY = e.clientY - rect.top;
  e.preventDefault();
});
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    overlay.style.left = `${e.clientX - offsetX}px`;
    overlay.style.top = `${e.clientY - offsetY}px`;
  }
});
document.addEventListener("mouseup", () => isDragging = false);

// Function to update overlay and scroll
function updateOverlay(interimText) {
  overlay.innerText = transcriptBuffer + interimText;
  // Always scroll to bottom
  overlay.scrollTop = overlay.scrollHeight;
}

// Web Speech API
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  let interimTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let result = event.results[i];
    if (result.isFinal) {
      // Append final results to buffer with a line break
      transcriptBuffer += result[0].transcript + "\n";
    } else {
      // Collect interim text
      interimTranscript += result[0].transcript + " ";
    }
  }
  updateOverlay(interimTranscript);
};

recognition.onerror = (err) => {
  overlay.innerText = "Error: " + err.error;
};


let buttons = document.createElement("div");
buttons.style.position = "fixed";
buttons.style.bottom = "20px";
buttons.style.left = "20px";
buttons.style.zindex = "1000000";
buttons.style.backgroundColor = "rgba(0,0,0,0.7)";
buttons.style.padding = "10px";

document.body.appendChild(buttons);


let startBtn = document.createElement("button");
startBtn.innerText = "Start";
//startBtn.style.position = "fixed";
startBtn.style.bottom = "20px";
startBtn.style.left = "100px";
startBtn.style.zIndex = "1000000";
startBtn.style.margin = "8px 12px";
startBtn.style.backgroundColor = "#4CAF50";
startBtn.style.color = "#fff";
startBtn.style.border = "none";
startBtn.style.borderRadius = "5px";
startBtn.style.cursor = "pointer";

startBtn.addEventListener("click", () => {
  recognition.start();
});

buttons.appendChild(startBtn);


let stopBtn = document.createElement("button");
stopBtn.innerText = "Stop";
//stopBtn.style.position = "fixed";
stopBtn.style.bottom = "20px";
stopBtn.style.left = "180px";
stopBtn.style.zIndex = "1000000";
stopBtn.style.margin = "8px 12px";
stopBtn.style.backgroundColor = "#4CAF50";
stopBtn.style.color = "#fff";
stopBtn.style.border = "none";
stopBtn.style.borderRadius = "5px";
stopBtn.style.cursor = "pointer";

stopBtn.addEventListener("click", () => {
  recognition.stop();
});

buttons.appendChild(stopBtn);

// Save transcript button
let saveBtn = document.createElement("button");
saveBtn.innerText = "Save Transcript";
// saveBtn.style.position = "fixed";
saveBtn.style.bottom = "20px";
saveBtn.style.left = "20px";
saveBtn.style.zIndex = "1000000";
saveBtn.style.margin = "8px 12px";
saveBtn.style.backgroundColor = "#4CAF50";
saveBtn.style.color = "#fff";
saveBtn.style.border = "none";
saveBtn.style.borderRadius = "5px";
saveBtn.style.cursor = "pointer";

saveBtn.addEventListener("click", () => {
  const blob = new Blob([transcriptBuffer], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transcript_${new Date().toISOString()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

buttons.appendChild(saveBtn);