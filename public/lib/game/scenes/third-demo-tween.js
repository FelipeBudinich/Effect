ig.module(
    'game.scenes.third-demo-tween'
)
.requires(
     'game.scenes.first-demo-tween'
)
.defines(function(){
    'use strict';

    ig.ThirdDemoTweenScene = ig.FirstDemoTweenScene.extend({
        
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
                ig.scene.set(ig.FourthDemoTweenScene);
            }
        }
    });

});
