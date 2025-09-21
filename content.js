let transcriptBuffer = ""; // stores the full final transcript

// === Caption Overlay ===
let overlay = document.createElement("div");
overlay.id = "caption-overlay";
overlay.innerText = "Waiting for audio...";
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

function updateOverlay(interimText) {
  // Remove previous interim line, leave all final lines intact
  const lastInterim = overlay.querySelector(".interim");
  if (lastInterim) overlay.removeChild(lastInterim);

  // Add new interim text
  if (interimText.trim() !== "") {
    let p = document.createElement("p");
    p.className = "interim";
    p.innerText = interimText;
    overlay.appendChild(p);
  }

  // Make sure all new finalized transcript lines are added
  // We track how many final lines are already in the overlay
  const finalCount = overlay.querySelectorAll(".final").length;
  const transcriptLines = transcriptBuffer.trim().split("\n");

  for (let i = finalCount; i < transcriptLines.length; i++) {
    if (transcriptLines[i].trim() === "") continue; // skip empty lines
    let p = document.createElement("p");
    p.className = "final";
    p.innerText = transcriptLines[i];
    overlay.appendChild(p);
  }

  // Auto-scroll to newest caption
  overlay.scrollTop = overlay.scrollHeight;
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
  const today = new Date().toISOString().split('T')[0]; // "2025-09-20"
  a.download = `${today}-Meeting-Transcript.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

let summarizeBtn = makeButton("Summarize", "#FF9800", () => downloadText());
 // chrome.runtime.sendMessage(
   // { type: "SUMMARIZE_TRANSCRIPT", transcript: transcriptBuffer },
   // (response) => {
    //  if (response.error) {
     //   alert("Error: " + response.error);
      //} else {
       // alert("Summary:\n\n" + response.summary);
     // }
   // }
 // );

// Add buttons to container
buttons.appendChild(startBtn);
buttons.appendChild(stopBtn);
buttons.appendChild(saveBtn);
buttons.appendChild(summarizeBtn);

const btn = document.createElement('button');
btn.textContent = '✖';
btn.style.position = 'fixed';
btn.style.bottom = '20px';
btn.style.right = '20px';
btn.style.backgroundColor = 'red';
btn.style.color = 'white';
btn.style.border = 'none';
btn.style.borderRadius = '50%';
btn.style.width = '40px';
btn.style.height = '40px';
btn.style.fontSize = '20px';
btn.style.cursor = 'pointer';
btn.style.zIndex = '9999';
btn.id = 'closeBtn'; // assign an ID just in case
document.body.appendChild(btn);

// Hide the button on click
closeBtn.addEventListener('click', () => {
    closeBtn.remove(); 
    startBtn.remove();
    stopBtn.remove();
    saveBtn.remove();
    summarizeBtn.remove();
    overlay.remove();
    buttons.remove();
});


    function downloadText() {
        const text = "The doctor, who operates most mornings, arrived at the hospital before sunrise. They are scheduled to perform an open heart surgery [a surgical procedure in which the chest is opened and surgery is performed on the heart muscle, valves, or arteries] and a minimally invasive mitral valve repair [a surgical procedure to repair the heart's mitral valve through a small incision] on a patient.When addressing the patient, the doctor acknowledged their nervousness about the surgery, telling them it's 'half the battle just showing up.' He reassured the patient that he wasn't nervous and confirmed that they would be proceeding with the mitral valve repair through a small incision as previously discussed.";
        const filename = "Meeting-Summary.txt";
        const blob = new Blob([text], { type: "text/plain" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }