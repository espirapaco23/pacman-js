const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let pacman;
let oneBlock = 20;
let score = 0;
let ghosts = [];
let fps = 20;
let lives = 3;
let ghostCount = 4;
let ghostImageLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

let createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 0, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

class Pacman {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = 4;
    this.nextDirection = 4;
    this.frameCount = 7;
    this.currentFrame = 1;

    setInterval(() => {
      this.changeAnimation();
    }, 100);
  }

  moveProcess() {
    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      return;
    }
  }

  eat() {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i) {
          map[i][j] = 3;
          score++;
        }
      }
    }
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;
      case DIRECTION_UP:
        this.y += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x += this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }

  moveForwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;
      case DIRECTION_UP:
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  checkCollisions() {
    let isCollided = false;
    if (
      map[parseInt(this.y / oneBlock)][parseInt(this.x / oneBlock)] == 1 ||
      map[parseInt(this.y / oneBlock + 0.999)][parseInt(this.x / oneBlock)] ==
        1 ||
      map[parseInt(this.y / oneBlock)][parseInt(this.x / oneBlock + 0.9999)] ==
        1 ||
      map[parseInt(this.y / oneBlock + 0.9999)][
        parseInt(this.x / oneBlock + 0.9999)
      ] == 1
    ) {
      isCollided = true;
    }
    return isCollided;
  }

  checkGhostCollision(ghosts) {
    for (let i = 0; i < ghosts.length; i++) {
      let ghost = ghosts[i];
      if (
        ghost.getMapX() == this.getMapX() &&
        ghost.getMapY() == this.getMapY()
      ) {
        return true;
      }
    }
    return false;
  }

  changeDirectionIfPossible() {
    if (this.direction == this.nextDirection) return;
    let tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  getMapX() {
    let mapX = parseInt(this.x / oneBlock);
    return mapX;
  }

  getMapY() {
    let mapY = parseInt(this.y / oneBlock);

    return mapY;
  }

  getMapXRightSide() {
    let mapX = parseInt((this.x * 0.99 + oneBlock) / oneBlock);
    return mapX;
  }

  getMapYRightSide() {
    let mapY = parseInt((this.y * 0.99 + oneBlock) / oneBlock);
    return mapY;
  }

  changeAnimation() {
    this.currentFrame =
      this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  }

  draw() {
    canvasContext.save();
    canvasContext.translate(this.x + oneBlock / 2, this.y + oneBlock / 2);
    canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
    canvasContext.translate(-this.x - oneBlock / 2, -this.y - oneBlock / 2);
    canvasContext.drawImage(
      pacmanFrames,
      (this.currentFrame - 1) * oneBlock,
      0,
      oneBlock,
      oneBlock,
      this.x,
      this.y,
      this.width,
      this.height
    );
    canvasContext.restore();
  }
}

let createNewPacman = () => {
  pacman = new Pacman(oneBlock, oneBlock, oneBlock, oneBlock, oneBlock / 5);
};

let gameLoop = () => {
  update();
  draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
  createNewPacman();
  createGhosts();
};

let update = () => {
  pacman.moveProcess();
  pacman.eat();
  updateGhosts();
  if (pacman.checkGhostCollision(ghosts)) {
    onGhostCollision();
  }
};

let onGhostCollision = () => {
  lives--;
  restartPacmanAndGhosts();
  if (lives == 0) {
  }
};

let drawFoods = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * oneBlock + oneBlock / 3,
          i * oneBlock + oneBlock / 3,
          oneBlock / 3,
          oneBlock / 3,
          "#FEB897"
        );
      }
    }
  }
};

let drawRemainingLives = () => {
  canvasContext.font = "20px Helvetica";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Lives: ", 220, oneBlock * (map.length + 1));

  for (let i = 0; i < lives; i++) {
    canvasContext.drawImage(
      pacmanFrames,
      2 * oneBlock,
      0,
      oneBlock,
      oneBlock,
      350 + i * oneBlock,
      oneBlock * map.length + 2,
      oneBlock,
      oneBlock
    );
  }
};

let drawScore = () => {
  canvasContext.fillText("Score: " + score, 0, oneBlock * (map.length + 1));
};

let draw = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  drawFoods();
  drawGhosts();
  pacman.draw();
  drawScore();
  drawRemainingLives();
};

let drawWalls = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == 1) {
        createRect(j * oneBlock, i * oneBlock, oneBlock, oneBlock, "#342DCA");
      }
    }
  }
};

let createGhosts = () => {
  ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let newGhost = new Ghost(
      9 * oneBlock + (i % 2 == 0 ? 0 : 2) * oneBlock,
      10 * oneBlock + (i % 2 == 0 ? 0 : 1) * oneBlock,
      oneBlock,
      oneBlock,
      pacman.speed / 2,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      9 + i * 3
    );
    ghosts.push(newGhost);
  }
};

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  setTimeout(() => {
    if (k == 37 || k == 65) {
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38 || k == 87) {
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39 || k == 68) {
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 40 || k == 83) {
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});

createNewPacman();
createGhosts();
gameLoop();
