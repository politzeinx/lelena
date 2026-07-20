// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const photoboothWrapper = document.getElementById("photobooth-wrapper");
const photoMessage = document.getElementById("photo-message");
const msgText = document.getElementById("msg-text");

const countdownContainer = document.getElementById("countdown-container");
const countdownTimer = document.getElementById("countdown-timer");

// Frases ANTES da data
const phrasesBeforeDate = [
  "Tenho uma surpresa pra você...",
  "Mas você só poderá abrir numa data bem especial!",
  "Aguarde pacientemente..."
];

// Frases NO DIA da data
const phrasesOnDate = [
  "O grande dia chegou!",
  "Deseja ver a surpresa?"
];

const typeSpeed = 70;
const pauseBetweenPhrases = 1200;

// Áudios
const dialogueSound = new Audio("Pixel game text_dialogue sound effect - Sectiy (youtube).mp3");
dialogueSound.loop = true;
const yippeeSound = new Audio("Yippee Sound Effect - YTSFX (youtube).mp3");

function speakText(text) {
  dialogueSound.currentTime = 0;
  dialogueSound.play();
}

// Verifica se já chegou no dia 3 de Agosto
function isBigDay() {
  const now = new Date();
  const targetYear = now.getFullYear();
  const targetDate = new Date(`August 3, ${targetYear} 00:00:00`);
  return now >= targetDate;
}

// Reproduz qualquer sequência de frases
function playPhraseSequence(phrases, phraseIndex, onComplete) {
  if (phraseIndex >= phrases.length) {
    if (onComplete) onComplete();
    return;
  }

  const currentPhrase = phrases[phraseIndex];
  let charIndex = 0;
  title.textContent = "";

  speakText(currentPhrase);

  function typeChar() {
    if (charIndex < currentPhrase.length) {
      title.textContent += currentPhrase.charAt(charIndex);
      charIndex++;
      setTimeout(typeChar, typeSpeed);
    } else {
      dialogueSound.pause();
      setTimeout(() => {
        playPhraseSequence(phrases, phraseIndex + 1, onComplete);
      }, pauseBetweenPhrases);
    }
  }

  typeChar();
}

// Exibe os botões com transição
function showButtons() {
  buttons.style.display = "flex";
  setTimeout(() => {
    buttons.classList.add("show");
  }, 10);
}

// Exibe mensagem + photobooth
function showMessageThenBooth() {
  catImg.style.display = "none";
  document.querySelector(".letter-window").classList.add("final");
  buttons.style.display = "none";
  countdownContainer.style.display = "none";
  finalText.style.display = "none";
  photoboothWrapper.style.display = "flex";

  const message = "Feliz aniversário, bebezuda! Aproveite muito o seu dia. Conhecer você melhorou muito o meu ano. Aqui está um presentinho bem bobo que eu fiz pra você :)";
  msgText.textContent = "";
  let i = 0;

  function typeMsg() {
    if (i < message.length) {
      msgText.textContent += message.charAt(i);
      i++;
      setTimeout(typeMsg, 35);
    }
  }

  typeMsg();

  photoMessage.style.display = "flex";
  photoMessage.addEventListener("click", () => {
    photoMessage.style.display = "none";
  }, { once: true });
}

// Contador Regressivo
function startCountdown() {
  countdownContainer.style.display = "block";

  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(`August 3, ${targetYear} 00:00:00`);

  if (now > targetDate) {
    targetYear++;
    targetDate = new Date(`August 3, ${targetYear} 00:00:00`);
  }

  function updateTimer() {
    const currentTime = new Date();
    const difference = targetDate - currentTime;

    if (difference <= 0) {
      countdownTimer.textContent = "🎉 Chegou o grande dia! 🎉";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    countdownTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Click Envelope
envelope.addEventListener("click", () => {
  dialogueSound.pause();
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    document.querySelector(".letter-window").classList.add("open");

    if (isBigDay()) {
      playPhraseSequence(phrasesOnDate, 0, () => {
        showButtons();
      });
    } else {
      // Se ainda não chegou o dia
      playPhraseSequence(phrasesBeforeDate, 0, () => {
        startCountdown(); // Mostra apenas o contador regressivo
      });
    }
  }, 50);
});

// Logic to move the NO btn
function moveNoBtn(e) {
  e.preventDefault();

  const card = document.querySelector(".letter-window");
  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const margin = 10;
  const spaceR = cardRect.right - btnRect.right - margin;
  const spaceL = btnRect.left - cardRect.left - margin;
  const spaceD = cardRect.bottom - btnRect.bottom - margin;
  const spaceU = btnRect.top - cardRect.top - margin;

  const maxMove = Math.min(180, Math.max(spaceR, spaceL, spaceD, spaceU, 60));

  const options = [];
  if (spaceR >= maxMove * 0.5) options.push({ x: maxMove, y: 0 });
  if (spaceL >= maxMove * 0.5) options.push({ x: -maxMove, y: 0 });
  if (spaceD >= maxMove * 0.5) options.push({ x: 0, y: maxMove });
  if (spaceU >= maxMove * 0.5) options.push({ x: 0, y: -maxMove });
  if (spaceR >= maxMove * 0.4 && spaceD >= maxMove * 0.4) options.push({ x: maxMove * 0.7, y: maxMove * 0.7 });
  if (spaceR >= maxMove * 0.4 && spaceU >= maxMove * 0.4) options.push({ x: maxMove * 0.7, y: -maxMove * 0.7 });
  if (spaceL >= maxMove * 0.4 && spaceD >= maxMove * 0.4) options.push({ x: -maxMove * 0.7, y: maxMove * 0.7 });
  if (spaceL >= maxMove * 0.4 && spaceU >= maxMove * 0.4) options.push({ x: -maxMove * 0.7, y: -maxMove * 0.7 });

  if (options.length === 0) return;

  const chosen = options[Math.floor(Math.random() * options.length)];
  chosen.x += (Math.random() - 0.5) * 30;
  chosen.y += (Math.random() - 0.5) * 30;

  noBtn.style.transition = "transform 0.2s ease";
  noBtn.style.transform = `translate(${chosen.x}px, ${chosen.y}px)`;
}

noBtn.addEventListener("mouseover", moveNoBtn);
noBtn.addEventListener("touchstart", moveNoBtn, { passive: false });

// YES is clicked
yesBtn.addEventListener("click", () => {
  dialogueSound.pause();

  catImg.src = "cat_dance.gif";
  buttons.style.display = "none";
  countdownContainer.style.display = "none";
  finalText.style.display = "none";

  const fullText = "Yippeeeeeeeeeeeeeeeeeeee!";
  title.textContent = "";
  let charIndex = 0;

  yippeeSound.currentTime = 0;
  yippeeSound.play();

  function typeWriter() {
    if (charIndex < fullText.length) {
      title.textContent += fullText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 50);
    } else {
      setTimeout(() => {
        let len = fullText.length;
        const interval = setInterval(() => {
          len--;
          if (len <= 0) {
            clearInterval(interval);
            title.textContent = "";
            document.querySelector(".letter-window").classList.add("final");
            showMessageThenBooth();
            return;
          }
          title.textContent = fullText.slice(0, len);
        }, 50);
      }, 600);
    }
  }

  typeWriter();
});