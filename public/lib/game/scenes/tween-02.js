ig.module(
    'game.scenes.tween-02'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_02= ig.SceneTween_01.extend({
        
        header: '2/x',
        texts: [                
            'linear',
            'sinusoidalOut',
            'quadraticOut',
            'cubicOut',
            'quarticOut',
            'quinticOut',
            'exponentialOut',
            'circularOut'
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_03);
            }
        }
    });

});
