const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

class Player {
  constructor(x, y) {
    this.position = { x, y };
    this.width = 40;
    this.height = 40;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }
  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
    jump: {
      pressed: false
    }
  };
}

class Plataform {
  constructor(x, y) {
    this.position = {
      x: x,
      y: y,
    };
    this.width = 200;
    this.height = 20;
  }
}


function gameFactory() {
  const gravity = 0.5;
  const state = {
    players: {"player1": new Player(100, 100)},
    plataform: {
      "plataform1": new Plataform(200, 400),
      "plataform2": new Plataform(230, 200),
      "plataform3": new Plataform(250, 550)
    }
  }

  function changeKeyPressedPlayer({key, player}) {
    const playerId = state.players[player];
    const keysPlayer = playerId.keys;
    switch (key) {
      case "a":
        keysPlayer.left.pressed = true;
        break;
      case "d":
        keysPlayer.right.pressed = true;
        break;
      case "w":
        keysPlayer.jump.pressed = true;
        break;
    }
   
    
  }

  function changeKeyReleasedPlayer({key, player}) { 
    const playerId = state.players[player];
    const keysPlayer = playerId.keys;
    switch (key) {
    case "a":
      keysPlayer.left.pressed = false;
      break;
    case "d":
      keysPlayer.right.pressed = false;
      break;
    case "w":
      keysPlayer.jump.pressed = false;
      break;
  }}

  function updatePlayerPosition(player) {

    if(player.position.y + player.velocity.y < 0){
      player.position.y = 0
      player.velocity.y += gravity;
    } else {
      player.position.y += player.velocity.y;
    }
    player.position.x += player.velocity.x;
  
    if (player.position.y + player.height + player.velocity.y <= canvas.height) {
      player.velocity.y += gravity;
    } else {
      player.velocity.y = 0;
    }
  }

  function isColisionPlayerAndPlataform(player, plataforms) {
    for(const plataformId in plataforms){
      const actualPlataform = state.plataform[plataformId]
      if(player.position.y + player.height <= actualPlataform.position.y &&
        player.position.y + player.height + player.velocity.y >=
        actualPlataform.position.y &&
        player.position.x + player.width >= actualPlataform.position.x &&
        player.position.x <= actualPlataform.position.x + actualPlataform.width){
          return true
        }
    }
    return false;
  }

  function isColisionCanvasXRight(player) {
    const playerPosition = player.position;
    return(playerPosition.x + player.width >= canvas.width)
  }
  function isColisionCanvasXLeft(player) {
    const playerPosition = player.position;
    return(playerPosition.x <= 0)
  }

  function isColisionPlayerAndCanvasY(player) {
    const playerPosition = player.position;
    if (playerPosition.y - player.height <= 0){
      return true
     
    };
    return false
  }
  
  function updatePlayerVelocity(player) {
    const handleVelocityX = 8;
    const jumpValue = 10;
     

    if(isColisionCanvasXRight(player)){
      player.keys.right.pressed = false;
    }
    if(isColisionCanvasXLeft(player)){
      player.keys.left.pressed = false;
    }
    
    if (player.keys.right.pressed) {
      player.velocity.x = handleVelocityX;
    } else if (player.keys.left.pressed) {
      player.velocity.x = -handleVelocityX;
    } else {
      player.velocity.x = 0;
    }
    

    if (isColisionPlayerAndPlataform(player, state.plataform)) {
      player.velocity.y = 0;
    }
    if(!isColisionPlayerAndCanvasY(player) && player.keys.jump.pressed && player.velocity.y === 0){
      player.velocity.y = -jumpValue;
    }
    
  }
 return {changeKeyPressedPlayer,changeKeyReleasedPlayer, updatePlayerPosition, updatePlayerVelocity, state}

}


const game = gameFactory();


function drawScreen() {
  for(const playerId in game.state.players) {
    const player = game.state.players[playerId]
    context.fillStyle = "black";
    context.fillRect(player.position.x, player.position.y, player.width, player.height);
  }
  for(const plataformId in game.state.plataform) {
    const plataform = game.state.plataform[plataformId]
    context.fillStyle = "black";
    context.fillRect(plataform.position.x, plataform.position.y, plataform.width, plataform.height);
  }
}


function createKeyboardDownObserver() {
  const observerList = []

  function subscribe(fn) {
    observerList.push(fn)
  }

  function notifyAll(comand) {
    for(const observerFunction of observerList){
      observerFunction(comand)
    }
  }
  window.addEventListener("keydown", handleKeyDown)
  function handleKeyDown ({key}){
    const command = {player: "player1", key}
    notifyAll(command)
  }
  return subscribe;
}

function createKeyboardUpObserver() {
  const observerList = []

  function subscribe(fn) {
    observerList.push(fn)
  }

  function notifyAll(comand) {
    for(const observerFunction of observerList){
      observerFunction(comand)
    }
  }
  window.addEventListener("keyup", handleKeyUp)
  function handleKeyUp ({key}){
    const command = {player: "player1", key}
    notifyAll(command)
  }
  return subscribe;
}


const keyboardListenerDown = createKeyboardDownObserver();
const keyboardListenerUp = createKeyboardUpObserver()
keyboardListenerDown(game.changeKeyPressedPlayer);
keyboardListenerUp(game.changeKeyReleasedPlayer);


function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  game.updatePlayerVelocity(game.state.players.player1); 
  game.updatePlayerPosition(game.state.players.player1);
  drawScreen();
}

animate();

