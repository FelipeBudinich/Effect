ig.module(
    'game.scenes.tween-12'
)
.requires(
     'game.scenes.tween-01'
)
.defines(function(){
    'use strict';

    ig.SceneTween_12= ig.SceneTween_01.extend({
        
        header: '12/x',
        texts: [                
            'linear',
            'minWind',
            'lightWind',
            'wind',
            'strongWind',
            'maxWind'
            
        ],
        nextDemo(){
            if (ig.input.pressed('action')){
                ig.scene.set(ig.SceneTween_01);
            }
        }
    });

});