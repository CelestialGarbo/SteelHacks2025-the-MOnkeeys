// Load stored key when options page opens
document.addEventListener("DOMContentLoaded", async () => {
  const { geminiKey } = await chrome.storage.local.get("geminiKey");
  if (geminiKey) {
    document.getElementById("apiKey").value = geminiKey;
  }
});

// Save key
document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();

  if (!apiKey) {
    document.getElementById("status").innerText = "Please enter a key.";
    return;
  }

  await chrome.storage.local.set({ geminiKey: apiKey });
  document.getElementById("status").innerText = "Key saved!";
});

// Test key
document.getElementById("test").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();

  if (!apiKey) {
    document.getElementById("status").innerText = "Please enter a key.";
    return;
  }

  document.getElementById("status").innerText = "Testing key...";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Say 'The key works'" }
          ],
          temperature: 0.3,
          max_output_tokens: 50
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Gemini returns an array of candidates
    const reply = data.candidates?.[0]?.content || "No response.";

    document.getElementById("status").innerText = "Key works! Response: " + reply;
  } catch (err) {
    document.getElementById("status").innerText = "Error testing key: " + err.message;
  }
});
