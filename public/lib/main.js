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
		ig.scene.set(ig.SceneIntro, { message: "We passed data to the intro scene\nWait, click, tap or press z to skip" });
	},

	draw: function(){
		this.parent();
	},
});

ig.init = function () {
	ig.init.scaleCanvas();
	ig.Sound.channels = 2;
	ig.main("#canvas", ig.Main, 60, 288, 576, 2);
	window.addEventListener('resize', () => ig.init.scaleCanvas(), false);

};

ig.init.scaleCanvas = function () {
    var canvas = document.getElementById('canvas');
    var maxCropping = 64; // Max cropping set to 64 pixels per side
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
