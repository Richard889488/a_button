const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const player = {
  x: 100,
  y: 0,
  vx: 0,
  vy: 0,
  width: 40,
  height: 40,
  speed: 3,
  jumpStrength: 10,
  onGround: false
};

const gravity = 0.5;

function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // apply physics
  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  // ground collision
  if (player.y + player.height > canvas.height - 50) {
    player.y = canvas.height - 50 - player.height;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // simple world bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // draw ground
  ctx.fillStyle = '#654321';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  // draw player
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

update();

// voice control
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'zh-TW';
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    const lower = transcript.toLowerCase();

    if (lower.includes('左') || lower.includes('left')) {
      player.vx = -player.speed;
    } else if (lower.includes('右') || lower.includes('right')) {
      player.vx = player.speed;
    } else if (lower.includes('停') || lower.includes('stop')) {
      player.vx = 0;
    } else if ((lower.includes('跳') || lower.includes('jump')) && player.onGround) {
      player.vy = -player.jumpStrength;
    }
  };

  recognition.onerror = () => {
    recognition.stop();
    setTimeout(() => recognition.start(), 1000);
  };

  recognition.onend = () => {
    setTimeout(() => recognition.start(), 1000);
  };
} else {
  document.querySelector('.instructions').textContent = 'Browser does not support SpeechRecognition';
}
