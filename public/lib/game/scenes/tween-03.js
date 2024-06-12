ig.module(
    'game.scenes.tween-03'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_03 = ig.SceneTween_01.extend({
        
        header: '3/x',
        texts: [                
            'linear',
            'sinusoidalInOut',
            'quadraticInOut',
            'cubicInOut',
            'quarticInOut',
            'quinticInOut',
            'exponentialInOut',
            'circularInOut'
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_04);
            }
        }
    });

});
