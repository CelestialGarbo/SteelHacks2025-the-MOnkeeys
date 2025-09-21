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

      // Get API key from storage
      const { groqKey } = await chrome.storage.local.get("groqKey");

      if (!groqKey) {
        sendResponse({ error: "No Groq API key set in extension options." });
        return true;
      }

      // Call Groq API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b", // one of Groq's fast LLMs
          messages: [
            { role: "system", content: "You are a helpful assistant that summarizes medical conversations clearly and simply. Note that the transcription is speech recognition, so it may have mistakes. Do your best to infer the original meaning in a medical context." },
            { role: "user", content: `Summarize this meeting:\n\n${transcript}` }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content || "No summary generated.";

      sendResponse({ summary });
    } catch (err) {
      sendResponse({ error: err.toString() });
    }
    return true; // keep channel open for async
  }
});


function startCaptions(streamId) {
  console.log("Captions starting with stream:", streamId);
}