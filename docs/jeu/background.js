class Layer {
  constructor(game, width, height, speedModifier, image) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

export class Background {
  constructor(game, images) {
    this.game = game;
    this.width = 1667;
    this.height = 500;
    this.images = images;
    this.initLayers();
  }

  initLayers() {
    this.backgroundLayers = this.images.map((image, index) => {
      // Définir une vitesse par défaut
      let speedModifier = 0.1 + index * 0.2;
      if (index === 3 || index === 4) {
        speedModifier = 0.5;
      }
      let layer = new Layer(
        this.game,
        this.width,
        this.height,
        speedModifier,
        image
      );
      if (index === 4) {
        layer.x = 833;
      }

      return layer;
    });
  }

  update() {
    this.backgroundLayers.forEach((layer) => layer.update());
  }

  draw(context) {
    // Dessiner toutes les couches sauf la dernière
    this.backgroundLayers.slice(0, -1).forEach((layer) => {
      layer.draw(context);
    });
  }

  drawLayer6(context) {
    // Cette fonction n'est plus correctement nommée puisque le dernier layer est maintenant le layer 4,
    // mais pour dessiner uniquement le dernier layer :
    if (this.backgroundLayers.length > 0) {
      this.backgroundLayers[this.backgroundLayers.length - 1].draw(context);
    }
  }
}
