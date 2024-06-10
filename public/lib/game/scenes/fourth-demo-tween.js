ig.module(
    'game.scenes.fourth-demo-tween'
)
.requires(
     'game.scenes.first-demo-tween'
)
.defines(function(){
    'use strict';

    ig.FourthDemoTweenScene = ig.FirstDemoTweenScene.extend({
        
        header: '4/x',
        texts: [                
            'linear',
            'minPullback',
            'lightPullback',
            'pullback',
            'strongPullback',
            'maxPullback'
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.FifthDemoTweenScene);
            }
        }
    });

});
