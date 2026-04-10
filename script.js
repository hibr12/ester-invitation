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
const questionToggle = document.getElementById('questionToggle');
const successToggle = document.getElementById('successToggle');

// --- NO button playful logic ---
let hoverCount = 0;
let originalNoPosition = null;

function overlapsRect(rectA, rectB) {
  return !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );
}

function moveNoButton(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!originalNoPosition) {
    const rect = noBtn.getBoundingClientRect();
    originalNoPosition = { x: rect.left, y: rect.top };
  }

  if (hoverCount < 3) {
    const bounds = questionPage.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const musicRect = questionToggle.getBoundingClientRect();

    // simple reposition logic
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${bounds.left + 50 + hoverCount * 30}px`;
    noBtn.style.top = `${bounds.top + 100 + hoverCount * 30}px`;
    noBtn.style.zIndex = '5';
    hoverCount++;
  } else {
    document.getElementById('noMessage').classList.remove('hidden');
    noBtn.style.display = 'none';
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
  if (message !== '') {
    const token = "8318492948:AAGzbVI7ZLJkLwyCwC1nYFfg29P4HGBEqyA";   // paste your bot token here
    const chatId = "6792798433";      // your chat ID
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
      alert("Message sent to Telegram!");
      document.getElementById('userMessage').value = "";
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to send message.");
    });
  } else {
    alert("Please write a message before sending!");
  }
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
