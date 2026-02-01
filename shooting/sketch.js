let targetX = 300;
let targetY = 200;
let targetSize = 80;
let score = 0;
let timeLeft = 50;
let gameOver = false;
let targetTimeLeft = 3.5;
let maxTargetTime = 3.5;
let freezeTimeLeft = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  targetX = windowWidth;
  targetY = windowHeight;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(135, 206, 235);

  if (gameOver) {
    fill(0);
    textSize(48);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2 - 50);
    textSize(32);
    text("Final score: " + score, width / 2, height / 2 + 20);
    textSize(20);
    text("Click to play again", width / 2, height / 2 + 80);
    textAlign(LEFT);
  } else {
    fill(255, 0, 0);
    circle(targetX, targetY, targetSize);

    fill(255, 255, 255);
    circle(targetX, targetY, targetSize * 0.75);

    fill(255, 0, 0);
    circle(targetX, targetY, targetSize * 0.5);

    fill(255, 255, 0);
    circle(targetX, targetY, targetSize * 0.25);

    fill(0);
    textSize(24);
    text("Score: " + score, 10, 30);
    text("Time: " + timeLeft, 10, 60);
    text("Target: " + targetTimeLeft.toFixed(1) + "s", 10, 90);

    if (freezeTimeLeft > 0) {
      fill(0, 150, 255);
      text("FROZEN: " + freezeTimeLeft.toFixed(1) + "s", 10, 120);
    }
    
    // Game timer countdown
    if (frameCount % 60 === 0 && timeLeft > 0) {
      timeLeft = timeLeft - 1;
    }

    // Update freeze timer
    if (freezeTimeLeft > 0) {
      freezeTimeLeft = freezeTimeLeft - 1 / 60;
      if (freezeTimeLeft < 0) {
        freezeTimeLeft = 0;
      }
    }

    // Check if both A and S are held down to activate freeze
    if (keyIsDown(65) && keyIsDown(83) && freezeTimeLeft === 0) {
      freezeTimeLeft = 5.0;
    }

    // Only count down target timer if NOT frozen
    if (freezeTimeLeft <= 0) {
      targetTimeLeft = targetTimeLeft - 1 / 60;
    }

    // Check if target time ran out
    if (targetTimeLeft <= 0) {
      score = score - 1;
      targetX = random(50, width - 50);
      targetY = random(50, height - 50);
      targetTimeLeft = maxTargetTime;
    }

    // Check if game over
    if (timeLeft <= 0) {
      gameOver = true;
    }
  }

  // Draw crosshair
  stroke(0);
  strokeWeight(2);
  line(mouseX - 15, mouseY, mouseX + 15, mouseY);
  line(mouseX, mouseY - 15, mouseX, mouseY + 15);
  noFill();
  circle(mouseX, mouseY, 20);
  noStroke();
}

function mousePressed() {
  if (gameOver) {
    score = 0;
    timeLeft = 50;
    gameOver = false;
    targetX = random(50, 550);
    targetY = random(50, 350);
    targetTimeLeft = 3.5;
    maxTargetTime = 3.5;
    freezeTimeLeft = 0;
  } else {
    let distance = dist(mouseX, mouseY, targetX, targetY);

    let radius = targetSize / 2;
    let bullseyeRadius = (targetSize * 0.25) / 2;

    if (distance < bullseyeRadius) {
      score = score + 5;
      targetX = random(50, 550);
      targetY = random(50, 350);
      maxTargetTime = max(1.0, maxTargetTime - 0.1);
      targetTimeLeft = maxTargetTime;
    } else if (distance < radius) {
      score = score + 1;
      targetX = random(50, 550);
      targetY = random(50, 350);
      maxTargetTime = max(1.0, maxTargetTime - 0.1);
      targetTimeLeft = maxTargetTime;
    }
  }
}
