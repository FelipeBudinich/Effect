ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.scenes',
	'game.entities.trigger'
)
.defines(function(){
'use strict';
ig.Main = ig.Game.extend({
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.MOUSE1, 'action' );
		ig.input.bind( ig.KEY.Z, 'action' );
	},
	
	run: function() {
		// Then we go to ig.IntroScene and pass an object to it
		ig.scene.set(ig.IntroScene, 
			{
				message: "We passed data to the intro scene\nWait, click, tap or press z to skip"
			});
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', ig.Main, 60, 320, 240, 2 );

});
