function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,1000,300);
    Entity.prototype.draw.call(this);
}


function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/skeleman.png"), 0, 0, 53.4, 70, 0.25, 9, true, true);
    this.backAnimation = new Animation(ASSET_MANAGER.getAsset("./img/skeleman.png"), 0, 71, 53.4, 70, 0.25, 9, false, true);
    this.backwards = false;
	this.speed = 150;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 450);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
	this.x += this.game.clockTick * this.speed;
	if (this.game.space && this.backwards == false) {
		this.backwards = true;
	} 
	else if(this.game.space && this.backwards == true) {
		this.backwards = false;
	} 

	

	if (this.x > 933) this.x = -230;
	if (this.x < -230) this.x = 933;
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
	ctx.font = "25px Arial";
	ctx.strokeStyle = "white";
	ctx.strokeText("Press space to walk in other direction", 45, 40); 

    if (this.backwards) {
        this.backAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
		this.speed = -150;
		
    } else {
		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
		this.speed = 150;	
	}
	
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/skeleman.png");
ASSET_MANAGER.queueDownload("./img/background.jpg");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new Unicorn(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
