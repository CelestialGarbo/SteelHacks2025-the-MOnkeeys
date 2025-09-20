// Load stored key when options page opens
document.addEventListener("DOMContentLoaded", async () => {
  const { groqKey } = await chrome.storage.local.get("groqKey");
  if (groqKey) {
    document.getElementById("apiKey").value = groqKey;
  }
});

// Save key
document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();

  if (!apiKey) {
    document.getElementById("status").innerText = "Please enter a key.";
    return;
  }

  await chrome.storage.local.set({ groqKey: apiKey });
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
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: "Say 'Hello, your key works!'" }],
        max_tokens: 20
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";

    document.getElementById("status").innerText = "Key works! Response: " + reply;
  } catch (err) {
    document.getElementById("status").innerText = "Error testing key: " + err.message;
  }
});
