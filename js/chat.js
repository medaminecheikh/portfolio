// Warm up Netlify function silently
document.addEventListener('DOMContentLoaded', () => {
  fetch("/.netlify/functions/gemini-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello" })
  }).catch(() => {}); // ignore errors silently
});





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
    const response = await fetch("/.netlify/functions/gemini-proxy", {
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
- Present Mohamed Amine’s profile only when the client asks about him, and adapt the details to match the client’s needs (not copy-paste). 
- Show his general capacity: full-stack development, secure architecture, AI integration, and adaptability to new demands. 
- Respond in the same language as the client. 
- Every reply must end with a thoughtful, engaging follow-up question that invites the client to share more about their goals or challenges. 
- Keep every response ≤200 characters, concise but meaningful. 
- Avoid greetings like “Hi”; start with value.
The client says: "${messageText}"
              `
            }]
          }
        ]
      })
    });

    const data = await response.json();
    document.getElementById(tempMessageId).remove();

    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Sorry but I am busy right now, but I’ll get back to you shortly.";

    addMessage(botResponse, 'bot');
  } catch (error) {
    
    document.getElementById(tempMessageId).remove();
    addMessage("Many requests right now, please try again.", 'bot');
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
