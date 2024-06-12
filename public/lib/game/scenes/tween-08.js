ig.module(
   'game.scenes.tween-08'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_08 = ig.SceneTween_01.extend({
        
        header: '8/x',
        texts: [                
            'linear',
            'twentyfourClock',
            'twelveClock',
            'sixClock',
            'minRattle',
            'rattle',
            'maxRattle'
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_09);
            }
        }
    });

});