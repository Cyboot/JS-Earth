var browser;
var ctx;
var canvas;
var loopID;

var WIDTH = 1000;
var HEIGHT = 600;
var DELTA_TARGET = 15;

var img_clouds;
var img_satellite_40;
var img_satellite_20;
var img_satellite_money_20;
var img_asteroid_40;
var img_asteroid_20;
var img_mothership;
var img_moon;
var img_sun;
var img_planet;
var img_circle;
var img_background;
var img_arrow_down_left;
var img_arrow_down_right;
var img_arrow_up_left;
var img_arrow_up_right;

var img_arrow_up;
var img_arrow_down;
var img_arrow_left;
var img_arrow_right;

var img_arrow_long_right;
var img_arrow_long_left;

var sprite_explosion_dust;
var sprite_explosion_fire;

var elem_level;
var elem_money;
var elem_live;

function init() {
	log("Init game (on " + BrowserDetect.browser + ")...");

	//Loading Images
	img_clouds = loadImage("clouds.png");
	img_satellite_40 = loadImage("satellite_40.png");
	img_satellite_20 = loadImage("satellite_20.png");
	img_satellite_money_20 = loadImage("satellite_money_20.png");
	img_asteroid_40 = loadImage("asteroid_40.png");
	img_asteroid_20 = loadImage("asteroid_20.png");
	img_mothership = loadImage("mothership.png");
	img_moon = loadImage("moon.png");
	img_sun = loadImage("sun.png");
	img_planet = loadImage("planet.png");
	img_circle = loadImage("circle.png");
	img_background = loadImage("background.png");
	
	img_arrow_down_left = loadImage("arrow_down_left.png");
	img_arrow_down_right = loadImage("arrow_down_right.png");
	img_arrow_up_left = loadImage("arrow_up_left.png");
	img_arrow_up_right = loadImage("arrow_up_right.png");
	img_arrow_up = loadImage("arrow_up.png");
	img_arrow_down = loadImage("arrow_down.png");
	img_arrow_left = loadImage("arrow_left.png");
	img_arrow_right = loadImage("arrow_right.png");	

	img_arrow_long_right = loadImage("arrow_long_right.png");
	img_arrow_long_left = loadImage("arrow_long_left.png");
	
	sprite_explosion_dust = loadImage("explosion_dust.png");
	sprite_explosion_fire = loadImage("explosion_fire.png");

	canvas = document.getElementById("drawcanvas");
	buffer = document.createElement("canvas");

	buffer.width = WIDTH;
	buffer.height = HEIGHT;

	real_ctx = canvas.getContext("2d");
	ctx = buffer.getContext("2d");
	towerArray = new TowerArray();

	elem_level = document.getElementById("level");
	elem_money = document.getElementById("money");
	elem_live = document.getElementById("live");

	Sun.init();
	Level.init();
	Button.init();
	Button.hideAll();
	Game.levelUP();

	start();
}

//Make requestAnimationFrame for all common Browser
(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

function start() {
	loopID = requestAnimationFrame(loop);

	//defender.push(new Satellite(new Vector(WIDTH / 2, HEIGHT / 2), 200, true));

	var sat = new Satellite(new Vector(WIDTH / 2, HEIGHT / 2), 200, false);
	sat.angle = Math.PI;
	//defender.push(sat);
}

function stop() {
	//clearInterval(loopID);
	cancelAnimationFrame(loopID);
}

