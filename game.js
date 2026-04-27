const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =========================
   GAME STATE
========================= */
let gameStarted = false;
let paused = false;

let checkpointsEnabled = true;
let level = 1;
let achievements = 0;

/* =========================
   PLAYER
========================= */
let player = {x:100,y:200,w:20,h:20,vy:0,grounded:false};

let gravity = 0.6;
let jumpPower = -12;

/* =========================
   SAVE SYSTEM
========================= */
let saves = JSON.parse(localStorage.getItem("saves") || "[]");

/* =========================
   WORLD
========================= */
let rooms = [];
let roomSize = 800;

/* =========================
   MENU CONTROLS
========================= */
document.getElementById("playBtn").onclick = ()=>{
  document.getElementById("mainMenu").style.display="none";
  canvas.style.display="block";
  gameStarted=true;
};

document.getElementById("savedBtn").onclick = openSaved;
document.getElementById("infoBtn").onclick = ()=>toggle("infoMenu");

/* =========================
   TOGGLE MENU
========================= */
function toggle(id){
  let el = document.getElementById(id);
  el.style.display = el.style.display==="block"?"none":"block";
}

/* =========================
   SAVE GAME
========================= */
function saveGame(){

  saves.push({
    level: level,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("saves", JSON.stringify(saves));

  alert("Game Saved!");
}

/* =========================
   SHOW SAVES
========================= */
function openSaved(){

  let menu = document.getElementById("savedMenu");
  menu.innerHTML = "<h2>Saved Maps</h2>";

  saves.forEach((s,i)=>{
    menu.innerHTML += `
      <div style="padding:10px;border-bottom:1px solid white;">
        Map No#${i+1}<br>
        Saved on: ${s.time}
        <button onclick="loadSave(${i})">Load</button>
      </div>
    `;
  });

  menu.style.display="block";
}

/* =========================
   LOAD SAVE
========================= */
function loadSave(i){
  level = saves[i].level;
  document.getElementById("levelUI").innerText = level;
  alert("Loaded Map No#" + (i+1));
}

/* =========================
   PAUSE
========================= */
document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){
    paused = !paused;
    document.getElementById("pauseMenu").style.display =
      paused ? "block":"none";
  }
});

/* =========================
   SETTINGS
========================= */
function resume(){
  paused=false;
  document.getElementById("pauseMenu").style.display="none";
}

function toggleCheckpoint(){
  checkpointsEnabled = !checkpointsEnabled;
}

/* =========================
   LOOP CONTROL
========================= */
function loop(){
  if(!gameStarted || paused){
    requestAnimationFrame(loop);
    return;
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="blue";
  ctx.fillRect(player.x,player.y,20,20);

  requestAnimationFrame(loop);
}

loop();
