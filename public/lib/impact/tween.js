ig.module(
    'impact.tween'
).defines(function () {
    'use strict';
    ig.Tween = function (start, end, duration, easeFunction, mode = 'once', callback) {
        this.start = start || 0;
        this.original = this.start;
        this.end = end || 0;
        this.duration = duration || 0;
        this.easeFunction = easeFunction || function (v) { return v; };
        this.callback = typeof callback === 'function' ? callback : function() {};
        this.mode = mode;
        this.executedCallback = false;
        this.forward = true;
        this.startTime = ig.Timer.time;
        return this;
    };

    ig.Tween.prototype.reset = function () {
        this.start = this.original;
        this.startTime = ig.Timer.time;
        this.executedCallback = false;
        this.forward = true;
    };

    ig.Tween.prototype.valueOf = function () {
        if (!this.executedCallback || this.mode === 'forever' || this.mode === 'oscillate') {
            var elapsed = ig.Timer.time - this.startTime;
            if (elapsed >= this.duration) {
                if (this.mode === 'once') {
                    this.executedCallback = true;
                    this.callback();
                    return this.end;
                } else if (this.mode === 'forever') {
                    this.startTime = ig.Timer.time;
                    this.callback();
                } else if (this.mode === 'oscillate') {
                    this.startTime = ig.Timer.time;
                    [this.start, this.end] = [this.end, this.start];
                    this.forward = !this.forward;
                    this.callback();
                }
            }
            var v = (elapsed % this.duration) / this.duration;
            v = Math.max(0, Math.min(1, v));
            v = this.easeFunction(v);
            return this.start + (this.end - this.start) * v;
        }
        return this.end;
    };

    Object.defineProperty(ig.Tween.prototype, 'value', {
        get: function() {
            return this.valueOf();
        },
        set: function(value) {
            console.warn("Setting value directly on a Tween is not supported.");
        }
    });

    Object.defineProperty(ig.Tween.prototype, 'done', {
        get: function () {
            return this.executedCallback;
        },
        set: function(value) {
            this.executedCallback = value;
        }
    });

    ig.Tween.ease = {
        // Mathematical
        linear: function (v) {
            return v;
        },
        quadraticIn: function (v) {
            return v * v;
        },
        quadraticOut: function (v) {
            return v * (2 - v);
        },
        quadraticInOut: function (v) {
            return v < 0.5 ? 2 * v * v : -1 + (4 - 2 * v) * v;
        },
        cubicIn: function (v) {
            return v * v * v;
        },
        cubicOut: function (v) {
            return (v -= 1) * v * v + 1;
        },
        cubicInOut: function (v) {
            return v < 0.5 ? 4 * v * v * v : (v - 1) * (2 * v - 2) * (2 * v - 2) + 1;
        },
        quarticIn: function (v) {
            return v * v * v * v;
        },
        quarticOut: function (v) {
            return 1 - (v -= 1) * v * v * v;
        },
        quarticInOut: function (v) {
            return v < 0.5 ? 8 * v * v * v * v : 1 - 8 * (v -= 1) * v * v * v;
        },
        quinticIn: function (v) {
            return v * v * v * v * v;
        },
        quinticOut: function (v) {
            return 1 + (v -= 1) * v * v * v * v;
        },
        quinticInOut: function (v) {
            return v < 0.5 ? 16 * v * v * v * v * v : 1 + 16 * (v -= 1) * v * v * v * v;
        },
        exponentialIn: function (v) {
            return v === 0 ? 0 : Math.pow(2, 10 * (v - 1));
        },
        exponentialOut: function (v) {
            return v === 1 ? 1 : -Math.pow(2, -10 * v) + 1;
        },
        exponentialInOut: function (v) {
            if (v === 0) {
                return 0;
            }
            if (v === 1) {
                return 1;
            }
            if ((v *= 2) < 1) {
                return 0.5 * Math.pow(2, 10 * (v - 1));
            }
            return 0.5 * (-Math.pow(2, -10 * (v - 1)) + 2);
        },
        sinusoidalIn: function (v) {
            return -Math.cos(v * Math.PI / 2) + 1;
        },
        sinusoidalOut: function (v) {
            return Math.sin(v * Math.PI / 2);
        },
        sinusoidalInOut: function (v) {
            return -0.5 * (Math.cos(Math.PI * v) - 1);
        },
        circularIn: function (v) {
            return -(Math.sqrt(1 - v * v) - 1);
        },
        circularOut: function (v) {
            return Math.sqrt(1 - ((v -= 1) * v));
        },
        circularInOut: function(v) {
            if (v < 0.5) {
                return 0.5 * (1 - Math.sqrt(1 - 4 * v * v));
            } else {
                return 0.5 * (Math.sqrt(1 - Math.pow(2 * v - 2, 2)) + 1);
            }
        },     
        // Pullback
        minPullback: function (v) {
            var s = 0.85;
            return v * v * ((s + 1) * v - s);
        },
        lightPullback: function (v) {
            var s = 1.35;
            return v * v * ((s + 1) * v - s);
        },
        pullback: function (v) {
            var s = 1.70158;
            return v * v * ((s + 1) * v - s);
        },
        strongPullback: function (v) {
            var s = 2.1482;
            return v * v * ((s + 1) * v - s);
        },
        maxPullback: function (v) {
            var s = 2.5949095;
            return v * v * ((s + 1) * v - s);
        },
        // Overshoot
        minOvershoot: function (v) {
            var s = Math.PI - 1.5;
            return (v = v - 1) * v * ((s + 1) * v + s) + 1;
        },
        lightOvershoot: function (v) {
            var s = Math.PI - 1.25;
            return (v = v - 1) * v * ((s + 1) * v + s) + 1;
        },
        overshoot: function (v) {
            var s = Math.PI - 1;
            return (v = v - 1) * v * ((s + 1) * v + s) + 1;
        },
        strongOvershoot: function (v) {
            var s = Math.PI - 0.75;
            return (v = v - 1) * v * ((s + 1) * v + s) + 1;
        },
        maxOvershoot: function (v) {
            var s = Math.PI - 0.5;
            return (v = v - 1) * v * ((s + 1) * v + s) + 1;
        },
        // Drift    
        drift: function (v) {
            var s = 2.5949095;
            if ((v *= 2) < 1) {
                return 0.5 * (v * v * ((s + 1) * v - s));
            }
            return 0.5 * ((v -= 2) * v * ((s + 1) * v + s) + 2);
        },
        softdrift: function (v) {
            var s = 1.5949095;
            if ((v *= 2) < 1) {
                return 0.5 * (v * v * ((s + 1) * v - s));
            }
            return 0.5 * ((v -= 2) * v * ((s + 1) * v + s) + 2);
        },
        // Artistic
        bounce: function (v) {
            if (v < 0.3636) {
                return 7.5625 * v * v;
            } else if (v < 0.7272) {
                return 7.5625 * (v -= 0.5454) * v + 0.75;
            } else if (v < 0.909) {
                return 7.5625 * (v -= 0.8181) * v + 0.9375;
            } else {
                return 7.5625 * (v -= 0.9545) * v + 0.984375;
            }
        },
        clock: function(v) {
            let n = Math.floor(v * 24);
            let residual = v * 24 - n;
            let direction = (n % 2 === 0) ? 1 : -1;
            let base = n * (1 / 24);
            let clockPosition = base + direction * residual * (1 / 24);
            let t = 0.5;
            return (1 - t) * v + t * clockPosition;
        },
        converge: function(v) {
            let position = Math.random()*0.99;
            let t = v;
            if (v > 0.99){
                return 1;
            } else if ( v < 0.01){
                return 0;
            } else if (v > 0.5){
                return (1 - t) * position + t * v;
            } else {
                return (1 - t) * v + t * position;
            }
        },
        deadbounce: function(v) {
            if (v < 0.3636) {
                return 7.5625 * v * v;
            } else if (v < 0.7272) {
                return 7.5625 * (v -= 0.5454) * v + 0.75;
            } else {
                return 1;
            }
        },
        elastic: function (v) {
            var a = 1,
                s = 0.1,
                p = 2.5;
            if (v === 0) {
                return 0;
            }
            if (v === 1) {
                return 1;
            }
            return (a * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) * p) + 1);
        },
        ghost: function(v) {
            const step = 0.2; // amount it moves forward
            const backStep = 0.1; // amount it moves back
            const cycleLength = step + backStep;
        
            let cycles = Math.floor(v / cycleLength);
            let cyclePos = v % cycleLength;
        
            let valueWithinCycle;
            if (cyclePos < step) {
                valueWithinCycle = cycles * cycleLength + cyclePos;
            } else {
                valueWithinCycle = cycles * cycleLength + 2 * step - cyclePos;
            }
        
            return valueWithinCycle / (1 + cycles * (step - backStep));
        }, 
        smootherstep: function(v) {
            return v * v * v * (v * (v * 6 - 15) + 10);
        },
        mechanical: function(v) {
            let n = Math.floor(v * 19);
            let residual = v * 19 - n;
            let direction = (n % 7 === 0) ? 1 : -1;
            let base = n * (1 / 19);
            let clockPosition = base + direction * residual * (1 / 19);
            let t = 0.7;
            return (1 - t) * v + t * clockPosition;
        },
        skate: function(v) {
            const waveAmplitude = 0.1; // Amplitude of the wave
            const waveFrequency = 2; // Number of full waves
        
            // Calculates the progress of the wave within one cycle
            const cycleLength = 1 / waveFrequency;
            const scaledTime = (v % cycleLength) / cycleLength;
        
            // Circular wave using the cosine function for smooth circular-like oscillation
            const lateralWave = waveAmplitude * Math.cos(scaledTime * 2 * Math.PI);
        
            // Calculate the forward motion considering the amplitude of the wave
            const forwardProgress = v * (1 - waveAmplitude);  
        
            return forwardProgress + lateralWave;
        },
        slide: function(v) {
            const waveAmplitude = 0.1;
            const waveFrequency = 2;
        
            // Calculates the progress of the wave within one cycle
            const cycleLength = 1 / waveFrequency;
            const scaledTime = (v % cycleLength) / cycleLength;
            const lateralWave = scaledTime < 0.5 
                                ? 2 * scaledTime * waveAmplitude    // Ascending part of the triangle
                                : 2 * (1 - scaledTime) * waveAmplitude;  // Descending part of the triangle
        
            // Calculate the forward motion considering the amplitude of the wave
            const forwardProgress = v * (1 - waveAmplitude);  
        
            return forwardProgress + lateralWave;
        },
        slither: function(v) {
            const amplitude = 0.05;
            const frequency = 3;
            const forwardSpeed = 1;
            let wave = Math.sin(v * Math.PI * frequency) * amplitude;
            let progress = v * forwardSpeed;
            let slitheringPosition = progress + Math.abs(wave);
        
            return slitheringPosition;
        },
        snap: function(v) {
            return v < 0.95 ? Math.pow(v, 3) : 1 - Math.pow(1 - v, 3) * 5;
        },
        spark: function(v) {
            if (v > 0.99){
                return 1;
            } else if ( v < 0.01){
                return 0;
            }
            let position = Math.random();
            let t = 0.05;
            return (1 - t) * v + t * position;
        },
        spin: function(v) {
            const waveAmplitude = 0.1; // Amplitude of the wave
            const waveFrequency = 7; // Number of full waves
        
            // Calculates the progress of the wave within one cycle
            const cycleLength = 1 / waveFrequency;
            const scaledTime = (v % cycleLength) / cycleLength;
        
            // Circular wave using the cosine function for smooth circular-like oscillation
            const lateralWave = waveAmplitude * Math.cos(scaledTime * 2 * Math.PI);
        
            // Calculate the forward motion considering the amplitude of the wave
            const forwardProgress = v * (1 - waveAmplitude);
            let t = 0.5;
            return (1 - t) * v + t * (forwardProgress + lateralWave);  
        },
        spring: function(v) {
            if (v === 0 || v === 1) return v;
            const p = 0.1; // period
            const a = 1; // amplitude
            const s = p / (2 * Math.PI) * Math.asin(1 / a);
            return (a * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) / p) + 1);
        },
        suspense: function (v){
            var s = 0.4;
            var power = 32; // Increasing the power to make the start even slower
            var modV = Math.pow(v, power);
            return modV * modV * ((s + 1) * modV - s);
        },
        swirl: function(v) {
            return Math.sin(v * Math.PI * 5) * (1 - v) * 0.5 + v;
        },
        undecided: function(v) {
            if (v < 0.8) {
                // Starts extremely slow
                return 0.5 * Math.pow(v / 0.8, 3);
            } else {
                // Accelerates very fast towards the end
                var t = (v - 0.8) / 0.2;
                return 0.5 + 0.5 * Math.pow(t, 2);
            }
        },
        wind: function(v) {
            return v + 0.05 * Math.sin(v * 3 * Math.PI) * (1 - v);
        }
    };

});