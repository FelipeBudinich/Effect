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
		// Then we go to ig.Intro Scene and pass an object to it
		ig.scene.set(ig.SceneIntro, 
			{
				message: "We passed data to the intro scene\nWait, click, tap or press z to skip"
			});
	}
});

ig.init = function () {
	ig.init.scaleCanvas();
	ig.Sound.channels = 2;
	ig.main("#canvas", ig.Main, 60, 288, 512, 2);
	window.addEventListener("resize", ig.init.scaleCanvas, !1);
};

ig.init.scaleCanvas = function () {
	var width = 288,
		height = 512,
		a = document.getElementById("canvas"),
		b = Math.min(window.innerWidth / width, window.innerHeight / height);
	a.style.width = width * b + "px";
	a.style.height = height * b + "px"
};

return ig.init()
});
