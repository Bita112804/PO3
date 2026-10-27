class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = min(
      canvas.width / this.aantalKolommen,
      canvas.height / this.aantalRijen
    );
  }


  teken() {
    push();

    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {

        var x = kolom * this.celGrootte;
        var y = rij * this.celGrootte;

        var rand =
          rij == 0 ||
          rij == this.aantalRijen - 1 ||
          kolom == 0 ||
          kolom == this.aantalKolommen - 1;

        var muisOpCel =
          mouseX >= x &&
          mouseX < x + this.celGrootte &&
          mouseY >= y &&
          mouseY < y + this.celGrootte;

        if (rand && muisOpCel) {
          fill("cyan");
        } else if (rand) {
          fill("blue");
        } else {
          noFill();
        }

        stroke("grey");

        if (rand) {
          stroke("blue");
        }

        rect(x, y, this.celGrootte, this.celGrootte);
      }
    }

    pop();
  }

}

function muisOpRand() {
  var cel = raster.celGrootte;

  return (
    mouseX >= 0 &&
    mouseX < canvas.width &&
    mouseY >= 0 &&
    mouseY < canvas.height &&
    (
      mouseX < cel ||
      mouseX >= canvas.width - cel ||
      mouseY < cel ||
      mouseY >= canvas.height - cel
    )
  );
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.levens = 3;
    this.klaar = false;
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

  }

  wordtGeraakt(vijand) {
    return (
      this.x < vijand.x + raster.celGrootte &&
      this.x + raster.celGrootte > vijand.x &&
      this.y < vijand.y + raster.celGrootte &&
      this.y + raster.celGrootte > vijand.y
    );
  }

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(
      this.x, 0, canvas.width - raster.celGrootte
    );
    this.y = constrain(
      this.y, 0, canvas.height - raster.celGrootte
    );
  }

  toon() {
    image(
      this.sprite,
      this.x,
      this.y,
      raster.celGrootte,
      raster.celGrootte);
  }
}

class Raket {
  constructor(x, y, snelheid) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.snelheidY = snelheid;
    this.zwaartekracht = 1.5;
    this.startSnelheid = snelheid;
  }

  beweeg() {
    this.snelheidY += this.zwaartekracht / 10;
    this.y += this.snelheidY;

    if (this.y >= canvas.height - raster.celGrootte) {
      this.y = canvas.height - raster.celGrootte;
      this.snelheidY = -abs(this.startSnelheid);
    }

    if (this.y <= 0) {
      this.y = 0;
      this.snelheidY = abs(this.startSnelheid);
    }
  }

  toon() {
    image(
      this.sprite,
      this.x,
      this.y,
      raster.celGrootte,
      raster.celGrootte);
  }
}

class Einddoel {
  constructor() {
    this.x = canvas.width - 2 * raster.celGrootte;
    this.y = 200;
    this.snelheidY = 3;
    this.sprite = null;
  }

  beweeg() {
    this.y += this.snelheidY;

    if (this.y <= 0) {
      this.y = 0;
      this.snelheidY *= -1;
    }

    if (this.y >= canvas.height - 2 * raster.celGrootte) {
      this.y = canvas.height - 2 * raster.celGrootte;
      this.snelheidY *= -1;
    }
  }

  toon() {
    image(
      this.sprite,
      this.x,
      this.y,
      2 * raster.celGrootte,
      2 * raster.celGrootte
    );
  }
}

class Pingpongbal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.snelheidX = 9;
    this.snelheidY = 8;
    this.sprite = null;
    this.opgegeten = false;
  }

  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;

    if (this.x <= 0 ||
        this.x >= canvas.width - raster.celGrootte) {
      this.snelheidX *= -1;
    }

    if (this.y <= 0 ||
        this.y >= canvas.height - raster.celGrootte) {
      this.snelheidY *= -1;
    }
  }

  toon() {
    if (!this.opgegeten) {
      image(
        this.sprite,
        this.x,
        this.y,
        raster.celGrootte,
        raster.celGrootte
      );
    }
  }
}


function tekenPiramide(n, x, y) {
  if (n > 0) {
    var breedte = canvas.width / 100;
    var hoogte = breedte / 2;

    if (muisOpRand()) {
      fill("cyan");
      stroke("darkcyan");
    } else {
      fill("gray");
      stroke("darkgray");
    }

    for (var nr = 0; nr < n; nr++) {
      rect(
        x + nr * breedte,
        y,
        breedte,
        hoogte
      );
    }

    tekenPiramide(
      n - 1,
      x + breedte / 2,
      y + hoogte
    );
  }
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");

  raster = new Raster(12, 18);

  raster.berekenCelGrootte();
  einddoel = new Einddoel();
  einddoel.sprite = loadImage("images/sprites/Finish/FinishLine.png");

  eve = new Jos();
  eve.stapGrootte = raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700, 200);
  alice.stapGrootte = eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  cindy = new Vijand(750, 250);
  cindy.stapGrootte = eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Cindy100px/Cindy.png");

  var eersteKolom = floor(random(10, 18));
  var tweedeKolom = floor(random(10, 18));
  var derdeKolom = floor(random(10, 18));

  raket1 = new Raket(eersteKolom * raster.celGrootte, 400, -8);
  raket2 = new Raket(tweedeKolom * raster.celGrootte, 400, -10);
  raket3 = new Raket(derdeKolom * raster.celGrootte, 400, -12);

  raket1.sprite = loadImage("images/sprites/Raket/Raket1.png");
  raket2.sprite = loadImage("images/sprites/Raket/Raket2.png");
  raket3.sprite = loadImage("images/sprites/Raket/Raket3.png");

  bal = new Pingpongbal(400, 500);
  bal.sprite = loadImage("images/sprites/Pingpongbal/PingPong.png");
}

function draw() {
  if (muisOpRand()) {
    background("blue");
  } else {
    background("white");
  }
  tekenPiramide(100,0,75)
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  raket1.beweeg();
  raket2.beweeg();
  raket3.beweeg();
  bal.beweeg()
  einddoel.beweeg()
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();
  raket1.toon();
  raket2.toon();
  raket3.toon();
  bal.toon();
  einddoel.toon()

  if (!bal.opgegeten && eve.wordtGeraakt(bal)) {
    bal.opgegeten = true;
    eve.levens++;
  }

  if (!eve.klaar &&
      (eve.wordtGeraakt(alice) ||
       eve.wordtGeraakt(bob) ||
       eve.wordtGeraakt(cindy) ||
       eve.wordtGeraakt(raket1) ||
       eve.wordtGeraakt(raket2) ||
       eve.wordtGeraakt(raket3))) {

    eve.levens--;

    if (eve.levens <= 0) {
      background('red');
      fill('black');
      textSize(50);
      text("Je hebt verloren!", 30, 300);
      noLoop();
    } else {
      eve.x = 400;
      eve.y = 300;
    }
  }

  if (!eve.klaar &&
      eve.x < einddoel.x + 2 * raster.celGrootte &&
      eve.x + raster.celGrootte > einddoel.x &&
      eve.y < einddoel.y + 2 * raster.celGrootte &&
      eve.y + raster.celGrootte > einddoel.y) {

    eve.klaar = true;
    background("green");
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Je hebt gewonnen!", canvas.width / 2, canvas.height / 2);
    noLoop();
  }

  if (!eve.klaar) {
    fill("red");
    textSize(24);
    textAlign(LEFT, TOP);
    text("Levens: " + eve.levens, 10, 10);
  }
}