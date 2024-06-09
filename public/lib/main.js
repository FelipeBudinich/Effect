ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.scenes',
	'game.scenes.manager', 
	'game.entities.trigger'
)
.defines(function(){
'use strict';
ig.Main = ig.Game.extend({
	
	init: function() {
		// Initialize your game here; bind keys etc.
	},
	
	run: function() {
		// Then we go to ig.IntroScene and pass an object to it
		ig.scene.set(ig.IntroScene, {message: "We passed data to the intro scene"});
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', ig.Main, 60, 320, 240, 2 );

});
