var tick_count = 0;
var time = Date.now();
var delta = 0;

var defender = new Array();
var towerArray;
var rocks = new Array();
var bullets = new Array();
var mothership = new Mothership(new Vector(100, 100));

var t_rotate = 0;
var c_earth = 0;

var ASTEROIDS = true;
var ANIMATE = false;
function loop(timestamp) {
	if(delta > 200)
		delta = DELTA_TARGET;
	
	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	//#################### UPDATE ##########################
	if(ASTEROIDS)
		Spawner.update(delta);

	if (ANIMATE) {
		Moon.update(delta);
		Sun.update(delta);
		Planet.update(delta);
	}

	var objToRemove = new Array();

	for (var i = 0; i < defender.length; i++) {
		defender[i].update(delta);
	};

	for (var i = 0; i < rocks.length; i++) {
		var remove = rocks[i].update(delta);
		if (remove)
			objToRemove.push(i);
	};
	rocks.removeElements(objToRemove);

	objToRemove = new Array();
	for (var i = 0; i < bullets.length; i++) {
		remove = bullets[i].update(delta);
		if (remove)
			objToRemove.push(i);
	};
	bullets.removeElements(objToRemove);
	mothership.update(delta);
	towerArray.update(delta);
	Game.update(delta);

	if (t_rotate > 800) {
		c_earth = ++c_earth % 8;
		t_rotate = 0;
	}
	//#######################################################

	//#################### RENDER ##########################
	Planet.render();
	ctx.drawImage(img_background, 0, 0);
	drawImageCentered(img_circle, WIDTH / 2, HEIGHT / 2);
	Moon.render();
	Sun.render();
	towerArray.render();

	for (var i = 0; i < rocks.length; i++) {
		rocks[i].render();
	};
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].render();
	};
	for (var i = 0; i < defender.length; i++) {
		defender[i].render();
	};

	//mothership.render();
	ArrowAsteroids.render(delta);
	//#######################################################
	//Tooltip for Button
	Tooltip.render(delta);
	//LevelUP
	ctx.fillStyle = "#ffffff";
	ctx.font = "14px Arial";
	ctx.fillText("Levelup in: " + Math.floor(Game.levelUPTimeleft / 1000), 10, 20);
	//prints FPS
	ctx.fillStyle = "#ffff00";
	ctx.fillText("FPS: " + Math.floor(1000 / delta), WIDTH - 70, 20);


	real_ctx.clearRect(0, 0, WIDTH, HEIGHT);
	real_ctx.drawImage(buffer, 0, 0);

	//print Money & Level
	elem_level.innerHTML = "Level "+Game.level;
	elem_money.innerHTML = Game.money;
	elem_live.innerHTML = Game.live + " %";
	
	checkButtonForCost();

	//calc Delta
	delta = Date.now() - time;
	time = Date.now();
	tick_count++;

	loopID = requestAnimationFrame(loop);
}