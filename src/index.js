const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;

class Player {
  constructor(x, y) {
    this.position = { x, y };
    this.width = 100;
    this.height = 100;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Plataform {
  constructor() {
    this.position = {
      x: 200,
      y: 100,
    };
    this.width = 200;
    this.height = 20;
  }

  draw() {
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player(100, 100);
const plataform = new Plataform();

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  plataform.draw();

  const handleVelocityX = 0.2;
  if (keys.right.pressed) {
    player.velocity.x += handleVelocityX;
  } else if (keys.left.pressed) {
    player.velocity.x -= handleVelocityX;
  } else {
    player.velocity.x = 0;
  }

  if (
    player.position.y + player.height <= plataform.position.y &&
    player.position.y + player.height + player.velocity.y >=
      plataform.position.y &&
    player.position.x + player.width >= plataform.position.x &&
    player.position.x <= plataform.position.x + plataform.width
  ) {
    player.velocity.y = 0;
  }
}

animate();

window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.left.pressed = true;
      break;
    case "d":
      keys.right.pressed = true;
      break;
    case "w":
      player.velocity.y -= 20;
      break;
  }
});

window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.left.pressed = false;
      break;
    case "d":
      keys.right.pressed = false;
      break;
  }
});
