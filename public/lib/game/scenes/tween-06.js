ig.module(
    'game.scenes.tween-06'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_06 = ig.SceneTween_01.extend({
        
        header: '6/x',
        texts: [                
            'linear',
            'minDrift',
            'lightDrift',
            'drift',
            'strongDrift',
            'maxDrift'
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_07);
            }
        }
    });

});