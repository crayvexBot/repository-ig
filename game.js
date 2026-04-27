const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =========================
   PLAYER
========================= */
let player = {
  x: 100,
  y: 200,
  w: 20,
  h: 20,
  vy: 0,
  grounded: false
};

let gravity = 0.7;

/* =========================
   CAMERA
========================= */
let camX = 0;

/* =========================
   LEVEL BLOCKS
========================= */
let blocks = [
  {x:0,y:450,w:300,h:20},
  {x:350,y:380,w:120,h:20},
  {x:520,y:320,w:120,h:20},
  {x:700,y:260,w:120,h:20},
  {x:900,y:320,w:120,h:20},
  {x:1100,y:400,w:200,h:20}
];

/* =========================
   INPUT (KEYBOARD)
========================= */
document.addEventListener("keydown", e=>{
  if(e.key === "a") player.x -= 6;
  if(e.key === "d") player.x += 6;

  if(e.key === "w" && player.grounded){
    player.vy = -12;
    player.grounded = false;
  }
});

/* =========================
   JOYSTICK
========================= */
let joy = {x:0,y:0};

const base = document.getElementById("joyBase");
const stick = document.getElementById("joyStick");

let dragging = false;

base.addEventListener("touchstart", ()=>dragging=true);

base.addEventListener("touchend", ()=>{
  dragging=false;
  joy.x=0;
  stick.style.transform="translate(0,0)";
});

base.addEventListener("touchmove",(e)=>{
  if(!dragging) return;

  let t = e.touches[0];
  let r = base.getBoundingClientRect();

  let dx = t.clientX - (r.left + 60);
  let dy = t.clientY - (r.top + 60);

  let dist = Math.sqrt(dx*dx + dy*dy);
  let max = 40;

  if(dist > max){
    dx = dx/dist * max;
    dy = dy/dist * max;
  }

  joy.x = dx / max;

  stick.style.transform = `translate(${dx}px,${dy}px)`;
});

/* =========================
   JUMP BUTTON
========================= */
const jumpBtn = document.getElementById("jumpBtn");

function jump(){
  if(player.grounded){
    player.vy = -12;
    player.grounded = false;
  }
}

jumpBtn.addEventListener("touchstart", jump);
jumpBtn.addEventListener("click", jump);

/* =========================
   COLLISION
========================= */
function collide(a,b){
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/* =========================
   UPDATE
========================= */
function update(){

  /* movement */
  player.x += joy.x * 6;

  /* gravity */
  player.vy += gravity;
  player.y += player.vy;

  player.grounded = false;

  /* collisions */
  for(let b of blocks){
    if(collide(player,b) && player.vy >= 0){
      player.y = b.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  }

  /* camera follow */
  camX = player.x - canvas.width/2;
}

/* =========================
   DRAW PLAYER
========================= */
function drawPlayer(){

  ctx.fillStyle = "#4aa3ff";

  ctx.beginPath();
  ctx.arc(
    player.x - camX + player.w/2,
    player.y + player.h/2,
    12,
    0,
    Math.PI*2
  );
  ctx.fill();

  /* eyes */
  ctx.fillStyle = "white";
  ctx.fillRect(player.x - camX + 6, player.y + 6, 2, 2);
  ctx.fillRect(player.x - camX + 12, player.y + 6, 2, 2);

  ctx.strokeStyle = "white";
  ctx.stroke();
}

/* =========================
   DRAW WORLD
========================= */
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  /* blocks */
  ctx.fillStyle = "#3a3a3a";

  for(let b of blocks){
    ctx.fillRect(
      b.x - camX,
      b.y,
      b.w,
      b.h
    );
  }

  /* player */
  drawPlayer();
}

/* =========================
   LOOP
========================= */
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
