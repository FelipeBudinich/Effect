ig.module(
    'game.scenes.first-demo-tween'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.tween' // Ensure tween is included
)
.defines(function(){
    'use strict';

    ig.FirstDemoTweenScene = ig.Game.extend({
        
        // Load a font
        font: new ig.Font('media/04b03.font.png'),
        
        // Initialize tween array
        tweens: [],
        oPositions: [],

        init: function() {
            var screenHeight = ig.system.height;
            var sectionHeight = screenHeight / 5;
            var oXStart = (ig.system.width / 12 ) +24;
            var oXEnd = ((ig.system.width / 12)*11) - 24;

            // Texts for each section
            this.texts = [
                'Quadratic In',
                'Quadratic Out',
                'Quadratic InOut',
                'Reference - Linear',
            ];

            var easingFunctions = [
                ig.Tween.ease.quadraticIn,
                ig.Tween.ease.quadraticOut,
                ig.Tween.ease.quadraticInOut,
                ig.Tween.ease.linear
            ];

            // Initialize tweens and positions
            for (var i = 0; i < this.texts.length; i++) {
                var y = (i + 1) * sectionHeight - 16 + 12;  // y position for "O"
                this.oPositions.push(oXStart);

                // Create a new tween
                let tween = new ig.Tween(oXStart, oXEnd, 3, easingFunctions[i], 'oscillate');

                // Push the newly created tween to the tweens array
                this.tweens.push(tween);
            }

        },
        
        update: function() {
            // Update all entities and backgroundMaps
            this.parent();

            // Update each tween and position
            for (var i = 0; i < this.tweens.length; i++) {
                this.oPositions[i] = this.tweens[i].value;
            }

            if (ig.input.pressed('action')){
                ig.scene.set(ig.SecondDemoTweenScene);
            }
        },
        
        draw: function() {
            // Draw all entities and backgroundMaps
            this.parent();

            var sectionHeight = ig.system.height / 5;
            var x = ig.system.width / 2;

            // Draw Texts for each section
            // and "O" characters
            for (var i = 0; i < this.texts.length; i++) {
                var y = (i + 1) * sectionHeight - 16;
                this.font.draw(this.texts[i], x, y + 12, ig.Font.ALIGN.CENTER);
                this.font.draw('O', this.oPositions[i], y + 24, ig.Font.ALIGN.CENTER);
            }

            this.font.draw('1/x', x, 24, ig.Font.ALIGN.CENTER);
        }
    });

});
