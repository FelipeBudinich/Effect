ig.module(
    'game.scenes.tween-10'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_10 = ig.SceneTween_01.extend({
        
        header: '10/x',
        texts: [                
            'linear',
            'minSnap',
            'snap',
            'maxSnap',
            'minSuspense',
            'suspense',
            'maxSuspense'
            
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_11);
            }
        }
    });

});