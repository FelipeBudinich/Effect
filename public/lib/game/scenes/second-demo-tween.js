ig.module(
    'game.scenes.second-demo-tween'
)
.requires(
     'game.scenes.first-demo-tween'
)
.defines(function(){
    'use strict';

    ig.SecondDemoTweenScene = ig.FirstDemoTweenScene.extend({
        
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
                ig.scene.set(ig.ThirdDemoTweenScene);
            }
        }
    });

});
