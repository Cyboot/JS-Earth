var Game = {
	money : 1000,
	level : 0,
	live : 100,
	levelUPTimeleft : 20 * 1000,

	update : function(delta) {
		this.levelUPTimeleft -= delta;

		if (this.levelUPTimeleft < 0) {
			this.levelUPTimeleft = 20 * 1000;
			this.levelUP();
		}
	},

	levelUP : function() {
		this.level++;
		ArrowAsteroids.reset();

		switch (this.level) {
		case 1:
			Button.show(Button.satellite_small);
			Button.show(Button.flak);
			Button.show(Button.satellite_energy);
			break;
		case 3:
			Button.show(Button.satellite_big);
			break;
		case 4:
			// Button.show(Button.satellite_energy);
			break;
		case 5:
			Button.show(Button.lab);
			break;
		case 6:
			Button.show(Button.upgrade_tower);
			break;
		case 7:
			Button.show(Button.upgrade_satellite_faster);
			Button.show(Button.upgrade_satellite_firerate);
			break;
		case 8:
			Button.show(Button.upgrade_lab);
			break;
		}
	}
};

var Spawner = {
	cooldown : 200,

	update : function(delta) {
		this.cooldown -= delta;

		if (this.cooldown < 0) {
			this.cooldown = Level.getRate();

			var rand = Math.random() > 0.5;
			var randBig = Math.random() < (0.1 * (Game.level - 2));

			var x, y;
			// up-left
			if (Level.getDir().contains("0")) {
				x = rand ? randomInt(WIDTH / 4, 0) : 0;
				y = rand ? 0 : randomInt(HEIGHT / 4, 0);
				addAsteroid(x, y, randBig);
			}

			// up-right
			if (Level.getDir().contains("1")) {
				x = rand ? WIDTH - randomInt(WIDTH / 4, 0) : WIDTH;
				y = rand ? 0 : randomInt(HEIGHT / 4, 0);
				addAsteroid(x, y, randBig);
			}

			// down-right
			if (Level.getDir().contains("2")) {
				x = rand ? WIDTH - randomInt(WIDTH / 4, 0) : WIDTH;
				y = rand ? HEIGHT : HEIGHT - randomInt(HEIGHT / 4, 0);
				addAsteroid(x, y, randBig);
			}

			// down-right
			if (Level.getDir().contains("3")) {
				x = rand ? randomInt(WIDTH / 4, 0) : 0;
				y = rand ? HEIGHT : HEIGHT - randomInt(HEIGHT / 4, 0);
				addAsteroid(x, y, randBig);
			}

			// up
			if (Level.getDir().contains("U")) {
				x = WIDTH / 4 + randomInt(WIDTH / 2, 0);
				y = 0;
				addAsteroid(x, y, randBig);
			}
			// down
			if (Level.getDir().contains("D")) {
				x = WIDTH / 4 + randomInt(WIDTH / 2, 0);
				y = HEIGHT;
				addAsteroid(x, y, randBig);
			}
			// left
			if (Level.getDir().contains("L")) {
				x = 0;
				y = HEIGHT / 4 + randomInt(HEIGHT / 2);
				addAsteroid(x, y, randBig);
			}
			// right
			if (Level.getDir().contains("R")) {
				x = WIDTH;
				y = HEIGHT / 4 + randomInt(HEIGHT / 2);
				addAsteroid(x, y, randBig);
			}

		}
	}
};

var Cost = {
	Satellite_small : 100,
	Satellite_big : 300,
	Satellite_energy : 300,
	Flak : 50,
	Lab : 150,
	Upgrade_Lab : 100,
	Upgrade_Flak : 100,
	Upgrade_Sat_faster : 100,
	Upgrade_Sat_firerate : 100
}

/**
 * 0 = up-left 1 = up-right 2 = down-right 3 = down-left U = up D = down R =
 * right L = left
 */

var Level = {
	dir : new Array(),
	rate : new Array(),
	MAXLEVEL : 12,

	init : function() {
//		this.dir[1] = "0123UDRL";
		this.dir[1] = "2";

		this.dir[2] = "23";
		this.dir[3] = "0";
		this.dir[4] = "1";
		this.dir[5] = "01";
		this.dir[6] = "12";
		this.dir[7] = "123";
		this.dir[8] = "0123";
		this.dir[9] = "0123";
		this.dir[10] = "UD";
		this.dir[11] = "UDLR";
		this.dir[12] = "0123UDLR";

		this.rate[1] = 4000;
		this.rate[2] = 7000;
		this.rate[3] = 3000;
		this.rate[4] = 2000;
		this.rate[5] = 1500;
		this.rate[6] = 1000;
		this.rate[7] = 800;
		this.rate[8] = 600;
		this.rate[9] = 400;
		this.rate[10] = 200;
		this.rate[11] = 300;
		this.rate[12] = 150;
	},

	getDir : function() {
		return this.dir[Game.level > this.MAXLEVEL ? this.MAXLEVEL : Game.level];
	},
	getRate : function() {
		return this.rate[Game.level > this.MAXLEVEL ? this.MAXLEVEL : Game.level];
	}
}

var ArrowAsteroids = {
	showTimeleft : 1000,
	blinkCountdown : 5,

	reset : function() {
		this.blinkCountdown = 5;
	},

	render : function(delta) {
		this.showTimeleft -= delta;

		if (this.blinkCountdown > 2) {
			ctx.strokeStyle = "#3b80ff";
			ctx.fillStyle = "#0049d2";
			ctx.font = "100px Arial bold";
			ctx.fillText("Level " + Game.level, WIDTH / 2 - 150,
					HEIGHT / 2 - 120);
			ctx.strokeText("Level " + Game.level, WIDTH / 2 - 150,
					HEIGHT / 2 - 120);
		}

		if (this.showTimeleft > 700)
			return;
		if (this.showTimeleft < 0) {
			this.showTimeleft = 1000;
			this.blinkCountdown--;
		}

		// Only Count 10 times per Level (reset via this.reset())
		if (this.blinkCountdown < 0)
			return;

		if (Level.getDir().contains("0"))
			drawImageCentered(img_arrow_up_left, 50, 50);

		if (Level.getDir().contains("1"))
			drawImageCentered(img_arrow_up_right, WIDTH - 50, 50);

		if (Level.getDir().contains("2"))
			drawImageCentered(img_arrow_down_right, WIDTH - 50, HEIGHT - 50);

		if (Level.getDir().contains("3"))
			drawImageCentered(img_arrow_down_left, 50, HEIGHT - 50);

		if (Level.getDir().contains("U"))
			drawImageCentered(img_arrow_up, WIDTH / 2 - 25, 50);
		if (Level.getDir().contains("D"))
			drawImageCentered(img_arrow_down, WIDTH / 2 - 25, HEIGHT - 50);
		if (Level.getDir().contains("L"))
			drawImageCentered(img_arrow_left, 50, HEIGHT / 2 - 25);
		if (Level.getDir().contains("R"))
			drawImageCentered(img_arrow_right, WIDTH - 50, HEIGHT / 2 - 25);
	}
}

var Tooltip = {
	title : "",
	money : 0,
	desc : "",
	y : 0,
	x : 20,
	delayTimeleft : 400,
	showTooltip : false,

	show : function(button, height) {
		this.y = height;

		switch (button) {
		case "satellite-small":
			this.title = "Small shooting satellite";
			this.money = Cost.Satellite_small;
			this.desc = "shoots at asteroids (1 shot/sec)";
			break;
		case "satellite-big":
			this.title = "Big shooting satellite";
			this.money = Cost.Satellite_big;
			this.desc = "shoots at asteroids (3 shot/sec)";
			break;
		case "satellite-energy":
			this.title = "Energy satellite";
			this.money = Cost.Satellite_energy;
			this.desc = "generates Money (10 $/sec)";
			break;
		case "flak":
			this.title = "Flak";
			this.money = Cost.Flak;
			this.desc = "shoots from planet into orbit (1 shot/sec)";
			break;
		case "lab":
			this.title = "Laboratory";
			this.money = Cost.Lab;
			this.desc = "build on planet, makes upgrades much cheaper";
			break;
		case "upgrade-lab":
			this.title = "Upgrade: Laboratory";
			this.money = Cost.Upgrade_Lab;
			this.desc = "upgrades all laboratories, makes other upgrades cheaper";
			break;
		case "upgrade-tower":
			this.title = "Upgrade: Flak";
			this.money = Cost.Upgrade_Lab;
			this.desc = "Flaks will shoot earlier and faster";
			break;
		case "upgrade-satellite-faster":
			this.title = "Upgrade: faster satellite";
			this.money = Cost.Upgrade_Sat_faster;
			this.desc = "newbuild satellites will move faster and in higher orbit";
			break;
		case "upgrade-satellite-firerate":
			this.title = "Upgrade: firerate satellite";
			this.money = Cost.Upgrade_Sat_faster;
			this.desc = "newbuild satellite will shoot with higher firerate";
			break;
		}
		this.showTooltip = true;
		this.delayTimeleft = 400;
	},
	hide : function() {
		this.showTooltip = false;
	},

	render : function(delta) {
		this.delayTimeleft -= delta;
		if (!this.showTooltip || this.delayTimeleft > 0)
			return;
		log(this.y);

		var yTop = this.y - 5;
		var yText1 = this.y + 10;
		var yText2 = yText1 + 20;
		var yMax = 45;

		var text = this.title + "   $" + this.money + "";
		ctx.font = "bold 15px Arial";
		var w1 = ctx.measureText(text).width;
		ctx.font = "14px Arial";
		var w2 = ctx.measureText(this.desc).width;

		var textWidth = Math.max(w1, w2);

		// Box
		ctx.fillStyle = "#444444";
		ctx.fillRect(this.x - 5, yTop, textWidth + 10, yMax);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(0, yTop + yMax / 2);
		ctx.lineTo(this.x, yTop + 10);
		ctx.lineTo(this.x, yTop + yMax - 10);
		ctx.closePath();
		ctx.fill();

		// Text: Title + Desc
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 15px Arial";
		ctx.fillText(text, this.x, yText1);
		ctx.font = "14px Arial";
		ctx.fillText(this.desc, this.x, yText2);

		/*
		 * Underline ctx.beginPath(); ctx.moveTo(this.x, yText1 + 3);
		 * ctx.lineTo(this.x + textWidth, yText1 + 3); ctx.setLineWidth = 1;
		 * ctx.closePath(); ctx.strokeStyle = "#ffffff"; ctx.stroke();
		 */

	}
}

var Button = {
	satellite_small : null,
	satellite_big : null,
	satellite_energy : null,
	flak : null,
	lab : null,
	upgrade_lab : null,
	upgrade_tower : null,
	upgrade_satellite_faster : null,
	upgrade_satellite_firerate : null,

	init : function() {
		this.satellite_small = document.getElementById("satellite-small");
		this.satellite_big = document.getElementById("satellite-big");
		this.satellite_energy = document.getElementById("satellite-energy");
		this.flak = document.getElementById("flak");
		this.lab = document.getElementById("lab");
		this.upgrade_lab = document.getElementById("upgrade-lab");
		this.upgrade_tower = document.getElementById("upgrade-tower");
		this.upgrade_satellite_faster = document
				.getElementById("upgrade-satellite-faster");
		this.upgrade_satellite_firerate = document
				.getElementById("upgrade-satellite-firerate");
	},

	hide : function(button) {
		button.style.display = "none";
	},
	show : function(button) {
		button.style.display = "";
	},

	hideAll : function() {
		this.satellite_small.style.display = "none";
		this.satellite_big.style.display = "none";
		this.satellite_energy.style.display = "none";
		this.flak.style.display = "none";
		this.lab.style.display = "none";
		this.upgrade_lab.style.display = "none";
		this.upgrade_tower.style.display = "none";
		this.upgrade_satellite_faster.style.display = "none";
		this.upgrade_satellite_firerate.style.display = "none";
	},
	showAll : function() {
		this.satellite_small.style.display = "";
		this.satellite_big.style.display = "";
		this.satellite_energy.style.display = "";
		this.flak.style.display = "";
		this.lab.style.display = "";
		this.upgrade_lab.style.display = "";
		this.upgrade_tower.style.display = "";
		this.upgrade_satellite_faster.style.display = "";
		this.upgrade_satellite_firerate.style.display = "";
	}
}

/**
 * Enable/Disable Button for the current Money
 */
function checkButtonForCost() {
	var allButton = document.getElementsByClassName("newButton");

	for ( var i = 0; i < allButton.length - 1; i++) {
		switch (allButton[i].id) {
		case "satellite-small":
			allButton[i].disabled = Cost.Satellite_small > Game.money;
			break;
		case "satellite-big":
			allButton[i].disabled = Cost.Satellite_big > Game.money;
			break;
		case "satellite-energy":
			allButton[i].disabled = Cost.Satellite_shield > Game.money;
			break;
		case "flak":
			allButton[i].disabled = Cost.Flak > Game.money;
			break;
		case "lab":
			allButton[i].disabled = Cost.Lab > Game.money;
			break;
		case "upgrade-lab":
			allButton[i].disabled = Cost.Upgrade_Lab > Game.money;
			break;
		case "upgrade-tower":
			allButton[i].disabled = Cost.Upgrade_Flak > Game.money;
			break;
		case "upgrade-satellite-faster":
			allButton[i].disabled = Cost.Upgrade_Sat_faster > Game.money;
			break;
		case "upgrade-satellite-firerate":
			allButton[i].disabled = Cost.Upgrade_Sat_firerate > Game.money;
			break;
		}

	}
	;
}

function addAsteroid(x, y, big) {
	var target = new Vector(WIDTH / 2, HEIGHT / 2);

	rocks.push(new Rock(new Vector(x, y), target, big));
}

function toogleAllButton(enable) {
	var allButton = document.getElementsByClassName("newButton");
	for ( var i = 0; i < allButton.length; i++) {
		allButton[i].disabled = !enable;
	}
	;
}

function button(action) {

	switch (action) {
	case "satellite-small":
		Game.money -= Cost.Satellite_small;
		defender.push(new Satellite(new Vector(WIDTH / 2, HEIGHT / 2), 200,
				false));
		break;
	case "satellite-big":
		Game.money -= Cost.Satellite_big;
		defender.push(new Satellite(new Vector(WIDTH / 2, HEIGHT / 2), 200,
				true));
		break;
	case "satellite-energy":
		Game.money -= Cost.Satellite_energy;
		defender.push(new EnergySatellite(new Vector(WIDTH / 2, HEIGHT / 2),
				200));
		break;
	case "flak":
		Game.money -= Cost.Flak;
		toogleAllButton(false);
		log("Flak");
		// Make all Flaks selected
		towerArray.select();
		break;
	case "lab":
		Game.money -= Cost.Lab;
		break;
	case "upgrade-lab":
		break;
	case "upgrade-tower":
		break;
	case "upgrade-satellite-faster":
		break;
	case "upgrade-satellite-firerate":
		break;
	case 'animate':
		ANIMATE = !ANIMATE;
		break;
	case 'debug':
		log("Button Debug");
		checkButtonForCost();
		break;
	}
}

function buildFlak(htmlNode) {
	debug("Build flak: " + htmlNode.id);
	towerArray.build(htmlNode.id)
}

function hover(elem) {
	Tooltip.show(elem.id, elem.offsetTop);
}

function unhover(elem) {
	Tooltip.hide();
}