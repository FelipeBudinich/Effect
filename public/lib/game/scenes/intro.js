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

	ig.SceneIntro = ig.Game.extend({
		// Load a font
		font: new ig.Font('media/04b03.font.png'),
        timer: new ig.Timer(),
        // We'll set the value of this.message from main.js when we set ig.SceneIntro as the active scene.
		message: '',
		
		init: function() {
			// Initialize the scene here.
            // We'll set the timer to count 10 seconds
            this.timer.set(10);
		},
		
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
			// If the timer has elapsed then switch the scene
            if (this.timer.delta() >= 0 || ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_01);
            }
		},
		
		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			
			// Add your own drawing code here
			var x = ig.system.width / 2,
				y = ig.system.height / 2;
			
			this.font.draw(this.message, x, y - 16, ig.Font.ALIGN.CENTER);
            this.font.draw(this.timer.delta().floor(), x, y +16, ig.Font.ALIGN.CENTER);
		}
	});
});
