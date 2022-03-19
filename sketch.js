/*

The Game Project 7

Commentary:
•	your extension(s)
	-noGoZone() to prevent infinite scrolling
	-preventing movement once you fall into a canyon
	-drawing of game score

•	the bits you found difficult
	-debugging after implementing new functions/code

•	the skills you learnt/practiced by implementing it
	-push(), pop(), translate(), understood how it worked and how variables and functions used in between the push() & pop() functions will not affect the whole scope

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var gameScore;
var flagpole;
var lives;

var platforms;
var enemies;

var restartGame;

var jumpSound;
var deathSound;
var backgroundMusic;
var knockingWall;
var gameOverSound;
var incompleteSound;
var tokenCollected;
var winnerMusic;

function preload(){
	soundFormats('mp3', 'wav');
	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.1);
	deathSound = loadSound('assets/dead.mp3');
	deathSound.setVolume(2);
	backgroundMusic = loadSound('assets/background.mp3');
	backgroundMusic.setVolume(1);
	knockingWall = loadSound('assets/knocking.mp3');
	knockingWall.setVolume(1);
	gameOverSound = loadSound('assets/gameOver.wav');
	gameOverSound.setVolume(1);
	incompleteSound = loadSound('assets/incomplete.wav');
	incompleteSound.setVolume(1);
	tokenCollected = loadSound('assets/token.wav');
	tokenCollected.setVolume(1);
	winnerMusic = loadSound('assets/winner.wav');
	winnerMusic.setVolume(1);
}

function setup(){
	angleMode(DEGREES);
	createCanvas(1200, 720);
	floorPos_y = height * 3/4;

	lives = 5;
	gameScore = 0;
	
	collectables = [
		{x: 100, y: floorPos_y, isFound: false},
		{x: 370, y: floorPos_y, isFound: false},
		{x: 750, y: floorPos_y, isFound: false},
		{x: 65, y: floorPos_y - 200, isFound: false},
		{x: 450, y: floorPos_y - 120, isFound: false},
		{x: 460, y: 290, isFound: false},
		{x: 1490, y: 270, isFound: false},
		{x: 970, y: 290, isFound: false},
		{x: 1030, y: 490, isFound: false},
		{x: 1490, y: floorPos_y, isFound: false},
	];
	
	startGame();
}

function startGame(){
	gameChar_x = 30;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	trees_x = [200, 400, 500, 700, 800, -100, 1200, 1400, 1500, 1700, 1900];
	clouds = [
		{x_pos: -200, y_pos: 150},
		{x_pos: 100, y_pos: 200},
		{x_pos: 400, y_pos: 170},
		{x_pos: 700, y_pos: 120},
		{x_pos: 1000, y_pos: 150},
		{x_pos: -500, y_pos: 150},
		{x_pos: 1400, y_pos: 150},
	];
	mountains_x = [-50, 700, 1700, 1500, -300,];
	canyons = [
		{x_pos: 250, width: 100},
		{x_pos: 550, width: 100},
		{x_pos: 1000, width: 170},
	];
	
	flagpole = {isReached: false, x: 1650};

	platforms = [];
	platforms.push(createPlatforms(100, floorPos_y - 70, 70));
	platforms.push(createPlatforms(120, floorPos_y - 140, 100));
	platforms.push(createPlatforms(50, floorPos_y - 200, 100));
	platforms.push(createPlatforms(260, floorPos_y - 180, 70));
	platforms.push(createPlatforms(350, floorPos_y - 120, 120));
	platforms.push(createPlatforms(555, 480, 80));
	platforms.push(createPlatforms(680, 420, 100));
	platforms.push(createPlatforms(810, 470, 100));
	platforms.push(createPlatforms(550, 370, 120));
	platforms.push(createPlatforms(450, 290, 170));
	platforms.push(createPlatforms(1000, 490, 60));
	platforms.push(createPlatforms(1090, 430, 100));
	platforms.push(createPlatforms(1200, 490, 100));
	platforms.push(createPlatforms(1010, 350, 90));
	platforms.push(createPlatforms(950, 290, 40));
	platforms.push(createPlatforms(1300, 430, 200));
	platforms.push(createPlatforms(1300, 350, 200));
	platforms.push(createPlatforms(1300, 270, 200));

	enemies = [];
	enemies.push(new createEnemies(100, floorPos_y, 100, 1));
	enemies.push(new createEnemies(405, floorPos_y, 95, 2));
	enemies.push(new createEnemies(800, floorPos_y, 170, 2));
	enemies.push(new createEnemies(500, 290, 100, 1));
	enemies.push(new createEnemies(1300, 430, 200, 1));
	enemies.push(new createEnemies(1300, 350, 200, 2));
	enemies.push(new createEnemies(1300, 270, 200, 3));
	enemies.push(new createEnemies(1250, floorPos_y, 250, 4));
}

function draw(){
	background(100, 155, 255); // fill the sky blue
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

	push();
	translate(scrollPos,0);

	// Draw clouds.
	drawClouds();
	// Draw mountains.
	drawMountains();
	// Draw trees.
	drawTrees();
	// Draw canyons.
	for(var i=0; i < canyons.length; i++){
		checkCanyon(canyons[i]);
		drawCanyon(canyons[i]);
	}
	// Draw collectable items.
	for(var i=0; i < collectables.length; i++){
		if(collectables[i].isFound == false){
			checkCollectable(collectables[i]);
			drawCollectable(collectables[i]);
		}
	}
	//platforms
	for(var i=0; i < platforms.length; i++){
		platforms[i].draw();
	}
	//enemies
	for(var i=0; i < enemies.length; i++){
		enemies[i].draw()
		var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y)
		if(isContact){
			if(lives > 0){
				deathSound.play();
				lives -= 1;
				startGame();
			}
		}
	}
	renderFlagpole();
	noGoZone();

	pop();

	// Draw game character.
	drawGameChar();

	//instructions
	push();
	fill(0);
	stroke(0);
	textSize(10);
	text("INSTRUCTIONS:\nLEFT ARROW TO MOVE LEFT\nRIGHT ARROW TO MOVE RIGHT\nSPACEBAR TO JUMP\nAVOID BLACK BALLS\nCOLLECT ALL TOKENS & REACH THE FLAG TO WIN\nPRESS 'M' TO TOGGLE BACKGROUND MUSIC\nENJOY! :)", 940, 20);
	pop();
	
	if(lives > 0){
		push();
		fill(0);
		noStroke();
		textSize(20);
		text("LIVES X ", 20, 30);
		pop();
		for(var i=0;i<lives;i++){
			push();
			fill(255,0,0);
			translate(115, 15);
			heart(0+30*i, 0, 20);
			pop();
		}
	}else{
		push();
		fill(255,0,0);
		noStroke();
		textSize(20);
		text("DEAD :P", 20, 30);
		pop();
	}
	if(gameScore == collectables.length){
		push();
		fill(255,0,0);
		noStroke();
		textSize(20);
		text("ALL TOKENS COLLECTED GO TO FLAG!",20,60);
		pop();
	}else{
		push();
		fill(0);
		noStroke();
		textSize(20);
		text("TOKENS X ", 20,60);
		pop();
		for(var i=0;i<gameScore;i++){
			push();
			translate(140+i*30, 52);
			drawGameScore(0);
			pop();
		}
	}
	
	if(lives == 0){
		push();
		translate(width/2, height/2);
		textAlign(CENTER);
		noStroke();
		fill(255,0,0);
		textSize(50);
		text("GAME OVER!\npress enter to restart",0, 0);
		if(!gameOverSound.isPlaying()){
			gameOverSound.play();
			backgroundMusic.stop();
		}
		pop();
		return
	}
	if(flagpole.isReached){
		if(gameScore == collectables.length){
			push();
			translate(width/2, height/2);
			textAlign(CENTER);
			noStroke();
			fill(255,0,0);
			textSize(50);
			text("GAME COMPLETED!\npress enter to restart", 0, 0);
			if(!winnerMusic.isPlaying()){
				winnerMusic.play();
				backgroundMusic.stop();
			}
			pop();
			return
		}else{
			push();
			translate(width/2, height/2);
			textAlign(CENTER);
			noStroke();
			fill(255,0,0);
			textSize(50);
			text("COLLECT ALL TOKENS TO WIN", 0, 0);
			if(!incompleteSound.isPlaying()){incompleteSound.play();}
			pop();
			flagpole.isReached = false;
		}
	}

	// Logic to make the game character rise and fall.
	if(isLeft == true){
		if(gameChar_x > width * 0.2){
			gameChar_x -= 5;
		}else{
			scrollPos += 5;
		}
	}if(isRight == true){
		if(gameChar_x < width * 0.8){
			gameChar_x  += 5;
		}else{
			scrollPos -= 5; // negative for moving against the background
		}
	}if(gameChar_y < floorPos_y){
		var isContact = false;
		for(var i = 0; i < platforms.length; i++){
			if(platforms[i].checkContact(gameChar_world_x, gameChar_y)){
				isContact = true;
				isFalling = false;
			}
		}
		if(isContact == false){
			isFalling = true;
			gameChar_y += 5;
		}
	}else{
		isFalling = false;
	}

	if(!flagpole.isReached){
		checkFlagpole();
	}

	checkPlayerDie();

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
	for(var i = 0; i < platforms.length; i++){
		if(platforms[i].checkContact(gameChar_world_x, gameChar_y) && keyCode == 32){gameChar_y -= 100;}
	}
	if(keyCode == 37){
		isLeft = true;
	}
	else if(keyCode == 39){
		isRight = true;
	}
	else if(keyCode == 32 && gameChar_y == floorPos_y){
		gameChar_y -= 100;
	}
	if(keyCode == 13){
		setup();
		if(backgroundMusic.isPlaying()){
			backgroundMusic.stop();
		}
	}
	if(keyCode == 32){jumpSound.play()}
	if(keyCode == 77){
		if(backgroundMusic.isPlaying()){
			backgroundMusic.stop();
		}else{
			backgroundMusic.loop();
		}
	}
}

function keyReleased()
{
	if(keyCode == 37){
		isLeft = false;
	}
	else if(keyCode == 39){
		isRight = false;
	}
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		//body
		fill(255,0,0);
		stroke(3);
		ellipse(gameChar_x,gameChar_y-22,30,50);
		//mouth
		line(gameChar_x-14, gameChar_y-14, gameChar_x-11, gameChar_y-16);
		line(gameChar_x-14, gameChar_y-14, gameChar_x-11, gameChar_y-12); 
		//eyes
		noFill();
		arc(gameChar_x-5, gameChar_y-30, 7, 7, 180, 360);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		//body
		fill(255,0,0);
		stroke(3);
		ellipse(gameChar_x,gameChar_y-22,30,50);
		//mouth
		line(gameChar_x+13, gameChar_y-14, gameChar_x+10, gameChar_y-16);
		line(gameChar_x+13, gameChar_y-14, gameChar_x+10, gameChar_y-12); 
		//eyes
		noFill();
		arc(gameChar_x+5, gameChar_y-30, 7, 7, 180, 360);
	}
	else if(isLeft)
	{
		// add your walking left code
		//body
		fill(255,0,0);
		stroke(3);
		ellipse(gameChar_x, gameChar_y-17, 40, 40);
		//mouth
		arc(gameChar_x-13, gameChar_y-7 , 10, 10, 0, 90);
		//eyes
		line(gameChar_x-13, gameChar_y-20, gameChar_x-8, gameChar_y-25);
		line(gameChar_x-13, gameChar_y-25, gameChar_x-8, gameChar_y-20);
	}
	else if(isRight)
	{
		// add your walking right code
		//body
		fill(255,0,0);
		stroke(3);
		ellipse(gameChar_x, gameChar_y-17, 40, 40);
		//mouth
		arc(gameChar_x+13, gameChar_y-7 , 10, 10, 90, 180);
		//eyes
		line(gameChar_x+13, gameChar_y-20, gameChar_x+8, gameChar_y-25);
		line(gameChar_x+13, gameChar_y-25, gameChar_x+8, gameChar_y-20);
	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//body
		fill(255,0,0);
		stroke(3);
		ellipse(gameChar_x,gameChar_y-22,30,50);
		//mouth
		line(gameChar_x-3, gameChar_y-15, gameChar_x+3, gameChar_y-10);
		line(gameChar_x-3, gameChar_y-10, gameChar_x+3, gameChar_y-15);
		//eyes
		arc(gameChar_x-6, gameChar_y-30, 7, 7, 180, 360);
		arc(gameChar_x+6, gameChar_y-30, 7, 7, 180, 360);
	}
	else
	{
		// add your standing front facing code
		//body
		fill(255,0,0);
		stroke(3);
		ellipse(gameChar_x, gameChar_y-17, 40, 40);
		//mouth
		arc(gameChar_x, gameChar_y-12, 20, 20, 0, 180);
		//eyes
		line(gameChar_x-10, gameChar_y-27, gameChar_x-5, gameChar_y-22);
		line(gameChar_x-10, gameChar_y-22, gameChar_x-5, gameChar_y-27);
		line(gameChar_x+5, gameChar_y-22, gameChar_x+10, gameChar_y-27);
		line(gameChar_x+5, gameChar_y-27, gameChar_x+10, gameChar_y-22);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(){
	for(var i=0;i<clouds.length;i++){
		fill(255);
		ellipse(clouds[i].x_pos+50, clouds[i].y_pos-10, 50, 50);
		ellipse(clouds[i].x_pos+90, clouds[i].y_pos-10, 70, 70);
		ellipse(clouds[i].x_pos+130, clouds[i].y_pos-10, 50, 50);
		rect(clouds[i].x_pos, clouds[i].y_pos, 180, 40, 50);
	}
	for(var i=0;i<clouds.length;i++){
		var cloud = clouds[i];
		cloud.x_pos += 1;
		if(cloud.x_pos > 2000){
			cloud.x_pos = -500;
		}
	}
}
// Function to draw mountains objects.
function drawMountains(){
	for(var i=0;i<mountains_x.length;i++){
		fill(96, 96, 96);
		triangle(mountains_x[i]+100, floorPos_y, mountains_x[i]+200, floorPos_y-132, mountains_x[i]+300, floorPos_y);
		fill(150, 150, 150);
		triangle(mountains_x[i], floorPos_y, mountains_x[i]+120, floorPos_y-182, mountains_x[i]+240, floorPos_y);
	}
}
// Function to draw trees objects.
function drawTrees(){
	for(var i=0;i<trees_x.length;i++){
		//console.log(trees_x[i]);
		noStroke();
		fill(153,76,0);
		rect(trees_x[i], floorPos_y-50, 10, 50);
		fill(0,155,0);
		ellipse(trees_x[i]+5, floorPos_y-70, 30, 30);
		ellipse(trees_x[i]-5, floorPos_y-50, 30, 30);
		ellipse(trees_x[i]+15, floorPos_y-50, 30, 30);
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	noStroke();
	fill(100, 155, 255);
	rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height-floorPos_y)
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if(gameChar_world_x > t_canyon.x_pos + 10 && gameChar_world_x < (t_canyon.x_pos + t_canyon.width) - 10){
        if(gameChar_y >= floorPos_y){
            isPlummeting = true;
        }
    }else{
        isPlummeting = false;
	}
	if(isPlummeting == true){
		gameChar_y += 10;
		isLeft = false;
		isRight = false;
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{	
	push();
	fill(255, 255, 0);
    stroke(3);
  	translate(t_collectable.x, t_collectable.y-15);
  	rotate(frameCount);
 	polygon(0, 0, 15, 7);
  	pop();
	function polygon(x, y, radius, npoints) {
		let angle = 720 / npoints;
		beginShape();
		for (let a = 0; a < 720; a += angle) {
		  let sx = x + cos(a) * radius;
		  let sy = y + sin(a) * radius;
		  vertex(sx, sy);
		}
		endShape(CLOSE);
	}
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x , gameChar_y, t_collectable.x, t_collectable.y) < 26){
		t_collectable.isFound = true;
		gameScore += 1;
		tokenCollected.play();
	}
}

function renderFlagpole(){
	push();
	strokeWeight(5);
	stroke(200);
	line(flagpole.x, floorPos_y, flagpole.x, floorPos_y-200);
	fill(255,0,0);
	noStroke();
	if(flagpole.isReached && gameScore == collectables.length){
		triangle(flagpole.x, floorPos_y-200, flagpole.x+50, floorPos_y-180, flagpole.x, floorPos_y-160);
	}else{
		triangle(flagpole.x, floorPos_y-40, flagpole.x+50, floorPos_y-20, flagpole.x, floorPos_y);
	}
	pop();
}

function checkFlagpole(){
	if(abs(gameChar_world_x - flagpole.x) < 10){
		flagpole.isReached = true;
	}
}

function checkPlayerDie(){
	if(gameChar_y == height){
		deathSound.play();
		lives -= 1;
		if(lives > 0){startGame();}
	}
}

function createPlatforms(x, y, length){
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function(){
			push();
			stroke(3);
			fill(255, 0, 255, 150);
			rect(this.x, this.y, this.length, 15);
			pop();
		},
		checkContact: function(gc_x, gc_y){
			if(gc_x > this.x && gc_x < this.x + this.length){
				if(abs(this.y - gc_y) < 5){
					return true
				}
			}
			return false
		}
	}
	return p
}

function createEnemies(x, y, range, inc){
	this.x = x;
	this.y = y;
	this.range = range;
	this.inc = inc;
	this.currentX = x;
	this.update = function(){
		this.currentX += this.inc;
		if(this.currentX >= this.x + this.range){
			this.inc -= inc;
		}
		else if(this.currentX < this.x){
			this.inc = inc;
		}
	}
	this.draw = function(){
		this.update();
		if(this.inc > 0){
			push();
			translate(this.currentX, this.y-15);
			fill(0);
			ellipse(0,0,30);
			fill(255);
			ellipse(0,0,15);
			fill(0);
			ellipse(5,0,5);
			pop();
		}else{
			push()
			translate(this.currentX, this.y-15);
			fill(0);
			ellipse(0,0,30);
			fill(255);
			ellipse(0,0,15);
			fill(0);
			ellipse(-5,0,5);
			pop();
		}
		
	}
	this.checkContact = function(gc_x, gc_y){
		if(dist(this.currentX, this.y-15, gc_x, gc_y) < 20){
			return true
		}
		return false
	}
}

function noGoZone(){ //restricted area (to prevent infinite scrolling)
	push();
	fill(255,0,0,50);
	rect(-500,0,300,720);
	rect(1800,0,300,720);
	pop();
	if(gameChar_world_x == -180){
		isLeft = false;
		if(!knockingWall.isPlaying()){knockingWall.play();}
	}
	if(gameChar_world_x == 1780){
		isRight = false;
		if(!knockingWall.isPlaying()){knockingWall.play();}
	}
}

function drawGameScore(x){ //drawing of game score
	push();
	fill(255, 255, 0);
    stroke(3);
	rotate(frameCount);
 	polygon(x, 0, 15, 7);
  	pop();
	function polygon(x, y, radius, npoints) {
		let angle = 720 / npoints;
		beginShape();
		for (let a = 0; a < 720; a += angle) {
		  let sx = x + cos(a) * radius;
		  let sy = y + sin(a) * radius;
		  vertex(sx, sy);
		}
		endShape(CLOSE);
	}
}

function heart(x, y, size) { //drawing of amount of lives
	beginShape();
	vertex(x, y);
	bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
	bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
	endShape(CLOSE);
  }