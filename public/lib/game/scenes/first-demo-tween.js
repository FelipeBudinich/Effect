ig.module(
    'game.scenes.first-demo-tween'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.tween'
)
.defines(function(){
    'use strict';

    ig.FirstDemoTweenScene = ig.Game.extend({
        
        // Load a font
        font: new ig.Font('media/04b03.font.png'),
        
        header: '1/x',
        texts: [                
            'linear',
            'sinusoidalIn',
            'quadraticIn',
            'cubicIn',
            'quarticIn',
            'quinticIn',
            'exponentialIn',
            'circularIn'
        ],
        tweens: [],
        oPositions: [],

        init: function() {

            this.sectionHeight = ig.system.height / 12;

            let start = (ig.system.width / 12 ) + 24;
            let end = ((ig.system.width / 12) * 11) - 24;
            let duration = 3;
            let mode = 'oscillate';

            this.initTweens(start, end, duration, mode)
        },

        initTweens: function(start, end, duration, mode){
            for (let i = 0; i < this.texts.length; i++) {
                let y = (i + 1) * this.sectionHeight;
                this.oPositions.push(start);
                let tween = new ig.Tween(start, end, duration, ig.Tween.ease[this.texts[i]], mode);
                this.tweens.push(tween);
            }
        },
        
        update: function() {
            this.parent();

            for (var i = 0; i < this.tweens.length; i++) {
                this.oPositions[i] = this.tweens[i].value;
            }
            this.nextDemo();
            
        },

        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SecondDemoTweenScene);
            }
        },
        
        draw: function() {
            this.parent();
            
            var x = ig.system.width / 2;
            this.font.draw(this.header, x, 24, ig.Font.ALIGN.CENTER);

            for (var i = 0; i < this.texts.length; i++) {
                var y = (i + 1) * this.sectionHeight;
                this.font.draw(this.texts[i], x, y, ig.Font.ALIGN.CENTER);
                this.font.draw('O', this.oPositions[i], y + 16, ig.Font.ALIGN.CENTER);
            }
        }
    });

});
