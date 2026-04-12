// Page references
const greetingPage = document.getElementById('greeting');
const questionPage = document.getElementById('question');
const successPage = document.getElementById('success');

// Background
const backgroundDiv = document.querySelector('.background');
const overlayDiv = document.querySelector('.overlay');

// Buttons
const startBtn = document.getElementById('startBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const sendBtn = document.getElementById('sendBtn');

// Audio + Toggles
const bgMusic = document.getElementById('bgMusic');
const successMusic = document.getElementById('successMusic');
bgMusic.volume = 0.2;       // softer background music
successMusic.volume = 0.2;  // softer success music

const questionToggle = document.getElementById('questionToggle');
const successToggle = document.getElementById('successToggle');

// --- NO button playful logic ---
let hoverCount = 0;
let originalNoPosition = null;

function moveNoButton(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!originalNoPosition) {
    const rect = noBtn.getBoundingClientRect();
    originalNoPosition = { x: rect.left, y: rect.top };
  }

  if (hoverCount < 2) {
    // playful reposition logic
    const bounds = questionPage.getBoundingClientRect();
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${bounds.left + 50 + hoverCount * 30}px`;
    noBtn.style.top = `${bounds.top + 100 + hoverCount * 30}px`;
    noBtn.style.zIndex = '5';
    hoverCount++;
  } else {
    // after 3 hovers, show message box
    document.getElementById('noMessage').classList.remove('hidden');
    noBtn.style.display = 'none';

    // auto-focus textarea
    setTimeout(() => {
      document.getElementById('userMessage').focus();
    }, 100);

    // notify Telegram
    notifyTelegram("User clicked NO ❌");
  }
}

noBtn.addEventListener('pointerdown', moveNoButton);

// --- Navigation buttons ---
startBtn.addEventListener('click', () => {
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
  greetingPage.classList.remove('active');
  questionPage.classList.add('active');
  backgroundDiv.classList.remove('blue-bg');
  backgroundDiv.classList.add('black-bg');
  overlayDiv.classList.add('dark-overlay');
});

yesBtn.addEventListener('click', () => {
  bgMusic.pause();
  successMusic.currentTime = 0;
  successMusic.play().catch(() => {});
  questionPage.classList.remove('active');
  successPage.classList.add('active');
  backgroundDiv.classList.remove('black-bg');
  overlayDiv.classList.remove('dark-overlay');

  // notify Telegram
  notifyTelegram("User clicked YES ✅");
});

// --- Toggle buttons ---
questionToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    questionToggle.textContent = '🔊';
  } else {
    bgMusic.pause();
    questionToggle.textContent = '🔇';
  }
});

successToggle.addEventListener('click', () => {
  if (successMusic.paused) {
    successMusic.play().catch(() => {});
    successToggle.textContent = '🔊';
  } else {
    successMusic.pause();
    successToggle.textContent = '🔇';
  }
});

// --- Send button ---
sendBtn.addEventListener('click', () => {
  const message = document.getElementById('userMessage').value.trim();
  const errorDiv = document.getElementById('errorMessage');

  if (message === '') {
    errorDiv.textContent = "Please write a message before sending!";
    errorDiv.style.color = "red";
    errorDiv.classList.remove('hidden');
    return;
  }

  // clear error if valid
  errorDiv.textContent = "";
  errorDiv.classList.add('hidden');

  const token = "8318492948:AAGzbVI7ZLJkLwyCwC1nYFfg29P4HGBEqyA";   // replace with your bot token
  const chatId = "6792798433";    // replace with your chat ID
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('userMessage').value = "";
    errorDiv.textContent = "Message sent successfully!";
    errorDiv.style.color = "green";
    errorDiv.classList.remove('hidden');
  })
  .catch(error => {
    console.error("Error:", error);
    errorDiv.textContent = "Failed to send message.";
    errorDiv.style.color = "red";
    errorDiv.classList.remove('hidden');
  });
});

// --- Back buttons ---
const backBtnQuestion = document.getElementById('backBtnQuestion');
backBtnQuestion.addEventListener('click', () => {
  questionPage.classList.remove('active');
  greetingPage.classList.add('active');
  backgroundDiv.classList.remove('black-bg');
  backgroundDiv.classList.add('blue-bg');
  overlayDiv.classList.remove('dark-overlay');
  bgMusic.pause();
});

const backBtnSuccess = document.getElementById('backBtnSuccess');
backBtnSuccess.addEventListener('click', () => {
  successPage.classList.remove('active');
  questionPage.classList.add('active');
  backgroundDiv.classList.add('black-bg');
  overlayDiv.classList.add('dark-overlay');
  successMusic.pause();
  bgMusic.play().catch(() => {});
});

// --- Telegram notify helper ---
function notifyTelegram(text) {
  const token = "8318492948:AAGzbVI7ZLJkLwyCwC1nYFfg29P4HGBEqyA";   // replace with your bot token
  const chatId = "6792798433";    // replace with your chat ID
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  }).catch(error => console.error("Telegram notify error:", error));
}


// hearts
for (let i = 0; i < 80; i++) {
  let heart = document.createElement("div");
  heart.innerHTML = "❤️";
  heart.style.position = "absolute";
  heart.style.left = "50%";
  heart.style.top = "50%";
  heart.style.fontSize = "30px";


  let x = (Math.random() - 0.5) * 600;
  let y = (Math.random() - 0.5) * 600;

  heart.animate([
    { transform: "translate(0,0)", opacity: 1 },
    { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
  ], { duration: 2000 });

  document.getElementById("success").appendChild(heart);
}

// roses
setInterval(() => {
  let rose = document.createElement("div");
  rose.innerHTML = "🌹";
  rose.style.position = "absolute";
  rose.style.left = Math.random() * 100+ "vw";
  rose.style.bottom = "-20px";
  rose.style.fontSize = "50px";

  rose.animate([
    { transform: "translateY(0)", opacity: 1 },
    { transform: "translateY(-100vh)", opacity: 0 }
  ], { duration: 4000 });

  document.getElementById("success").appendChild(rose);
}, 300);
