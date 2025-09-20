// Create caption overlay
let overlay = document.createElement("div");
overlay.id = "caption-overlay";
overlay.innerText = "Waiting for captions...";

// Styling

overlay.style.position = "fixed";
overlay.style.maxHeight = "40px";
overlay.style.cursor = "move";
overlay.style.resize = "both";
overlay.style.userSelect = "none";

document.body.appendChild(overlay);

// Drag functionality
let isDragging = false;
let offsetX = 0, offsetY = 0;

overlay.addEventListener("mousedown", (e) => {
  isDragging = true;
  // Get current numeric left/top
  const rect = overlay.getBoundingClientRect();
  offsetX = e.clientX - rect.left - rect.width / 2;
  offsetY = e.clientY - rect.top;
  e.preventDefault(); // prevent text selection
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;
    overlay.style.left = `${newLeft}px`;
    overlay.style.top = `${newTop}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Update captions function
window.updateCaptions = function(text) {
  overlay.innerText = text;
  overlay.scrollTop = overlay.scrollHeight;
};

// Web Speech API
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  let transcript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript + " ";
  }
  window.updateCaptions(transcript);
};

recognition.onerror = (err) => {
  window.updateCaptions("Error: " + err.error);
};

recognition.start();

<<<<<<< Updated upstream
// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STT_CAPTION") {
    window.updateCaptions(message.text);
  }
=======
let buttons = document.createElement("div");
buttons.style.position = "fixed";
buttons.style.bottom = "20px";
buttons.style.left = "20px";
buttons.style.zindex = "1000000";
buttons.style.backgroundColor = "rgba(0,0,0,0.7)";
buttons.style.padding = "5px";

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
>>>>>>> Stashed changes
});
