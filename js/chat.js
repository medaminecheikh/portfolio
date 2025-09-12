const API_KEY = "AIzaSyD9HIfa54PQS59lDl04opg-ZrrNzVoJeQM"; // ⚠️ For testing only, don’t expose on production

const chatContainer = document.getElementById('chat-container-unique');
const chatInput = chatContainer.querySelector('#chatInput');
const chatMessages = chatContainer.querySelector('#chatMessages');

chatInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const messageText = chatInput.value.trim();
  if (!messageText) return;

  addMessage(messageText, 'user');
  chatInput.value = '';

  const tempMessageId = Date.now();
  addMessage("...", 'bot', tempMessageId);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: messageText }] }]
        }),
      }
    );

    const data = await response.json();
    document.getElementById(tempMessageId).remove();

    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from AI";

    addMessage(botResponse, 'bot');
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    document.getElementById(tempMessageId).remove();
    addMessage("Sorry, I'm having trouble responding.", 'bot');
  }
}

function addMessage(text, sender, id = null) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  if (id) {
    messageDiv.id = id;
  }

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  messageDiv.innerHTML = `${text}<span class="message-timestamp">${timestamp}</span>`;
  chatMessages.appendChild(messageDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}
