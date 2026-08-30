let customerOrder;
let score = 0;
let highScores = [];
let playerName = "";
let enteringName = true;
let showLeaderboard = false;
let nameInput;
let loadingScores = true;
let timeLeft = 180;
let gameOver = false;
let lastSecond = 0;
let message = "";
let messageTimer = 0;

let foods = [
  {name: "🍕 Pizza", emoji: "🍕", x: 100, y: 450},
  {name: "🍔 Burger", emoji: "🍔", x: 250, y: 450},
  {name: "🍰 Cake", emoji: "🍰", x: 400, y: 450},
  {name: "🍟 Fries", emoji: "🍟", x: 550, y: 450}
];

function setup() {
  createCanvas(800, 600);
  textSize(60);
  pickNewOrder();
  
  // Create name input once
  nameInput = createInput('');
  nameInput.position(300, 300);
  nameInput.size(200);
  
  loadHighScores();
}

function pickNewOrder() {
  customerOrder = random(foods);
}

function mousePressed() {
  if (gameOver || showLeaderboard || enteringName) {
    return;
  }
  
  for (let food of foods) {
    let distance = dist(mouseX, mouseY, food.x + 30, food.y - 30);
    
    if (distance < 40) {
      if (food.name === customerOrder.name) {
        score = score + 10;
        message = "Great job! +10 points! 🎉";
        messageTimer = 60;
        pickNewOrder();
      } else {
        score = score - 5;
        message = "Oops! wrong food! -5 points 😅";
        messageTimer = 60;
      }
    }
  }
}

function draw() {
  background(135, 206, 235);
  
  if (enteringName) {
    drawNameEntry();
    return;
  }
  
  nameInput.hide();
  
  if (showLeaderboard) {
    drawLeaderboard();
    return;
  }
  
  if (!gameOver) {
    if (floor(frameCount / 60) > lastSecond) {
      lastSecond = floor(frameCount / 60);
      timeLeft = timeLeft - 1;
    }
    
    if (timeLeft <= 0) {
      timeLeft = 0;
      gameOver = true;
      saveHighScore(playerName, score);
    }
  }
  
  let minutes = floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  
  let secondsDisplay = seconds < 10 ? "0" + seconds : seconds;
  
  if (timeLeft <= 30) {
    fill(255, 80, 80);
  } else {
    fill(255);
  }
  textSize(35);
  text("⏱️ " + minutes + ":" + secondsDisplay, 30, 50);

  fill(139, 69, 19);
  rect(0, 400, 800, 200);
  
  textSize(80);
  text("🧑‍🍳", 350, 200);
  
  textSize(40);
  fill(0);
  text("I want: " + customerOrder.emoji, 280, 300);
  
  textSize(60);
  for (let food of foods) {
    text(food.emoji, food.x, food.y);
  }
  
  textSize(30);
  fill(255);
  text("Score: " + score, 650, 50);
  
  if (messageTimer > 0) {
    fill(255, 200, 0);
    textSize(35);
    text(message, 200, 550);
    messageTimer = messageTimer - 1;
  }
  
  if (gameOver) {
    fill(0, 0, 0, 150);
    rect(0, 0, 800, 600);
    
    fill(255, 200, 0);
    textSize(70);
    text("⏰ Time's up!", 200, 200);
    
    textSize(50);
    fill(255);
    text("Final score: " + score, 250, 310);
    
    textSize(35);
    fill(180, 255, 180);
    text("Press SPACE to play again!", 180, 420);
    
    textSize(30);
    fill(255, 200, 150);
    text("Press L to see Leaderboard", 200, 470);
  }
}

async function loadHighScores() {
  try {
    const result = await window.storage.get('restaurant_highscores', true);
    if (result && result.value) {
      highScores = JSON.parse(result.value);
    } else {
      highScores = [];
    }
  } catch (error) {
    console.log("No high scores yet!");
    highScores = [];
  }
  loadingScores = false;
}

async function saveHighScore(name, points) {
  // Add new score
  highScores.push({name: name, score: points});
  
  // Sort by score (highest first)
  highScores.sort((a, b) => b.score - a.score);
  
  // Keep only top 10
  highScores = highScores.slice(0, 10);
  
  // Save online (true = everyone can see it!)
  try {
    await window.storage.set('restaurant_highscores', JSON.stringify(highScores), true);
  } catch (error) {
    console.log("Could not save score:", error);
  }
}

function drawNameEntry() {
  background(135, 206, 235);
  
  fill(255, 200, 0);
  textSize(60);
  textAlign(CENTER);
  text("🍕 Restaurant Game 🍔", 400, 150);
  
  fill(0);
  textSize(35);
  text("Enter Username:", 400, 250);
  
  nameInput.show();
  
  textSize(25);
  fill(100);
  text("Press ENTER to start!", 400, 400);
  
  textAlign(LEFT);
}

function drawLeaderboard() {
  background(135, 206, 235);
  
  fill(255, 200, 0);
  textSize(60);
  textAlign(CENTER);
  text("🏆 Top 10 High Scores 🏆", 400, 80);
  
  if (highScores.length === 0) {
    fill(0);
    textSize(30);
    text("No scores yet! Be the first!", 400, 300);
  } else {
    textAlign(LEFT);
    textSize(28);
    
    for (let i = 0; i < highScores.length; i++) {
      let yPos = 150 + i * 40;
      
      if (i === 0) fill(255, 215, 0);
      else if (i === 1) fill(192, 192, 192);
      else if (i === 2) fill(205, 127, 50);
      else fill(0);
      
      text((i + 1) + ".", 100, yPos);
      text(highScores[i].name, 150, yPos);
      text(highScores[i].score + " pts", 600, yPos);
    }
  }
  
  textAlign(CENTER);
  textSize(30);
  fill(100);
  text("Press SPACE to play again", 400, 560);
  textAlign(LEFT);
}

function keyPressed() {
  if (enteringName && keyCode === ENTER) {
    playerName = nameInput.value().trim();
    if (playerName.length > 0) {
      enteringName = false;
      nameInput.hide();
    }
  }
  
  if (keyCode === 32) { // SPACE
    if (gameOver || showLeaderboard) {
      score = 0;
      timeLeft = 180;
      lastSecond = 0;
      frameCount = 0;
      gameOver = false;
      showLeaderboard = false;
      pickNewOrder();
    }
  }
  
  if (keyCode === 76 && gameOver) { // L key
    showLeaderboard = true;
  }
}