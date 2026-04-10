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
  const errorDiv = document.getElementById('errorMessage');

  if (message === '') {
    errorDiv.textContent = "Please write a message before sending!";
    errorDiv.classList.remove('hidden');
    return;
  }

  // Clear error if valid
  errorDiv.textContent = "";
  errorDiv.classList.add('hidden');

  const token = "8318492948:AAGzbVI7ZLJkLwyCwC1nYFfg29P4HGBEqyA";   // your bot token
  const chatId = "6792798433";    // your chat ID
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
    // keep your reposition logic here
    const bounds = questionPage.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${bounds.left + 50 + hoverCount * 30}px`;
    noBtn.style.top = `${bounds.top + 100 + hoverCount * 30}px`;
    noBtn.style.zIndex = '5';
    hoverCount++;
  } else {
    // only after the button disappears, show the message box
    document.getElementById('noMessage').classList.remove('hidden');
    noBtn.style.display = 'none';

    // now focus the textarea
    setTimeout(() => {
      document.getElementById('userMessage').focus();
    }, 100); // slight delay ensures the element is visible before focus
  }
}
