const API_KEY = ""; // ⚠️ For testing only, don’t expose on production

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{
                  text: `
You are Mohamed Amine's female assistant in a client chat. 
- Answer the client's question directly, warmly and professionally. 
- Only mention Mohamed Amine's skills and experience briefly if the client asks about him:
   full-stack dev, integrating external functionality and AI, secure and architect applications. 
- Respond in the same language as the client.
- After the introduction, end your reply with a question that engages the recruiter, like asking about their needs or priorities.
- Keep every response ≤200 characters.
- Avoid starting with "Hi" or greetings; focus on value.

          
          The client says: "${messageText}"
                  `}]
              }
            ]
          }),
          
      }
    );

    const data = await response.json();
    document.getElementById(tempMessageId).remove();

    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Sorry but I am busy right now, but I’ll get back to you shortly.";

    addMessage(botResponse, 'bot');
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    document.getElementById(tempMessageId).remove();
    addMessage("Many requests right now, please try later.", 'bot');
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
