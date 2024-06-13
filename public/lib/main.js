ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	"game.input",
	'game.scenes',
	'game.entities.trigger'
)
.defines(function(){
'use strict';
ig.Main = ig.Game.extend({
	
	init: function() {
		// Initialize your game here; bind keys etc.
		new ig.InputSetup();
	},
	
	run: function() {
		this.parent();
		// Then we go to ig.Intro Scene and pass an object to it
		//ig.scene.set(ig.SceneIntro, { message: "We passed data to the intro scene\nWait, click, tap or press z to skip" });
	},

	draw: function(){
		this.parent();
		this.safeZone();
	},
	safeZone: function(){
		var ctx = ig.system.context;
		var margin = 64;
		// Adjust x and y to center the rectangle
		var x = margin + (ig.system.realWidth - 2 * margin) / 2;
		var y = margin + (ig.system.realHeight - 2 * margin) / 2;
		var width = ig.system.realWidth - 2 * margin; // Canvas width minus twice the margin
		var height = ig.system.realHeight - 2 * margin; // Canvas height minus twice the margin

		// Adjust x and y to the top-left corner of the centered rectangle
		x -= width / 2;
		y -= height / 2;
			
		ctx.strokeStyle = 'red'; // Set the color of the rectangle
		ctx.lineWidth = 1; // Set the line width of the rectangle
		ctx.strokeRect(x, y, width, height); // Draw the rectangle outline
	}
});

ig.init = function () {
	ig.init.scaleCanvas();
	ig.Sound.channels = 2;
	ig.main("#canvas", ig.Main, 60, 288, 576, 2);
	window.addEventListener("resize", ig.init.scaleCanvas, false);
};

/*ig.init.scaleCanvas = function () {
	var width = 288,
		height = 576,
		a = document.getElementById("canvas"),
		b = Math.min(window.innerWidth / width, window.innerHeight / height);
	a.style.width = width * b + "px";
	a.style.height = height * b + "px"
};*/

ig.init.scaleCanvas = function () {
    var canvas = document.getElementById('canvas');
    var maxCropping = 128; // Max cropping set to 64 pixels per side
    var originalWidth = 288;
    var originalHeight = 576;
    var canvasRatio = originalWidth / originalHeight;

    var windowRatio = window.innerWidth / window.innerHeight;

    var scale = Math.min(window.innerWidth / originalWidth, window.innerHeight / originalHeight);

    var targetWidth = originalWidth * scale;
    var targetHeight = originalHeight * scale;

    if (windowRatio > canvasRatio) {
        // Window is wider than the canvas
        targetWidth = Math.min(window.innerWidth, targetWidth + maxCropping);
        scale = targetWidth / originalWidth;
        targetHeight = originalHeight * scale;
    } else {
        // Window is taller than the canvas
        targetHeight = Math.min(window.innerHeight, targetHeight + (maxCropping*2));
        scale = targetHeight / originalHeight;
        targetWidth = originalWidth * scale;
    }

    canvas.style.width = targetWidth + 'px';
    canvas.style.height = targetHeight + 'px';
};

return ig.init()
});
