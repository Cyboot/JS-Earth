function log(msg) {
	console.log(msg);
}

function debug(msg) {
	console.debug(msg);
}

function warn(msg) {
	console.warn(msg);
}

function error(msg) {
	console.error(msg);
}

function loadImage(name) {
	var img = new Image();
	img.src = "img/" + name;
	return img;
}

function Vector(x, y) {
	this.x = x;
	this.y = y;

	this.set = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.multiply = function(factor) {
		this.x *= factor;
		this.y *= factor;
	}

	this.normalize = function() {
		var length = this.length();

		this.x /= length;
		this.y /= length;
	}
	this.length = function() {
		return Math.sqrt(x * x + y * y);
	}

	this.distanceToVec = function(other) {
		return Math.sqrt(Math.pow(other.x - this.x, 2)
				+ Math.pow(other.y - this.y, 2));
	}
	this.distanceTo = function(x, y) {
		return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
	}
}

function drawImageCentered(img, x, y) {
	var width = img.width;
	var height = img.height;

	ctx.drawImage(img, x - width / 2, y - height / 2);
}

/**
 * draws an image from an 1 dimensional spritesheet (all frames must be
 * quadratic)
 */
function drawSpriteSheetImage(img_spritesheet, x, y, frameNr) {
	var height = img_spritesheet.height;

	ctx.drawImage(img_spritesheet, height * frameNr, 0, height, height, x - height
			/ 2, y - height / 2, height, height);

}

function drawCircle(x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, Math.PI, 0);
	ctx.arc(x, y, radius, 0, Math.PI);
	ctx.stroke();
}

function fillCircle(x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function getRotation(el) {
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("-webkit-transform")
			|| st.getPropertyValue("-moz-transform")
			|| st.getPropertyValue("-ms-transform")
			|| st.getPropertyValue("-o-transform")
			|| st.getPropertyValue("transform") || "fail...";

	var values = tr.split('(')[1];
	values = values.split(')')[0];
	values = values.split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	var scale = Math.sqrt(a * a + b * b);

	// arc sin, convert from radians to degrees, round
	// DO NOT USE: see update below
	var sin = b / scale;
	// var angle = Math.round(Math.asin(sin) * (180 / Math.PI));
	var angleRad = Math.atan2(b, a);

	if (angleRad < 0)
		angleRad += Math.PI * 2;
	var angleDeg = angleRad * (180 / Math.PI);

	// console.log('Rotate: ' + angleDeg + ' deg ('+angleRad+')');
	return angleRad;
}

/**
 * Calculates the intersection between to linear moving things (moving target=
 * U, moving bullet = V)
 * 
 * @param {Vector} Upos Position of U (target)
 * @param {Vector} uDir Direction of U (target)
 * @param {Vector} Uspeed Speed of U (target)
 * @param {Vector} Vpos Position of V (Bullet)
 * @param {float} Vspeed Speed of V (Bullet)
 * 
 * @return direction to move to hit the target (Vdir)
 */
function calcIntersect(Upos, uDir, Uspeed, Vpos, Vspeed) {
	// add Speed to u
	var u = new Vector(uDir.x * Uspeed, uDir.y * Uspeed);

	// Vector UV
	var UV = new Vector(Upos.x - Vpos.x, Upos.y - Vpos.y);
	UV.normalize();

	// Udir in UV system
	var uDot = UV.x * u.x + UV.y * u.y;
	var uj = new Vector(uDot * UV.x, uDot * UV.y);
	var ui = new Vector(u.x - uj.x, u.y - uj.y);

	// vi must be == ui to hit target
	// Magnitude of vj
	var viMag = Math.sqrt(ui.x * ui.x + ui.y * ui.y);
	var vjMag = Math.sqrt(Vspeed * Vspeed - viMag * viMag);

	// Resulting VJ factor
	var vj = new Vector(UV.x * vjMag, UV.y * vjMag);

	// Finish result: add v = vi + vj
	var v = new Vector(ui.x + vj.x, ui.y + vj.y);

	return v;
}

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.removeElements = function(array) {
	array.reverse();
	for ( var i = 0; i < array.length; i++)
		this.remove(array[i]);
};

function randomVector() {
	return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
}

function randomInt(max, min) {
	var result = Math.floor(Math.random() * max);
	return result >= (min || 0) ? result : min;
}

function randBoolean(percent) {
	return Math.random() < (percent || 0.5);
}

String.prototype.contains = function(str) {
	return this.indexOf(str) != -1;
}
