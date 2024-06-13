ig.module(
    'game.scenes.tween'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.tween'
)
.defines(function(){
    'use strict';
    ig.SceneTween = ig.Game.extend({
        font: new ig.Font('media/04b03.font.png'),    
        tweens: [],
        oPositions: [],
        easeKeys: Object.keys(ig.Tween.ease), // Store the keys from ig.Tween.ease
        currentSet: 0, // Track the current set of easing functions
        setSize: 8, // Set size is now 7 per set

        init: function() {
            this.sectionHeight = ig.system.height / 12;

            let start = (ig.system.width / 12 ) + 36;
            let end = ((ig.system.width / 12) * 11) - 36;
            let duration = 3;
            let mode = 'oscillate';

            this.updateTweens(start, end, duration, mode);
        },

        updateTweens: function(start, end, duration, mode) {
            this.tweens = [];
            this.oPositions = [];
            
            // Always include the first key
            let firstKey = this.easeKeys[0];
            this.easeKeysSubset = [firstKey];

            // Calculate the subset of easing functions to use
            let startIndex = 1 + this.currentSet * (this.setSize - 1);
            let endIndex = startIndex + this.setSize - 1;
            let additionalKeys = this.easeKeys.slice(startIndex, endIndex);

            this.easeKeysSubset = this.easeKeysSubset.concat(additionalKeys);

            for (let i = 0; i < this.easeKeysSubset.length; i++) {
                let y = (i + 1) * this.sectionHeight;
                this.oPositions.push(start);
                let tween = new ig.Tween(start, end, duration, ig.Tween.ease[this.easeKeysSubset[i]], mode);
                this.tweens.push(tween);
            }
        },

        update: function() {
            this.parent();

            for (let i = 0; i < this.tweens.length; i++) {
                this.oPositions[i] = this.tweens[i].value;
            }
            
            if (ig.input.pressed('action')) {
                this.nextDemo();
            }
        },

        nextDemo: function() {
            this.currentSet = (this.currentSet + 1) % Math.ceil((this.easeKeys.length - 1) / (this.setSize - 1));
            let start = (ig.system.width / 12) + 36;
            let end = ((ig.system.width / 12) * 11) - 36;
            let duration = 3;
            let mode = 'oscillate';
            this.updateTweens(start, end, duration, mode);
        },

        draw: function() {
            this.parent();
            
            let x = ig.system.width / 2;
            this.font.draw(this.currentSet, x, 64, ig.Font.ALIGN.CENTER);

            for (let i = 0; i < this.tweens.length; i++) {
                let y = (i + 1) * this.sectionHeight;
                this.font.draw(this.easeKeysSubset[i], x, y + 64, ig.Font.ALIGN.CENTER);
                this.font.draw('O', this.oPositions[i], y + 80, ig.Font.ALIGN.CENTER);
            }

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
});
