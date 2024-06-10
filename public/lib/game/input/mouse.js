ig.module("game.input.mouse").defines(function () {
    ig.Mouse = ig.Class.extend({
        staticInstantiate: function (a) {
            this.alias("mouse");
            return ig.Mouse.instance || null
        },
        alias: function (a) {
            Object.defineProperty(ig, a, {
                value: this
            });
        },
        init: function () {
            ig.Mouse.instance = this;
            ig.input.initMouse();
            ig.input.bind(ig.KEY.MOUSE1, "click");
            ig.input.bind(ig.KEY.MOUSE2, "right-click");
            ig.system.canvas.focus();
            ig.input.bindTouch("#canvas", "click");
            ig.system.canvas.addEventListener("mouseover", function () {
                ig.Mouse.overCanvas = !0
            }, !1);
            ig.system.canvas.addEventListener("mouseout", function () {
                ig.Mouse.overCanvas = !1
            }, !1);
            ig.system.canvas.addEventListener("contextmenu", function (a) {
                a.preventDefault();
            }, !1);
        },
        setCursorStyle: function (a) {
            if (!ig.ua.mobile) {
                var b = document.getElementById("canvas");
                "undefined" !== typeof b && null !== b && (b.style.cursor = "none" === a ? a : "url('css/" + a + "-cursor.png'), " + a)
            }
        },
        getMousePosition: function () {
            return {
                x: ig.input.mouse.x + ig.game.screen.x,
                y: ig.input.mouse.y + ig.game.screen.y
            };
        },
        isOverCanvas: function () {
            return ig.Mouse.overCanvas;
        }
    });
    ig.Mouse.overCanvas = !0
});