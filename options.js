// Load stored key when options page opens
document.addEventListener("DOMContentLoaded", async () => {
  const { groqKey } = await chrome.storage.local.get("groqKey");
  if (groqKey) {
    document.getElementById("apiKey").value = groqKey;
  }
});

// Save key when user clicks button
document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();

  if (!apiKey) {
    document.getElementById("status").innerText = "❌ Please enter a key.";
    return;
  }

  await chrome.storage.local.set({ groqKey: apiKey });
  document.getElementById("status").innerText = "✅ Key saved!";
});
