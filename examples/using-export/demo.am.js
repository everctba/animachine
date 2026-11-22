(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports['new project'] = factory();
	else
		root['new project'] = factory();
})(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var createAnimationSource = __webpack_require__(1);

	// Dados do projeto injetados no export (ver src/rocks/create-bundle-file/index.js).
	// Sem `eval` no bundle: o JSON entra como literal e é válido mesmo com aspas.
	var projectSource = [{"$id":1,"name":"new project","currentTimeline":2,"timelines":[2],"type":"Project"},{"$id":2,"name":"new timeline","currentTrack":3,"isPlaying":false,"isSeeking":false,"currentTime":500,"pxpms":1,"width":1300,"start":0,"startMargin":6,"tracks":[3]},{"$id":3,"name":"new track for \"#box-1\"","openInTimeline":true,"params":[4,9,14],"selectors":[19]},{"$id":4,"name":"x","openInTimeline":true,"keys":[5,7]},{"$id":5,"time":0,"value":120.98714832046463,"ease":6,"selected":false},{"$id":6,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":7,"time":500,"value":268.4778505619122,"ease":8,"selected":false},{"$id":8,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":9,"name":"y","openInTimeline":true,"keys":[10,12]},{"$id":10,"time":0,"value":70.56529214784264,"ease":11,"selected":false},{"$id":11,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":12,"time":500,"value":159.18113954109128,"ease":13,"selected":false},{"$id":13,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":14,"name":"rotationZ","openInTimeline":true,"keys":[15,17]},{"$id":15,"time":0,"value":0,"ease":16,"selected":false},{"$id":16,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":17,"time":500,"value":45,"ease":18,"selected":false},{"$id":18,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":19,"selectorType":"css","query":"#box-1"}];
	var timelineSources = [{"name":"new timeline","tracks":[{"params":[{"keys":[{"time":0,"value":120.98714832046463,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}},{"time":500,"value":268.4778505619122,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}}],"name":"x"},{"keys":[{"time":0,"value":70.56529214784264,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}},{"time":500,"value":159.18113954109128,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}}],"name":"y"},{"keys":[{"time":0,"value":0,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}},{"time":500,"value":45,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}}],"name":"rotationZ"}],"selectors":[{"selectorType":"css","query":"#box-1"}]}]}];

	// Metadados para reabrir este arquivo no editor (menu > open animation .am.js).
	var __ANIMACHINE_BUNDLE__ = {"schema":1,"name":"new project","project":[{"$id":1,"name":"new project","currentTimeline":2,"timelines":[2],"type":"Project"},{"$id":2,"name":"new timeline","currentTrack":3,"isPlaying":false,"isSeeking":false,"currentTime":500,"pxpms":1,"width":1300,"start":0,"startMargin":6,"tracks":[3]},{"$id":3,"name":"new track for \"#box-1\"","openInTimeline":true,"params":[4,9,14],"selectors":[19]},{"$id":4,"name":"x","openInTimeline":true,"keys":[5,7]},{"$id":5,"time":0,"value":120.98714832046463,"ease":6,"selected":false},{"$id":6,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":7,"time":500,"value":268.4778505619122,"ease":8,"selected":false},{"$id":8,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":9,"name":"y","openInTimeline":true,"keys":[10,12]},{"$id":10,"time":0,"value":70.56529214784264,"ease":11,"selected":false},{"$id":11,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":12,"time":500,"value":159.18113954109128,"ease":13,"selected":false},{"$id":13,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":14,"name":"rotationZ","openInTimeline":true,"keys":[15,17]},{"$id":15,"time":0,"value":0,"ease":16,"selected":false},{"$id":16,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":17,"time":500,"value":45,"ease":18,"selected":false},{"$id":18,"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"},{"$id":19,"selectorType":"css","query":"#box-1"}],"timelines":[{"name":"new timeline","tracks":[{"params":[{"keys":[{"time":0,"value":120.98714832046463,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}},{"time":500,"value":268.4778505619122,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}}],"name":"x"},{"keys":[{"time":0,"value":70.56529214784264,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}},{"time":500,"value":159.18113954109128,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}}],"name":"y"},{"keys":[{"time":0,"value":0,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}},{"time":500,"value":45,"ease":{"easeType":"bezier","pointAX":0.3,"pointAY":0.3,"pointBX":0.7,"pointBY":0.7,"roughEase":false,"roughStrength":1,"roughPoints":20,"roughClamp":false,"roughRandomise":true,"roughTaper":"none"}}],"name":"rotationZ"}],"selectors":[{"selectorType":"css","query":"#box-1"}]}]}]};

	var animations = {};

	timelineSources.forEach(function (timelineSource) {
	  animations[timelineSource.name] = createAnimationSource(timelineSource);
	});

	// Compatibilidade com o uso original: require('...am.js') -> mapa de animações.
	module.exports = animations;

	// Registro estável no browser (independente do nome do projeto):
	//   window.__animachine['<nome do projeto>']['<timeline>'](rootTarget)
	if (typeof window !== 'undefined') {
	  window.__animachine = window.__animachine || {};
	  window.__animachine['new project'] = animations;
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = createAnimationSource;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var _createEaser = __webpack_require__(2);

	var _createEaser2 = _interopRequireDefault(_createEaser);

	var _createTargets = __webpack_require__(4);

	var _createTargets2 = _interopRequireDefault(_createTargets);

	function find(items, key, value) {
	  for (var i = 0; i < items.length; ++i) {
	    if (items[i][key] === value) {
	      return items[i];
	    }
	  }
	}

	function uniq(items) {
	  var result = [];
	  for (var i = 0; i < items.length; ++i) {
	    if (result.indexOf(items[i]) === -1) {
	      result.push(items[i]);
	    }
	  }
	  return result;
	}

	function flatten() {
	  var result = [];

	  for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
	    items[_key] = arguments[_key];
	  }

	  for (var i = 0; i < items.length; ++i) {
	    result.push.apply(result, _toConsumableArray(items[i]));
	  }
	  return result;
	}

	var sortKeys = function sortKeys(a, b) {
	  return a.time - b.time;
	};

	var mergeTransformOriginParams = function mergeTransformOriginParams(next) {
	  return function (params, targets, tlRoot) {
	    var transformOriginX = find(params, 'name', 'transformOriginX');
	    var transformOriginY = find(params, 'name', 'transformOriginY');
	    var transformOriginZ = find(params, 'name', 'transformOriginZ');

	    if (transformOriginX || transformOriginY || transformOriginZ) {
	      (function () {
	        //remove all the transform origin params
	        params = params.filter(function (_ref) {
	          var name = _ref.name;
	          return name.indexOf('transformOrigin') !== 0;
	        });
	        var getKeys = function getKeys(param) {
	          return param ? param.keys.map(function (key) {
	            return key.time;
	          }) : [];
	        };
	        var times = uniq(flatten(getKeys(transformOriginX), getKeys(transformOriginY), getKeys(transformOriginZ)));

	        var previousTransformOrigin = { x: 50, y: 50, z: 0 };
	        var getValue = function getValue(param, time, previousValue) {
	          var key = param && find(param.keys, 'time', time);
	          return key ? key.value * 100 : previousValue;
	        };
	        var keys = times.map(function (time) {
	          var to = {
	            x: getValue(transformOriginX, time, previousTransformOrigin.x),
	            y: getValue(transformOriginY, time, previousTransformOrigin.y),
	            z: getValue(transformOriginZ, time, previousTransformOrigin.z)
	          };

	          previousTransformOrigin = to;

	          return { time: time, value: to.x + '% ' + to.y + '%' };
	        });

	        params = [].concat(_toConsumableArray(params), [{ name: 'transformOrigin', keys: keys }]);
	      })();
	    }

	    next(params, targets, tlRoot);
	  };
	};

	var fixTransformOriginForSvgNodes = function fixTransformOriginForSvgNodes(next) {
	  return function (params, targets, tlRoot) {
	    //TODO do this only if targets contains an svg
	    var transformOriginParam = find(params, 'name', 'transformOrigin');
	    if (!transformOriginParam || !find(transformOriginParam.keys, 'time', 0)) {
	      tlRoot.set(targets, { transformOrigin: '50% 50%' }, 0);
	    }

	    next(params, targets, tlRoot);
	  };
	};

	// Nomes de parâmetros de rotação e o sufixo que o GSAP usa para "short rotation".
	var ROTATION_PARAM_NAMES = ['rotation', 'rotationX', 'rotationY', 'rotationZ'];

	// Versões antigas acumulavam "_short" a cada leitura (mutação); normaliza antes de usar.
	function stripShortSuffix(value) {
	  if (typeof value !== 'string') {
	    return value;
	  }
	  return value.replace(/(?:_short)+$/, '');
	}

	// IMPORTANTE: não mutar o documento. O valor original continua no model; só a cópia
	// usada para montar a timeline recebe o sufixo _short.
	var makeAllRotationShort = function makeAllRotationShort(next) {
	  return function (params, targets, tlRoot) {
	    var rotationParams = ROTATION_PARAM_NAMES.map(function (name) {
	      return find(params, 'name', name);
	    }).filter(function (param) {
	      return !!param;
	    });

	    if (!rotationParams.length) {
	      next(params, targets, tlRoot);
	      return;
	    }

	    var shortParams = params.map(function (param) {
	      if (rotationParams.indexOf(param) === -1 || !param.keys) {
	        return param;
	      }
	      return Object.assign({}, param, {
	        keys: param.keys.map(function (key) {
	          return Object.assign({}, key, {
	            value: stripShortSuffix(key.value) + '_short'
	          });
	        })
	      });
	    });

	    next(shortParams, targets, tlRoot);
	  };
	};

	var addParamTimelines = mergeTransformOriginParams(fixTransformOriginForSvgNodes(makeAllRotationShort(function (params, targets, tlRoot) {
	  params.forEach(function (param) {
	    var tlParam = new TimelineMax();
	    tlRoot.add(tlParam, 0);
	    var headTime = 0;

	    if (param.keys && param.keys.length) {
	      // slice(): sort() mutaria a ordem dos keys no documento
	      var sortedKeys = param.keys.slice().sort(sortKeys);

	      //set the start position to the first key event is not in the time=0
	      // so tartgets don't going to tween from they current position
	      tlParam.set(targets, _defineProperty({}, param.name, sortedKeys[0].value));

	      sortedKeys.forEach(function (key) {
	        var _tlParam$to;

	        var duration = key.time - headTime;

	        tlParam.to(targets, duration / 1000, (_tlParam$to = {}, _defineProperty(_tlParam$to, param.name, key.value), _defineProperty(_tlParam$to, 'smoothOrigin', false), _defineProperty(_tlParam$to, 'ease', (0, _createEaser2['default'])(key.ease)), _tlParam$to), headTime / 1000);
	        headTime = key.time;
	      });
	    }

	    if (param.params) {
	      addParams(param.params, targets);
	    }
	  });
	})));

	function createAnimationSource(timeline, register) {
	  function animationSource(rootTarget) {
	    //to keep compatible with react-gsap-enhancer v0.2.x
	    if (rootTarget.hasOwnProperty('target') && rootTarget.hasOwnProperty('options')) {
	      rootTarget = rootTarget.target;
	    }
	    //--------------------------------------------------

	    var tlRoot = new TimelineMax();

	    timeline.tracks.forEach(function (track) {
	      var targets = track.selectors.map(function (selector) {
	        return (0, _createTargets2['default'])(rootTarget, selector);
	      });

	      addParamTimelines(track.params, targets, tlRoot);
	    });

	    //add to the animachine registry
	    if (register) {
	      register(rootTarget, tlRoot);
	    }

	    return tlRoot;
	  }

	  return animationSource;
	}

	module.exports = exports['default'];
	//http://greensock.com/docs/#/HTML5/Plugins/CSSPlugin/

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _bezierEasing = __webpack_require__(3);

	var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

	exports['default'] = function (ease) {
	  if (!ease) {
	    return Power0.easeNone;
	  }
	  var bezierEasing = (0, _bezierEasing2['default'])([ease.pointAX, ease.pointAY, ease.pointBX, ease.pointBY]);
	  var easer = new GreenSockGlobals.Ease(function (t) {
	    return bezierEasing.get(t);
	  });

	  if (ease.roughEase) {
	    easer = new GreenSockGlobals.RoughEase({
	      template: easer,
	      strength: ease.roughStrength,
	      points: ease.roughPoints,
	      clamp: ease.roughClamp,
	      randomise: ease.roughRandomise,
	      taper: ease.roughTaper
	    });
	  }

	  return easer;
	};

	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * BezierEasing - use bezier curve for transition easing function
	 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
	 *
	 * Credits: is based on Firefox's nsSMILKeySpline.cpp
	 * Usage:
	 * var spline = BezierEasing([ 0.25, 0.1, 0.25, 1.0 ])
	 * spline.get(x) => returns the easing value | x must be in [0, 1] range
	 *
	 */

	// These values are established by empiricism with tests (tradeoff: performance VS precision)
	var NEWTON_ITERATIONS = 4;
	var NEWTON_MIN_SLOPE = 0.001;
	var SUBDIVISION_PRECISION = 0.0000001;
	var SUBDIVISION_MAX_ITERATIONS = 10;

	var kSplineTableSize = 11;
	var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	var float32ArraySupported = typeof Float32Array === "function";

	function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
	function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
	function C (aA1)      { return 3.0 * aA1; }

	// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	function calcBezier (aT, aA1, aA2) {
	  return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
	}

	// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	function getSlope (aT, aA1, aA2) {
	  return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	}

	function binarySubdivide (aX, aA, aB, mX1, mX2) {
	  var currentX, currentT, i = 0;
	  do {
	    currentT = aA + (aB - aA) / 2.0;
	    currentX = calcBezier(currentT, mX1, mX2) - aX;
	    if (currentX > 0.0) {
	      aB = currentT;
	    } else {
	      aA = currentT;
	    }
	  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	  return currentT;
	}

	function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
	  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	    var currentSlope = getSlope(aGuessT, mX1, mX2);
	    if (currentSlope === 0.0) return aGuessT;
	    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	    aGuessT -= currentX / currentSlope;
	  }
	  return aGuessT;
	}

	/**
	 * points is an array of [ mX1, mY1, mX2, mY2 ]
	 */
	function BezierEasing (points, b, c, d) {
	  if (arguments.length === 4) {
	    return new BezierEasing([ points, b, c, d ]);
	  }
	  if (!(this instanceof BezierEasing)) return new BezierEasing(points);

	  if (!points || points.length !== 4) {
	    throw new Error("BezierEasing: points must contains 4 values");
	  }
	  for (var i=0; i<4; ++i) {
	    if (typeof points[i] !== "number" || isNaN(points[i]) || !isFinite(points[i])) {
	      throw new Error("BezierEasing: points should be integers.");
	    }
	  }
	  if (points[0] < 0 || points[0] > 1 || points[2] < 0 || points[2] > 1) {
	    throw new Error("BezierEasing x values must be in [0, 1] range.");
	  }

	  this._str = "BezierEasing("+points+")";
	  this._css = "cubic-bezier("+points+")";
	  this._p = points;
	  this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
	  this._precomputed = false;

	  this.get = this.get.bind(this);
	}

	BezierEasing.prototype = {

	  get: function (x) {
	    var mX1 = this._p[0],
	      mY1 = this._p[1],
	      mX2 = this._p[2],
	      mY2 = this._p[3];
	    if (!this._precomputed) this._precompute();
	    if (mX1 === mY1 && mX2 === mY2) return x; // linear
	    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	    if (x === 0) return 0;
	    if (x === 1) return 1;
	    return calcBezier(this._getTForX(x), mY1, mY2);
	  },

	  getPoints: function() {
	    return this._p;
	  },

	  toString: function () {
	    return this._str;
	  },

	  toCSS: function () {
	    return this._css;
	  },

	  // Private part

	  _precompute: function () {
	    var mX1 = this._p[0],
	      mY1 = this._p[1],
	      mX2 = this._p[2],
	      mY2 = this._p[3];
	    this._precomputed = true;
	    if (mX1 !== mY1 || mX2 !== mY2)
	      this._calcSampleValues();
	  },

	  _calcSampleValues: function () {
	    var mX1 = this._p[0],
	      mX2 = this._p[2];
	    for (var i = 0; i < kSplineTableSize; ++i) {
	      this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	    }
	  },

	  /**
	   * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
	   */
	  _getTForX: function (aX) {
	    var mX1 = this._p[0],
	      mX2 = this._p[2],
	      mSampleValues = this._mSampleValues;

	    var intervalStart = 0.0;
	    var currentSample = 1;
	    var lastSample = kSplineTableSize - 1;

	    for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
	      intervalStart += kSampleStepSize;
	    }
	    --currentSample;

	    // Interpolate to provide an initial guess for t
	    var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]);
	    var guessForT = intervalStart + dist * kSampleStepSize;

	    var initialSlope = getSlope(guessForT, mX1, mX2);
	    if (initialSlope >= NEWTON_MIN_SLOPE) {
	      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
	    } else if (initialSlope === 0.0) {
	      return guessForT;
	    } else {
	      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	    }
	  }
	};

	// CSS mapping
	BezierEasing.css = {
	  "ease":        BezierEasing.ease      = BezierEasing(0.25, 0.1, 0.25, 1.0),
	  "linear":      BezierEasing.linear    = BezierEasing(0.00, 0.0, 1.00, 1.0),
	  "ease-in":     BezierEasing.easeIn    = BezierEasing(0.42, 0.0, 1.00, 1.0),
	  "ease-out":    BezierEasing.easeOut   = BezierEasing(0.00, 0.0, 0.58, 1.0),
	  "ease-in-out": BezierEasing.easeInOut = BezierEasing(0.42, 0.0, 0.58, 1.0)
	};

	module.exports = BezierEasing;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	exports['default'] = function (rootTarget, selector) {
	  if (selector.selectorType === 'css') {
	    //TODO throw if rootTarget not a dom element
	    if (selector.query === ':root') {
	      return [rootTarget];
	    } else {
	      try {
	        // seletores relativos ("> :nth-child(3)") são inválidos em querySelectorAll;
	        // ancoramos no próprio rootTarget com :scope (funciona em projetos antigos)
	        var query = selector.query;
	        if (query.charAt(0) === '>') {
	          query = ':scope ' + query;
	        }
	        return [].concat(_toConsumableArray(rootTarget.querySelectorAll(query)));
	      } catch (e) {
	        console.warn('error on using css selector  "' + selector.query + '"');
	        return [];
	      }
	    }
	  } else if (selector.selectorType === 'react') {
	    return rootTarget.findWithCommands(selector.query);
	  }
	};

	module.exports = exports['default'];

/***/ })
/******/ ])
});
;