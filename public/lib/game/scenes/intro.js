ig.module( 
	'game.scenes.intro' 
)
.requires(
	'impact.game',
    'impact.timer',
    'impact.font'
)
.defines(function(){
    'use strict';

	ig.IntroScene = ig.Game.extend({
		// Load a font
		font: new ig.Font('media/04b03.font.png'),
        timer: new ig.Timer(),
        // We'll set the value of this.message from main.js when we set ig.IntroScene as the active scene.
		message: '',
		
		init: function() {
			// Initialize the scene here.
            // We'll set the timer to count 5 seconds
            this.timer.set(5);
		},
		
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
			// If the timer has elapsed then switch the scene
            if (this.timer.delta() >= 0){
                ig.scene.set(ig.DemoScene, {message: "We passed data to the intro scene"});
            }
		},
		
		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			
			// Add your own drawing code here
			var x = ig.system.width / 2,
				y = ig.system.height / 2;
			
			this.font.draw(this.message, x, y, ig.Font.ALIGN.CENTER);
            this.font.draw(this.timer.delta().floor(), x, y +16, ig.Font.ALIGN.CENTER);
		}
	});
});
