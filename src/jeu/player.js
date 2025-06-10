import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
        this.hitSound = document.getElementById('hitSound');
        this.attackSound = document.getElementById('attackSound');
}

reset() {
    this.x = 100; // Mettez ici la position initiale souhaitée en X
    this.y = this.game.height - this.height - this.game.groundMargin; // Mettez ici la position initiale souhaitée en Y // Mettez ici la position initiale souhaitée
    this.velocity = { x: 0, y: 0 }; // Réinitialisez la vitesse si nécessaire
    this.setState(0, 0);
  }

playHitSound() {
    if (this.hitSound) {
        this.hitSound.currentTime = 0; 
        this.hitSound.volume = 0.5;
        this.hitSound.play();
    }
}

playAttackSound() {
    if (this.attackSound) {
        this.attackSound.currentTime = 0;
        this.attackSound.volume = 0.2;
        this.attackSound.play();
    }
}

    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        //mouvement horizontal
        this.x += this.speed;
        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        //limites horizontales
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //mouvement vertical
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        //limites verticales
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        //sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
            this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
        
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
    
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.playAttackSound();
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 100));
                } else {
                    this.setState(6, 0);
                    if (this.game.score - 5 < 0) {
                        this.game.score = 0;
                    } else {
                        this.game.score -= 5;
                    }
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }                
            }   
        });
    }
}

