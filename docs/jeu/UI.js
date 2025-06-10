export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 40;
    this.fontFamily = "Nanum Pen Script";
    this.livesImage = document.getElementById("lives");
    this.gameOverSound = document.getElementById("gameOverSound");
  }
  playGameOverSound() {
    if (this.gameOverSound) {
      this.gameOverSound.play();
    }
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.font = this.fontSize + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    context.fillText("Score: " + this.game.score, 20, 50);
    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 20, 80);
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 20 * i + 20, 95, 25, 25);
    }

    //game over messages
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.font = this.fontSize * 2 + "px " + this.fontFamily;

      // Vérifier si le joueur a gagné ou perdu
      if (this.game.score > this.game.winningScore) {
        // Le joueur a gagné
        this.game.playWinSound();
        context.fillText(
          "Et bam!",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize + "px " + this.fontFamily;
        context.fillText(
          "De quoi les créatures de la nuit ont-elles peur? TOI!!!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        this.drawButton(context, "Suivant");
      } else {
        this.playGameOverSound();
        context.fillText(
          "Coup de foudre au premier bit?",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize + "px " + this.fontFamily;
        context.fillText(
          "Nope, retente ta chance!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
      this.drawButton(context, "Rejouer");
    }
    context.restore();
  }
  drawButton(context, buttonText) {
    let buttonY = this.game.height / 2 + (buttonText === "Suivant" ? 100 : 40);

    context.save();
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    context.shadowColor = "transparent";
    context.fillStyle = "#000";
    context.fillRect(this.game.width / 2 - 50, buttonY, 100, 50);
    context.font = "30px Nanum Pen Script";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.fillText(buttonText, this.game.width / 2, buttonY + 35);
    context.restore();
  }
}
