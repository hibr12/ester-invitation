// Page references
const greetingPage = document.getElementById('greeting');
const questionPage = document.getElementById('question');
const successPage = document.getElementById('success');

// Background
const backgroundDiv = document.querySelector('.background');
const overlayDiv = document.querySelector('.overlay');

// Initially, since greeting is active, add blue background
backgroundDiv.classList.add('blue-bg');

// Buttons
const startBtn = document.getElementById('startBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const sendBtn = document.getElementById('sendBtn');
const musicToggle = document.getElementById('musicToggle');

// Audio
const bgMusic = document.getElementById('bgMusic');
const successMusic = document.getElementById('successMusic');

// Splash effect
function createSplash(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const splash = document.createElement('span');
  splash.className = 'button-splash';
  const size = Math.max(rect.width, rect.height) * 0.35;
  splash.style.width = `${size}px`;
  splash.style.height = `${size}px`;
  splash.style.left = `${event.clientX - rect.left - size / 2}px`;
  splash.style.top = `${event.clientY - rect.top - size / 2}px`;
  splash.style.background = button.classList.contains('playful-btn') ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.55)';
  button.appendChild(splash);
  splash.addEventListener('animationend', () => splash.remove());
}

const splashButtons = document.querySelectorAll('.splash-btn');
splashButtons.forEach(btn => btn.addEventListener('pointerdown', createSplash));

// NO button behavior
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

function getJumpConstraints(bounds, buttonRect) {
  const shortestSide = Math.min(bounds.width, bounds.height);
  const buttonSize = Math.max(buttonRect.width, buttonRect.height);
  const bodyInset = shortestSide <= 420
    ? Math.max(36, Math.min(72, shortestSide * 0.12))
    : Math.min(100, Math.max(48, (shortestSide - buttonSize) / 2 - 8));
  const edgePadding = bodyInset;
  const noOverlapGap = Math.max(12, Math.min(buttonSize * 0.35, 26));
  const musicGap = Math.max(14, Math.min(shortestSide * 0.05, 30));

  return {
    edgePadding,
    noOverlapGap,
    musicGap
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getFixedPosition(bounds, buttonRect, yesRect, musicRect, trialIndex) {
  const isSmallScreen = Math.min(bounds.width, bounds.height) <= 420;
  const { edgePadding, noOverlapGap, musicGap } = getJumpConstraints(bounds, buttonRect);
  const minX = bounds.left + edgePadding;
  const minY = bounds.top + edgePadding;
  const maxX = Math.max(minX, bounds.right - buttonRect.width - edgePadding);
  const maxY = Math.max(minY, bounds.bottom - buttonRect.height - edgePadding);
  const originalX = clamp(originalNoPosition.x, minX, maxX);
  const originalY = clamp(originalNoPosition.y, minY, maxY);
  const safeCenterX = clamp(bounds.left + (bounds.width - buttonRect.width) / 2, minX, maxX);
  const safeBodyY = clamp(bounds.top + bounds.height * 0.42, minY, maxY);
  const returnX = clamp(
    isSmallScreen ? safeCenterX : originalX,
    minX,
    maxX
  );
  const returnY = clamp(
    isSmallScreen ? safeBodyY : originalY,
    minY,
    maxY
  );
  const sideGap = Math.max(noOverlapGap + 8, Math.min(buttonRect.width * 0.35, 24));
  const topGap = Math.max(noOverlapGap + 10, Math.min(buttonRect.height * 0.45, 28));
  const topRightX = clamp(yesRect.right + sideGap, minX, maxX);
  const topLeftX = clamp(yesRect.left - buttonRect.width - sideGap, minX, maxX);
  const topY = clamp(yesRect.top - buttonRect.height - topGap, minY, maxY);

  const positions = [
    { x: topRightX, y: topY },
    { x: topLeftX, y: topY },
    { x: returnX, y: returnY }
  ];

  const target = positions[trialIndex] || positions[positions.length - 1];
  const candidateRect = {
    left: target.x,
    right: target.x + buttonRect.width,
    top: target.y,
    bottom: target.y + buttonRect.height
  };
  const expandedYesRect = {
    left: yesRect.left - noOverlapGap,
    right: yesRect.right + noOverlapGap,
    top: yesRect.top - noOverlapGap,
    bottom: yesRect.bottom + noOverlapGap
  };
  const expandedMusicRect = {
    left: musicRect.left - musicGap,
    right: musicRect.right + musicGap,
    top: musicRect.top - musicGap,
    bottom: musicRect.bottom + musicGap
  };

  if (!overlapsRect(candidateRect, expandedYesRect) && !overlapsRect(candidateRect, expandedMusicRect)) {
    return target;
  }

  const fallbackPositions = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: minX, y: maxY },
    { x: maxX, y: maxY }
  ];

  return fallbackPositions.find((position) => {
    const rect = {
      left: position.x,
      right: position.x + buttonRect.width,
      top: position.y,
      bottom: position.y + buttonRect.height
    };

    return !overlapsRect(rect, expandedYesRect) && !overlapsRect(rect, expandedMusicRect);
  }) || target;
}

function moveNoButton(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!originalNoPosition) {
    const rect = noBtn.getBoundingClientRect();
    originalNoPosition = {
      x: rect.left,
      y: rect.top
    };
  }

  if (hoverCount < 3) {
    const bounds = questionPage.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const musicRect = musicToggle.getBoundingClientRect();
    const bestPosition = getFixedPosition(bounds, buttonRect, yesRect, musicRect, hoverCount);

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${bestPosition.x}px`;
    noBtn.style.top = `${bestPosition.y}px`;
    noBtn.style.zIndex = '5';
    noBtn.style.display = 'block';
    hoverCount++;
  } else {
    document.getElementById('noMessage').classList.remove('hidden');
    noBtn.style.display = 'none';
  }
}

noBtn.addEventListener('pointerdown', moveNoButton);

// Start button
startBtn.addEventListener('click', () => {
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
  greetingPage.classList.remove('active');
  questionPage.classList.add('active');
  backgroundDiv.classList.remove('blue-bg');
  backgroundDiv.classList.add('black-bg');
  overlayDiv.classList.add('dark-overlay');
});

// YES button
yesBtn.addEventListener('click', () => {
  bgMusic.pause();
  successMusic.currentTime = 0;
  successMusic.play().catch(() => {});
  questionPage.classList.remove('active');
  successPage.classList.add('active');
  backgroundDiv.classList.remove('black-bg');
  overlayDiv.classList.remove('dark-overlay');
});

// Music toggle
musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicToggle.textContent = '🔊';
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🔇';
  }
});

musicToggle.addEventListener('click', () => {
  if (successMusic.paused) {
    successMusic.play().catch(() => {});
    musicToggle.textContent = '🔊';
  } else {
    successMusic.pause();
    musicToggle.textContent = '🔇';
  }
});

// Send button (Telegram redirect)
sendBtn.addEventListener('click', () => {
  const message = document.getElementById('userMessage').value;
  if (message.trim() !== '') {
    window.location.href = `https://t.me/HB_Y_12?text=${encodeURIComponent(message)}`;
  }
});


// Back button on Question page → goes back to Greeting
const backBtnQuestion = document.getElementById('backBtnQuestion');
backBtnQuestion.addEventListener('click', () => {
  questionPage.classList.remove('active');
  greetingPage.classList.add('active');
  backgroundDiv.classList.remove('black-bg');
  backgroundDiv.classList.add('blue-bg');
  overlayDiv.classList.remove('dark-overlay');
  bgMusic.pause();
});

// Back button on Success page → goes back to Question
const backBtnSuccess = document.getElementById('backBtnSuccess');
backBtnSuccess.addEventListener('click', () => {
  successPage.classList.remove('active');
  questionPage.classList.add('active');
  backgroundDiv.classList.add('black-bg');
  overlayDiv.classList.add('dark-overlay');
  successMusic.pause();
  bgMusic.play().catch(() => {});
});
