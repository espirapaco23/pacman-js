class Ghost {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    range
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_RIGHT;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageHeight = imageHeight;
    this.imageWidth = imageWidth;
    this.loopCounter = 1;
    this.range = range;
    this.randomDirection = DIRECTION_BOTTOM;

    setInterval(() => {
      this.changeRandomDirection();
    }, 5000);
  }

  draw() {
    canvasContext.save();
    canvasContext.drawImage(
      ghostFrames,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    canvasContext.restore();
  }

  isInRange() {
    let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
    let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
    if (
      Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range
    ) {
      return true;
    }
    return false;
  }

  changeRandomDirection() {
    this.randomDirection = this.randomDirection % 4;
    this.randomDirection += parseInt(Math.random * 4);
    this.randomDirection = (this.randomDirection % 4) + 1;
  }

  moveProcess() {
    if (this.isInRange()) {
      this.changeDirectionIfPossible();
    } else {
      this.playRandomMove();
    }

    this.moveForwards();

    if (this.checkCollisions()) {
      this.moveBackwards();
      return;
    }
  }

  playRandomMove() {
    this.direction = this.randomDirection;
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.changeRandomDirection();
    } else {
      this.moveBackwards();
    }
  }

  moveBackwards() {
    switch (this.direction) {
      case 4:
        this.x -= this.speed;
        break;
      case 3:
        this.y += this.speed;
        break;
      case 2:
        this.x += this.speed;
        break;
      case 1:
        this.y -= this.speed;
        break;
    }
  }

  moveForwards() {
    switch (this.direction) {
      case 4:
        this.x += this.speed;
        break;
      case 3:
        this.y -= this.speed;
        break;
      case 2:
        this.x -= this.speed;
        break;
      case 1:
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

  changeDirectionIfPossible() {
    let tempDirection = this.direction;
    this.direction = this.calculateNewDirection(
      map,
      parseInt(pacman.x / oneBlock),
      parseInt(pacman.y / oneBlock)
    );
    if (typeof this.direction == "undefined") {
      console.log("undefined");
      this.direction = tempDirection;
      return;
    }
    this.loopCounter++;
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  calculateNewDirection(map, destX, destY) {
    let mp = [];
    for (let i = 0; i < map.length; i++) {
      mp[i] = map[i].slice();
    }

    let queue = [
      {
        x: parseInt(this.x / oneBlock),
        y: parseInt(this.y / oneBlock),
        moves: [],
      },
    ];

    while (queue.length > 0) {
      let poped = queue.shift();
      if (poped.x == destX && poped.y == destY) {
        return poped.moves[0];
      } else {
        mp[poped.y][poped.x] = 1;
        let neighborList = this.addNeighbors(poped, mp);
        for (let i = 0; i < neighborList.length; i++) {
          queue.push(neighborList[i]);
        }
      }
    }

    return 1;
  }

  addNeighbors(poped, mp) {
    let queue = [];
    let numOfRows = mp.length;
    let numOfColumns = mp[0].length;

    if (
      poped.x - 1 >= 0 &&
      poped.x - 1 < numOfRows &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_LEFT);
      queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.x + 1 >= 0 &&
      poped.x + 1 < numOfRows &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_RIGHT);
      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.y - 1 >= 0 &&
      poped.y - 1 < numOfColumns &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_UP);
      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
    }
    if (
      poped.y + 1 >= 0 &&
      poped.y + 1 < numOfColumns &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_BOTTOM);
      queue.push({ x: poped.x - 1, y: poped.y + 1, moves: tempMoves });
    }
    return queue;
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
}

let drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
};

let updateGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
};
