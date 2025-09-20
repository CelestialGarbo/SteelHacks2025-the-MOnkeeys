let overlay = document.createElement("div");
overlay.id = "caption-overlay";
document.body.appendChild(overlay);

// Style applied in overlay.css
overlay.innerText = "Waiting for captions...";

// Use Web Speech API
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  let transcript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript + " ";
  }
  overlay.innerText = transcript;
};

recognition.onerror = (err) => {
  overlay.innerText = "Error: " + err.error;
};

recognition.start();
