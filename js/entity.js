function Satellite(center, radius, big) {
	var ATTACK_DIST = 200;
	var COOLDOWN = big ? 250 : 1000;
	var cooldown = COOLDOWN;
	var SPEED = 0.0006;

	this.center = center;
	this.radius = radius;
	this.big = big;
	this.x = 0
	this.y = 0;
	this.angle = 0;

	this.update = function(delta) {
		this.x = Math.sin(this.angle) * radius;
		this.y = -Math.cos(this.angle) * radius;

		this.angle += delta * SPEED;
		if (this.angle > 2 * Math.PI)
			this.angle -= 2 * Math.PI;

		var posX = center.x + this.x;
		var posY = center.y + this.y;

		cooldown -= delta;
		//Check for near Rocks
		if (cooldown < 0) {
			for (var i = 0; i < rocks.length; i++) {
				var rockPos = rocks[i].getPos();
				var dist = rockPos.distanceTo(posX, posY);

				if (dist < ATTACK_DIST) {
					//log("Attacking Rock Nr." + i);

					var pos = new Vector(posX, posY);

					var dir = calcIntersect(rocks[i].pos, rocks[i].dir, 1, pos, 1);
					bullets.push(new Bullet(pos, dir));

					//only attack one enemy per round
					cooldown = COOLDOWN;
					break;
				}
			}
		}
	}

	this.render = function() {
		var posX = center.x + this.x;
		var posY = center.y + this.y;

		if (big)
			drawImageCentered(img_satellite_40, posX, posY);
		else
			drawImageCentered(img_satellite_20, posX, posY);

		//ctx.fillStyle = "rgba(255,255,0,20)";
		//drawCircle(posX, posY, ATTACK_DIST);
	}

	this.setSpeed = function(s) {
		SPEED = s;
	}
}
function EnergySatellite(center, radius) {
	this.center = center;
	this.radius = radius;
	this.x = 0
	this.y = 0;
	this.angle = 0;
	this.timeleft = 1000;
	var SPEED = 0.0006;
	var MONEY = 10;

	this.update = function(delta) {
		this.x = Math.sin(this.angle) * radius;
		this.y = -Math.cos(this.angle) * radius;

		this.angle += delta * SPEED;
		if (this.angle > 2 * Math.PI)
			this.angle -= 2 * Math.PI;

		var posX = center.x + this.x;
		var posY = center.y + this.y;
		
		this.timeleft -= delta;
		if(this.timeleft < 0){
			this.timeleft = 1000;
			Game.money += MONEY;
		}
	}

	this.render = function() {
		var posX = center.x + this.x;
		var posY = center.y + this.y;

		drawImageCentered(img_satellite_money_20, posX, posY);
	}

	this.setSpeed = function(s) {
		speed = s;
	}
}

function Mothership(position) {
	var MAX_MOVE_FROM_ORIGIN = 5;

	var minBorder = new Vector(position.x - MAX_MOVE_FROM_ORIGIN, position.y - MAX_MOVE_FROM_ORIGIN);
	var maxBorder = new Vector(position.x + MAX_MOVE_FROM_ORIGIN, position.y + MAX_MOVE_FROM_ORIGIN);
	var pos = position;
	var dir = randomVector();
	this.remove = false;
	var speed = 0.005;
	var changeDir = 1000;

	this.update = function(delta) {
		changeDir -= delta;
		if (changeDir < 0) {
			changeDir = 1000;
			dir = randomVector();
			dir.normalize();
		}

		pos.x += dir.x * speed * delta;
		pos.y += dir.y * speed * delta;

		if (pos.x < minBorder.x || pos.x > maxBorder.x)
			dir.x = -dir.x;

		if (pos.y < minBorder.y || pos.y > maxBorder.y)
			dir.y = -dir.y;

	}

	this.render = function() {
		drawImageCentered(img_mothership, pos.x, pos.y);
	}
}

function Bullet(pos, dir, size) {
	this.dir = dir;
	this.pos = pos;
	this.remove = false;
	this.speed = 1;
	this.size = 3;

	this.update = function(delta) {
		this.pos.x += this.dir.x * this.speed * delta;
		this.pos.y += this.dir.y * this.speed * delta;

		for (var i = 0; i < rocks.length; i++) {
			var rockPos = rocks[i].getPos();

			if (rockPos.distanceToVec(this.pos) < rocks[i].size) {
				rocks[i].kill();
				this.remove = true;
			}
		}
		if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > WIDTH || this.pos.y > HEIGHT)
			this.remove = true;

		return this.remove;
	}

	this.render = function() {
		ctx.fillStyle = "#ff0000";

		fillCircle(pos.x, pos.y, this.size);
	}
}

function Rock(pos, target, big) {
	this.target = target;
	this.pos = pos;
	this.big = big;
	this.remove = false;
	this.size = big ? 40 : 20;

	this.speed = 0.03;
	this.dir = new Vector(target.x - pos.x, target.y - pos.y);
	this.dir.normalize();
	this.dir.multiply(this.speed);

	this.update = function(delta) {
		pos.x += this.dir.x * delta;
		pos.y += this.dir.y * delta;

		if (this.pos.distanceToVec(this.target) < 100) {
			Game.live -= 1;
			this.remove = true;
		}

		return this.remove;
	}

	this.render = function() {
		if (big)
			drawImageCentered(img_asteroid_40, this.pos.x, this.pos.y);
		else
			drawImageCentered(img_asteroid_20, this.pos.x, this.pos.y);
	}

	this.getPos = function() {
		return this.pos;
	}

	this.kill = function() {
		this.remove = true;

		if (big) {
			Game.money += 5;
			rocks.push(new Rock(new Vector(this.pos.x - 12, this.pos.y - 12), this.target, false));
			rocks.push(new Rock(new Vector(this.pos.x - 12, this.pos.y + 12), this.target, false));
			rocks.push(new Rock(new Vector(this.pos.x + 12, this.pos.y - 12), this.target, false));
			rocks.push(new Rock(new Vector(this.pos.x + 12, this.pos.y + 12), this.target, false));
		} else
			Game.money += 1;
	}
}

function TowerArray() {
	var createTower = function(id) {
		var but = document.getElementById(id);
		return new Tower(but.offsetLeft, but.offsetTop, getRotation(but), but);
	}
	var array = new Array();
	array.push(createTower("flak0L"));
	array.push(createTower("flak0"));
	array.push(createTower("flak0R"));
	array.push(createTower("flak1L"));
	array.push(createTower("flak1"));
	array.push(createTower("flak1R"));
	array.push(createTower("flak2L"));
	array.push(createTower("flak2"));
	array.push(createTower("flak2R"));
	array.push(createTower("flak3L"));
	array.push(createTower("flak3"));
	array.push(createTower("flak3R"));

	this.select = function() {
		for (var i = 0; i < array.length; i++)
			array[i].select();
	}
	this.deselect = function() {
		for (var i = 0; i < array.length; i++)
			array[i].deselect();
	}
	this.build = function(flakName) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].name == flakName)
				array[i].build();
		}
		toogleAllButton(true);
		this.deselect();
	}

	this.render = function() {
		for (var i = 0; i < array.length; i++) {
			array[i].render();
		};
	}
	this.update = function(delta) {
		for (var i = 0; i < array.length; i++) {
			array[i].update(delta);
		};
	}
}

function Tower(x, y, angle, htmlNode) {
	var bullet_dx;
	var bullet_dy;
	var BULLET_DIST = 8;

	var init = function(angle) {
		var x = Math.sin(angle);
		var y = -Math.cos(angle);
		dir = new Vector(x, y);
		dir.normalize();

		x = Math.sin(angle + Math.PI / 2);
		y = -Math.cos(angle + Math.PI / 2);
		var ortho = new Vector(x, y);
		ortho.normalize();
		bullet_dx = ortho.x * BULLET_DIST;
		bullet_dy = ortho.y * BULLET_DIST;
	}
	var ATTACK_DIST = 75;
	var cooldown = 100;
	var COOLDOWN = 300;
	var active = false;
	var dir;
	this.name = htmlNode.id;
	this.htmlNode = htmlNode;
	init(angle);

	this.pos = new Vector(x, y);

	this.select = function() {
		if (active)
			return;

		htmlNode.classList.remove("inactive");
		htmlNode.classList.add("selected");
		htmlNode.disabled = false;
	}
	this.deselect = function() {
		if (active)
			return;

		htmlNode.classList.remove("selected");
		htmlNode.classList.add("inactive");
		htmlNode.disabled = true;
	}
	this.build = function() {
		active = true;
		htmlNode.disabled = true;
		htmlNode.classList.remove("inactive");
		htmlNode.classList.add("active");
	}
	this.render = function() {
		if (!active)
			return;
		//ctx.fillStyle = "rgba(255,255,0,20)";
		//drawCircle(this.pos.x, this.pos.y, ATTACK_DIST);
	}

	this.update = function(delta) {
		if (!active)
			return;
		cooldown -= delta;
		//Check for near Rocks
		if (cooldown < 0) {
			for (var i = 0; i < rocks.length; i++) {
				var rockPos = rocks[i].getPos();
				var dist = rockPos.distanceTo(this.pos.x, this.pos.y);

				if (dist < ATTACK_DIST) {
					bullets.push(new Bullet(new Vector(this.pos.x + bullet_dx, this.pos.y + bullet_dy), dir, 2));
					bullets.push(new Bullet(new Vector(this.pos.x - bullet_dx, this.pos.y - bullet_dy), dir, 2));

					//only attack one enemy per round
					cooldown = COOLDOWN;
					break;
				}
			}
		}
	}
}

var Planet = {
	x : 0,
	y : HEIGHT / 2 - 100,

	update : function(delta) {
		this.x += delta / 50;

		if (this.x > 600)
			this.x = 0;

	},

	render : function() {
		ctx.drawImage(img_planet, this.x, this.y);
		ctx.drawImage(img_planet, this.x - 600, this.y);
	}
}

var Moon = {
	center : new Vector(WIDTH / 2, HEIGHT / 2),
	radius : 400,
	x : -1000,
	y : -1000,
	angle : Math.PI / 2,
	speed : 0.0001,

	update : function(delta) {
		this.x = Math.sin(this.angle) * this.radius;
		this.y = -Math.cos(this.angle) * this.radius;

		this.angle += delta * this.speed;
		if (this.angle > 2 * Math.PI)
			this.angle -= 2 * Math.PI;
	},

	render : function() {
		var posX = this.center.x + this.x;
		var posY = this.center.y + this.y;

		drawImageCentered(img_moon, posX, posY);
	}
}
var Sun = {
	center : new Vector(WIDTH / 2, HEIGHT / 2),
	radius : 650,
	x : -1000,
	y : -1000,
	angle : Math.PI * 3 / 2,
	speed : 0.00004,
	style_rotation : null,

	init : function() {
		this.style_rotation = document.getElementById("planet_shade").style;
	},

	update : function(delta) {
		this.x = Math.sin(this.angle) * this.radius;
		this.y = -Math.cos(this.angle) * this.radius;

		this.angle += delta * this.speed;
		if (this.angle > 2 * Math.PI)
			this.angle -= 2 * Math.PI;
			
		var deg =	this.angle * (180/Math.PI);
		this.style_rotation.webkitTransform = "rotate(" + deg + "deg)";
		this.style_rotation.MozTransform = "rotate(" + deg + "deg)";
		this.style_rotation.msTransform = "rotate(" + deg + "deg)";
	},

	render : function() {
		var posX = this.center.x + this.x;
		var posY = this.center.y + this.y;

		drawImageCentered(img_sun, posX, posY);
	}
}