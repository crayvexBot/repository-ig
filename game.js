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

let gravity = 0.6;
let jumpPower = -12;

/* =========================
   INPUT
========================= */
const jumpBtn = document.getElementById("jumpBtn");

function jump(){
  if(player.grounded){
    player.vy = jumpPower;
    player.grounded = false;
  }
}

document.addEventListener("keydown", e=>{
  if(e.key === "w") jump();
});

jumpBtn.addEventListener("click", jump);
jumpBtn.addEventListener("touchstart", jump);

/* =========================
   WORLD
========================= */
let rooms = [];
let roomSize = 800;

/* =========================
   COINS
========================= */
let collected = 0;

/* =========================
   ROOM GENERATION
========================= */
function createRoom(i){

  let baseX = i * roomSize;

  let room = {
    ground: {x:baseX,y:450,w:roomSize,h:200},
    platforms: [],
    spikes: [],
    coins: []
  };

  /* HIGHER RANDOM PLATFORMS */
  let pCount = 3 + Math.floor(Math.random()*3);

  for(let i=0;i<pCount;i++){
    room.platforms.push({
      x: baseX + 100 + Math.random()*600,
      y: 180 + Math.random()*220,
      w: 80 + Math.random()*80,
      h: 15
    });
  }

  /* SPIKES */
  let sCount = 2 + Math.floor(Math.random()*3);

  for(let i=0;i<sCount;i++){
    room.spikes.push({
      x: baseX + 100 + Math.random()*600,
      y: 430,
      w: 30,
      h: 20
    });
  }

  /* COINS */
  for(let i=0;i<3;i++){
    room.coins.push({
      x: baseX + 150 + Math.random()*500,
      y: 200 + Math.random()*150,
      collected:false
    });
  }

  rooms.push(room);
}

/* INIT ROOMS */
for(let i=0;i<5;i++){
  createRoom(i);
}

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
   RESPAWN
========================= */
function respawn(){
  player.x = 100;
  player.y = 200;
  player.vy = 0;
}

/* =========================
   UPDATE
========================= */
function update(){

  player.vy += gravity;
  player.y += player.vy;

  player.grounded = false;

  let roomIndex = Math.floor(player.x / roomSize);

  if(roomIndex + 3 > rooms.length){
    createRoom(rooms.length);
  }

  let room = rooms[roomIndex];
  if(!room) return;

  /* GROUND */
  if(collide(player, room.ground) && player.vy >= 0){
    player.y = room.ground.y - player.h;
    player.vy = 0;
    player.grounded = true;
  }

  /* PLATFORMS */
  for(let p of room.platforms){
    if(collide(player,p) && player.vy >= 0){
      player.y = p.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  }

  /* SPIKES */
  for(let s of room.spikes){
    if(collide(player,s)){
      respawn();
    }
  }

  /* COINS */
  for(let c of room.coins){
    if(!c.collected &&
      Math.abs(player.x - c.x) < 20 &&
      Math.abs(player.y - c.y) < 20
    ){
      c.collected = true;
      collected++;
      document.getElementById("coins").innerText = collected;
    }
  }
}

/* =========================
   DRAW
========================= */
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let room of rooms){

    /* GRASS */
    ctx.fillStyle = "#2e8b57";
    ctx.fillRect(room.ground.x,room.ground.y,room.ground.w,room.ground.h);

    /* PLATFORMS */
    ctx.fillStyle = "#333";
    for(let p of room.platforms){
      ctx.fillRect(p.x,p.y,p.w,p.h);
    }

    /* SPIKES */
    ctx.fillStyle = "red";
    for(let s of room.spikes){
      ctx.beginPath();
      ctx.moveTo(s.x, s.y + s.h);
      ctx.lineTo(s.x + s.w/2, s.y);
      ctx.lineTo(s.x + s.w, s.y + s.h);
      ctx.fill();
    }

    /* COINS */
    ctx.fillStyle = "gold";
    for(let c of room.coins){
      if(!c.collected){
        ctx.fillRect(c.x,c.y,10,10);
      }
    }
  }

  /* PLAYER ICON (CUSTOM) */
  ctx.fillStyle = "#4aa3ff";

  ctx.beginPath();
  ctx.arc(
    player.x + player.w/2,
    player.y + player.h/2,
    12,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
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
