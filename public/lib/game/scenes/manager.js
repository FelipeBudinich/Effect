ig.module(
	'game.scenes.manager'
).requires(
	'impact.impact'
).defines(function () {
	'use strict';
	ig.SceneManager = ig.Class.extend({
		staticInstantiate: function (ignore) {
			this.alias('scene');
			return ig.SceneManager.instance || null;
		},
		alias: function (name) {
			Object.defineProperty(ig, name, {
				value: this
			});
		},
		init: function () {
			ig.SceneManager.instance = this;
		},
		set: function (SceneClass, data) {
			if (!(SceneClass.prototype instanceof ig.Game)) {
				throw ('scene is not an instance of ig.Game');
			}
			ig.system.setGameNow = function(gameClass) {
				ig.game = new gameClass();
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						ig.game[key] = data[key];
					}
				}
				ig.system.setDelegate(ig.game);
			};
			ig.system.setGame(SceneClass);
		}
	});
	return new ig.SceneManager();
});