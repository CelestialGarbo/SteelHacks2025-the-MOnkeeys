//chrome.action.onClicked.addListener((tab) => {
  //chrome.tabCapture.capture({ audio: true, video: false }, (stream) => \
 // {
   // const output = new AudioContext();
    //const source = output.createMediaStreamSource(stream);
    //source.connect(output.destination);
    //if (stream) {
     // chrome.scripting.executeScript({
       // target: { tabId: tab.id },
        //func: startCaptions,
        //args: [stream.id] // we'll use this in content.js
      //});
    //}
  //});
//});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "SUMMARIZE_TRANSCRIPT") {
    try {
      const { transcript } = message;

      // Retrieve Gemini key from storage
      const { geminiKey } = await chrome.storage.local.get("geminiKey");

      if (!geminiKey) {
        sendResponse({ error: "No Gemini API key set in extension options." });
        return true;
      }

      // Optional: truncate transcript if very long
      const snippet = transcript.length > 3000 ? transcript.slice(-3000) : transcript;

      // Call Gemini API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${geminiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that summarizes medical conversations clearly and simply. Note that the transcription may have mistakes. Do your best to infer the original meaning in a medical context."
              },
              { role: "user", content: `Summarize this meeting:\n\n${snippet}` }
            ],
            temperature: 0.3,
            max_output_tokens: 500
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Gemini returns an array of candidates
      const summary = data.candidates?.[0]?.content || "No summary generated.";

      sendResponse({ summary });
    } catch (err) {
      sendResponse({ error: err.message });
    }

    return true; // keep channel open for async
  }
});


function startCaptions(streamId) {
  console.log("Captions starting with stream:", streamId);
}