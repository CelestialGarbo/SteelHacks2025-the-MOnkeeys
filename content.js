let transcriptBuffer = ""; // stores the full final transcript

// === Caption Overlay ===
let overlay = document.createElement("div");
overlay.id = "caption-overlay";
overlay.innerText = "Waiting for captions...";
document.body.appendChild(overlay);

// === Dragging Logic (Overlay) ===
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

// === Update Overlay & Scroll ===
function updateOverlay(interimText) {
  overlay.innerText = transcriptBuffer + interimText;
  setTimeout(() => {
    overlay.scrollTop = overlay.scrollHeight;
  }, 0);
}

// === Web Speech API ===
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  let interimTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let result = event.results[i];
    if (result.isFinal) {
      transcriptBuffer += result[0].transcript + "\n";
    } else {
      interimTranscript += result[0].transcript + " ";
    }
  }
  updateOverlay(interimTranscript);
};

recognition.onerror = (err) => {
  overlay.innerText = "Error: " + err.error;
};

// === Buttons Container ===
let buttons = document.createElement("div");
buttons.style.position = "fixed";
buttons.style.bottom = "20px";
buttons.style.left = "20px";
buttons.style.zIndex = "1000000";
buttons.style.backgroundColor = "rgba(0,0,0,0.7)";
buttons.style.padding = "8px 12px";
buttons.style.borderRadius = "8px";
buttons.style.display = "flex";
buttons.style.gap = "10px";
buttons.style.cursor = "move"; // show it's draggable
document.body.appendChild(buttons);

// === Dragging Logic (Buttons) ===
let isDraggingButtons = false, btnOffsetX = 0, btnOffsetY = 0;
buttons.addEventListener("mousedown", (e) => {
  isDraggingButtons = true;
  const rect = buttons.getBoundingClientRect();
  btnOffsetX = e.clientX - rect.left;
  btnOffsetY = e.clientY - rect.top;
  e.preventDefault();
});
document.addEventListener("mousemove", (e) => {
  if (isDraggingButtons) {
    buttons.style.left = `${e.clientX - btnOffsetX}px`;
    buttons.style.top = `${e.clientY - btnOffsetY}px`;
    buttons.style.bottom = "auto"; // unset bottom so it can move freely
  }
});
document.addEventListener("mouseup", () => isDraggingButtons = false);

// === Helper: Button Factory ===
function makeButton(label, color, onClick) {
  let btn = document.createElement("button");
  btn.innerText = label;
  btn.style.padding = "6px 12px";
  btn.style.backgroundColor = color;
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.cursor = "pointer";
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent drag when clicking
    onClick();
  });
  return btn;
}

// === Buttons ===
let startBtn = makeButton("Start", "#4CAF50", () => recognition.start());
let stopBtn = makeButton("Stop", "#f44336", () => recognition.stop());
let saveBtn = makeButton("Save Transcript", "#2196F3", () => {
  const blob = new Blob([transcriptBuffer], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transcript_${new Date().toISOString()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

// Add buttons to container
buttons.appendChild(startBtn);
buttons.appendChild(stopBtn);
buttons.appendChild(saveBtn);
