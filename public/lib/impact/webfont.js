ig.module(
    'impact.webfont'
)
.requires(
    'impact.impact'
)
.defines(function() {
    "use strict";

    ig.WebFont = ig.Class.extend({
        fontFamily: null,
        path: null,
        loaded: false,
        onload: null,

        init: function(fontFamily, path, onloadCallback) {
            this.fontFamily = fontFamily;
            this.path = path;
            this.onload = onloadCallback || null;
            ig.resources.push(this);
            this.load();
        },

        load: function() {
            // Create a style element to inject @font-face style
            var style = document.createElement('style');
            document.head.appendChild(style);
            var fontFaceRule = `@font-face {
                font-family: '${this.fontFamily}';
                src: url('${this.path}');
            }`;
            style.sheet.insertRule(fontFaceRule, 0);

            // Use the Font Loading API to load the font
            document.fonts.load(`1em ${this.fontFamily}`).then(function(fonts) {
                if (fonts.length >= 1) {
                    this.loaded = true;
                    if (this.onload) {
                        this.onload();
                    }
                } else {
                    throw new Error('Font failed to load: ' + this.path);
                }
            }.bind(this));
        }
    });
});
