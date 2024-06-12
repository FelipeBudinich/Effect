ig.module(
    'game.scenes.tween-04'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_04 = ig.SceneTween_01.extend({
        
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
                ig.scene.set(ig.SceneTween_05);
            }
        }
    });

});
