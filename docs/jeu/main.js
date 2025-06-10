import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import {
  FlyingEnemy,
  GroundEnemy,
  ClimbingEnemy,
  FlyingEnemy2,
  ClimbingEnemy2,
  GroundEnemy2,
  FlyingEnemy3,
  ClimbingEnemy3,
  GroundEnemy3,
} from "./enemies.js";

import { UI } from "./UI.js";
let game;
let canvas, ctx;

const transitionImages = [
  document.getElementById("transitionImage1"),
  document.getElementById("transitionImage2"),
];
const transitionSounds = [
  document.getElementById("transitionSound1"),
  document.getElementById("transitionSound2"),
];

const level1Images = [
  document.getElementById("layer0"),
  document.getElementById("layer1"),
  document.getElementById("layer2"),
  document.getElementById("layer3"),
  document.getElementById("layer4"),
];
const level2Images = [
  document.getElementById("layer2-0"),
  document.getElementById("layer2-1"),
  document.getElementById("layer2-2"),
  document.getElementById("layer2-3"),
  document.getElementById("layer2-4"),
];
const level3Images = [
  document.getElementById("layer3-0"),
  document.getElementById("layer3-1"),
  document.getElementById("layer3-2"),
  document.getElementById("layer3-3"),
  document.getElementById("layer3-4"),
];

function playIntroVideo() {
  const video = document.getElementById('introVideo');
  // Affiche la vidéo et lance la lecture
  video.style.display = 'block';
  video.play();

  video.onended = function() {
    video.style.display = 'none'; // Cache la vidéo après la lecture
    startGame(); // Lance le jeu après la fin de la vidéo
  };
}

function showLevelTransition(levelIndex, nextLevelCallback) {
  // Assurer que toutes les images et sons précédents sont cachés ou arrêtés
  transitionImages.forEach(img => img.style.display = 'none');
  transitionSounds.forEach(sound => sound.pause());

  // Montrer l'image de transition et jouer le son pour le niveau actuel
  transitionImages[levelIndex].style.display = 'block';
  transitionSounds[levelIndex].play();

  setTimeout(() => {
    transitionImages[levelIndex].style.display = 'none';
    nextLevelCallback(); // Appelle la fonction pour charger le niveau suivant
  }, 2000); // à modifier ici
}

function setupGame() {
  canvas = document.getElementById("canvas1");
  ctx = canvas.getContext("2d");
  canvas.width = 1080;
  canvas.height = 500;

  // Ajout de l'écouteur de clic UNE SEULE FOIS
  canvas.addEventListener("click", function (event) {
    if (game && game.gameOver) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      checkButtonClick(x, y);
    }
  });

  playIntroVideo();
}

function startGame() {
  game = new Game(canvas.width, canvas.height);
  game.loadLevel(game.level);
  requestAnimationFrame(animate);
  // Ne pas ajouter d'écouteur ici !
}

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundMargin = 80;
    this.speed = 0;
    this.maxSpeed = 3;
    this.background = null;
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];
    this.maxParticles = 50;
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.debug = false;
    this.score = 0;
    this.winningScore = 3; //modifier ici score victoire, 40
    this.fontColor = "black";
    this.startGameSound = document.getElementById("startGameSound");
    this.winSound = document.getElementById("winSound");
    this.playStartGameSound();
    this.time = 0;
    this.maxTime = 10000; //modifier ici temps de jeu, 30000
    this.gameOver = false;
    this.lives = 5;
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
    this.level = 1;
    window.MAX_LEVEL = 3; //augmenter pour le nombre de niveaux
    this.replayButton = {
      x: this.width / 2 - 50,
      y: this.height / 2 + 40,
      width: 100,
      height: 50,
    };
    this.nextButton = {
      x: this.width / 2 - 50,
      y: this.height / 2 + 100,
      width: 100,
      height: 50,
    };
  }

  loadLevel(levelNumber) {
    this.resetGame();
    this.time = 0;
    this.enemies = [];
    // Choisissez les images selon le niveau
    let images;
    switch (levelNumber) {
      case 1:
        images = level1Images;
        break;
      case 2:
        images = level2Images;
        break;
      case 3:
        images = level3Images;
        break;
      default:
        console.log("Niveau inconnu");
        return; // Sortez de la fonction si le niveau n'est pas reconnu
    }
    this.background = new Background(this, images);
    this.gameOver = false;
    this.initializeLevel(levelNumber);
  }

  initializeLevel(level) {
    switch (level) {
      case 1:
      case 2:
      case 3:
        this.player.reset();
        // Ajoutez ici la logique spécifique pour initialiser le niveau 3
        // Par exemple, ajustez les intervalles d'apparition des ennemis, configurez des défis uniques, etc.
        break;
      default:
        console.log("Niveau inconnu");
        break;
    }
  }

  resetGame() {
    this.score = 0;
    this.lives = 5;
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];
  }

  setBackground(background) {
    this.background = background;
  }

  update(deltaTime) {
    if (this.gameOver) {
      return;
    }
    if (this.background) this.background.update();
    this.time += deltaTime;
    if (this.time > this.maxTime) {
      this.gameOver = true;
    }
    this.player.update(this.input.keys, deltaTime);
    // handleEnemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
    });
    // messages
    this.floatingMessages.forEach((message) => {
      message.update();
    });
    // handle particles
    this.particles.forEach((particle, index) => {
      particle.update();
    });
    if (this.particles.length > this.maxParticles) {
      this.particles.length = this.maxParticles;
    }
    //handle collision sprites
    this.collisions.forEach((collision, index) => {
      collision.update(deltaTime);
    });
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion
    );
    this.collisions = this.collisions.filter(
      (collision) => !collision.markedForDeletion
    );
    this.floatingMessages = this.floatingMessages.filter(
      (message) => !message.markedForDeletion
    );
  }

  draw(context) {
    context.drawImage(skyImage, 0, 0, canvas.width, canvas.height);
    this.background.draw(context);
    this.player.draw(context);
    this.enemies.forEach((enemy) => {
      enemy.draw(context);
    });
    this.particles.forEach((particle) => {
      particle.draw(context);
    });
    this.collisions.forEach((collision) => {
      collision.draw(context);
    });
    this.floatingMessages.forEach((message) => {
      message.draw(context);
    });
    this.background.drawLayer6(context);
    this.UI.draw(context);
  }

  addEnemy() {
    // Pour le niveau 1
    if (this.level === 1) {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingEnemy(this));
    }

    // Pour le niveau 2
    else if (this.level === 2) {
      if (this.speed > 0 && Math.random() < 0.3) {
        this.enemies.push(new GroundEnemy2(this)); // Plus de chances de générer des ennemis terrestres
      }
      if (Math.random() < 0.1) {
        this.enemies.push(new ClimbingEnemy2(this)); // Moins de chances pour les grimpants
      }
      if (Math.random() < 0.5) {
        this.enemies.push(new FlyingEnemy2(this)); // Introduction d'un nouveau type d'ennemi volant
      }
    }

    // Pour le niveau 3
    else if (this.level === 3) {
      if (this.speed > 0 && Math.random() < 0.4) {
        this.enemies.push(new GroundEnemy3(this)); // Ajoute un nouveau type d'ennemi terrestre spécifique au niveau 3
      }
      if (Math.random() < 0.2) {
        this.enemies.push(new ClimbingEnemy3(this)); // Réutilise les ennemis grimpants du niveau 1 pour diversité
      }
      if (Math.random() < 0.6) {
        this.enemies.push(new FlyingEnemy3(this)); // Ajoute un nouveau type d'ennemi volant spécifique au niveau 3
      }
    }

    // Ajoutez des conditions similaires pour d'autres niveaux si nécessaire
  }

  playStartGameSound() {
    if (this.startGameSound) {
      this.startGameSound.play();
    }
  }

  playWinSound() {
    if (this.winSound) {
      this.winSound.play();
    }
  }
}

function restartCurrentLevel() {
  // Affiche le canvas et masque les overlays
  const canvas = document.getElementById('canvas1');
  if (canvas) canvas.style.display = 'block';
  const introVideo = document.getElementById('introVideo');
  if (introVideo) introVideo.style.display = 'none';
  const winVideo = document.getElementById('winVideo');
  if (winVideo) winVideo.style.display = 'none';
  transitionImages.forEach(img => img.style.display = 'none');

  game.loadLevel(game.level); // Recharge le niveau actuel au lieu de toujours charger le niveau 1
  requestAnimationFrame(animate);
}

function nextLevel() {
  // Affiche le canvas et masque les overlays
  const canvas = document.getElementById('canvas1');
  if (canvas) canvas.style.display = 'block';
  const introVideo = document.getElementById('introVideo');
  if (introVideo) introVideo.style.display = 'none';
  const winVideo = document.getElementById('winVideo');
  if (winVideo) winVideo.style.display = 'none';
  transitionImages.forEach(img => img.style.display = 'none');

  if (game.level < window.MAX_LEVEL) {
    // Montre l'image de transition avant de passer au niveau suivant
    // Note: ajustez l'indice si nécessaire (ex: game.level - 1)
    showLevelTransition(game.level - 1, () => {
      game.level++;
      game.loadLevel(game.level); // Charge le niveau suivant
      requestAnimationFrame(animate);
    });
  } else {
    console.log("Dernier niveau complété.");
  }
}


let lastTime = 0;

function animate(timestamp) {
  if (lastTime === 0) lastTime = timestamp; // Initialise lastTime lors du premier appel
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  if (game.gameOver) {
    lastTime = 0;
    // Optionnel : afficher un message de fin de jeu ou effectuer d'autres actions spécifiques à la fin du jeu
    // Ici, vous pouvez ajouter un bouton ou une invite pour redémarrer le niveau actuel en cas de défaite.
    return; // Assurez-vous d'avoir une logique pour redémarrer le jeu ici ou ailleurs dans votre code.
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(animate);
}

function checkButtonClick(x, y) {
  const replayButtonX = game.width / 2 - 50;
  const replayButtonY = game.height / 2 + 40;
  const buttonWidth = 100;
  const buttonHeight = 50;
  const nextButtonX = game.width / 2 - 50;
  const nextButtonY = game.height / 2 + 100;
  const nextButtonWidth = 100;
  const nextButtonHeight = 50;

  if (
    x >= replayButtonX &&
    x <= replayButtonX + buttonWidth &&
    y >= replayButtonY &&
    y <= replayButtonY + buttonHeight
  ) {
    restartCurrentLevel();
  }

  if (
    x >= nextButtonX &&
    x <= nextButtonX + nextButtonWidth &&
    y >= nextButtonY &&
    y <= nextButtonY + nextButtonHeight
  ) {
    nextLevel();
  }
}

window.addEventListener("load", setupGame);
