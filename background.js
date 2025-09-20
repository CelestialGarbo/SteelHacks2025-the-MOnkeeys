chrome.action.onClicked.addListener((tab) => {
  chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
    if (stream) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: startCaptions,
        args: [stream.id] // we'll use this in content.js
      });
    }
  });
});

function startCaptions(streamId) {
  console.log("Captions starting with stream:", streamId);
}
