const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/***** Variables *****/

//ular
let snake = [
  { x: 140, y: 160 },
  { x: 120, y: 160 },
  { x: 100, y: 160 },
  { x: 80, y: 160 },
];
//kecepatan x
let speedX = 20;
//kecepatan y 
let speedY = 0;
//kecepatan
let speed = 10;
//apple x 
let appleX = 0;
//apple y 
let appleY = 0;
//Score 
let score = 0;
//Bug 
let bugDirection = false;
//StopGame
let stopGame = false;
// audio 
let sound_Dead = new Audio('audio/dead.mp3');
let sound_Eat = new Audio('audio/eat.mp3');
let sound_Move = new Audio('audio/move.mp3');
let sound_Game = new Audio('audio/gameMain.mp3');
//gambar
let img = new Image();
img.src="image/gameover.png";

/***** Fonctions *****/

function animation() {
  if (stopGame === true) {
    return;
  } else {
    setTimeout(function () {
      bugDirection = false;
      displayCanvas();
      displayApple();
      moveSnake();
      displaySnake();
      //Rekursi
      animation();
    }, 1000/speed);
  }
}

function displayCanvas() {
  ctx.fillStyle = "#ECEA95";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function displayCube(cube) {
  ctx.fillStyle = "#00fe14";
  ctx.strokeStyle = "black";
  ctx.fillRect(cube.x, cube.y, 20, 20);
  ctx.strokeRect(cube.x, cube.y, 20, 20);
}

function displaySnake() {
  snake.forEach((cube) => {
    displayCube(cube);
  });
}

function moveSnake() {
  sound_Game.play();
  const head = { x: snake[0].x + speedX, y: snake[0].y + speedY };
  //menambahkan diawal
  snake.unshift(head);

  if (gameOver()) {
    snake.shift(head);
    restartGame();
    stopGame = true;
    return;
  }

  const snakeEatApple = snake[0].x === appleX && snake[0].y === appleY;

  if (snakeEatApple) {
    sound_Eat.play();
    score += 10;
    document.getElementById("score").innerHTML = ('SCORE : '+score);
    createApple();
  } else {
    //menghapus
    snake.pop();
  }
}

function changeDirection(event) {
  //bug
  if (bugDirection) return;
  bugDirection = true;

  const left = "ArrowLeft";
  const right = "ArrowRight";
  const up = "ArrowUp";
  const down = "ArrowDown";  

  const direction = event.key;

  const goUp = speedY === -20;
  const goDown = speedY === 20;
  const goRight = speedX === 20;
  const goLeft = speedX === -20;

  if (direction === left && !goRight) {
    sound_Move.play();
    speedX = -20;
    speedY = 0;
  }
  if (direction === right && !goLeft) {
    sound_Move.play();
    speedX = 20;
    speedY = 0;
  }
  if (direction === up && !goDown) {
    sound_Move.play();
    speedX = 0;
    speedY = -20;
  }
  if (direction === down && !goUp) {
    sound_Move.play();
    speedX = 0;
    speedY = 20;
  }
}

function random() {
  return Math.round((Math.random() * 380) / 20) * 20;
}
function createApple() { 
  appleX = random();
  appleY = random();

  //Pastikan apel tidak muncul di ular
  snake.forEach(function (part) {
    const appleOnSnake = part.x == appleX && part.y == appleY;
    if (appleOnSnake) {
      createApple();
    }
  });
}

function displayApple() {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "darkred";
  ctx.beginPath();
  ctx.arc(appleX + 10, appleY + 10, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function gameOver() {
  let snakeHead = snake.slice(1, -1);
  let touchBody = false;
  snakeHead.forEach((cube) => {
    if (cube.x === snake[0].x && cube.y === snake[0].y) {
      touchBody = true;
    }
  });
  const touchWallLeft = snake[0].x < -1;
  const touchWallRight = snake[0].x > canvas.width - 20;
  const touchWallTop = snake[0].y < -1;
  const touchWallBottom = snake[0].y > canvas.height - 20;
  let over = false;
  if (
    touchBody || touchWallBottom || touchWallLeft || touchWallTop || touchWallRight
  ) {
    ctx.drawImage(img, 40, 15);
    sound_Game.pause();
    sound_Dead.play();
    over = true;
  }
  return over;
}

function restartGame() {
  const restart = document.getElementById("restart");

  restart.style.display = "block";

  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      document.location.reload(true);
    }
  });
}

document.addEventListener("keydown", changeDirection);

animation();
createApple();
changeDirection();
displaySnake();
