ig.module( 
	'game.scenes.intro' 
)
.requires(
	'impact.game',
    'impact.font'
)
.defines(function(){
    'use strict';

	ig.IntroScene = ig.Game.extend({
		// Load a font
		font: new ig.Font('media/04b03.font.png'),
		message: '',
		
		init: function() {
			// Initialize the scene here.
		},
		
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
			// Add your own, additional update code here
		},
		
		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			
			// Add your own drawing code here
			var x = ig.system.width / 2,
				y = ig.system.height / 2;
			
			this.font.draw(this.message, x, y, ig.Font.ALIGN.CENTER);
		}
	});
});
