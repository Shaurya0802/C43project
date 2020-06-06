var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cow, cowImg;
var ground, invisibleGround;

var cloudsGroup, cloudImage;
var obstaclesGroup,obstacleImg;

var backgroundImg;

var score=0;

var gameOver, restart;

var cowSound,gaveOverSound;

let soundClassifier;

function preload(){
    const options = {
        probabilityThreshold: 0.95
      }
    soundClassifier = ml5.soundClassifier('SpeechCommands18w', options);

    cowImg =   loadImage("images/cow image.png");

    cloudImg = loadImage("images/Cloud.png");

    backgroundImg = loadImage("images/Background.jpg")

    obstacleImg = loadImage("images/fence.png");

    gameOverImg = loadImage("images/Game Over.jfif");

    restartImg = loadImage("images/Restart.png");

    cowSound = loadSound("Cow Sound.mp3");

    gameOverSound = loadSound("game-over-sound-effect.mp3");
}

function setup() {
    createCanvas(displayWidth,displayHeight);

    cow = createSprite(70,height - 40,20,20);

    cow.addImage("img1", cowImg);
    cow.scale = 0.2;

    ground = createSprite(width/2,height - 20,width + 100,50);
    ground.shapeColor = "brown";

    ground.x = ground.width /2;
    ground.velocityX = -(6 + 3*score/100);

    gameOver = createSprite(width/2,height/2 + 100);
    gameOver.addImage(gameOverImg);

    restart = createSprite(width/2,height/2 + 200);
    restart.addImage(restartImg);

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    gameOver.visible = false;
    restart.visible = false;

    invisibleGround = createSprite(width/2,height - 15,width,10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();
    obstaclesGroup = new Group();

    score = 0;

    soundClassifier.classify(gotCommand);
}

function gotCommand(error, results){
    if (error) {
      console.error(error);
    }
    console.log(results[0].label, results[0].confidence);
    if (results[0].label === 'up') {
        cow.velocityY = -32;
        cow.velocityY = cow.velocityY + 1;
        cowSound.play();
    }
  }  

function draw() {
    background(backgroundImg);

    //console.log(cow.y);

    fill("#ffdb58");
    strokeWeight(7);
    stroke(255,0,0);
    textSize(50);
    textStyle(BOLD);
    textFont("Comic Sans MS");
    text("Score: "+ score,width - 300,70);

    fill("#ffdb58");
    strokeWeight(7);
    stroke(255,0,0);
    textSize(30);
    textStyle(BOLD);
    textFont("Comic Sans MS");
    text("This game is initiated with voice recoginition🤩🤩.\n Just say 'up' and watch😃 ",width/2 - 600,70);

    ground.depth = cow.depth;
    cow.depth = cow.depth + 1;

    if (gameState===PLAY){
        score = score + Math.round(getFrameRate()/60);
        ground.velocityX = -(6 + 3*score/100);

        if(touches.length > 0 || keyDown("space") && cow.y >= 686.9) {
            cow.velocityY = -32;
            cowSound.play();
            touches = [];
        }

        cow.velocityY = cow.velocityY + 1;

        if (ground.x < width/2){
            ground.x = ground.width/2;
        }

        cow.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();

        if(obstaclesGroup.isTouching(cow)){
            gameState = END;
            gameOverSound.play();
        }
    }
    else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        cow.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        //cow.changeAnimation("collided",trex_collided);

        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        if(touches.length > 0 || mousePressedOver(restart)) {
            reset();
            touches = [];
        }
    }

    drawSprites();
}

function spawnClouds() {
    if (frameCount % 170 === 0) {
        var cloud = createSprite(width + 50,200);
        //cloud.debug = true;
        cloud.y = Math.round(random(250,400));
        cloud.addImage(cloudImg);
        cloud.scale = 0.5;
        cloud.velocityX = -3;

        cloud.lifetime = 500;

        cloud.depth = cow.depth;
        cow.depth = cow.depth + 1;

        cloudsGroup.add(cloud);
    }
  
}

function spawnObstacles() {
    if(frameCount % 150 === 0) {
        var obstacle = createSprite(width + 50,height - 65);
        //obstacle.debug = true;

        obstacle.addImage(obstacleImg);
        obstacle.velocityX = -(7 + 3.5*score/100);

        obstacle.scale = 0.3;
        obstacle.lifetime = 300;

        obstaclesGroup.add(obstacle);
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();

    //cow.changeAnimation("running",trex_running);

    score = 0;
}