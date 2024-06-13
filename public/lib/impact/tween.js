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
        if (!this.executedCallback || this.mode === 'repeat' || this.mode === 'oscillate') {
            var elapsed = ig.Timer.time - this.startTime;
            if (elapsed >= this.duration) {
                if (this.mode === 'once') {
                    this.executedCallback = true;
                    this.callback();
                    return this.end;
                } else if (this.mode === 'repeat') {
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

    ig.Tween.ease = (function() {

        function bounceSequence(v, bounceCount) {
            const k = 7.5625;
            let intervals = [0.3636, 0.7272, 0.909, 0.9999];
            let offsets =   [0, 0.5454, 0.8181, 0.9545]; // Offsets for subtracting v
            let bases =     [0, 0.75, 0.9375, 0.984375]; // Base values to add after multiplication
    
            for (let i = 0; i < bounceCount; i++) {
                if (v < intervals[i]) {
                    return k * Math.pow((v - offsets[i]), 2) + bases[i];
                }
            }
            return 1;
        } 
        function bouncy(v, decayBase, powBase) {
            const vTransition = 0.162;
    
            if (v <= vTransition) {
                return v / vTransition * 0.95;
            }
    
            const frequency = Math.PI;
            const phase = v * 6;
            const decayFactor = (1 + Math.floor(phase)) * decayBase;
            let bounceHeight = Math.pow(powBase, decayFactor) * Math.abs(Math.sin(frequency * phase));
    
            bounceHeight = 1 - bounceHeight;
            return Math.max(0, Math.min(1, bounceHeight));
        }
        function converge(v, range) {
            let position = Math.random() * range;
            let t = v;
            if (v > 0.99) {
                return 1;
            } else if (v < 0.01) {
                return 0;
            } else if (v > 0.5) {
                return (1 - t) * position + t * v;
            } else {
                return (1 - t) * v + t * position;
            }
        }
        function drift(v, s) {
            v *= 2;
            if (v < 1) {
                return 0.5 * (v * v * ((s + 1) * v - s));
            } else {
                v -= 2;
                return 0.5 * (v * v * ((s + 1) * v + s) + 2);
            }
        }
        function elastic(v, p) {
            var a = 1,
                s = 0.1;
            if (v === 0) {
                return 0;
            }
            if (v === 1) {
                return 1;
            }
            return (a * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) * p) + 1);
        }
        function elasticSnap(v, p) {
            var a = 1,
                s = 0.1;

            var elastic = (a * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) * p) + 1);
            
            v = elastic;
            var snap = Math.pow(v, 2) * Math.pow(v, 2) * ((s + 1) * Math.pow(v, 2) - s);
    
            return 1 * (1 - v) * snap * v * v + 1 * v;
        }
        function mechanical(v, subdivisions) {
            let n = Math.floor(v * subdivisions);
            let residual = v * subdivisions - n;
            let direction = (n % 2 === 0) ? 1 : -1;
            let base = n * (1 / subdivisions);
            let clockPosition = base + direction * residual * (1 / subdivisions);
            let t = 0.5;
            return (1 - t) * v + t * clockPosition;
        }
        function overshoot(v, sOffset) {
            const s = Math.PI - sOffset;
            v = v - 1;
            return v * v * ((s + 1) * v + s) + 1;
        }
        function pull(v, interpolationFactor) {
            const sinusoidalOutput = 0.25 + 0.25 * Math.sin(4 * Math.PI * v - Math.PI / 2) + 0.5 * v;
            const s = 0.4;
            v = Math.pow(v, 2) * Math.pow(v, 2) * ((s + 1) * Math.pow(v, 2) - s);

            return interpolationFactor * (1 - v) * sinusoidalOutput + (1 - interpolationFactor) * v * v + interpolationFactor * v;
        }
        function pullback(v, strength) {
            const t = v * v;
            return t * ((strength + 1) * v - strength);
        }
        function punch(v, s) {
            var pullback = v * v * ((s + 1) * v - s);
            v = Math.pow(v, 2) * Math.pow(v, 2) * ((s + 1) * Math.pow(v, 2) - s);
            return 1 * (1 - v) * pullback * v * v + 1 * v;
        }
        function rattle(v, t) {
            let n = Math.floor(v * 23);
            let residual = v * 23 - n;
            let direction = (n % 7 === 0) ? 1 : -1;
            let base = n * (1 / 23);
            let rattlePosition = base + direction * residual * (1 / 23);
            return (1 - t) * v + t * rattlePosition;
        }
        function row(v, waveAmplitude) {
            const waveFrequency = 1.5;
            const cycleLength = 1 / waveFrequency;
            const scaledTime = (v % cycleLength) / cycleLength;
            const lateralWave = scaledTime < 0.5
                                ? 2 * scaledTime * waveAmplitude 
                                : 2 * (1 - scaledTime) * waveAmplitude;
            const forwardProgress = v * (1 - waveAmplitude);
            return forwardProgress + lateralWave;
        }
        function slither(v, amplitude, frequency) {
            const forwardSpeed = 1;
            let wave = Math.sin(v * Math.PI * frequency) * amplitude;
            let progress = v * forwardSpeed;
            let slitheringPosition = progress + Math.abs(wave);
    
            return slitheringPosition;
        }
        function skate(v, waveAmplitude) {
            const waveFrequency = 2;
            const cycleLength = 1 / waveFrequency;
            const scaledTime = (v % cycleLength) / cycleLength;
            const lateralWave = waveAmplitude * Math.cos(scaledTime * 2 * Math.PI);
            const forwardProgress = v * (1 - waveAmplitude);
            return forwardProgress + lateralWave;
        }
        function snap(v, threshold) {
            if (v < threshold) {
                return Math.pow(v, 3);
            } else {
                return 1 - Math.pow(1 - v, 3) * 5;
            }
        }
        function spark(v, t) {
            if (v > 0.99) {
                return 1;
            } else if (v < 0.01) {
                return 0;
            }
            let position = Math.random();
            return (1 - t) * v + t * position;
        }
        function spin(v, amplitude, frequency) {
            const cycleLength = 1 / frequency;
            const scaledTime = (v % cycleLength) / cycleLength;
            const lateralWave = amplitude * Math.cos(scaledTime * 2 * Math.PI);
            const forwardProgress = v * (1 - amplitude);
            let t = 0.5;
            return (1 - t) * v + t * (forwardProgress + lateralWave);
        }
        function spring(v, p, a) {
            if (v === 0 || v === 1) return v;
            const s = p / (2 * Math.PI) * Math.asin(1 / a);
            return (a * Math.pow(4.5, -10 * v) * Math.sin((v - s) * (2 * Math.PI) / p) + 1);
        }
        function suspense(v, power) {
            var s = 0.4;
            var modV = Math.pow(v, power);
            return modV * modV * ((s + 1) * modV - s);
        }
        function swirl(v, frequency, amplitude) {
            return Math.sin(v * Math.PI * frequency) * (1 - v) * amplitude + v;
        }
        function undecided(v, power) {
            if (v < 0.8) {
                return 0.5 * Math.pow(v / 0.8, power);
            } else {
                var t = (v - 0.8) / 0.2;
                return 0.5 + 0.5 * Math.pow(t, 2);
            }
        }
        function wind(v, strength) {
            return v + strength * Math.sin(v * 3 * Math.PI) * (1 - v);
        }
        // Public API
        return {
            linear: function (v) {
                return v;
            },
            //Ease In
            sinusoidalIn: function (v) {
                return -Math.cos(v * Math.PI / 2) + 1;
            },
            quadraticIn: function (v) {
                return v * v;
            },
            cubicIn: function (v) {
                return v * v * v;
            },
            quarticIn: function (v) {
                return v * v * v * v;
            },
            quinticIn: function (v) {
                return v * v * v * v * v;
            },
            exponentialIn: function (v) {
                return v === 0 ? 0 : Math.pow(2, 10 * (v - 1));
            },
            circularIn: function (v) {
                return -(Math.sqrt(1 - v * v) - 1);
            },
            // Ease Out
            sinusoidalOut: function (v) {
                return Math.sin(v * Math.PI / 2);
            },
            quadraticOut: function (v) {
                return v * (2 - v);
            },
            cubicOut: function (v) {
                return (v -= 1) * v * v + 1;
            },
            quarticOut: function (v) {
                return 1 - (v -= 1) * v * v * v;
            },
            quinticOut: function (v) {
                return 1 + (v -= 1) * v * v * v * v;
            },
            exponentialOut: function (v) {
                return v === 1 ? 1 : -Math.pow(2, -10 * v) + 1;
            },
            circularOut: function (v) {
                return Math.sqrt(1 - ((v -= 1) * v));
            },
            //Ease InOut
            sinusoidalInOut: function (v) {
                return -0.5 * (Math.cos(Math.PI * v) - 1);
            },
            quadraticInOut: function (v) {
                return v < 0.5 ? 2 * v * v : -1 + (4 - 2 * v) * v;
            },
            cubicInOut: function (v) {
                return v < 0.5 ? 4 * v * v * v : (v - 1) * (2 * v - 2) * (2 * v - 2) + 1;
            },
            quarticInOut: function (v) {
                return v < 0.5 ? 8 * v * v * v * v : 1 - 8 * (v -= 1) * v * v * v;
            },
            quinticInOut: function (v) {
                return v < 0.5 ? 16 * v * v * v * v * v : 1 + 16 * (v -= 1) * v * v * v * v;
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
            circularInOut: function(v) {
                if (v < 0.5) {
                    return 0.5 * (1 - Math.sqrt(1 - 4 * v * v));
                } else {
                    return 0.5 * (Math.sqrt(1 - Math.pow(2 * v - 2, 2)) + 1);
                }
            },
            // Bouncy 
            minBouncy: function(v) {return bouncy(v, 1.1, 0.5);},
            slightBouncy: function(v) {return bouncy(v, 1.1, 0.525);},
            lightBouncy: function(v) { return bouncy(v, 1.1, 0.55);},
            bouncy: function(v) {return bouncy(v, 1.2, 0.6);},
            strongBouncy: function(v) {return bouncy(v, 1.2, 0.625);
            },
            intenseBouncy: function(v) {return bouncy(v, 1.2, 0.65);},
            maxBouncy: function(v) {return bouncy(v, 1.2, 0.7);},
            // Pullback
            minPullback: function(v) {return pullback(v, 0.85);},
            slightPullback: function(v) {return pullback(v, 1.1);},
            lightPullback: function(v) {return pullback(v, 1.35);},
            pullback: function(v) {return pullback(v, 1.70158);},
            strongPullback: function(v) {return pullback(v, 2.1482);},
            intensePullback: function(v) {return pullback(v, 2.37155475);},
            maxPullback: function(v) {return pullback(v, 2.5949095);},
            // Overshoot
            minOvershoot: function(v) { return overshoot(v, 1.5); },
            slightOvershoot: function(v) { return overshoot(v, 1.375); },
            lightOvershoot: function(v) { return overshoot(v, 1.25); },
            overshoot: function(v) { return overshoot(v, 1); },
            strongOvershoot: function(v) { return overshoot(v, 0.75); },
            intenseOvershoot: function(v) { return overshoot(v, 0.625); },
            maxOvershoot: function(v) { return overshoot(v, 0.5); },
            // Drift
            minDrift: function(v) { return drift(v, 1); },
            slightDrift: function(v) { return drift(v, 1.5); },
            lightDrift: function(v) { return drift(v, 2); },
            drift: function(v) { return drift(v, 2.5); },
            strongDrift: function(v) { return drift(v, 3); },
            intenseDrift: function(v) { return drift(v, 3.5); },
            maxDrift: function(v) { return drift(v, 4); },
            // Clock
            minMechanical: function(v) { return mechanical(v, 63); },
            slightMechanical: function(v) { return mechanical(v, 54); },
            lightMechanical: function(v) { return mechanical(v, 45); },
            mechanical: function(v) { return mechanical(v, 36); },
            strongMechanical: function(v) { return mechanical(v, 27); },
            instenseMechanical: function(v) { return mechanical(v, 18); },
            maxMechanical: function(v) { return mechanical(v, 9); },
            // Rattle
            minRattle: function(v) { return rattle(v, 0.3); },
            slightRattle: function(v) { return rattle(v, 0.4); },
            lightRattle: function(v) { return rattle(v, 0.5); },
            rattle: function(v) { return rattle(v, 0.6); },
            strongRattle: function(v) { return rattle(v, 0.7); },
            intenseRattle: function(v) { return rattle(v, 0.8); },
            maxRattle: function(v) { return rattle(v, 0.9); },
            // Converge
            minConverge: function(v) { return converge(v, 0.3); },
            slightConverge: function(v) { return converge(v, 0.4); },
            lightConverge: function(v) { return converge(v, 0.5); },
            converge: function(v) { return converge(v, 0.6); },
            strongConverge: function(v) { return converge(v, 0.7); },
            intenseConverge: function(v) { return converge(v, 0.8); },
            maxConverge: function(v) { return converge(v, 0.9); },
            // Spark
            minSpark: function(v) { return spark(v, 0.05); },
            slightSpark: function(v) { return spark(v, 0.0875); },
            lightSpark: function(v) { return spark(v, 0.125); },
            spark: function(v) { return spark(v, 0.1625); },
            strongSpark: function(v) { return spark(v, 0.2); },
            intenseSpark: function(v) { return spark(v, 0.2375); },
            maxSpark: function(v) { return spark(v, 0.275); },
            // Snap
            minSnap: function(v) { return snap(v, 0.98); },
            slightSnap: function(v) { return snap(v, 0.95); },
            lightSnap: function(v) { return snap(v, 0.92); },
            snap: function(v) { return snap(v, 0.89); },
            strongSnap: function(v) { return snap(v, 0.86); },
            intenseSnap: function(v) { return snap(v, 0.83); },
            maxSnap: function(v) { return snap(v, 0.8); },
            // Suspense
            minSuspense: function(v) { return suspense(v, 4); },
            slightSuspense: function(v) { return suspense(v, 6); },
            lightSuspense: function(v) { return suspense(v, 8); },
            suspense: function(v) { return suspense(v, 10); },
            strongSuspense: function(v) { return suspense(v, 12); },
            intenseSuspense: function(v) { return suspense(v, 14); },
            maxSuspense: function(v) { return suspense(v, 16); },
            //Elastic
            minElastic: function(v) { return elastic(v, 1.1); },
            slightElastic: function(v) { return elastic(v, 1.2); },
            lightElastic: function(v) { return elastic(v, 1.3); },
            elastic: function(v) { return elastic(v, 1.7); },
            strongElastic: function(v) { return elastic(v, 2.1); },
            intenseElastic: function(v) { return elastic(v, 2.5); },
            maxElastic: function(v) { return elastic(v, 2.9); },
            //Wind
            minWind: function(v) { return wind(v, 0.05); },
            slightWind: function(v) { return wind(v, 0.1); },
            lightWind: function(v) { return wind(v, 0.15); },
            wind: function(v) { return wind(v, 0.2); },
            strongWind: function(v) { return wind(v, 0.25); },
            intenseWind: function(v) { return wind(v, 0.3); },
            maxWind: function(v) { return wind(v, 0.35); },
            //Pull
            minPull: function(v) { return pull(v, 0.25); },
            slightPull: function(v) { return pull(v, 0.3125); }, 
            lightPull: function(v) { return pull(v, 0.375); },
            pull: function(v) { return pull(v, 0.5); },      
            strongPull: function(v) { return pull(v, 0.7); },
            intensePull: function(v) { return pull(v, 0.825); },
            maxPull: function(v) { return pull(v, 0.95); },
            //Punch
            minPunch: function(v) { return punch(v, 1); }, 
            slightPunch: function (v){ return punch(v, 1.25);},
            lightPunch: function(v) { return punch(v, 1.5); },
            punch: function(v) { return punch(v, 2); },   
            strongPunch: function(v) { return punch(v, 2.5); },
            intensePunch: function(v) { return punch(v, 2.75)},
            maxPunch: function(v) { return punch(v, 3); },  
            //Elastic Snap
            minElasticSnap: function(v) { return elasticSnap(v, 1); },
            slightElasticSnap: function(v) { return elasticSnap(v, 1.125); },
            lightElasticSnap: function(v) { return elasticSnap(v, 1.25); },
            elasticSnap: function(v) { return elasticSnap(v, 1.375); },
            strongElasticSnap: function(v) { return elasticSnap(v, 1.5); },
            intenseElasticSnap: function(v) { return elasticSnap(v, 1.625); },
            maxElasticSnap: function(v) { return elasticSnap(v, 1.75); },
            //Undecided
            minUndecided: function(v) { return undecided(v, 3); },
            slightUndecided: function(v) { return undecided(v, 4); },
            lightUndecided: function(v) { return undecided(v, 5); },
            undecided: function(v) { return undecided(v, 6); },
            strongUndecided: function(v) { return undecided(v, 7); },
            intenseUndecided: function(v) { return undecided(v, 8); },
            maxUndecided: function(v) { return undecided(v, 9); },
            //Skate
            minSkate: function(v) { return skate(v, 0.05); },
            slightSkate: function(v) { return skate(v, 0.075); },
            lightSkate: function(v) { return skate(v, 0.1); },
            skate: function(v) { return skate(v, 0.125); },
            strongSkate: function(v) { return skate(v, 0.15); },
            intenseSkate: function(v) { return skate(v, 0.175); },
            maxSkate: function(v) { return skate(v, 0.2); },
            //Row
            minRow: function(v) { return row(v, 0.1); },
            slightRow: function(v) { return row(v, 0.125); },
            lightRow: function(v) { return row(v, 0.15); },
            row: function(v) { return row(v, 0.175); },
            strongRow: function(v) { return row(v, 0.2); },
            intenseRow: function(v) { return row(v, 0.225); },
            maxRow: function(v) { return row(v, 0.25); },
            //Swirl
            minSwirl: function(v) { return swirl(v, 4, 0.11); },    
            slightSwirl: function(v) { return swirl(v, 5, 0.2); },
            lightSwirl: function(v) { return swirl(v, 6, 0.25); },
            swirl: function(v) { return swirl(v, 7, 0.3); },
            strongSwirl: function(v) { return swirl(v, 8, 0.35); },
            intenseSwirl: function(v) { return swirl(v, 9, 0.4); },
            maxSwirl: function(v) { return swirl(v, 10, 0.45); },
            //Slither
            minSlither: function(v) { return slither(v, 0.04, 6); },
            slightSlither: function(v) { return slither(v, 0.05, 7); },
            lightSlither: function(v) { return slither(v, 0.06, 8); },
            slither: function(v) { return slither(v, 0.06, 9); },
            strongSlither: function(v) { return slither(v, 0.06, 10); },
            intenseSlither: function(v) { return slither(v, 0.06, 10.5); },
            maxSlither: function(v) { return slither(v, 0.06, 11); },
            //Spring
            minSpring: function(v) { return spring(v, 0.25, 1.04); },
            slightSpring: function(v) { return spring(v, 0.24, 1.05); },
            lightSpring: function(v) { return spring(v, 0.23, 1.06); },
            spring: function(v) { return spring(v, 0.22, 1.07); },
            strongSpring: function(v) { return spring(v, 0.21, 1.08); },
            intenseSpring: function(v) { return spring(v, 0.2, 1.09); },
            maxSpring: function(v) { return spring(v, 0.19, 1.1); },
            //Spin
            minSpin: function(v) { return spin(v, 0.05, 7); },
            slightSpin: function(v) { return spin(v, 0.075, 8); },
            lightSpin: function(v) { return spin(v, 0.1, 9); },
            spin: function(v) { return spin(v, 0.125, 10); },
            strongSpin: function(v) { return spin(v, 0.15, 11); },
            intenseSpin: function(v) { return spin(v, 0.175, 12); },
            maxSpin: function(v) { return spin(v, 0.2, 13); },
            //
            noBounce: function(v) {return bounceSequence(v,1);},
            oneBounce: function(v) {return bounceSequence(v,2);},
            twoBounce: function(v) {return bounceSequence(v,3);},
            fourBounce: function(v) {return bounceSequence(v,4);}         
        };
    })();

});