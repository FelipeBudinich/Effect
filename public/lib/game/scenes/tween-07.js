ig.module(
    'game.scenes.tween-07'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_07 = ig.SceneTween_01.extend({
        
        header: '7/x',
        texts: [                
            'linear',
            'oneBounce',
            'twoBounce',
            'fourBounce',
            'minBouncy',
            'bouncy',
            'maxBouncy'
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_08);
            }
        }
    });

});