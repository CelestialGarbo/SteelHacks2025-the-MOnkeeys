// Create caption overlay
let overlay = document.createElement("div");
overlay.id = "caption-overlay";
overlay.innerText = "Waiting for captions...";

// Styling
overlay.style.position = "fixed";
overlay.style.left = "20px";
overlay.style.top = "20px";
overlay.style.width = "400px";
overlay.style.maxHeight = "200px";
overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
overlay.style.color = "#fff";
overlay.style.fontSize = "16px";
overlay.style.padding = "10px";
overlay.style.overflowY = "auto";
overlay.style.borderRadius = "8px";
overlay.style.zIndex = "999999";
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
  offsetX = e.clientX - rect.left / 2;
  offsetY = e.clientY - rect.top / 2;
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

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STT_CAPTION") {
    window.updateCaptions(message.text);
  }
});
