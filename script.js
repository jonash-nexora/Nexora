const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const newChatButton = document.getElementById("newChatButton");
const clearButton = document.getElementById("clearButton");
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const statusText = document.getElementById("statusText");
const historyList = document.getElementById("historyList");

let chatHistory = [];


/* -------------------------
   SEND MESSAGE
------------------------- */

async function sendMessage() {

  const text = messageInput.value.trim();

  if (!text) return;

  hideWelcome();

  addMessage("user", text);

  messageInput.value = "";
  resizeInput();

  setStatus("NEXORA is thinking...");

  sendButton.disabled = true;

  const typingMessage = addTypingMessage();

  try {

    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    typingMessage.remove();

    if (!response.ok) {
      throw new Error(data.error || "API request failed.");
    }

    addMessage("ai", data.reply);

    chatHistory.push({
      user: text,
      ai: data.reply
    });

    updateHistory(text);

    setStatus("AI is ready");

  } catch (error) {

    typingMessage.remove();

    addMessage(
      "ai",
      "Sorry, I couldn't connect to NEXORA right now."
    );

    console.error(error);

    setStatus("Connection error");

  } finally {

    sendButton.disabled = false;
    messageInput.focus();

  }
}


/* -------------------------
   ADD MESSAGE
------------------------- */

function addMessage(type, text) {

  const message = document.createElement("div");

  message.className = `message ${type}`;

  const avatar = document.createElement("div");

  avatar.className = "message-avatar";

  avatar.textContent = type === "ai" ? "N" : "U";

  const content = document.createElement("div");

  content.className = "message-content";

  const name = document.createElement("div");

  name.className = "message-name";

  name.textContent = type === "ai" ? "NEXORA" : "YOU";

  const textElement = document.createElement("div");

  textElement.textContent = text;

  content.appendChild(name);
  content.appendChild(textElement);

  message.appendChild(avatar);
  message.appendChild(content);

  messages.appendChild(message);

  scrollToBottom();
}


/* -------------------------
   TYPING INDICATOR
------------------------- */

function addTypingMessage() {

  const message = document.createElement("div");

  message.className = "message ai";

  message.innerHTML = `
    <div class="message-avatar">N</div>

    <div class="message-content">

      <div class="message-name">
        NEXORA
      </div>

      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>
  `;

  messages.appendChild(message);

  scrollToBottom();

  return message;
}


/* -------------------------
   WELCOME SCREEN
------------------------- */

function hideWelcome() {

  const welcome = document.getElementById("welcome");

  if (welcome) {
    welcome.remove();
  }
}


/* -------------------------
   CLEAR CHAT
------------------------- */

function clearChat() {

  messages.innerHTML = `
    <div class="welcome" id="welcome">

      <div class="welcome-icon">
        N
      </div>

      <h2>Welcome to NEXORA</h2>

      <p>
        Your intelligent AI assistant powered by Gemini.
      </p>

      <div class="suggestions">

        <button class="suggestion">
          💡 Give me an idea
        </button>

        <button class="suggestion">
          ✍️ Help me write something
        </button>

        <button class="suggestion">
          🧠 Explain something
        </button>

        <button class="suggestion">
          💻 Help me code
        </button>

      </div>

    </div>
  `;

  chatHistory = [];

  historyList.innerHTML = "";

  setStatus("AI is ready");

  attachSuggestionEvents();
}


/* -------------------------
   CHAT HISTORY
------------------------- */

function updateHistory(text) {

  if (historyList.children.length >= 8) {
    historyList.removeChild(historyList.lastChild);
  }

  const item = document.createElement("div");

  item.className = "history-item";

  item.textContent = text;

  historyList.prepend(item);
}


/* -------------------------
   STATUS
------------------------- */

function setStatus(text) {
  statusText.textContent = text;
}


/* -------------------------
   SCROLL
------------------------- */

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}


/* -------------------------
   TEXTAREA
------------------------- */

function resizeInput() {

  messageInput.style.height = "auto";

  messageInput.style.height =
    Math.min(messageInput.scrollHeight, 150) + "px";
}

messageInput.addEventListener("input", resizeInput);


/* -------------------------
   ENTER TO SEND
------------------------- */

messageInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter" && !event.shiftKey) {

    event.preventDefault();

    sendMessage();

  }

});


/* -------------------------
   BUTTONS
------------------------- */

sendButton.addEventListener("click", sendMessage);

clearButton.addEventListener("click", clearChat);

newChatButton.addEventListener("click", clearChat);


/* -------------------------
   SETTINGS
------------------------- */

settingsButton.addEventListener("click", () => {

  settingsModal.classList.remove("hidden");

});

closeSettings.addEventListener("click", () => {

  settingsModal.classList.add("hidden");

});

closeSettingsButton.addEventListener("click", () => {

  settingsModal.classList.add("hidden");

});

settingsModal.addEventListener("click", (event) => {

  if (event.target === settingsModal) {

    settingsModal.classList.add("hidden");

  }

});


/* -------------------------
   MOBILE SIDEBAR
------------------------- */

menuButton.addEventListener("click", () => {

  sidebar.classList.toggle("open");

});


/* -------------------------
   SUGGESTIONS
------------------------- */

function attachSuggestionEvents() {

  document.querySelectorAll(".suggestion").forEach(button => {

    button.addEventListener("click", () => {

      const text = button.textContent
        .replace(/^[^a-zA-Z]+/, "")
        .trim();

      messageInput.value = text;

      messageInput.focus();

      resizeInput();

    });

  });

}

attachSuggestionEvents();
