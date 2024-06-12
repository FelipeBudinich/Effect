ig.module(
    'game.scenes.tween-05'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_05 = ig.SceneTween_01.extend({
        
        header: '5/x',
        texts: [                
            'linear',
            'minOvershoot',
            'lightOvershoot',
            'overshoot',
            'strongOvershoot',
            'maxOvershoot'
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_06);
            }
        }
    });

});