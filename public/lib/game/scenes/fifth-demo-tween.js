ig.module(
    'game.scenes.fifth-demo-tween'
)
.requires(
     'game.scenes.first-demo-tween'
)
.defines(function(){
    'use strict';

    ig.FifthDemoTweenScene = ig.FirstDemoTweenScene.extend({
        
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
                ig.scene.set(ig.SixthDemoTweenScene);
            }
        }
    });

});