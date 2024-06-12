ig.module(
    'game.scenes.tween-09'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_09 = ig.SceneTween_01.extend({
        
        header: '9/x',
        texts: [                
            'linear',
            'minSpark',
            'spark',
            'maxSpark',
            'minConverge',
            'converge',
            'maxConverge',
            
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_10);
            }
        }
    });

});