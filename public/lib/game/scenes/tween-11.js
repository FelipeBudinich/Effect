ig.module(
    'game.scenes.tween-11'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_11 = ig.SceneTween_01.extend({
        
        header: '11/x',
        texts: [                
            'linear',
            'minElastic',
            'lightElastic',
            'elastic',
            'strongElastic',
            'maxElastic'
            
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_12);
            }
        }
    });

});