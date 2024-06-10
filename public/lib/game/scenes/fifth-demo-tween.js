ig.module(
    'game.scenes.fifth-demo-tween'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.tween'
)
.defines(function(){
    'use strict';

    ig.FifthDemoTweenScene = ig.Game.extend({
        
        font: new ig.Font('media/04b03.font.png'),
        tweens: [],
        oPositions: [],

        init: function() {
            var screenHeight = ig.system.height;
            var sectionHeight = screenHeight / 5;
            var oXStart = (ig.system.width / 12 ) +24;
            var oXEnd = ((ig.system.width / 12)*11) - 24;

            this.texts = [
                'Sinusoidal In',
                'Sinusoidal  Out',
                'Sinusoidal InOut',
                'Reference - Linear',
            ];

            var easingFunctions = [
                ig.Tween.ease.sinusoidalIn,
                ig.Tween.ease.sinusoidalOut,
                ig.Tween.ease.sinusoidalInOut,
                ig.Tween.ease.linear
            ];

            for (var i = 0; i < this.texts.length; i++) {
                var y = (i + 1) * sectionHeight - 16 + 12;
                this.oPositions.push(oXStart);
                let tween = new ig.Tween(oXStart, oXEnd, 3, easingFunctions[i], 'oscillate');
                this.tweens.push(tween);
            }

        },
        
        update: function() {
            this.parent();

            for (var i = 0; i < this.tweens.length; i++) {
                this.oPositions[i] = this.tweens[i].value;
            }

            if (ig.input.pressed('action')){
                ig.scene.set(ig.SixthDemoTweenScene);
            }
        },
        
        draw: function() {
            this.parent();

            var sectionHeight = ig.system.height / 5;
            var x = ig.system.width / 2;

            for (var i = 0; i < this.texts.length; i++) {
                var y = (i + 1) * sectionHeight - 16;
                this.font.draw(this.texts[i], x, y + 12, ig.Font.ALIGN.CENTER);
                this.font.draw('O', this.oPositions[i], y + 24, ig.Font.ALIGN.CENTER);
            }

            this.font.draw('5/x', x, 24, ig.Font.ALIGN.CENTER);
        }
    });

});
