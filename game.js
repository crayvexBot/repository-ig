const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =====================
   GAME STATE
===================== */
let gameStarted = false;

/* =====================
   PLAYER
===================== */
let player = {
  x:100,
  y:200,
  w:20,
  h:20,
  vy:0,
  grounded:false
};

let gravity = 0.7;

/* =====================
   CAMERA
===================== */
let camX = 0;

/* =====================
   BLOCKS (REAL PLATFORMER)
===================== */
let blocks = [
  {x:0,y:500,w:300,h:20},
  {x:350,y:450,w:120,h:20},
  {x:520,y:400,w:120,h:20},
  {x:700,y:350,w:120,h:20},
  {x:900,y:400,w:200,h:20},
];

/* =====================
   MENU
===================== */
document.getElementById("play").onclick = ()=>{
  document.getElementById("menu").style.display="none";
  gameStarted = true;
};

/* =====================
   KEYBOARD
===================== */
document.addEventListener("keydown",e=>{
  if(!gameStarted) return;

  if(e.key==="a") player.x -= 6;
  if(e.key==="d") player.x += 6;

  if(e.key==="w" && player.grounded){
    player.vy = -12;
    player.grounded = false;
  }
});

/* =====================
   JOYSTICK
===================== */
let joy = {x:0};
let dragging = false;

const base = document.getElementById("joyBase");
const stick = document.getElementById("joyStick");

base.addEventListener("touchstart",()=>dragging=true);

base.addEventListener("touchend",()=>{
  dragging=false;
  joy.x=0;
  stick.style.transform="translate(0,0)";
});

base.addEventListener("touchmove",(e)=>{
  if(!dragging) return;

  let t=e.touches[0];
  let r=base.getBoundingClientRect();

  let dx=t.clientX-(r.left+60);

  let max=40;
  if(dx>max) dx=max;
  if(dx<-max) dx=-max;

  joy.x = dx/max;

  stick.style.transform=`translate(${dx}px,0)`;
});

/* =====================
   JUMP BUTTON
===================== */
document.getElementById("jumpBtn").onclick = ()=>{
  if(player.grounded){
    player.vy = -12;
    player.grounded=false;
  }
};

/* =====================
   COLLISION
===================== */
function collide(a,b){
  return (
    a.x < b.x+b.w &&
    a.x+a.w > b.x &&
    a.y < b.y+b.h &&
    a.y+a.h > b.y
  );
}

/* =====================
   UPDATE
===================== */
function update(){

  player.x += joy.x * 6;

  player.vy += gravity;
  player.y += player.vy;

  player.grounded = false;

  for(let b of blocks){
    if(collide(player,b) && player.vy>=0){
      player.y = b.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  }

  camX = player.x - canvas.width/2;
}

/* =====================
   DRAW PLAYER
===================== */
function drawPlayer(){

  ctx.fillStyle="#4aa3ff";

  ctx.beginPath();
  ctx.arc(
    player.x - camX,
    player.y,
    12,
    0,
    Math.PI*2
  );
  ctx.fill();

  ctx.fillStyle="white";
  ctx.fillRect(player.x-camX+5,player.y+5,2,2);
  ctx.fillRect(player.x-camX+10,player.y+5,2,2);
}

/* =====================
   DRAW WORLD
===================== */
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="#3a3a3a";

  for(let b of blocks){
    ctx.fillRect(b.x-camX,b.y,b.w,b.h);
  }

  drawPlayer();
}

/* =====================
   LOOP
===================== */
function loop(){
  if(gameStarted){
    update();
    draw();
  }

  requestAnimationFrame(loop);
}

loop();
