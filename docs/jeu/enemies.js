class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    //mouvement
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    //check si en dehors de l'écran
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

// Niveau 1
export class FlyingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 80;
    this.height = 52;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_oiseau");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 85;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById("enemy_poulet");
    this.speedX = 2;
    this.speedY = 0;
    this.maxFrame = 1;
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 103;
    this.height = 144;
    this.x = this.game.width;
    this.y = 0;
    this.image = document.getElementById("enemy_liannes");
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 5;
  }
}

// Niveau 2

export class FlyingEnemy2 extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 110;
    this.height = 101;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 9;
    this.image = document.getElementById("enemy_chatTournant");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy2 extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 180;
    this.height = 104;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById("enemy_chatGluant");
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 3;
  }
}

export class ClimbingEnemy2 extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 118;
    this.height = 253;
    this.x = this.game.width;
    this.y = 0;
    this.image = document.getElementById("enemy_chat1");
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 9;
  }
}

// Niveau 3

export class FlyingEnemy3 extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_fly");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy3 extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById("enemy_plant");
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 1;
  }
}

export class ClimbingEnemy3 extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 118;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.image = document.getElementById("enemy_spider_big");
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.speedY *= -1;
    if (this.y < -this.height) this.markedForDeletion = true;
  }

  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}

// pas sûre que ça serve xD
const enemiesByLevel = {
  1: [FlyingEnemy, GroundEnemy, ClimbingEnemy],
  2: [FlyingEnemy2, GroundEnemy2, ClimbingEnemy2],
  3: [FlyingEnemy3, GroundEnemy3, ClimbingEnemy3],
};

export function spawnEnemy(game) {
  const level = game.level;
  const enemiesForLevel = enemiesByLevel[level];

  if (!enemiesForLevel) {
    console.error("Pas d'ennemis définis pour ce niveau:", level);
    return null;
  }

  // pas sûre que ça serve non plus
  const enemyIndex = Math.floor(Math.random() * enemiesForLevel.length);
  const EnemyClass = enemiesForLevel[enemyIndex];

  return new EnemyClass(game);
}
