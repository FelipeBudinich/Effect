ig.module(
    "game.input"
).requires(
    "impact.game", 
    "game.input.mouse"
).defines(function () {
    ig.InputSetup = ig.Class.extend({
        init: function () {
            new ig.Mouse();
            ig.input.bind( ig.KEY.MOUSE1, 'action' );
            ig.input.bind( ig.KEY.Z, 'action' );
        },
        staticInstantiate: function (a) {
            return ig.InputSetup.instance || null
        }
    })
});