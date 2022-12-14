// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/leaflet/dist/leaflet-src.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/* @preserve
 * Leaflet 1.6.0, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2019 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.L = {})));
}(this, (function (exports) { 'use strict';

var version = "1.6.0";

/*
 * @namespace Util
 *
 * Various utility functions, used by Leaflet internally.
 */

var freeze = Object.freeze;
Object.freeze = function (obj) { return obj; };

// @function extend(dest: Object, src?: Object): Object
// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
function extend(dest) {
	var i, j, len, src;

	for (j = 1, len = arguments.length; j < len; j++) {
		src = arguments[j];
		for (i in src) {
			dest[i] = src[i];
		}
	}
	return dest;
}

// @function create(proto: Object, properties?: Object): Object
// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
var create = Object.create || (function () {
	function F() {}
	return function (proto) {
		F.prototype = proto;
		return new F();
	};
})();

// @function bind(fn: Function, ???): Function
// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
// Has a `L.bind()` shortcut.
function bind(fn, obj) {
	var slice = Array.prototype.slice;

	if (fn.bind) {
		return fn.bind.apply(fn, slice.call(arguments, 1));
	}

	var args = slice.call(arguments, 2);

	return function () {
		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	};
}

// @property lastId: Number
// Last unique ID used by [`stamp()`](#util-stamp)
var lastId = 0;

// @function stamp(obj: Object): Number
// Returns the unique ID of an object, assigning it one if it doesn't have it.
function stamp(obj) {
	/*eslint-disable */
	obj._leaflet_id = obj._leaflet_id || ++lastId;
	return obj._leaflet_id;
	/* eslint-enable */
}

// @function throttle(fn: Function, time: Number, context: Object): Function
// Returns a function which executes function `fn` with the given scope `context`
// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
// `fn` will be called no more than one time per given amount of `time`. The arguments
// received by the bound function will be any arguments passed when binding the
// function, followed by any arguments passed when invoking the bound function.
// Has an `L.throttle` shortcut.
function throttle(fn, time, context) {
	var lock, args, wrapperFn, later;

	later = function () {
		// reset lock and call if queued
		lock = false;
		if (args) {
			wrapperFn.apply(context, args);
			args = false;
		}
	};

	wrapperFn = function () {
		if (lock) {
			// called too soon, queue to call later
			args = arguments;

		} else {
			// call and lock until later
			fn.apply(context, arguments);
			setTimeout(later, time);
			lock = true;
		}
	};

	return wrapperFn;
}

// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
// Returns the number `num` modulo `range` in such a way so it lies within
// `range[0]` and `range[1]`. The returned value will be always smaller than
// `range[1]` unless `includeMax` is set to `true`.
function wrapNum(x, range, includeMax) {
	var max = range[1],
	    min = range[0],
	    d = max - min;
	return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
}

// @function falseFn(): Function
// Returns a function which always returns `false`.
function falseFn() { return false; }

// @function formatNum(num: Number, digits?: Number): Number
// Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
function formatNum(num, digits) {
	var pow = Math.pow(10, (digits === undefined ? 6 : digits));
	return Math.round(num * pow) / pow;
}

// @function trim(str: String): String
// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
function trim(str) {
	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
function splitWords(str) {
	return trim(str).split(/\s+/);
}

// @function setOptions(obj: Object, options: Object): Object
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
function setOptions(obj, options) {
	if (!obj.hasOwnProperty('options')) {
		obj.options = obj.options ? create(obj.options) : {};
	}
	for (var i in options) {
		obj.options[i] = options[i];
	}
	return obj.options;
}

// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
// be appended at the end. If `uppercase` is `true`, the parameter names will
// be uppercased (e.g. `'?A=foo&B=bar'`)
function getParamString(obj, existingUrl, uppercase) {
	var params = [];
	for (var i in obj) {
		params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
	}
	return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
}

var templateRe = /\{ *([\w_-]+) *\}/g;

// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values ??? they will be evaluated passing `data` as an argument.
function template(str, data) {
	return str.replace(templateRe, function (str, key) {
		var value = data[key];

		if (value === undefined) {
			throw new Error('No value provided for variable ' + str);

		} else if (typeof value === 'function') {
			value = value(data);
		}
		return value;
	});
}

// @function isArray(obj): Boolean
// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
var isArray = Array.isArray || function (obj) {
	return (Object.prototype.toString.call(obj) === '[object Array]');
};

// @function indexOf(array: Array, el: Object): Number
// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
function indexOf(array, el) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === el) { return i; }
	}
	return -1;
}

// @property emptyImageUrl: String
// Data URI string containing a base64-encoded empty GIF image.
// Used as a hack to free memory from unused images on WebKit-powered
// mobile devices (by setting image `src` to this string).
var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

function getPrefixed(name) {
	return window['webkit' + name] || window['moz' + name] || window['ms' + name];
}

var lastTime = 0;

// fallback for IE 7-8
function timeoutDefer(fn) {
	var time = +new Date(),
	    timeToCall = Math.max(0, 16 - (time - lastTime));

	lastTime = time + timeToCall;
	return window.setTimeout(fn, timeToCall);
}

var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
// `context` if given. When `immediate` is set, `fn` is called immediately if
// the browser doesn't have native support for
// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
function requestAnimFrame(fn, context, immediate) {
	if (immediate && requestFn === timeoutDefer) {
		fn.call(context);
	} else {
		return requestFn.call(window, bind(fn, context));
	}
}

// @function cancelAnimFrame(id: Number): undefined
// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
function cancelAnimFrame(id) {
	if (id) {
		cancelFn.call(window, id);
	}
}


var Util = (Object.freeze || Object)({
	freeze: freeze,
	extend: extend,
	create: create,
	bind: bind,
	lastId: lastId,
	stamp: stamp,
	throttle: throttle,
	wrapNum: wrapNum,
	falseFn: falseFn,
	formatNum: formatNum,
	trim: trim,
	splitWords: splitWords,
	setOptions: setOptions,
	getParamString: getParamString,
	template: template,
	isArray: isArray,
	indexOf: indexOf,
	emptyImageUrl: emptyImageUrl,
	requestFn: requestFn,
	cancelFn: cancelFn,
	requestAnimFrame: requestAnimFrame,
	cancelAnimFrame: cancelAnimFrame
});

// @class Class
// @aka L.Class

// @section
// @uninheritable

// Thanks to John Resig and Dean Edwards for inspiration!

function Class() {}

Class.extend = function (props) {

	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		this.callInitHooks();
	};

	var parentProto = NewClass.__super__ = this.prototype;

	var proto = create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	// inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== '__super__') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		checkDeprecatedMixinEvents(props.includes);
		extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = extend(create(proto.options), props.options);
	}

	// mix given properties into the prototype
	extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// @function include(properties: Object): this
// [Includes a mixin](#class-includes) into the current class.
Class.include = function (props) {
	extend(this.prototype, props);
	return this;
};

// @function mergeOptions(options: Object): this
// [Merges `options`](#class-options) into the defaults of the class.
Class.mergeOptions = function (options) {
	extend(this.prototype.options, options);
	return this;
};

// @function addInitHook(fn: Function): this
// Adds a [constructor hook](#class-constructor-hooks) to the class.
Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
	return this;
};

function checkDeprecatedMixinEvents(includes) {
	if (typeof L === 'undefined' || !L || !L.Mixin) { return; }

	includes = isArray(includes) ? includes : [includes];

	for (var i = 0; i < includes.length; i++) {
		if (includes[i] === L.Mixin.Events) {
			console.warn('Deprecated include of L.Mixin.Events: ' +
				'this property will be removed in future releases, ' +
				'please inherit from L.Evented instead.', new Error().stack);
		}
	}
}

/*
 * @class Evented
 * @aka L.Evented
 * @inherits Class
 *
 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
 *
 * @example
 *
 * ```js
 * map.on('click', function(e) {
 * 	alert(e.latlng);
 * } );
 * ```
 *
 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
 *
 * ```js
 * function onClick(e) { ... }
 *
 * map.on('click', onClick);
 * map.off('click', onClick);
 * ```
 */

var Events = {
	/* @method on(type: String, fn: Function, context?: Object): this
	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
	 *
	 * @alternative
	 * @method on(eventMap: Object): this
	 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	 */
	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	/* @method off(type: String, fn?: Function, context?: Object): this
	 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
	 *
	 * @alternative
	 * @method off(eventMap: Object): this
	 * Removes a set of type/listener pairs.
	 *
	 * @alternative
	 * @method off: this
	 * Removes all listeners to all events on the object. This includes implicitly attached events.
	 */
	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {
		this._events = this._events || {};

		/* get/init listeners for type */
		var typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}
		var newListener = {fn: fn, ctx: context},
		    listeners = typeListeners;

		// check if fn already there
		for (var i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i].fn === fn && listeners[i].ctx === context) {
				return;
			}
		}

		listeners.push(newListener);
	},

	_off: function (type, fn, context) {
		var listeners,
		    i,
		    len;

		if (!this._events) { return; }

		listeners = this._events[type];

		if (!listeners) {
			return;
		}

		if (!fn) {
			// Set all removed listeners to noop so they are not called if remove happens in fire
			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].fn = falseFn;
			}
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		if (context === this) {
			context = undefined;
		}

		if (listeners) {

			// find fn and remove it
			for (i = 0, len = listeners.length; i < len; i++) {
				var l = listeners[i];
				if (l.ctx !== context) { continue; }
				if (l.fn === fn) {

					// set the removed listener to noop so that's not called if remove happens in fire
					l.fn = falseFn;

					if (this._firingCount) {
						/* copy array in case events are being fired */
						this._events[type] = listeners = listeners.slice();
					}
					listeners.splice(i, 1);

					return;
				}
			}
		}
	},

	// @method fire(type: String, data?: Object, propagate?: Boolean): this
	// Fires an event of the specified type. You can optionally provide an data
	// object ??? the first argument of the listener function will contain its
	// properties. The event can optionally be propagated to event parents.
	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = extend({}, data, {
			type: type,
			target: this,
			sourceTarget: data && data.sourceTarget || this
		});

		if (this._events) {
			var listeners = this._events[type];

			if (listeners) {
				this._firingCount = (this._firingCount + 1) || 1;
				for (var i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					l.fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	// @method listens(type: String): Boolean
	// Returns `true` if a particular event type has any listeners attached to it.
	listens: function (type, propagate) {
		var listeners = this._events && this._events[type];
		if (listeners && listeners.length) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	// @method once(???): this
	// Behaves as [`on(???)`](#evented-on), except the listener will only get fired once and then removed.
	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = bind(function () {
			this
			    .off(types, fn, context)
			    .off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

	// @method addEventParent(obj: Evented): this
	// Adds an event parent - an `Evented` that will receive propagated events
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[stamp(obj)] = obj;
		return this;
	},

	// @method removeEventParent(obj: Evented): this
	// Removes an event parent, so it will stop receiving propagated events
	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, extend({
				layer: e.target,
				propagatedFrom: e.target
			}, e), true);
		}
	}
};

// aliases; we should ditch those eventually

// @method addEventListener(???): this
// Alias to [`on(???)`](#evented-on)
Events.addEventListener = Events.on;

// @method removeEventListener(???): this
// Alias to [`off(???)`](#evented-off)

// @method clearAllEventListeners(???): this
// Alias to [`off()`](#evented-off)
Events.removeEventListener = Events.clearAllEventListeners = Events.off;

// @method addOneTimeEventListener(???): this
// Alias to [`once(???)`](#evented-once)
Events.addOneTimeEventListener = Events.once;

// @method fireEvent(???): this
// Alias to [`fire(???)`](#evented-fire)
Events.fireEvent = Events.fire;

// @method hasEventListeners(???): Boolean
// Alias to [`listens(???)`](#evented-listens)
Events.hasEventListeners = Events.listens;

var Evented = Class.extend(Events);

/*
 * @class Point
 * @aka L.Point
 *
 * Represents a point with `x` and `y` coordinates in pixels.
 *
 * @example
 *
 * ```js
 * var point = L.point(200, 300);
 * ```
 *
 * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
 *
 * ```js
 * map.panBy([200, 300]);
 * map.panBy(L.point(200, 300));
 * ```
 *
 * Note that `Point` does not inherit from Leafet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function Point(x, y, round) {
	// @property x: Number; The `x` coordinate of the point
	this.x = (round ? Math.round(x) : x);
	// @property y: Number; The `y` coordinate of the point
	this.y = (round ? Math.round(y) : y);
}

var trunc = Math.trunc || function (v) {
	return v > 0 ? Math.floor(v) : Math.ceil(v);
};

Point.prototype = {

	// @method clone(): Point
	// Returns a copy of the current point.
	clone: function () {
		return new Point(this.x, this.y);
	},

	// @method add(otherPoint: Point): Point
	// Returns the result of addition of the current and the given points.
	add: function (point) {
		// non-destructive, returns a new point
		return this.clone()._add(toPoint(point));
	},

	_add: function (point) {
		// destructive, used directly for performance in situations where it's safe to modify existing point
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	// @method subtract(otherPoint: Point): Point
	// Returns the result of subtraction of the given point from the current.
	subtract: function (point) {
		return this.clone()._subtract(toPoint(point));
	},

	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	// @method divideBy(num: Number): Point
	// Returns the result of division of the current point by the given number.
	divideBy: function (num) {
		return this.clone()._divideBy(num);
	},

	_divideBy: function (num) {
		this.x /= num;
		this.y /= num;
		return this;
	},

	// @method multiplyBy(num: Number): Point
	// Returns the result of multiplication of the current point by the given number.
	multiplyBy: function (num) {
		return this.clone()._multiplyBy(num);
	},

	_multiplyBy: function (num) {
		this.x *= num;
		this.y *= num;
		return this;
	},

	// @method scaleBy(scale: Point): Point
	// Multiply each coordinate of the current point by each coordinate of
	// `scale`. In linear algebra terms, multiply the point by the
	// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
	// defined by `scale`.
	scaleBy: function (point) {
		return new Point(this.x * point.x, this.y * point.y);
	},

	// @method unscaleBy(scale: Point): Point
	// Inverse of `scaleBy`. Divide each coordinate of the current point by
	// each coordinate of `scale`.
	unscaleBy: function (point) {
		return new Point(this.x / point.x, this.y / point.y);
	},

	// @method round(): Point
	// Returns a copy of the current point with rounded coordinates.
	round: function () {
		return this.clone()._round();
	},

	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	// @method floor(): Point
	// Returns a copy of the current point with floored coordinates (rounded down).
	floor: function () {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},

	// @method ceil(): Point
	// Returns a copy of the current point with ceiled coordinates (rounded up).
	ceil: function () {
		return this.clone()._ceil();
	},

	_ceil: function () {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	},

	// @method trunc(): Point
	// Returns a copy of the current point with truncated coordinates (rounded towards zero).
	trunc: function () {
		return this.clone()._trunc();
	},

	_trunc: function () {
		this.x = trunc(this.x);
		this.y = trunc(this.y);
		return this;
	},

	// @method distanceTo(otherPoint: Point): Number
	// Returns the cartesian distance between the current and the given points.
	distanceTo: function (point) {
		point = toPoint(point);

		var x = point.x - this.x,
		    y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	},

	// @method equals(otherPoint: Point): Boolean
	// Returns `true` if the given point has the same coordinates.
	equals: function (point) {
		point = toPoint(point);

		return point.x === this.x &&
		       point.y === this.y;
	},

	// @method contains(otherPoint: Point): Boolean
	// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
	contains: function (point) {
		point = toPoint(point);

		return Math.abs(point.x) <= Math.abs(this.x) &&
		       Math.abs(point.y) <= Math.abs(this.y);
	},

	// @method toString(): String
	// Returns a string representation of the point for debugging purposes.
	toString: function () {
		return 'Point(' +
		        formatNum(this.x) + ', ' +
		        formatNum(this.y) + ')';
	}
};

// @factory L.point(x: Number, y: Number, round?: Boolean)
// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

// @alternative
// @factory L.point(coords: Number[])
// Expects an array of the form `[x, y]` instead.

// @alternative
// @factory L.point(coords: Object)
// Expects a plain object of the form `{x: Number, y: Number}` instead.
function toPoint(x, y, round) {
	if (x instanceof Point) {
		return x;
	}
	if (isArray(x)) {
		return new Point(x[0], x[1]);
	}
	if (x === undefined || x === null) {
		return x;
	}
	if (typeof x === 'object' && 'x' in x && 'y' in x) {
		return new Point(x.x, x.y);
	}
	return new Point(x, y, round);
}

/*
 * @class Bounds
 * @aka L.Bounds
 *
 * Represents a rectangular area in pixel coordinates.
 *
 * @example
 *
 * ```js
 * var p1 = L.point(10, 10),
 * p2 = L.point(40, 60),
 * bounds = L.bounds(p1, p2);
 * ```
 *
 * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```js
 * otherBounds.intersects([[10, 10], [40, 60]]);
 * ```
 *
 * Note that `Bounds` does not inherit from Leafet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function Bounds(a, b) {
	if (!a) { return; }

	var points = b ? [a, b] : a;

	for (var i = 0, len = points.length; i < len; i++) {
		this.extend(points[i]);
	}
}

Bounds.prototype = {
	// @method extend(point: Point): this
	// Extends the bounds to contain the given point.
	extend: function (point) { // (Point)
		point = toPoint(point);

		// @property min: Point
		// The top left corner of the rectangle.
		// @property max: Point
		// The bottom right corner of the rectangle.
		if (!this.min && !this.max) {
			this.min = point.clone();
			this.max = point.clone();
		} else {
			this.min.x = Math.min(point.x, this.min.x);
			this.max.x = Math.max(point.x, this.max.x);
			this.min.y = Math.min(point.y, this.min.y);
			this.max.y = Math.max(point.y, this.max.y);
		}
		return this;
	},

	// @method getCenter(round?: Boolean): Point
	// Returns the center point of the bounds.
	getCenter: function (round) {
		return new Point(
		        (this.min.x + this.max.x) / 2,
		        (this.min.y + this.max.y) / 2, round);
	},

	// @method getBottomLeft(): Point
	// Returns the bottom-left point of the bounds.
	getBottomLeft: function () {
		return new Point(this.min.x, this.max.y);
	},

	// @method getTopRight(): Point
	// Returns the top-right point of the bounds.
	getTopRight: function () { // -> Point
		return new Point(this.max.x, this.min.y);
	},

	// @method getTopLeft(): Point
	// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
	getTopLeft: function () {
		return this.min; // left, top
	},

	// @method getBottomRight(): Point
	// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
	getBottomRight: function () {
		return this.max; // right, bottom
	},

	// @method getSize(): Point
	// Returns the size of the given bounds
	getSize: function () {
		return this.max.subtract(this.min);
	},

	// @method contains(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle contains the given one.
	// @alternative
	// @method contains(point: Point): Boolean
	// Returns `true` if the rectangle contains the given point.
	contains: function (obj) {
		var min, max;

		if (typeof obj[0] === 'number' || obj instanceof Point) {
			obj = toPoint(obj);
		} else {
			obj = toBounds(obj);
		}

		if (obj instanceof Bounds) {
			min = obj.min;
			max = obj.max;
		} else {
			min = max = obj;
		}

		return (min.x >= this.min.x) &&
		       (max.x <= this.max.x) &&
		       (min.y >= this.min.y) &&
		       (max.y <= this.max.y);
	},

	// @method intersects(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle intersects the given bounds. Two bounds
	// intersect if they have at least one point in common.
	intersects: function (bounds) { // (Bounds) -> Boolean
		bounds = toBounds(bounds);

		var min = this.min,
		    max = this.max,
		    min2 = bounds.min,
		    max2 = bounds.max,
		    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
		    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	},

	// @method overlaps(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle overlaps the given bounds. Two bounds
	// overlap if their intersection is an area.
	overlaps: function (bounds) { // (Bounds) -> Boolean
		bounds = toBounds(bounds);

		var min = this.min,
		    max = this.max,
		    min2 = bounds.min,
		    max2 = bounds.max,
		    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
		    yOverlaps = (max2.y > min.y) && (min2.y < max.y);

		return xOverlaps && yOverlaps;
	},

	isValid: function () {
		return !!(this.min && this.max);
	}
};


// @factory L.bounds(corner1: Point, corner2: Point)
// Creates a Bounds object from two corners coordinate pairs.
// @alternative
// @factory L.bounds(points: Point[])
// Creates a Bounds object from the given array of points.
function toBounds(a, b) {
	if (!a || a instanceof Bounds) {
		return a;
	}
	return new Bounds(a, b);
}

/*
 * @class LatLngBounds
 * @aka L.LatLngBounds
 *
 * Represents a rectangular geographical area on a map.
 *
 * @example
 *
 * ```js
 * var corner1 = L.latLng(40.712, -74.227),
 * corner2 = L.latLng(40.774, -74.125),
 * bounds = L.latLngBounds(corner1, corner2);
 * ```
 *
 * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```js
 * map.fitBounds([
 * 	[40.712, -74.227],
 * 	[40.774, -74.125]
 * ]);
 * ```
 *
 * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
 *
 * Note that `LatLngBounds` does not inherit from Leafet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function LatLngBounds(corner1, corner2) { // (LatLng, LatLng) or (LatLng[])
	if (!corner1) { return; }

	var latlngs = corner2 ? [corner1, corner2] : corner1;

	for (var i = 0, len = latlngs.length; i < len; i++) {
		this.extend(latlngs[i]);
	}
}

LatLngBounds.prototype = {

	// @method extend(latlng: LatLng): this
	// Extend the bounds to contain the given point

	// @alternative
	// @method extend(otherBounds: LatLngBounds): this
	// Extend the bounds to contain the given bounds
	extend: function (obj) {
		var sw = this._southWest,
		    ne = this._northEast,
		    sw2, ne2;

		if (obj instanceof LatLng) {
			sw2 = obj;
			ne2 = obj;

		} else if (obj instanceof LatLngBounds) {
			sw2 = obj._southWest;
			ne2 = obj._northEast;

			if (!sw2 || !ne2) { return this; }

		} else {
			return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
		}

		if (!sw && !ne) {
			this._southWest = new LatLng(sw2.lat, sw2.lng);
			this._northEast = new LatLng(ne2.lat, ne2.lng);
		} else {
			sw.lat = Math.min(sw2.lat, sw.lat);
			sw.lng = Math.min(sw2.lng, sw.lng);
			ne.lat = Math.max(ne2.lat, ne.lat);
			ne.lng = Math.max(ne2.lng, ne.lng);
		}

		return this;
	},

	// @method pad(bufferRatio: Number): LatLngBounds
	// Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
	// For example, a ratio of 0.5 extends the bounds by 50% in each direction.
	// Negative values will retract the bounds.
	pad: function (bufferRatio) {
		var sw = this._southWest,
		    ne = this._northEast,
		    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
		    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

		return new LatLngBounds(
		        new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
		        new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	},

	// @method getCenter(): LatLng
	// Returns the center point of the bounds.
	getCenter: function () {
		return new LatLng(
		        (this._southWest.lat + this._northEast.lat) / 2,
		        (this._southWest.lng + this._northEast.lng) / 2);
	},

	// @method getSouthWest(): LatLng
	// Returns the south-west point of the bounds.
	getSouthWest: function () {
		return this._southWest;
	},

	// @method getNorthEast(): LatLng
	// Returns the north-east point of the bounds.
	getNorthEast: function () {
		return this._northEast;
	},

	// @method getNorthWest(): LatLng
	// Returns the north-west point of the bounds.
	getNorthWest: function () {
		return new LatLng(this.getNorth(), this.getWest());
	},

	// @method getSouthEast(): LatLng
	// Returns the south-east point of the bounds.
	getSouthEast: function () {
		return new LatLng(this.getSouth(), this.getEast());
	},

	// @method getWest(): Number
	// Returns the west longitude of the bounds
	getWest: function () {
		return this._southWest.lng;
	},

	// @method getSouth(): Number
	// Returns the south latitude of the bounds
	getSouth: function () {
		return this._southWest.lat;
	},

	// @method getEast(): Number
	// Returns the east longitude of the bounds
	getEast: function () {
		return this._northEast.lng;
	},

	// @method getNorth(): Number
	// Returns the north latitude of the bounds
	getNorth: function () {
		return this._northEast.lat;
	},

	// @method contains(otherBounds: LatLngBounds): Boolean
	// Returns `true` if the rectangle contains the given one.

	// @alternative
	// @method contains (latlng: LatLng): Boolean
	// Returns `true` if the rectangle contains the given point.
	contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
		if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
			obj = toLatLng(obj);
		} else {
			obj = toLatLngBounds(obj);
		}

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2, ne2;

		if (obj instanceof LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	},

	// @method intersects(otherBounds: LatLngBounds): Boolean
	// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
	intersects: function (bounds) {
		bounds = toLatLngBounds(bounds);

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2 = bounds.getSouthWest(),
		    ne2 = bounds.getNorthEast(),

		    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
		    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	},

	// @method overlaps(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
	overlaps: function (bounds) {
		bounds = toLatLngBounds(bounds);

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2 = bounds.getSouthWest(),
		    ne2 = bounds.getNorthEast(),

		    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
		    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

		return latOverlaps && lngOverlaps;
	},

	// @method toBBoxString(): String
	// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
	toBBoxString: function () {
		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	},

	// @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
	// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
	equals: function (bounds, maxMargin) {
		if (!bounds) { return false; }

		bounds = toLatLngBounds(bounds);

		return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
		       this._northEast.equals(bounds.getNorthEast(), maxMargin);
	},

	// @method isValid(): Boolean
	// Returns `true` if the bounds are properly initialized.
	isValid: function () {
		return !!(this._southWest && this._northEast);
	}
};

// TODO International date line?

// @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
// Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

// @alternative
// @factory L.latLngBounds(latlngs: LatLng[])
// Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
function toLatLngBounds(a, b) {
	if (a instanceof LatLngBounds) {
		return a;
	}
	return new LatLngBounds(a, b);
}

/* @class LatLng
 * @aka L.LatLng
 *
 * Represents a geographical point with a certain latitude and longitude.
 *
 * @example
 *
 * ```
 * var latlng = L.latLng(50.5, 30.5);
 * ```
 *
 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
 *
 * ```
 * map.panTo([50, 30]);
 * map.panTo({lon: 30, lat: 50});
 * map.panTo({lat: 50, lng: 30});
 * map.panTo(L.latLng(50, 30));
 * ```
 *
 * Note that `LatLng` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function LatLng(lat, lng, alt) {
	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	}

	// @property lat: Number
	// Latitude in degrees
	this.lat = +lat;

	// @property lng: Number
	// Longitude in degrees
	this.lng = +lng;

	// @property alt: Number
	// Altitude in meters (optional)
	if (alt !== undefined) {
		this.alt = +alt;
	}
}

LatLng.prototype = {
	// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
	// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
	equals: function (obj, maxMargin) {
		if (!obj) { return false; }

		obj = toLatLng(obj);

		var margin = Math.max(
		        Math.abs(this.lat - obj.lat),
		        Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
	},

	// @method toString(): String
	// Returns a string representation of the point (for debugging purposes).
	toString: function (precision) {
		return 'LatLng(' +
		        formatNum(this.lat, precision) + ', ' +
		        formatNum(this.lng, precision) + ')';
	},

	// @method distanceTo(otherLatLng: LatLng): Number
	// Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
	distanceTo: function (other) {
		return Earth.distance(this, toLatLng(other));
	},

	// @method wrap(): LatLng
	// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
	wrap: function () {
		return Earth.wrapLatLng(this);
	},

	// @method toBounds(sizeInMeters: Number): LatLngBounds
	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
	toBounds: function (sizeInMeters) {
		var latAccuracy = 180 * sizeInMeters / 40075017,
		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

		return toLatLngBounds(
		        [this.lat - latAccuracy, this.lng - lngAccuracy],
		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
	},

	clone: function () {
		return new LatLng(this.lat, this.lng, this.alt);
	}
};



// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

// @alternative
// @factory L.latLng(coords: Array): LatLng
// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

// @alternative
// @factory L.latLng(coords: Object): LatLng
// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

function toLatLng(a, b, c) {
	if (a instanceof LatLng) {
		return a;
	}
	if (isArray(a) && typeof a[0] !== 'object') {
		if (a.length === 3) {
			return new LatLng(a[0], a[1], a[2]);
		}
		if (a.length === 2) {
			return new LatLng(a[0], a[1]);
		}
		return null;
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
	}
	if (b === undefined) {
		return null;
	}
	return new LatLng(a, b, c);
}

/*
 * @namespace CRS
 * @crs L.CRS.Base
 * Object that defines coordinate reference systems for projecting
 * geographical points into pixel (screen) coordinates and back (and to
 * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
 * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
 *
 * Leaflet defines the most usual CRSs by default. If you want to use a
 * CRS not defined by default, take a look at the
 * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
 *
 * Note that the CRS instances do not inherit from Leafet's `Class` object,
 * and can't be instantiated. Also, new classes can't inherit from them,
 * and methods can't be added to them with the `include` function.
 */

var CRS = {
	// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
	// Projects geographical coordinates into pixel coordinates for a given zoom.
	latLngToPoint: function (latlng, zoom) {
		var projectedPoint = this.projection.project(latlng),
		    scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	},

	// @method pointToLatLng(point: Point, zoom: Number): LatLng
	// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
	// zoom into geographical coordinates.
	pointToLatLng: function (point, zoom) {
		var scale = this.scale(zoom),
		    untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	},

	// @method project(latlng: LatLng): Point
	// Projects geographical coordinates into coordinates in units accepted for
	// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
	project: function (latlng) {
		return this.projection.project(latlng);
	},

	// @method unproject(point: Point): LatLng
	// Given a projected coordinate returns the corresponding LatLng.
	// The inverse of `project`.
	unproject: function (point) {
		return this.projection.unproject(point);
	},

	// @method scale(zoom: Number): Number
	// Returns the scale used when transforming projected coordinates into
	// pixel coordinates for a particular zoom. For example, it returns
	// `256 * 2^zoom` for Mercator-based CRS.
	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	},

	// @method zoom(scale: Number): Number
	// Inverse of `scale()`, returns the zoom level corresponding to a scale
	// factor of `scale`.
	zoom: function (scale) {
		return Math.log(scale / 256) / Math.LN2;
	},

	// @method getProjectedBounds(zoom: Number): Bounds
	// Returns the projection's bounds scaled and transformed for the provided `zoom`.
	getProjectedBounds: function (zoom) {
		if (this.infinite) { return null; }

		var b = this.projection.bounds,
		    s = this.scale(zoom),
		    min = this.transformation.transform(b.min, s),
		    max = this.transformation.transform(b.max, s);

		return new Bounds(min, max);
	},

	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
	// Returns the distance between two geographical coordinates.

	// @property code: String
	// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
	//
	// @property wrapLng: Number[]
	// An array of two numbers defining whether the longitude (horizontal) coordinate
	// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
	// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
	//
	// @property wrapLat: Number[]
	// Like `wrapLng`, but for the latitude (vertical) axis.

	// wrapLng: [min, max],
	// wrapLat: [min, max],

	// @property infinite: Boolean
	// If true, the coordinate space will be unbounded (infinite in both axes)
	infinite: false,

	// @method wrapLatLng(latlng: LatLng): LatLng
	// Returns a `LatLng` where lat and lng has been wrapped according to the
	// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
	wrapLatLng: function (latlng) {
		var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
		    lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
		    alt = latlng.alt;

		return new LatLng(lat, lng, alt);
	},

	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
	// Returns a `LatLngBounds` with the same size as the given one, ensuring
	// that its center is within the CRS's bounds.
	// Only accepts actual `L.LatLngBounds` instances, not arrays.
	wrapLatLngBounds: function (bounds) {
		var center = bounds.getCenter(),
		    newCenter = this.wrapLatLng(center),
		    latShift = center.lat - newCenter.lat,
		    lngShift = center.lng - newCenter.lng;

		if (latShift === 0 && lngShift === 0) {
			return bounds;
		}

		var sw = bounds.getSouthWest(),
		    ne = bounds.getNorthEast(),
		    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
		    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

		return new LatLngBounds(newSw, newNe);
	}
};

/*
 * @namespace CRS
 * @crs L.CRS.Earth
 *
 * Serves as the base for CRS that are global such that they cover the earth.
 * Can only be used as the base for other CRS and cannot be used directly,
 * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
 * meters.
 */

var Earth = extend({}, CRS, {
	wrapLng: [-180, 180],

	// Mean Earth Radius, as recommended for use by
	// the International Union of Geodesy and Geophysics,
	// see http://rosettacode.org/wiki/Haversine_formula
	R: 6371000,

	// distance between two geographical points using spherical law of cosines approximation
	distance: function (latlng1, latlng2) {
		var rad = Math.PI / 180,
		    lat1 = latlng1.lat * rad,
		    lat2 = latlng2.lat * rad,
		    sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
		    sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2),
		    a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
		    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return this.R * c;
	}
});

/*
 * @namespace Projection
 * @projection L.Projection.SphericalMercator
 *
 * Spherical Mercator projection ??? the most common projection for online maps,
 * used by almost all free and commercial tile providers. Assumes that Earth is
 * a sphere. Used by the `EPSG:3857` CRS.
 */

var earthRadius = 6378137;

var SphericalMercator = {

	R: earthRadius,
	MAX_LATITUDE: 85.0511287798,

	project: function (latlng) {
		var d = Math.PI / 180,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    sin = Math.sin(lat * d);

		return new Point(
			this.R * latlng.lng * d,
			this.R * Math.log((1 + sin) / (1 - sin)) / 2);
	},

	unproject: function (point) {
		var d = 180 / Math.PI;

		return new LatLng(
			(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
			point.x * d / this.R);
	},

	bounds: (function () {
		var d = earthRadius * Math.PI;
		return new Bounds([-d, -d], [d, d]);
	})()
};

/*
 * @class Transformation
 * @aka L.Transformation
 *
 * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
 * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
 * the reverse. Used by Leaflet in its projections code.
 *
 * @example
 *
 * ```js
 * var transformation = L.transformation(2, 5, -1, 10),
 * 	p = L.point(1, 2),
 * 	p2 = transformation.transform(p), //  L.point(7, 8)
 * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
 * ```
 */


// factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
// Creates a `Transformation` object with the given coefficients.
function Transformation(a, b, c, d) {
	if (isArray(a)) {
		// use array properties
		this._a = a[0];
		this._b = a[1];
		this._c = a[2];
		this._d = a[3];
		return;
	}
	this._a = a;
	this._b = b;
	this._c = c;
	this._d = d;
}

Transformation.prototype = {
	// @method transform(point: Point, scale?: Number): Point
	// Returns a transformed point, optionally multiplied by the given scale.
	// Only accepts actual `L.Point` instances, not arrays.
	transform: function (point, scale) { // (Point, Number) -> Point
		return this._transform(point.clone(), scale);
	},

	// destructive transform (faster)
	_transform: function (point, scale) {
		scale = scale || 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	},

	// @method untransform(point: Point, scale?: Number): Point
	// Returns the reverse transformation of the given point, optionally divided
	// by the given scale. Only accepts actual `L.Point` instances, not arrays.
	untransform: function (point, scale) {
		scale = scale || 1;
		return new Point(
		        (point.x / scale - this._b) / this._a,
		        (point.y / scale - this._d) / this._c);
	}
};

// factory L.transformation(a: Number, b: Number, c: Number, d: Number)

// @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
// Instantiates a Transformation object with the given coefficients.

// @alternative
// @factory L.transformation(coefficients: Array): Transformation
// Expects an coefficients array of the form
// `[a: Number, b: Number, c: Number, d: Number]`.

function toTransformation(a, b, c, d) {
	return new Transformation(a, b, c, d);
}

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3857
 *
 * The most common CRS for online maps, used by almost all free and commercial
 * tile providers. Uses Spherical Mercator projection. Set in by default in
 * Map's `crs` option.
 */

var EPSG3857 = extend({}, Earth, {
	code: 'EPSG:3857',
	projection: SphericalMercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * SphericalMercator.R);
		return toTransformation(scale, 0.5, -scale, 0.5);
	}())
});

var EPSG900913 = extend({}, EPSG3857, {
	code: 'EPSG:900913'
});

// @namespace SVG; @section
// There are several static functions which can be called without instantiating L.SVG:

// @function create(name: String): SVGElement
// Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
// corresponding to the class name passed. For example, using 'line' will return
// an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
function svgCreate(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

// @function pointsToPath(rings: Point[], closed: Boolean): String
// Generates a SVG path string for multiple rings, with each ring turning
// into "M..L..L.." instructions
function pointsToPath(rings, closed) {
	var str = '',
	i, j, len, len2, points, p;

	for (i = 0, len = rings.length; i < len; i++) {
		points = rings[i];

		for (j = 0, len2 = points.length; j < len2; j++) {
			p = points[j];
			str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
		}

		// closes the ring for polygons; "x" is VML syntax
		str += closed ? (svg ? 'z' : 'x') : '';
	}

	// SVG complains about empty path strings
	return str || 'M0 0';
}

/*
 * @namespace Browser
 * @aka L.Browser
 *
 * A namespace with static properties for browser/feature detection used by Leaflet internally.
 *
 * @example
 *
 * ```js
 * if (L.Browser.ielt9) {
 *   alert('Upgrade your browser, dude!');
 * }
 * ```
 */

var style$1 = document.documentElement.style;

// @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
var ie = 'ActiveXObject' in window;

// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
var ielt9 = ie && !document.addEventListener;

// @property edge: Boolean; `true` for the Edge web browser.
var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
var webkit = userAgentContains('webkit');

// @property android: Boolean
// `true` for any browser running on an Android platform.
var android = userAgentContains('android');

// @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
var android23 = userAgentContains('android 2') || userAgentContains('android 3');

/* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
// @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
var androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

// @property opera: Boolean; `true` for the Opera browser
var opera = !!window.opera;

// @property chrome: Boolean; `true` for the Chrome browser.
var chrome = userAgentContains('chrome');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

// @property safari: Boolean; `true` for the Safari browser.
var safari = !chrome && userAgentContains('safari');

var phantom = userAgentContains('phantom');

// @property opera12: Boolean
// `true` for the Opera browser supporting CSS transforms (version 12 or later).
var opera12 = 'OTransition' in style$1;

// @property win: Boolean; `true` when the browser is running in a Windows platform
var win = navigator.platform.indexOf('Win') === 0;

// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
var ie3d = ie && ('transition' in style$1);

// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
var gecko3d = 'MozPerspective' in style$1;

// @property any3d: Boolean
// `true` for all browsers supporting CSS transforms.
var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
var mobileWebkit = mobile && webkit;

// @property mobileWebkit3d: Boolean
// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
var mobileWebkit3d = mobile && webkit3d;

// @property msPointer: Boolean
// `true` for browsers implementing the Microsoft touch events model (notably IE10).
var msPointer = !window.PointerEvent && window.MSPointerEvent;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
var pointer = !webkit && !!(window.PointerEvent || msPointer);

// @property touch: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// This does not necessarily mean that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
		(window.DocumentTouch && document instanceof window.DocumentTouch));

// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
var mobileOpera = mobile && opera;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
var mobileGecko = mobile && gecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

// @property passiveEvents: Boolean
// `true` for browsers that support passive events.
var passiveEvents = (function () {
	var supportsPassiveOption = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function () {
				supportsPassiveOption = true;
			}
		});
		window.addEventListener('testPassiveEventSupport', falseFn, opts);
		window.removeEventListener('testPassiveEventSupport', falseFn, opts);
	} catch (e) {
		// Errors can safely be ignored since this is only a browser support test.
	}
	return supportsPassiveOption;
});

// @property canvas: Boolean
// `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
var canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

// @property svg: Boolean
// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

// @property vml: Boolean
// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
var vml = !svg && (function () {
	try {
		var div = document.createElement('div');
		div.innerHTML = '<v:shape adj="1"/>';

		var shape = div.firstChild;
		shape.style.behavior = 'url(#default#VML)';

		return shape && (typeof shape.adj === 'object');

	} catch (e) {
		return false;
	}
}());


function userAgentContains(str) {
	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
}


var Browser = (Object.freeze || Object)({
	ie: ie,
	ielt9: ielt9,
	edge: edge,
	webkit: webkit,
	android: android,
	android23: android23,
	androidStock: androidStock,
	opera: opera,
	chrome: chrome,
	gecko: gecko,
	safari: safari,
	phantom: phantom,
	opera12: opera12,
	win: win,
	ie3d: ie3d,
	webkit3d: webkit3d,
	gecko3d: gecko3d,
	any3d: any3d,
	mobile: mobile,
	mobileWebkit: mobileWebkit,
	mobileWebkit3d: mobileWebkit3d,
	msPointer: msPointer,
	pointer: pointer,
	touch: touch,
	mobileOpera: mobileOpera,
	mobileGecko: mobileGecko,
	retina: retina,
	passiveEvents: passiveEvents,
	canvas: canvas,
	svg: svg,
	vml: vml
});

/*
 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
 */


var POINTER_DOWN =   msPointer ? 'MSPointerDown'   : 'pointerdown';
var POINTER_MOVE =   msPointer ? 'MSPointerMove'   : 'pointermove';
var POINTER_UP =     msPointer ? 'MSPointerUp'     : 'pointerup';
var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';
var TAG_WHITE_LIST = ['INPUT', 'SELECT', 'OPTION'];

var _pointers = {};
var _pointerDocListener = false;

// DomEvent.DoubleTap needs to know about this
var _pointersCount = 0;

// Provides a touch events wrapper for (ms)pointer events.
// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

function addPointerListener(obj, type, handler, id) {
	if (type === 'touchstart') {
		_addPointerStart(obj, handler, id);

	} else if (type === 'touchmove') {
		_addPointerMove(obj, handler, id);

	} else if (type === 'touchend') {
		_addPointerEnd(obj, handler, id);
	}

	return this;
}

function removePointerListener(obj, type, id) {
	var handler = obj['_leaflet_' + type + id];

	if (type === 'touchstart') {
		obj.removeEventListener(POINTER_DOWN, handler, false);

	} else if (type === 'touchmove') {
		obj.removeEventListener(POINTER_MOVE, handler, false);

	} else if (type === 'touchend') {
		obj.removeEventListener(POINTER_UP, handler, false);
		obj.removeEventListener(POINTER_CANCEL, handler, false);
	}

	return this;
}

function _addPointerStart(obj, handler, id) {
	var onDown = bind(function (e) {
		if (e.pointerType !== 'mouse' && e.MSPOINTER_TYPE_MOUSE && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
			// In IE11, some touch events needs to fire for form controls, or
			// the controls will stop working. We keep a whitelist of tag names that
			// need these events. For other target tags, we prevent default on the event.
			if (TAG_WHITE_LIST.indexOf(e.target.tagName) < 0) {
				preventDefault(e);
			} else {
				return;
			}
		}

		_handlePointer(e, handler);
	});

	obj['_leaflet_touchstart' + id] = onDown;
	obj.addEventListener(POINTER_DOWN, onDown, false);

	// need to keep track of what pointers and how many are active to provide e.touches emulation
	if (!_pointerDocListener) {
		// we listen documentElement as any drags that end by moving the touch off the screen get fired there
		document.documentElement.addEventListener(POINTER_DOWN, _globalPointerDown, true);
		document.documentElement.addEventListener(POINTER_MOVE, _globalPointerMove, true);
		document.documentElement.addEventListener(POINTER_UP, _globalPointerUp, true);
		document.documentElement.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

		_pointerDocListener = true;
	}
}

function _globalPointerDown(e) {
	_pointers[e.pointerId] = e;
	_pointersCount++;
}

function _globalPointerMove(e) {
	if (_pointers[e.pointerId]) {
		_pointers[e.pointerId] = e;
	}
}

function _globalPointerUp(e) {
	delete _pointers[e.pointerId];
	_pointersCount--;
}

function _handlePointer(e, handler) {
	e.touches = [];
	for (var i in _pointers) {
		e.touches.push(_pointers[i]);
	}
	e.changedTouches = [e];

	handler(e);
}

function _addPointerMove(obj, handler, id) {
	var onMove = function (e) {
		// don't fire touch moves when mouse isn't down
		if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

		_handlePointer(e, handler);
	};

	obj['_leaflet_touchmove' + id] = onMove;
	obj.addEventListener(POINTER_MOVE, onMove, false);
}

function _addPointerEnd(obj, handler, id) {
	var onUp = function (e) {
		_handlePointer(e, handler);
	};

	obj['_leaflet_touchend' + id] = onUp;
	obj.addEventListener(POINTER_UP, onUp, false);
	obj.addEventListener(POINTER_CANCEL, onUp, false);
}

/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
var _pre = '_leaflet_';

// inspired by Zepto touch code by Thomas Fuchs
function addDoubleTapListener(obj, handler, id) {
	var last, touch$$1,
	    doubleTap = false,
	    delay = 250;

	function onTouchStart(e) {
		var count;

		if (pointer) {
			if ((!edge) || e.pointerType === 'mouse') { return; }
			count = _pointersCount;
		} else {
			count = e.touches.length;
		}

		if (count > 1) { return; }

		var now = Date.now(),
		    delta = now - (last || now);

		touch$$1 = e.touches ? e.touches[0] : e;
		doubleTap = (delta > 0 && delta <= delay);
		last = now;
	}

	function onTouchEnd(e) {
		if (doubleTap && !touch$$1.cancelBubble) {
			if (pointer) {
				if ((!edge) || e.pointerType === 'mouse') { return; }
				// work around .type being readonly with MSPointer* events
				var newTouch = {},
				    prop, i;

				for (i in touch$$1) {
					prop = touch$$1[i];
					newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
				}
				touch$$1 = newTouch;
			}
			touch$$1.type = 'dblclick';
			touch$$1.button = 0;
			handler(touch$$1);
			last = null;
		}
	}

	obj[_pre + _touchstart + id] = onTouchStart;
	obj[_pre + _touchend + id] = onTouchEnd;
	obj[_pre + 'dblclick' + id] = handler;

	obj.addEventListener(_touchstart, onTouchStart, passiveEvents ? {passive: false} : false);
	obj.addEventListener(_touchend, onTouchEnd, passiveEvents ? {passive: false} : false);

	// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
	// the browser doesn't fire touchend/pointerup events but does fire
	// native dblclicks. See #4127.
	// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
	obj.addEventListener('dblclick', handler, false);

	return this;
}

function removeDoubleTapListener(obj, id) {
	var touchstart = obj[_pre + _touchstart + id],
	    touchend = obj[_pre + _touchend + id],
	    dblclick = obj[_pre + 'dblclick' + id];

	obj.removeEventListener(_touchstart, touchstart, passiveEvents ? {passive: false} : false);
	obj.removeEventListener(_touchend, touchend, passiveEvents ? {passive: false} : false);
	if (!edge) {
		obj.removeEventListener('dblclick', dblclick, false);
	}

	return this;
}

/*
 * @namespace DomUtil
 *
 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
 * tree, used by Leaflet internally.
 *
 * Most functions expecting or returning a `HTMLElement` also work for
 * SVG elements. The only difference is that classes refer to CSS classes
 * in HTML and SVG classes in SVG.
 */


// @property TRANSFORM: String
// Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
var TRANSFORM = testProp(
	['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

// webkitTransition comes first because some browser versions that drop vendor prefix don't do
// the same for the transitionend event, in particular the Android 4.1 stock browser

// @property TRANSITION: String
// Vendor-prefixed transition style name.
var TRANSITION = testProp(
	['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

// @property TRANSITION_END: String
// Vendor-prefixed transitionend event name.
var TRANSITION_END =
	TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';


// @function get(id: String|HTMLElement): HTMLElement
// Returns an element given its DOM id, or returns the element itself
// if it was passed directly.
function get(id) {
	return typeof id === 'string' ? document.getElementById(id) : id;
}

// @function getStyle(el: HTMLElement, styleAttrib: String): String
// Returns the value for a certain style attribute on an element,
// including computed values or values set through CSS.
function getStyle(el, style) {
	var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

	if ((!value || value === 'auto') && document.defaultView) {
		var css = document.defaultView.getComputedStyle(el, null);
		value = css ? css[style] : null;
	}
	return value === 'auto' ? null : value;
}

// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
// Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
function create$1(tagName, className, container) {
	var el = document.createElement(tagName);
	el.className = className || '';

	if (container) {
		container.appendChild(el);
	}
	return el;
}

// @function remove(el: HTMLElement)
// Removes `el` from its parent element
function remove(el) {
	var parent = el.parentNode;
	if (parent) {
		parent.removeChild(el);
	}
}

// @function empty(el: HTMLElement)
// Removes all of `el`'s children elements from `el`
function empty(el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

// @function toFront(el: HTMLElement)
// Makes `el` the last child of its parent, so it renders in front of the other children.
function toFront(el) {
	var parent = el.parentNode;
	if (parent && parent.lastChild !== el) {
		parent.appendChild(el);
	}
}

// @function toBack(el: HTMLElement)
// Makes `el` the first child of its parent, so it renders behind the other children.
function toBack(el) {
	var parent = el.parentNode;
	if (parent && parent.firstChild !== el) {
		parent.insertBefore(el, parent.firstChild);
	}
}

// @function hasClass(el: HTMLElement, name: String): Boolean
// Returns `true` if the element's class attribute contains `name`.
function hasClass(el, name) {
	if (el.classList !== undefined) {
		return el.classList.contains(name);
	}
	var className = getClass(el);
	return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
}

// @function addClass(el: HTMLElement, name: String)
// Adds `name` to the element's class attribute.
function addClass(el, name) {
	if (el.classList !== undefined) {
		var classes = splitWords(name);
		for (var i = 0, len = classes.length; i < len; i++) {
			el.classList.add(classes[i]);
		}
	} else if (!hasClass(el, name)) {
		var className = getClass(el);
		setClass(el, (className ? className + ' ' : '') + name);
	}
}

// @function removeClass(el: HTMLElement, name: String)
// Removes `name` from the element's class attribute.
function removeClass(el, name) {
	if (el.classList !== undefined) {
		el.classList.remove(name);
	} else {
		setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
	}
}

// @function setClass(el: HTMLElement, name: String)
// Sets the element's class.
function setClass(el, name) {
	if (el.className.baseVal === undefined) {
		el.className = name;
	} else {
		// in case of SVG element
		el.className.baseVal = name;
	}
}

// @function getClass(el: HTMLElement): String
// Returns the element's class.
function getClass(el) {
	// Check if the element is an SVGElementInstance and use the correspondingElement instead
	// (Required for linked SVG elements in IE11.)
	if (el.correspondingElement) {
		el = el.correspondingElement;
	}
	return el.className.baseVal === undefined ? el.className : el.className.baseVal;
}

// @function setOpacity(el: HTMLElement, opacity: Number)
// Set the opacity of an element (including old IE support).
// `opacity` must be a number from `0` to `1`.
function setOpacity(el, value) {
	if ('opacity' in el.style) {
		el.style.opacity = value;
	} else if ('filter' in el.style) {
		_setOpacityIE(el, value);
	}
}

function _setOpacityIE(el, value) {
	var filter = false,
	    filterName = 'DXImageTransform.Microsoft.Alpha';

	// filters collection throws an error if we try to retrieve a filter that doesn't exist
	try {
		filter = el.filters.item(filterName);
	} catch (e) {
		// don't set opacity to 1 if we haven't already set an opacity,
		// it isn't needed and breaks transparent pngs.
		if (value === 1) { return; }
	}

	value = Math.round(value * 100);

	if (filter) {
		filter.Enabled = (value !== 100);
		filter.Opacity = value;
	} else {
		el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
	}
}

// @function testProp(props: String[]): String|false
// Goes through the array of style names and returns the first name
// that is a valid style name for an element. If no such name is found,
// it returns false. Useful for vendor-prefixed styles like `transform`.
function testProp(props) {
	var style = document.documentElement.style;

	for (var i = 0; i < props.length; i++) {
		if (props[i] in style) {
			return props[i];
		}
	}
	return false;
}

// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
// Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
// and optionally scaled by `scale`. Does not have an effect if the
// browser doesn't support 3D CSS transforms.
function setTransform(el, offset, scale) {
	var pos = offset || new Point(0, 0);

	el.style[TRANSFORM] =
		(ie3d ?
			'translate(' + pos.x + 'px,' + pos.y + 'px)' :
			'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
		(scale ? ' scale(' + scale + ')' : '');
}

// @function setPosition(el: HTMLElement, position: Point)
// Sets the position of `el` to coordinates specified by `position`,
// using CSS translate or top/left positioning depending on the browser
// (used by Leaflet internally to position its layers).
function setPosition(el, point) {

	/*eslint-disable */
	el._leaflet_pos = point;
	/* eslint-enable */

	if (any3d) {
		setTransform(el, point);
	} else {
		el.style.left = point.x + 'px';
		el.style.top = point.y + 'px';
	}
}

// @function getPosition(el: HTMLElement): Point
// Returns the coordinates of an element previously positioned with setPosition.
function getPosition(el) {
	// this method is only used for elements previously positioned using setPosition,
	// so it's safe to cache the position for performance

	return el._leaflet_pos || new Point(0, 0);
}

// @function disableTextSelection()
// Prevents the user from generating `selectstart` DOM events, usually generated
// when the user drags the mouse through a page with text. Used internally
// by Leaflet to override the behaviour of any click-and-drag interaction on
// the map. Affects drag interactions on the whole document.

// @function enableTextSelection()
// Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
var disableTextSelection;
var enableTextSelection;
var _userSelect;
if ('onselectstart' in document) {
	disableTextSelection = function () {
		on(window, 'selectstart', preventDefault);
	};
	enableTextSelection = function () {
		off(window, 'selectstart', preventDefault);
	};
} else {
	var userSelectProperty = testProp(
		['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

	disableTextSelection = function () {
		if (userSelectProperty) {
			var style = document.documentElement.style;
			_userSelect = style[userSelectProperty];
			style[userSelectProperty] = 'none';
		}
	};
	enableTextSelection = function () {
		if (userSelectProperty) {
			document.documentElement.style[userSelectProperty] = _userSelect;
			_userSelect = undefined;
		}
	};
}

// @function disableImageDrag()
// As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
// for `dragstart` DOM events, usually generated when the user drags an image.
function disableImageDrag() {
	on(window, 'dragstart', preventDefault);
}

// @function enableImageDrag()
// Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
function enableImageDrag() {
	off(window, 'dragstart', preventDefault);
}

var _outlineElement;
var _outlineStyle;
// @function preventOutline(el: HTMLElement)
// Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
// of the element `el` invisible. Used internally by Leaflet to prevent
// focusable elements from displaying an outline when the user performs a
// drag interaction on them.
function preventOutline(element) {
	while (element.tabIndex === -1) {
		element = element.parentNode;
	}
	if (!element.style) { return; }
	restoreOutline();
	_outlineElement = element;
	_outlineStyle = element.style.outline;
	element.style.outline = 'none';
	on(window, 'keydown', restoreOutline);
}

// @function restoreOutline()
// Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
function restoreOutline() {
	if (!_outlineElement) { return; }
	_outlineElement.style.outline = _outlineStyle;
	_outlineElement = undefined;
	_outlineStyle = undefined;
	off(window, 'keydown', restoreOutline);
}

// @function getSizedParentNode(el: HTMLElement): HTMLElement
// Finds the closest parent node which size (width and height) is not null.
function getSizedParentNode(element) {
	do {
		element = element.parentNode;
	} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
	return element;
}

// @function getScale(el: HTMLElement): Object
// Computes the CSS scale currently applied on the element.
// Returns an object with `x` and `y` members as horizontal and vertical scales respectively,
// and `boundingClientRect` as the result of [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
function getScale(element) {
	var rect = element.getBoundingClientRect(); // Read-only in old browsers.

	return {
		x: rect.width / element.offsetWidth || 1,
		y: rect.height / element.offsetHeight || 1,
		boundingClientRect: rect
	};
}


var DomUtil = (Object.freeze || Object)({
	TRANSFORM: TRANSFORM,
	TRANSITION: TRANSITION,
	TRANSITION_END: TRANSITION_END,
	get: get,
	getStyle: getStyle,
	create: create$1,
	remove: remove,
	empty: empty,
	toFront: toFront,
	toBack: toBack,
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	setClass: setClass,
	getClass: getClass,
	setOpacity: setOpacity,
	testProp: testProp,
	setTransform: setTransform,
	setPosition: setPosition,
	getPosition: getPosition,
	disableTextSelection: disableTextSelection,
	enableTextSelection: enableTextSelection,
	disableImageDrag: disableImageDrag,
	enableImageDrag: enableImageDrag,
	preventOutline: preventOutline,
	restoreOutline: restoreOutline,
	getSizedParentNode: getSizedParentNode,
	getScale: getScale
});

/*
 * @namespace DomEvent
 * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
 */

// Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

// @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
// Adds a listener function (`fn`) to a particular DOM event type of the
// element `el`. You can optionally specify the context of the listener
// (object the `this` keyword will point to). You can also pass several
// space-separated types (e.g. `'click dblclick'`).

// @alternative
// @function on(el: HTMLElement, eventMap: Object, context?: Object): this
// Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
function on(obj, types, fn, context) {

	if (typeof types === 'object') {
		for (var type in types) {
			addOne(obj, type, types[type], fn);
		}
	} else {
		types = splitWords(types);

		for (var i = 0, len = types.length; i < len; i++) {
			addOne(obj, types[i], fn, context);
		}
	}

	return this;
}

var eventsKey = '_leaflet_events';

// @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
// Removes a previously added listener function.
// Note that if you passed a custom context to on, you must pass the same
// context to `off` in order to remove the listener.

// @alternative
// @function off(el: HTMLElement, eventMap: Object, context?: Object): this
// Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
function off(obj, types, fn, context) {

	if (typeof types === 'object') {
		for (var type in types) {
			removeOne(obj, type, types[type], fn);
		}
	} else if (types) {
		types = splitWords(types);

		for (var i = 0, len = types.length; i < len; i++) {
			removeOne(obj, types[i], fn, context);
		}
	} else {
		for (var j in obj[eventsKey]) {
			removeOne(obj, j, obj[eventsKey][j]);
		}
		delete obj[eventsKey];
	}

	return this;
}

function addOne(obj, type, fn, context) {
	var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

	if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

	var handler = function (e) {
		return fn.call(context || obj, e || window.event);
	};

	var originalHandler = handler;

	if (pointer && type.indexOf('touch') === 0) {
		// Needs DomEvent.Pointer.js
		addPointerListener(obj, type, handler, id);

	} else if (touch && (type === 'dblclick') && addDoubleTapListener &&
	           !(pointer && chrome)) {
		// Chrome >55 does not need the synthetic dblclicks from addDoubleTapListener
		// See #5180
		addDoubleTapListener(obj, handler, id);

	} else if ('addEventListener' in obj) {

		if (type === 'mousewheel') {
			obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, passiveEvents ? {passive: false} : false);

		} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
			handler = function (e) {
				e = e || window.event;
				if (isExternalTarget(obj, e)) {
					originalHandler(e);
				}
			};
			obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

		} else {
			if (type === 'click' && android) {
				handler = function (e) {
					filterClick(e, originalHandler);
				};
			}
			obj.addEventListener(type, handler, false);
		}

	} else if ('attachEvent' in obj) {
		obj.attachEvent('on' + type, handler);
	}

	obj[eventsKey] = obj[eventsKey] || {};
	obj[eventsKey][id] = handler;
}

function removeOne(obj, type, fn, context) {

	var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
	    handler = obj[eventsKey] && obj[eventsKey][id];

	if (!handler) { return this; }

	if (pointer && type.indexOf('touch') === 0) {
		removePointerListener(obj, type, id);

	} else if (touch && (type === 'dblclick') && removeDoubleTapListener &&
	           !(pointer && chrome)) {
		removeDoubleTapListener(obj, id);

	} else if ('removeEventListener' in obj) {

		if (type === 'mousewheel') {
			obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, passiveEvents ? {passive: false} : false);

		} else {
			obj.removeEventListener(
				type === 'mouseenter' ? 'mouseover' :
				type === 'mouseleave' ? 'mouseout' : type, handler, false);
		}

	} else if ('detachEvent' in obj) {
		obj.detachEvent('on' + type, handler);
	}

	obj[eventsKey][id] = null;
}

// @function stopPropagation(ev: DOMEvent): this
// Stop the given event from propagation to parent elements. Used inside the listener functions:
// ```js
// L.DomEvent.on(div, 'click', function (ev) {
// 	L.DomEvent.stopPropagation(ev);
// });
// ```
function stopPropagation(e) {

	if (e.stopPropagation) {
		e.stopPropagation();
	} else if (e.originalEvent) {  // In case of Leaflet event.
		e.originalEvent._stopped = true;
	} else {
		e.cancelBubble = true;
	}
	skipped(e);

	return this;
}

// @function disableScrollPropagation(el: HTMLElement): this
// Adds `stopPropagation` to the element's `'mousewheel'` events (plus browser variants).
function disableScrollPropagation(el) {
	addOne(el, 'mousewheel', stopPropagation);
	return this;
}

// @function disableClickPropagation(el: HTMLElement): this
// Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
// `'mousedown'` and `'touchstart'` events (plus browser variants).
function disableClickPropagation(el) {
	on(el, 'mousedown touchstart dblclick', stopPropagation);
	addOne(el, 'click', fakeStop);
	return this;
}

// @function preventDefault(ev: DOMEvent): this
// Prevents the default action of the DOM Event `ev` from happening (such as
// following a link in the href of the a element, or doing a POST request
// with page reload when a `<form>` is submitted).
// Use it inside listener functions.
function preventDefault(e) {
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
	return this;
}

// @function stop(ev: DOMEvent): this
// Does `stopPropagation` and `preventDefault` at the same time.
function stop(e) {
	preventDefault(e);
	stopPropagation(e);
	return this;
}

// @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
// Gets normalized mouse position from a DOM event relative to the
// `container` (border excluded) or to the whole page if not specified.
function getMousePosition(e, container) {
	if (!container) {
		return new Point(e.clientX, e.clientY);
	}

	var scale = getScale(container),
	    offset = scale.boundingClientRect; // left and top  values are in page scale (like the event clientX/Y)

	return new Point(
		// offset.left/top values are in page scale (like clientX/Y),
		// whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
		(e.clientX - offset.left) / scale.x - container.clientLeft,
		(e.clientY - offset.top) / scale.y - container.clientTop
	);
}

// Chrome on Win scrolls double the pixels as in other platforms (see #4538),
// and Firefox scrolls device pixels, not CSS pixels
var wheelPxFactor =
	(win && chrome) ? 2 * window.devicePixelRatio :
	gecko ? window.devicePixelRatio : 1;

// @function getWheelDelta(ev: DOMEvent): Number
// Gets normalized wheel delta from a mousewheel DOM event, in vertical
// pixels scrolled (negative if scrolling down).
// Events from pointing devices without precise scrolling are mapped to
// a best guess of 60 pixels.
function getWheelDelta(e) {
	return (edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
	       (e.deltaY && e.deltaMode === 0) ? -e.deltaY / wheelPxFactor : // Pixels
	       (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
	       (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
	       (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
	       e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
	       (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
	       e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
	       0;
}

var skipEvents = {};

function fakeStop(e) {
	// fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
	skipEvents[e.type] = true;
}

function skipped(e) {
	var events = skipEvents[e.type];
	// reset when checking, as it's only used in map container and propagates outside of the map
	skipEvents[e.type] = false;
	return events;
}

// check if element really left/entered the event target (for mouseenter/mouseleave)
function isExternalTarget(el, e) {

	var related = e.relatedTarget;

	if (!related) { return true; }

	try {
		while (related && (related !== el)) {
			related = related.parentNode;
		}
	} catch (err) {
		return false;
	}
	return (related !== el);
}

var lastClick;

// this is a horrible workaround for a bug in Android where a single touch triggers two click events
function filterClick(e, handler) {
	var timeStamp = (e.timeStamp || (e.originalEvent && e.originalEvent.timeStamp)),
	    elapsed = lastClick && (timeStamp - lastClick);

	// are they closer together than 500ms yet more than 100ms?
	// Android typically triggers them ~300ms apart while multiple listeners
	// on the same event should be triggered far faster;
	// or check if click is simulated on the element, and if it is, reject any non-simulated events

	if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
		stop(e);
		return;
	}
	lastClick = timeStamp;

	handler(e);
}




var DomEvent = (Object.freeze || Object)({
	on: on,
	off: off,
	stopPropagation: stopPropagation,
	disableScrollPropagation: disableScrollPropagation,
	disableClickPropagation: disableClickPropagation,
	preventDefault: preventDefault,
	stop: stop,
	getMousePosition: getMousePosition,
	getWheelDelta: getWheelDelta,
	fakeStop: fakeStop,
	skipped: skipped,
	isExternalTarget: isExternalTarget,
	addListener: on,
	removeListener: off
});

/*
 * @class PosAnimation
 * @aka L.PosAnimation
 * @inherits Evented
 * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
 *
 * @example
 * ```js
 * var fx = new L.PosAnimation();
 * fx.run(el, [300, 500], 0.5);
 * ```
 *
 * @constructor L.PosAnimation()
 * Creates a `PosAnimation` object.
 *
 */

var PosAnimation = Evented.extend({

	// @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
	// Run an animation of a given element to a new position, optionally setting
	// duration in seconds (`0.25` by default) and easing linearity factor (3rd
	// argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
	// `0.5` by default).
	run: function (el, newPos, duration, easeLinearity) {
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._duration = duration || 0.25;
		this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

		this._startPos = getPosition(el);
		this._offset = newPos.subtract(this._startPos);
		this._startTime = +new Date();

		// @event start: Event
		// Fired when the animation starts
		this.fire('start');

		this._animate();
	},

	// @method stop()
	// Stops the animation (if currently running).
	stop: function () {
		if (!this._inProgress) { return; }

		this._step(true);
		this._complete();
	},

	_animate: function () {
		// animation loop
		this._animId = requestAnimFrame(this._animate, this);
		this._step();
	},

	_step: function (round) {
		var elapsed = (+new Date()) - this._startTime,
		    duration = this._duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._easeOut(elapsed / duration), round);
		} else {
			this._runFrame(1);
			this._complete();
		}
	},

	_runFrame: function (progress, round) {
		var pos = this._startPos.add(this._offset.multiplyBy(progress));
		if (round) {
			pos._round();
		}
		setPosition(this._el, pos);

		// @event step: Event
		// Fired continuously during the animation.
		this.fire('step');
	},

	_complete: function () {
		cancelAnimFrame(this._animId);

		this._inProgress = false;
		// @event end: Event
		// Fired when the animation ends.
		this.fire('end');
	},

	_easeOut: function (t) {
		return 1 - Math.pow(1 - t, this._easeOutPower);
	}
});

/*
 * @class Map
 * @aka L.Map
 * @inherits Evented
 *
 * The central class of the API ??? it is used to create a map on a page and manipulate it.
 *
 * @example
 *
 * ```js
 * // initialize the map on the "map" div with a given center and zoom
 * var map = L.map('map', {
 * 	center: [51.505, -0.09],
 * 	zoom: 13
 * });
 * ```
 *
 */

var Map = Evented.extend({

	options: {
		// @section Map State Options
		// @option crs: CRS = L.CRS.EPSG3857
		// The [Coordinate Reference System](#crs) to use. Don't change this if you're not
		// sure what it means.
		crs: EPSG3857,

		// @option center: LatLng = undefined
		// Initial geographic center of the map
		center: undefined,

		// @option zoom: Number = undefined
		// Initial map zoom level
		zoom: undefined,

		// @option minZoom: Number = *
		// Minimum zoom level of the map.
		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
		// the lowest of their `minZoom` options will be used instead.
		minZoom: undefined,

		// @option maxZoom: Number = *
		// Maximum zoom level of the map.
		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
		// the highest of their `maxZoom` options will be used instead.
		maxZoom: undefined,

		// @option layers: Layer[] = []
		// Array of layers that will be added to the map initially
		layers: [],

		// @option maxBounds: LatLngBounds = null
		// When this option is set, the map restricts the view to the given
		// geographical bounds, bouncing the user back if the user tries to pan
		// outside the view. To set the restriction dynamically, use
		// [`setMaxBounds`](#map-setmaxbounds) method.
		maxBounds: undefined,

		// @option renderer: Renderer = *
		// The default method for drawing vector layers on the map. `L.SVG`
		// or `L.Canvas` by default depending on browser support.
		renderer: undefined,


		// @section Animation Options
		// @option zoomAnimation: Boolean = true
		// Whether the map zoom animation is enabled. By default it's enabled
		// in all browsers that support CSS3 Transitions except Android.
		zoomAnimation: true,

		// @option zoomAnimationThreshold: Number = 4
		// Won't animate zoom if the zoom difference exceeds this value.
		zoomAnimationThreshold: 4,

		// @option fadeAnimation: Boolean = true
		// Whether the tile fade animation is enabled. By default it's enabled
		// in all browsers that support CSS3 Transitions except Android.
		fadeAnimation: true,

		// @option markerZoomAnimation: Boolean = true
		// Whether markers animate their zoom with the zoom animation, if disabled
		// they will disappear for the length of the animation. By default it's
		// enabled in all browsers that support CSS3 Transitions except Android.
		markerZoomAnimation: true,

		// @option transform3DLimit: Number = 2^23
		// Defines the maximum size of a CSS translation transform. The default
		// value should not be changed unless a web browser positions layers in
		// the wrong place after doing a large `panBy`.
		transform3DLimit: 8388608, // Precision limit of a 32-bit float

		// @section Interaction Options
		// @option zoomSnap: Number = 1
		// Forces the map's zoom level to always be a multiple of this, particularly
		// right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
		// By default, the zoom level snaps to the nearest integer; lower values
		// (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
		// means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
		zoomSnap: 1,

		// @option zoomDelta: Number = 1
		// Controls how much the map's zoom level will change after a
		// [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
		// or `-` on the keyboard, or using the [zoom controls](#control-zoom).
		// Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
		zoomDelta: 1,

		// @option trackResize: Boolean = true
		// Whether the map automatically handles browser window resize to update itself.
		trackResize: true
	},

	initialize: function (id, options) { // (HTMLElement or String, Object)
		options = setOptions(this, options);

		// Make sure to assign internal flags at the beginning,
		// to avoid inconsistent state in some edge cases.
		this._handlers = [];
		this._layers = {};
		this._zoomBoundLayers = {};
		this._sizeChanged = true;

		this._initContainer(id);
		this._initLayout();

		// hack for https://github.com/Leaflet/Leaflet/issues/1980
		this._onResize = bind(this._onResize, this);

		this._initEvents();

		if (options.maxBounds) {
			this.setMaxBounds(options.maxBounds);
		}

		if (options.zoom !== undefined) {
			this._zoom = this._limitZoom(options.zoom);
		}

		if (options.center && options.zoom !== undefined) {
			this.setView(toLatLng(options.center), options.zoom, {reset: true});
		}

		this.callInitHooks();

		// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
		this._zoomAnimated = TRANSITION && any3d && !mobileOpera &&
				this.options.zoomAnimation;

		// zoom transitions run with the same duration for all layers, so if one of transitionend events
		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
		if (this._zoomAnimated) {
			this._createAnimProxy();
			on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
		}

		this._addLayers(this.options.layers);
	},


	// @section Methods for modifying map state

	// @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
	// Sets the view of the map (geographical center and zoom) with the given
	// animation options.
	setView: function (center, zoom, options) {

		zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
		center = this._limitCenter(toLatLng(center), zoom, this.options.maxBounds);
		options = options || {};

		this._stop();

		if (this._loaded && !options.reset && options !== true) {

			if (options.animate !== undefined) {
				options.zoom = extend({animate: options.animate}, options.zoom);
				options.pan = extend({animate: options.animate, duration: options.duration}, options.pan);
			}

			// try animating pan or zoom
			var moved = (this._zoom !== zoom) ?
				this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
				this._tryAnimatedPan(center, options.pan);

			if (moved) {
				// prevent resize handler call, the view will refresh after animation anyway
				clearTimeout(this._sizeTimer);
				return this;
			}
		}

		// animation didn't start, just reset the map view
		this._resetView(center, zoom);

		return this;
	},

	// @method setZoom(zoom: Number, options?: Zoom/pan options): this
	// Sets the zoom of the map.
	setZoom: function (zoom, options) {
		if (!this._loaded) {
			this._zoom = zoom;
			return this;
		}
		return this.setView(this.getCenter(), zoom, {zoom: options});
	},

	// @method zoomIn(delta?: Number, options?: Zoom options): this
	// Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	zoomIn: function (delta, options) {
		delta = delta || (any3d ? this.options.zoomDelta : 1);
		return this.setZoom(this._zoom + delta, options);
	},

	// @method zoomOut(delta?: Number, options?: Zoom options): this
	// Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	zoomOut: function (delta, options) {
		delta = delta || (any3d ? this.options.zoomDelta : 1);
		return this.setZoom(this._zoom - delta, options);
	},

	// @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
	// Zooms the map while keeping a specified geographical point on the map
	// stationary (e.g. used internally for scroll zoom and double-click zoom).
	// @alternative
	// @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
	// Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
	setZoomAround: function (latlng, zoom, options) {
		var scale = this.getZoomScale(zoom),
		    viewHalf = this.getSize().divideBy(2),
		    containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng),

		    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
		    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

		return this.setView(newCenter, zoom, {zoom: options});
	},

	_getBoundsCenterZoom: function (bounds, options) {

		options = options || {};
		bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);

		var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
		    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),

		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

		zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

		if (zoom === Infinity) {
			return {
				center: bounds.getCenter(),
				zoom: zoom
			};
		}

		var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

		    swPoint = this.project(bounds.getSouthWest(), zoom),
		    nePoint = this.project(bounds.getNorthEast(), zoom),
		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

		return {
			center: center,
			zoom: zoom
		};
	},

	// @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
	// Sets a map view that contains the given geographical bounds with the
	// maximum zoom level possible.
	fitBounds: function (bounds, options) {

		bounds = toLatLngBounds(bounds);

		if (!bounds.isValid()) {
			throw new Error('Bounds are not valid.');
		}

		var target = this._getBoundsCenterZoom(bounds, options);
		return this.setView(target.center, target.zoom, options);
	},

	// @method fitWorld(options?: fitBounds options): this
	// Sets a map view that mostly contains the whole world with the maximum
	// zoom level possible.
	fitWorld: function (options) {
		return this.fitBounds([[-90, -180], [90, 180]], options);
	},

	// @method panTo(latlng: LatLng, options?: Pan options): this
	// Pans the map to a given center.
	panTo: function (center, options) { // (LatLng)
		return this.setView(center, this._zoom, {pan: options});
	},

	// @method panBy(offset: Point, options?: Pan options): this
	// Pans the map by a given number of pixels (animated).
	panBy: function (offset, options) {
		offset = toPoint(offset).round();
		options = options || {};

		if (!offset.x && !offset.y) {
			return this.fire('moveend');
		}
		// If we pan too far, Chrome gets issues with tiles
		// and makes them disappear or appear in the wrong place (slightly offset) #2602
		if (options.animate !== true && !this.getSize().contains(offset)) {
			this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
			return this;
		}

		if (!this._panAnim) {
			this._panAnim = new PosAnimation();

			this._panAnim.on({
				'step': this._onPanTransitionStep,
				'end': this._onPanTransitionEnd
			}, this);
		}

		// don't fire movestart if animating inertia
		if (!options.noMoveStart) {
			this.fire('movestart');
		}

		// animate pan unless animate: false specified
		if (options.animate !== false) {
			addClass(this._mapPane, 'leaflet-pan-anim');

			var newPos = this._getMapPanePos().subtract(offset).round();
			this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
		} else {
			this._rawPanBy(offset);
			this.fire('move').fire('moveend');
		}

		return this;
	},

	// @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
	// Sets the view of the map (geographical center and zoom) performing a smooth
	// pan-zoom animation.
	flyTo: function (targetCenter, targetZoom, options) {

		options = options || {};
		if (options.animate === false || !any3d) {
			return this.setView(targetCenter, targetZoom, options);
		}

		this._stop();

		var from = this.project(this.getCenter()),
		    to = this.project(targetCenter),
		    size = this.getSize(),
		    startZoom = this._zoom;

		targetCenter = toLatLng(targetCenter);
		targetZoom = targetZoom === undefined ? startZoom : targetZoom;

		var w0 = Math.max(size.x, size.y),
		    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
		    u1 = (to.distanceTo(from)) || 1,
		    rho = 1.42,
		    rho2 = rho * rho;

		function r(i) {
			var s1 = i ? -1 : 1,
			    s2 = i ? w1 : w0,
			    t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
			    b1 = 2 * s2 * rho2 * u1,
			    b = t1 / b1,
			    sq = Math.sqrt(b * b + 1) - b;

			    // workaround for floating point precision bug when sq = 0, log = -Infinite,
			    // thus triggering an infinite loop in flyTo
			    var log = sq < 0.000000001 ? -18 : Math.log(sq);

			return log;
		}

		function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
		function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
		function tanh(n) { return sinh(n) / cosh(n); }

		var r0 = r(0);

		function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
		function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

		function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }

		var start = Date.now(),
		    S = (r(1) - r0) / rho,
		    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

		function frame() {
			var t = (Date.now() - start) / duration,
			    s = easeOut(t) * S;

			if (t <= 1) {
				this._flyToFrame = requestAnimFrame(frame, this);

				this._move(
					this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
					this.getScaleZoom(w0 / w(s), startZoom),
					{flyTo: true});

			} else {
				this
					._move(targetCenter, targetZoom)
					._moveEnd(true);
			}
		}

		this._moveStart(true, options.noMoveStart);

		frame.call(this);
		return this;
	},

	// @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
	// Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
	// but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
	flyToBounds: function (bounds, options) {
		var target = this._getBoundsCenterZoom(bounds, options);
		return this.flyTo(target.center, target.zoom, options);
	},

	// @method setMaxBounds(bounds: Bounds): this
	// Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
	setMaxBounds: function (bounds) {
		bounds = toLatLngBounds(bounds);

		if (!bounds.isValid()) {
			this.options.maxBounds = null;
			return this.off('moveend', this._panInsideMaxBounds);
		} else if (this.options.maxBounds) {
			this.off('moveend', this._panInsideMaxBounds);
		}

		this.options.maxBounds = bounds;

		if (this._loaded) {
			this._panInsideMaxBounds();
		}

		return this.on('moveend', this._panInsideMaxBounds);
	},

	// @method setMinZoom(zoom: Number): this
	// Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
	setMinZoom: function (zoom) {
		var oldZoom = this.options.minZoom;
		this.options.minZoom = zoom;

		if (this._loaded && oldZoom !== zoom) {
			this.fire('zoomlevelschange');

			if (this.getZoom() < this.options.minZoom) {
				return this.setZoom(zoom);
			}
		}

		return this;
	},

	// @method setMaxZoom(zoom: Number): this
	// Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
	setMaxZoom: function (zoom) {
		var oldZoom = this.options.maxZoom;
		this.options.maxZoom = zoom;

		if (this._loaded && oldZoom !== zoom) {
			this.fire('zoomlevelschange');

			if (this.getZoom() > this.options.maxZoom) {
				return this.setZoom(zoom);
			}
		}

		return this;
	},

	// @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
	// Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
	panInsideBounds: function (bounds, options) {
		this._enforcingBounds = true;
		var center = this.getCenter(),
		    newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));

		if (!center.equals(newCenter)) {
			this.panTo(newCenter, options);
		}

		this._enforcingBounds = false;
		return this;
	},

	// @method panInside(latlng: LatLng, options?: options): this
	// Pans the map the minimum amount to make the `latlng` visible. Use
	// `padding`, `paddingTopLeft` and `paddingTopRight` options to fit
	// the display to more restricted bounds, like [`fitBounds`](#map-fitbounds).
	// If `latlng` is already within the (optionally padded) display bounds,
	// the map will not be panned.
	panInside: function (latlng, options) {
		options = options || {};

		var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
		    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),
		    center = this.getCenter(),
		    pixelCenter = this.project(center),
		    pixelPoint = this.project(latlng),
		    pixelBounds = this.getPixelBounds(),
		    halfPixelBounds = pixelBounds.getSize().divideBy(2),
		    paddedBounds = toBounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]);

		if (!paddedBounds.contains(pixelPoint)) {
			this._enforcingBounds = true;
			var diff = pixelCenter.subtract(pixelPoint),
			    newCenter = toPoint(pixelPoint.x + diff.x, pixelPoint.y + diff.y);

			if (pixelPoint.x < paddedBounds.min.x || pixelPoint.x > paddedBounds.max.x) {
				newCenter.x = pixelCenter.x - diff.x;
				if (diff.x > 0) {
					newCenter.x += halfPixelBounds.x - paddingTL.x;
				} else {
					newCenter.x -= halfPixelBounds.x - paddingBR.x;
				}
			}
			if (pixelPoint.y < paddedBounds.min.y || pixelPoint.y > paddedBounds.max.y) {
				newCenter.y = pixelCenter.y - diff.y;
				if (diff.y > 0) {
					newCenter.y += halfPixelBounds.y - paddingTL.y;
				} else {
					newCenter.y -= halfPixelBounds.y - paddingBR.y;
				}
			}
			this.panTo(this.unproject(newCenter), options);
			this._enforcingBounds = false;
		}
		return this;
	},

	// @method invalidateSize(options: Zoom/pan options): this
	// Checks if the map container size changed and updates the map if so ???
	// call it after you've changed the map size dynamically, also animating
	// pan by default. If `options.pan` is `false`, panning will not occur.
	// If `options.debounceMoveend` is `true`, it will delay `moveend` event so
	// that it doesn't happen often even if the method is called many
	// times in a row.

	// @alternative
	// @method invalidateSize(animate: Boolean): this
	// Checks if the map container size changed and updates the map if so ???
	// call it after you've changed the map size dynamically, also animating
	// pan by default.
	invalidateSize: function (options) {
		if (!this._loaded) { return this; }

		options = extend({
			animate: false,
			pan: true
		}, options === true ? {animate: true} : options);

		var oldSize = this.getSize();
		this._sizeChanged = true;
		this._lastCenter = null;

		var newSize = this.getSize(),
		    oldCenter = oldSize.divideBy(2).round(),
		    newCenter = newSize.divideBy(2).round(),
		    offset = oldCenter.subtract(newCenter);

		if (!offset.x && !offset.y) { return this; }

		if (options.animate && options.pan) {
			this.panBy(offset);

		} else {
			if (options.pan) {
				this._rawPanBy(offset);
			}

			this.fire('move');

			if (options.debounceMoveend) {
				clearTimeout(this._sizeTimer);
				this._sizeTimer = setTimeout(bind(this.fire, this, 'moveend'), 200);
			} else {
				this.fire('moveend');
			}
		}

		// @section Map state change events
		// @event resize: ResizeEvent
		// Fired when the map is resized.
		return this.fire('resize', {
			oldSize: oldSize,
			newSize: newSize
		});
	},

	// @section Methods for modifying map state
	// @method stop(): this
	// Stops the currently running `panTo` or `flyTo` animation, if any.
	stop: function () {
		this.setZoom(this._limitZoom(this._zoom));
		if (!this.options.zoomSnap) {
			this.fire('viewreset');
		}
		return this._stop();
	},

	// @section Geolocation methods
	// @method locate(options?: Locate options): this
	// Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
	// event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
	// and optionally sets the map view to the user's location with respect to
	// detection accuracy (or to the world view if geolocation failed).
	// Note that, if your page doesn't use HTTPS, this method will fail in
	// modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
	// See `Locate options` for more details.
	locate: function (options) {

		options = this._locateOptions = extend({
			timeout: 10000,
			watch: false
			// setView: false
			// maxZoom: <Number>
			// maximumAge: 0
			// enableHighAccuracy: false
		}, options);

		if (!('geolocation' in navigator)) {
			this._handleGeolocationError({
				code: 0,
				message: 'Geolocation not supported.'
			});
			return this;
		}

		var onResponse = bind(this._handleGeolocationResponse, this),
		    onError = bind(this._handleGeolocationError, this);

		if (options.watch) {
			this._locationWatchId =
			        navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}
		return this;
	},

	// @method stopLocate(): this
	// Stops watching location previously initiated by `map.locate({watch: true})`
	// and aborts resetting the map view if map.locate was called with
	// `{setView: true}`.
	stopLocate: function () {
		if (navigator.geolocation && navigator.geolocation.clearWatch) {
			navigator.geolocation.clearWatch(this._locationWatchId);
		}
		if (this._locateOptions) {
			this._locateOptions.setView = false;
		}
		return this;
	},

	_handleGeolocationError: function (error) {
		var c = error.code,
		    message = error.message ||
		            (c === 1 ? 'permission denied' :
		            (c === 2 ? 'position unavailable' : 'timeout'));

		if (this._locateOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		// @section Location events
		// @event locationerror: ErrorEvent
		// Fired when geolocation (using the [`locate`](#map-locate) method) failed.
		this.fire('locationerror', {
			code: c,
			message: 'Geolocation error: ' + message + '.'
		});
	},

	_handleGeolocationResponse: function (pos) {
		var lat = pos.coords.latitude,
		    lng = pos.coords.longitude,
		    latlng = new LatLng(lat, lng),
		    bounds = latlng.toBounds(pos.coords.accuracy * 2),
		    options = this._locateOptions;

		if (options.setView) {
			var zoom = this.getBoundsZoom(bounds);
			this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
		}

		var data = {
			latlng: latlng,
			bounds: bounds,
			timestamp: pos.timestamp
		};

		for (var i in pos.coords) {
			if (typeof pos.coords[i] === 'number') {
				data[i] = pos.coords[i];
			}
		}

		// @event locationfound: LocationEvent
		// Fired when geolocation (using the [`locate`](#map-locate) method)
		// went successfully.
		this.fire('locationfound', data);
	},

	// TODO Appropriate docs section?
	// @section Other Methods
	// @method addHandler(name: String, HandlerClass: Function): this
	// Adds a new `Handler` to the map, given its name and constructor function.
	addHandler: function (name, HandlerClass) {
		if (!HandlerClass) { return this; }

		var handler = this[name] = new HandlerClass(this);

		this._handlers.push(handler);

		if (this.options[name]) {
			handler.enable();
		}

		return this;
	},

	// @method remove(): this
	// Destroys the map and clears all related event listeners.
	remove: function () {

		this._initEvents(true);

		if (this._containerId !== this._container._leaflet_id) {
			throw new Error('Map container is being reused by another instance');
		}

		try {
			// throws error in IE6-8
			delete this._container._leaflet_id;
			delete this._containerId;
		} catch (e) {
			/*eslint-disable */
			this._container._leaflet_id = undefined;
			/* eslint-enable */
			this._containerId = undefined;
		}

		if (this._locationWatchId !== undefined) {
			this.stopLocate();
		}

		this._stop();

		remove(this._mapPane);

		if (this._clearControlPos) {
			this._clearControlPos();
		}
		if (this._resizeRequest) {
			cancelAnimFrame(this._resizeRequest);
			this._resizeRequest = null;
		}

		this._clearHandlers();

		if (this._loaded) {
			// @section Map state change events
			// @event unload: Event
			// Fired when the map is destroyed with [remove](#map-remove) method.
			this.fire('unload');
		}

		var i;
		for (i in this._layers) {
			this._layers[i].remove();
		}
		for (i in this._panes) {
			remove(this._panes[i]);
		}

		this._layers = [];
		this._panes = [];
		delete this._mapPane;
		delete this._renderer;

		return this;
	},

	// @section Other Methods
	// @method createPane(name: String, container?: HTMLElement): HTMLElement
	// Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
	// then returns it. The pane is created as a child of `container`, or
	// as a child of the main map pane if not set.
	createPane: function (name, container) {
		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
		    pane = create$1('div', className, container || this._mapPane);

		if (name) {
			this._panes[name] = pane;
		}
		return pane;
	},

	// @section Methods for Getting Map State

	// @method getCenter(): LatLng
	// Returns the geographical center of the map view
	getCenter: function () {
		this._checkIfLoaded();

		if (this._lastCenter && !this._moved()) {
			return this._lastCenter;
		}
		return this.layerPointToLatLng(this._getCenterLayerPoint());
	},

	// @method getZoom(): Number
	// Returns the current zoom level of the map view
	getZoom: function () {
		return this._zoom;
	},

	// @method getBounds(): LatLngBounds
	// Returns the geographical bounds visible in the current map view
	getBounds: function () {
		var bounds = this.getPixelBounds(),
		    sw = this.unproject(bounds.getBottomLeft()),
		    ne = this.unproject(bounds.getTopRight());

		return new LatLngBounds(sw, ne);
	},

	// @method getMinZoom(): Number
	// Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
	getMinZoom: function () {
		return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
	},

	// @method getMaxZoom(): Number
	// Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
	getMaxZoom: function () {
		return this.options.maxZoom === undefined ?
			(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
			this.options.maxZoom;
	},

	// @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
	// Returns the maximum zoom level on which the given bounds fit to the map
	// view in its entirety. If `inside` (optional) is set to `true`, the method
	// instead returns the minimum zoom level on which the map view fits into
	// the given bounds in its entirety.
	getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
		bounds = toLatLngBounds(bounds);
		padding = toPoint(padding || [0, 0]);

		var zoom = this.getZoom() || 0,
		    min = this.getMinZoom(),
		    max = this.getMaxZoom(),
		    nw = bounds.getNorthWest(),
		    se = bounds.getSouthEast(),
		    size = this.getSize().subtract(padding),
		    boundsSize = toBounds(this.project(se, zoom), this.project(nw, zoom)).getSize(),
		    snap = any3d ? this.options.zoomSnap : 1,
		    scalex = size.x / boundsSize.x,
		    scaley = size.y / boundsSize.y,
		    scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

		zoom = this.getScaleZoom(scale, zoom);

		if (snap) {
			zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
			zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
		}

		return Math.max(min, Math.min(max, zoom));
	},

	// @method getSize(): Point
	// Returns the current size of the map container (in pixels).
	getSize: function () {
		if (!this._size || this._sizeChanged) {
			this._size = new Point(
				this._container.clientWidth || 0,
				this._container.clientHeight || 0);

			this._sizeChanged = false;
		}
		return this._size.clone();
	},

	// @method getPixelBounds(): Bounds
	// Returns the bounds of the current map view in projected pixel
	// coordinates (sometimes useful in layer and overlay implementations).
	getPixelBounds: function (center, zoom) {
		var topLeftPoint = this._getTopLeftPoint(center, zoom);
		return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
	},

	// TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
	// the map pane? "left point of the map layer" can be confusing, specially
	// since there can be negative offsets.
	// @method getPixelOrigin(): Point
	// Returns the projected pixel coordinates of the top left point of
	// the map layer (useful in custom layer and overlay implementations).
	getPixelOrigin: function () {
		this._checkIfLoaded();
		return this._pixelOrigin;
	},

	// @method getPixelWorldBounds(zoom?: Number): Bounds
	// Returns the world's bounds in pixel coordinates for zoom level `zoom`.
	// If `zoom` is omitted, the map's current zoom level is used.
	getPixelWorldBounds: function (zoom) {
		return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
	},

	// @section Other Methods

	// @method getPane(pane: String|HTMLElement): HTMLElement
	// Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
	getPane: function (pane) {
		return typeof pane === 'string' ? this._panes[pane] : pane;
	},

	// @method getPanes(): Object
	// Returns a plain object containing the names of all [panes](#map-pane) as keys and
	// the panes as values.
	getPanes: function () {
		return this._panes;
	},

	// @method getContainer: HTMLElement
	// Returns the HTML element that contains the map.
	getContainer: function () {
		return this._container;
	},


	// @section Conversion Methods

	// @method getZoomScale(toZoom: Number, fromZoom: Number): Number
	// Returns the scale factor to be applied to a map transition from zoom level
	// `fromZoom` to `toZoom`. Used internally to help with zoom animations.
	getZoomScale: function (toZoom, fromZoom) {
		// TODO replace with universal implementation after refactoring projections
		var crs = this.options.crs;
		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
		return crs.scale(toZoom) / crs.scale(fromZoom);
	},

	// @method getScaleZoom(scale: Number, fromZoom: Number): Number
	// Returns the zoom level that the map would end up at, if it is at `fromZoom`
	// level and everything is scaled by a factor of `scale`. Inverse of
	// [`getZoomScale`](#map-getZoomScale).
	getScaleZoom: function (scale, fromZoom) {
		var crs = this.options.crs;
		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
		var zoom = crs.zoom(scale * crs.scale(fromZoom));
		return isNaN(zoom) ? Infinity : zoom;
	},

	// @method project(latlng: LatLng, zoom: Number): Point
	// Projects a geographical coordinate `LatLng` according to the projection
	// of the map's CRS, then scales it according to `zoom` and the CRS's
	// `Transformation`. The result is pixel coordinate relative to
	// the CRS origin.
	project: function (latlng, zoom) {
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.latLngToPoint(toLatLng(latlng), zoom);
	},

	// @method unproject(point: Point, zoom: Number): LatLng
	// Inverse of [`project`](#map-project).
	unproject: function (point, zoom) {
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.pointToLatLng(toPoint(point), zoom);
	},

	// @method layerPointToLatLng(point: Point): LatLng
	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
	// returns the corresponding geographical coordinate (for the current zoom level).
	layerPointToLatLng: function (point) {
		var projectedPoint = toPoint(point).add(this.getPixelOrigin());
		return this.unproject(projectedPoint);
	},

	// @method latLngToLayerPoint(latlng: LatLng): Point
	// Given a geographical coordinate, returns the corresponding pixel coordinate
	// relative to the [origin pixel](#map-getpixelorigin).
	latLngToLayerPoint: function (latlng) {
		var projectedPoint = this.project(toLatLng(latlng))._round();
		return projectedPoint._subtract(this.getPixelOrigin());
	},

	// @method wrapLatLng(latlng: LatLng): LatLng
	// Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
	// map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
	// CRS's bounds.
	// By default this means longitude is wrapped around the dateline so its
	// value is between -180 and +180 degrees.
	wrapLatLng: function (latlng) {
		return this.options.crs.wrapLatLng(toLatLng(latlng));
	},

	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
	// Returns a `LatLngBounds` with the same size as the given one, ensuring that
	// its center is within the CRS's bounds.
	// By default this means the center longitude is wrapped around the dateline so its
	// value is between -180 and +180 degrees, and the majority of the bounds
	// overlaps the CRS's bounds.
	wrapLatLngBounds: function (latlng) {
		return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
	},

	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
	// Returns the distance between two geographical coordinates according to
	// the map's CRS. By default this measures distance in meters.
	distance: function (latlng1, latlng2) {
		return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
	},

	// @method containerPointToLayerPoint(point: Point): Point
	// Given a pixel coordinate relative to the map container, returns the corresponding
	// pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
	containerPointToLayerPoint: function (point) { // (Point)
		return toPoint(point).subtract(this._getMapPanePos());
	},

	// @method layerPointToContainerPoint(point: Point): Point
	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
	// returns the corresponding pixel coordinate relative to the map container.
	layerPointToContainerPoint: function (point) { // (Point)
		return toPoint(point).add(this._getMapPanePos());
	},

	// @method containerPointToLatLng(point: Point): LatLng
	// Given a pixel coordinate relative to the map container, returns
	// the corresponding geographical coordinate (for the current zoom level).
	containerPointToLatLng: function (point) {
		var layerPoint = this.containerPointToLayerPoint(toPoint(point));
		return this.layerPointToLatLng(layerPoint);
	},

	// @method latLngToContainerPoint(latlng: LatLng): Point
	// Given a geographical coordinate, returns the corresponding pixel coordinate
	// relative to the map container.
	latLngToContainerPoint: function (latlng) {
		return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
	},

	// @method mouseEventToContainerPoint(ev: MouseEvent): Point
	// Given a MouseEvent object, returns the pixel coordinate relative to the
	// map container where the event took place.
	mouseEventToContainerPoint: function (e) {
		return getMousePosition(e, this._container);
	},

	// @method mouseEventToLayerPoint(ev: MouseEvent): Point
	// Given a MouseEvent object, returns the pixel coordinate relative to
	// the [origin pixel](#map-getpixelorigin) where the event took place.
	mouseEventToLayerPoint: function (e) {
		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	},

	// @method mouseEventToLatLng(ev: MouseEvent): LatLng
	// Given a MouseEvent object, returns geographical coordinate where the
	// event took place.
	mouseEventToLatLng: function (e) { // (MouseEvent)
		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	},


	// map initialization methods

	_initContainer: function (id) {
		var container = this._container = get(id);

		if (!container) {
			throw new Error('Map container not found.');
		} else if (container._leaflet_id) {
			throw new Error('Map container is already initialized.');
		}

		on(container, 'scroll', this._onScroll, this);
		this._containerId = stamp(container);
	},

	_initLayout: function () {
		var container = this._container;

		this._fadeAnimated = this.options.fadeAnimation && any3d;

		addClass(container, 'leaflet-container' +
			(touch ? ' leaflet-touch' : '') +
			(retina ? ' leaflet-retina' : '') +
			(ielt9 ? ' leaflet-oldie' : '') +
			(safari ? ' leaflet-safari' : '') +
			(this._fadeAnimated ? ' leaflet-fade-anim' : ''));

		var position = getStyle(container, 'position');

		if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
			container.style.position = 'relative';
		}

		this._initPanes();

		if (this._initControlPos) {
			this._initControlPos();
		}
	},

	_initPanes: function () {
		var panes = this._panes = {};
		this._paneRenderers = {};

		// @section
		//
		// Panes are DOM elements used to control the ordering of layers on the map. You
		// can access panes with [`map.getPane`](#map-getpane) or
		// [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
		// [`map.createPane`](#map-createpane) method.
		//
		// Every map has the following default panes that differ only in zIndex.
		//
		// @pane mapPane: HTMLElement = 'auto'
		// Pane that contains all other map panes

		this._mapPane = this.createPane('mapPane', this._container);
		setPosition(this._mapPane, new Point(0, 0));

		// @pane tilePane: HTMLElement = 200
		// Pane for `GridLayer`s and `TileLayer`s
		this.createPane('tilePane');
		// @pane overlayPane: HTMLElement = 400
		// Pane for vectors (`Path`s, like `Polyline`s and `Polygon`s), `ImageOverlay`s and `VideoOverlay`s
		this.createPane('shadowPane');
		// @pane shadowPane: HTMLElement = 500
		// Pane for overlay shadows (e.g. `Marker` shadows)
		this.createPane('overlayPane');
		// @pane markerPane: HTMLElement = 600
		// Pane for `Icon`s of `Marker`s
		this.createPane('markerPane');
		// @pane tooltipPane: HTMLElement = 650
		// Pane for `Tooltip`s.
		this.createPane('tooltipPane');
		// @pane popupPane: HTMLElement = 700
		// Pane for `Popup`s.
		this.createPane('popupPane');

		if (!this.options.markerZoomAnimation) {
			addClass(panes.markerPane, 'leaflet-zoom-hide');
			addClass(panes.shadowPane, 'leaflet-zoom-hide');
		}
	},


	// private methods that modify map state

	// @section Map state change events
	_resetView: function (center, zoom) {
		setPosition(this._mapPane, new Point(0, 0));

		var loading = !this._loaded;
		this._loaded = true;
		zoom = this._limitZoom(zoom);

		this.fire('viewprereset');

		var zoomChanged = this._zoom !== zoom;
		this
			._moveStart(zoomChanged, false)
			._move(center, zoom)
			._moveEnd(zoomChanged);

		// @event viewreset: Event
		// Fired when the map needs to redraw its content (this usually happens
		// on map zoom or load). Very useful for creating custom overlays.
		this.fire('viewreset');

		// @event load: Event
		// Fired when the map is initialized (when its center and zoom are set
		// for the first time).
		if (loading) {
			this.fire('load');
		}
	},

	_moveStart: function (zoomChanged, noMoveStart) {
		// @event zoomstart: Event
		// Fired when the map zoom is about to change (e.g. before zoom animation).
		// @event movestart: Event
		// Fired when the view of the map starts changing (e.g. user starts dragging the map).
		if (zoomChanged) {
			this.fire('zoomstart');
		}
		if (!noMoveStart) {
			this.fire('movestart');
		}
		return this;
	},

	_move: function (center, zoom, data) {
		if (zoom === undefined) {
			zoom = this._zoom;
		}
		var zoomChanged = this._zoom !== zoom;

		this._zoom = zoom;
		this._lastCenter = center;
		this._pixelOrigin = this._getNewPixelOrigin(center);

		// @event zoom: Event
		// Fired repeatedly during any change in zoom level, including zoom
		// and fly animations.
		if (zoomChanged || (data && data.pinch)) {	// Always fire 'zoom' if pinching because #3530
			this.fire('zoom', data);
		}

		// @event move: Event
		// Fired repeatedly during any movement of the map, including pan and
		// fly animations.
		return this.fire('move', data);
	},

	_moveEnd: function (zoomChanged) {
		// @event zoomend: Event
		// Fired when the map has changed, after any animations.
		if (zoomChanged) {
			this.fire('zoomend');
		}

		// @event moveend: Event
		// Fired when the center of the map stops changing (e.g. user stopped
		// dragging the map).
		return this.fire('moveend');
	},

	_stop: function () {
		cancelAnimFrame(this._flyToFrame);
		if (this._panAnim) {
			this._panAnim.stop();
		}
		return this;
	},

	_rawPanBy: function (offset) {
		setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
	},

	_getZoomSpan: function () {
		return this.getMaxZoom() - this.getMinZoom();
	},

	_panInsideMaxBounds: function () {
		if (!this._enforcingBounds) {
			this.panInsideBounds(this.options.maxBounds);
		}
	},

	_checkIfLoaded: function () {
		if (!this._loaded) {
			throw new Error('Set map center and zoom first.');
		}
	},

	// DOM event handling

	// @section Interaction events
	_initEvents: function (remove$$1) {
		this._targets = {};
		this._targets[stamp(this._container)] = this;

		var onOff = remove$$1 ? off : on;

		// @event click: MouseEvent
		// Fired when the user clicks (or taps) the map.
		// @event dblclick: MouseEvent
		// Fired when the user double-clicks (or double-taps) the map.
		// @event mousedown: MouseEvent
		// Fired when the user pushes the mouse button on the map.
		// @event mouseup: MouseEvent
		// Fired when the user releases the mouse button on the map.
		// @event mouseover: MouseEvent
		// Fired when the mouse enters the map.
		// @event mouseout: MouseEvent
		// Fired when the mouse leaves the map.
		// @event mousemove: MouseEvent
		// Fired while the mouse moves over the map.
		// @event contextmenu: MouseEvent
		// Fired when the user pushes the right mouse button on the map, prevents
		// default browser context menu from showing if there are listeners on
		// this event. Also fired on mobile when the user holds a single touch
		// for a second (also called long press).
		// @event keypress: KeyboardEvent
		// Fired when the user presses a key from the keyboard that produces a character value while the map is focused.
		// @event keydown: KeyboardEvent
		// Fired when the user presses a key from the keyboard while the map is focused. Unlike the `keypress` event,
		// the `keydown` event is fired for keys that produce a character value and for keys
		// that do not produce a character value.
		// @event keyup: KeyboardEvent
		// Fired when the user releases a key from the keyboard while the map is focused.
		onOff(this._container, 'click dblclick mousedown mouseup ' +
			'mouseover mouseout mousemove contextmenu keypress keydown keyup', this._handleDOMEvent, this);

		if (this.options.trackResize) {
			onOff(window, 'resize', this._onResize, this);
		}

		if (any3d && this.options.transform3DLimit) {
			(remove$$1 ? this.off : this.on).call(this, 'moveend', this._onMoveEnd);
		}
	},

	_onResize: function () {
		cancelAnimFrame(this._resizeRequest);
		this._resizeRequest = requestAnimFrame(
		        function () { this.invalidateSize({debounceMoveend: true}); }, this);
	},

	_onScroll: function () {
		this._container.scrollTop  = 0;
		this._container.scrollLeft = 0;
	},

	_onMoveEnd: function () {
		var pos = this._getMapPanePos();
		if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
			// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
			// a pixel offset on very high values, see: http://jsfiddle.net/dg6r5hhb/
			this._resetView(this.getCenter(), this.getZoom());
		}
	},

	_findEventTargets: function (e, type) {
		var targets = [],
		    target,
		    isHover = type === 'mouseout' || type === 'mouseover',
		    src = e.target || e.srcElement,
		    dragging = false;

		while (src) {
			target = this._targets[stamp(src)];
			if (target && (type === 'click' || type === 'preclick') && !e._simulated && this._draggableMoved(target)) {
				// Prevent firing click after you just dragged an object.
				dragging = true;
				break;
			}
			if (target && target.listens(type, true)) {
				if (isHover && !isExternalTarget(src, e)) { break; }
				targets.push(target);
				if (isHover) { break; }
			}
			if (src === this._container) { break; }
			src = src.parentNode;
		}
		if (!targets.length && !dragging && !isHover && isExternalTarget(src, e)) {
			targets = [this];
		}
		return targets;
	},

	_handleDOMEvent: function (e) {
		if (!this._loaded || skipped(e)) { return; }

		var type = e.type;

		if (type === 'mousedown' || type === 'keypress' || type === 'keyup' || type === 'keydown') {
			// prevents outline when clicking on keyboard-focusable element
			preventOutline(e.target || e.srcElement);
		}

		this._fireDOMEvent(e, type);
	},

	_mouseEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],

	_fireDOMEvent: function (e, type, targets) {

		if (e.type === 'click') {
			// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
			// @event preclick: MouseEvent
			// Fired before mouse click on the map (sometimes useful when you
			// want something to happen on click before any existing click
			// handlers start running).
			var synth = extend({}, e);
			synth.type = 'preclick';
			this._fireDOMEvent(synth, synth.type, targets);
		}

		if (e._stopped) { return; }

		// Find the layer the event is propagating from and its parents.
		targets = (targets || []).concat(this._findEventTargets(e, type));

		if (!targets.length) { return; }

		var target = targets[0];
		if (type === 'contextmenu' && target.listens(type, true)) {
			preventDefault(e);
		}

		var data = {
			originalEvent: e
		};

		if (e.type !== 'keypress' && e.type !== 'keydown' && e.type !== 'keyup') {
			var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
			data.containerPoint = isMarker ?
				this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
			data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
			data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
		}

		for (var i = 0; i < targets.length; i++) {
			targets[i].fire(type, data, true);
			if (data.originalEvent._stopped ||
				(targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1)) { return; }
		}
	},

	_draggableMoved: function (obj) {
		obj = obj.dragging && obj.dragging.enabled() ? obj : this;
		return (obj.dragging && obj.dragging.moved()) || (this.boxZoom && this.boxZoom.moved());
	},

	_clearHandlers: function () {
		for (var i = 0, len = this._handlers.length; i < len; i++) {
			this._handlers[i].disable();
		}
	},

	// @section Other Methods

	// @method whenReady(fn: Function, context?: Object): this
	// Runs the given function `fn` when the map gets initialized with
	// a view (center and zoom) and at least one layer, or immediately
	// if it's already initialized, optionally passing a function context.
	whenReady: function (callback, context) {
		if (this._loaded) {
			callback.call(context || this, {target: this});
		} else {
			this.on('load', callback, context);
		}
		return this;
	},


	// private methods for getting map state

	_getMapPanePos: function () {
		return getPosition(this._mapPane) || new Point(0, 0);
	},

	_moved: function () {
		var pos = this._getMapPanePos();
		return pos && !pos.equals([0, 0]);
	},

	_getTopLeftPoint: function (center, zoom) {
		var pixelOrigin = center && zoom !== undefined ?
			this._getNewPixelOrigin(center, zoom) :
			this.getPixelOrigin();
		return pixelOrigin.subtract(this._getMapPanePos());
	},

	_getNewPixelOrigin: function (center, zoom) {
		var viewHalf = this.getSize()._divideBy(2);
		return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
	},

	_latLngToNewLayerPoint: function (latlng, zoom, center) {
		var topLeft = this._getNewPixelOrigin(center, zoom);
		return this.project(latlng, zoom)._subtract(topLeft);
	},

	_latLngBoundsToNewLayerBounds: function (latLngBounds, zoom, center) {
		var topLeft = this._getNewPixelOrigin(center, zoom);
		return toBounds([
			this.project(latLngBounds.getSouthWest(), zoom)._subtract(topLeft),
			this.project(latLngBounds.getNorthWest(), zoom)._subtract(topLeft),
			this.project(latLngBounds.getSouthEast(), zoom)._subtract(topLeft),
			this.project(latLngBounds.getNorthEast(), zoom)._subtract(topLeft)
		]);
	},

	// layer point of the current center
	_getCenterLayerPoint: function () {
		return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
	},

	// offset of the specified place to the current center in pixels
	_getCenterOffset: function (latlng) {
		return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
	},

	// adjust center for view to get inside bounds
	_limitCenter: function (center, zoom, bounds) {

		if (!bounds) { return center; }

		var centerPoint = this.project(center, zoom),
		    viewHalf = this.getSize().divideBy(2),
		    viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
		    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

		// If offset is less than a pixel, ignore.
		// This prevents unstable projections from getting into
		// an infinite loop of tiny offsets.
		if (offset.round().equals([0, 0])) {
			return center;
		}

		return this.unproject(centerPoint.add(offset), zoom);
	},

	// adjust offset for view to get inside bounds
	_limitOffset: function (offset, bounds) {
		if (!bounds) { return offset; }

		var viewBounds = this.getPixelBounds(),
		    newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

		return offset.add(this._getBoundsOffset(newBounds, bounds));
	},

	// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
	_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
		var projectedMaxBounds = toBounds(
		        this.project(maxBounds.getNorthEast(), zoom),
		        this.project(maxBounds.getSouthWest(), zoom)
		    ),
		    minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
		    maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),

		    dx = this._rebound(minOffset.x, -maxOffset.x),
		    dy = this._rebound(minOffset.y, -maxOffset.y);

		return new Point(dx, dy);
	},

	_rebound: function (left, right) {
		return left + right > 0 ?
			Math.round(left - right) / 2 :
			Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
	},

	_limitZoom: function (zoom) {
		var min = this.getMinZoom(),
		    max = this.getMaxZoom(),
		    snap = any3d ? this.options.zoomSnap : 1;
		if (snap) {
			zoom = Math.round(zoom / snap) * snap;
		}
		return Math.max(min, Math.min(max, zoom));
	},

	_onPanTransitionStep: function () {
		this.fire('move');
	},

	_onPanTransitionEnd: function () {
		removeClass(this._mapPane, 'leaflet-pan-anim');
		this.fire('moveend');
	},

	_tryAnimatedPan: function (center, options) {
		// difference between the new and current centers in pixels
		var offset = this._getCenterOffset(center)._trunc();

		// don't animate too far unless animate: true specified in options
		if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

		this.panBy(offset, options);

		return true;
	},

	_createAnimProxy: function () {

		var proxy = this._proxy = create$1('div', 'leaflet-proxy leaflet-zoom-animated');
		this._panes.mapPane.appendChild(proxy);

		this.on('zoomanim', function (e) {
			var prop = TRANSFORM,
			    transform = this._proxy.style[prop];

			setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

			// workaround for case when transform is the same and so transitionend event is not fired
			if (transform === this._proxy.style[prop] && this._animatingZoom) {
				this._onZoomTransitionEnd();
			}
		}, this);

		this.on('load moveend', this._animMoveEnd, this);

		this._on('unload', this._destroyAnimProxy, this);
	},

	_destroyAnimProxy: function () {
		remove(this._proxy);
		this.off('load moveend', this._animMoveEnd, this);
		delete this._proxy;
	},

	_animMoveEnd: function () {
		var c = this.getCenter(),
		    z = this.getZoom();
		setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
	},

	_catchTransitionEnd: function (e) {
		if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
			this._onZoomTransitionEnd();
		}
	},

	_nothingToAnimate: function () {
		return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
	},

	_tryAnimatedZoom: function (center, zoom, options) {

		if (this._animatingZoom) { return true; }

		options = options || {};

		// don't animate if disabled, not supported or zoom difference is too large
		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
		        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

		// offset is the pixel coords of the zoom origin relative to the current center
		var scale = this.getZoomScale(zoom),
		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

		requestAnimFrame(function () {
			this
			    ._moveStart(true, false)
			    ._animateZoom(center, zoom, true);
		}, this);

		return true;
	},

	_animateZoom: function (center, zoom, startAnim, noUpdate) {
		if (!this._mapPane) { return; }

		if (startAnim) {
			this._animatingZoom = true;

			// remember what center/zoom to set after animation
			this._animateToCenter = center;
			this._animateToZoom = zoom;

			addClass(this._mapPane, 'leaflet-zoom-anim');
		}

		// @section Other Events
		// @event zoomanim: ZoomAnimEvent
		// Fired at least once per zoom animation. For continuous zoom, like pinch zooming, fired once per frame during zoom.
		this.fire('zoomanim', {
			center: center,
			zoom: zoom,
			noUpdate: noUpdate
		});

		// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
		setTimeout(bind(this._onZoomTransitionEnd, this), 250);
	},

	_onZoomTransitionEnd: function () {
		if (!this._animatingZoom) { return; }

		if (this._mapPane) {
			removeClass(this._mapPane, 'leaflet-zoom-anim');
		}

		this._animatingZoom = false;

		this._move(this._animateToCenter, this._animateToZoom);

		// This anim frame should prevent an obscure iOS webkit tile loading race condition.
		requestAnimFrame(function () {
			this._moveEnd(true);
		}, this);
	}
});

// @section

// @factory L.map(id: String, options?: Map options)
// Instantiates a map object given the DOM ID of a `<div>` element
// and optionally an object literal with `Map options`.
//
// @alternative
// @factory L.map(el: HTMLElement, options?: Map options)
// Instantiates a map object given an instance of a `<div>` HTML element
// and optionally an object literal with `Map options`.
function createMap(id, options) {
	return new Map(id, options);
}

/*
 * @class Control
 * @aka L.Control
 * @inherits Class
 *
 * L.Control is a base class for implementing map controls. Handles positioning.
 * All other controls extend from this class.
 */

var Control = Class.extend({
	// @section
	// @aka Control options
	options: {
		// @option position: String = 'topright'
		// The position of the control (one of the map corners). Possible values are `'topleft'`,
		// `'topright'`, `'bottomleft'` or `'bottomright'`
		position: 'topright'
	},

	initialize: function (options) {
		setOptions(this, options);
	},

	/* @section
	 * Classes extending L.Control will inherit the following methods:
	 *
	 * @method getPosition: string
	 * Returns the position of the control.
	 */
	getPosition: function () {
		return this.options.position;
	},

	// @method setPosition(position: string): this
	// Sets the position of the control.
	setPosition: function (position) {
		var map = this._map;

		if (map) {
			map.removeControl(this);
		}

		this.options.position = position;

		if (map) {
			map.addControl(this);
		}

		return this;
	},

	// @method getContainer: HTMLElement
	// Returns the HTMLElement that contains the control.
	getContainer: function () {
		return this._container;
	},

	// @method addTo(map: Map): this
	// Adds the control to the given map.
	addTo: function (map) {
		this.remove();
		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		addClass(container, 'leaflet-control');

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}

		this._map.on('unload', this.remove, this);

		return this;
	},

	// @method remove: this
	// Removes the control from the map it is currently active on.
	remove: function () {
		if (!this._map) {
			return this;
		}

		remove(this._container);

		if (this.onRemove) {
			this.onRemove(this._map);
		}

		this._map.off('unload', this.remove, this);
		this._map = null;

		return this;
	},

	_refocusOnMap: function (e) {
		// if map exists and event is not a keyboard event
		if (this._map && e && e.screenX > 0 && e.screenY > 0) {
			this._map.getContainer().focus();
		}
	}
});

var control = function (options) {
	return new Control(options);
};

/* @section Extension methods
 * @uninheritable
 *
 * Every control should extend from `L.Control` and (re-)implement the following methods.
 *
 * @method onAdd(map: Map): HTMLElement
 * Should return the container DOM element for the control and add listeners on relevant map events. Called on [`control.addTo(map)`](#control-addTo).
 *
 * @method onRemove(map: Map)
 * Optional method. Should contain all clean up code that removes the listeners previously added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
 */

/* @namespace Map
 * @section Methods for Layers and Controls
 */
Map.include({
	// @method addControl(control: Control): this
	// Adds the given control to the map
	addControl: function (control) {
		control.addTo(this);
		return this;
	},

	// @method removeControl(control: Control): this
	// Removes the given control from the map
	removeControl: function (control) {
		control.remove();
		return this;
	},

	_initControlPos: function () {
		var corners = this._controlCorners = {},
		    l = 'leaflet-',
		    container = this._controlContainer =
		            create$1('div', l + 'control-container', this._container);

		function createCorner(vSide, hSide) {
			var className = l + vSide + ' ' + l + hSide;

			corners[vSide + hSide] = create$1('div', className, container);
		}

		createCorner('top', 'left');
		createCorner('top', 'right');
		createCorner('bottom', 'left');
		createCorner('bottom', 'right');
	},

	_clearControlPos: function () {
		for (var i in this._controlCorners) {
			remove(this._controlCorners[i]);
		}
		remove(this._controlContainer);
		delete this._controlCorners;
		delete this._controlContainer;
	}
});

/*
 * @class Control.Layers
 * @aka L.Control.Layers
 * @inherits Control
 *
 * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](http://leafletjs.com/examples/layers-control/)). Extends `Control`.
 *
 * @example
 *
 * ```js
 * var baseLayers = {
 * 	"Mapbox": mapbox,
 * 	"OpenStreetMap": osm
 * };
 *
 * var overlays = {
 * 	"Marker": marker,
 * 	"Roads": roadsLayer
 * };
 *
 * L.control.layers(baseLayers, overlays).addTo(map);
 * ```
 *
 * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
 *
 * ```js
 * {
 *     "<someName1>": layer1,
 *     "<someName2>": layer2
 * }
 * ```
 *
 * The layer names can contain HTML, which allows you to add additional styling to the items:
 *
 * ```js
 * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
 * ```
 */

var Layers = Control.extend({
	// @section
	// @aka Control.Layers options
	options: {
		// @option collapsed: Boolean = true
		// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
		collapsed: true,
		position: 'topright',

		// @option autoZIndex: Boolean = true
		// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
		autoZIndex: true,

		// @option hideSingleBase: Boolean = false
		// If `true`, the base layers in the control will be hidden when there is only one.
		hideSingleBase: false,

		// @option sortLayers: Boolean = false
		// Whether to sort the layers. When `false`, layers will keep the order
		// in which they were added to the control.
		sortLayers: false,

		// @option sortFunction: Function = *
		// A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
		// that will be used for sorting the layers, when `sortLayers` is `true`.
		// The function receives both the `L.Layer` instances and their names, as in
		// `sortFunction(layerA, layerB, nameA, nameB)`.
		// By default, it sorts layers alphabetically by their name.
		sortFunction: function (layerA, layerB, nameA, nameB) {
			return nameA < nameB ? -1 : (nameB < nameA ? 1 : 0);
		}
	},

	initialize: function (baseLayers, overlays, options) {
		setOptions(this, options);

		this._layerControlInputs = [];
		this._layers = [];
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},

	onAdd: function (map) {
		this._initLayout();
		this._update();

		this._map = map;
		map.on('zoomend', this._checkDisabledLayers, this);

		for (var i = 0; i < this._layers.length; i++) {
			this._layers[i].layer.on('add remove', this._onLayerChange, this);
		}

		return this._container;
	},

	addTo: function (map) {
		Control.prototype.addTo.call(this, map);
		// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
		return this._expandIfNotCollapsed();
	},

	onRemove: function () {
		this._map.off('zoomend', this._checkDisabledLayers, this);

		for (var i = 0; i < this._layers.length; i++) {
			this._layers[i].layer.off('add remove', this._onLayerChange, this);
		}
	},

	// @method addBaseLayer(layer: Layer, name: String): this
	// Adds a base layer (radio button entry) with the given name to the control.
	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		return (this._map) ? this._update() : this;
	},

	// @method addOverlay(layer: Layer, name: String): this
	// Adds an overlay (checkbox entry) with the given name to the control.
	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		return (this._map) ? this._update() : this;
	},

	// @method removeLayer(layer: Layer): this
	// Remove the given layer from the control.
	removeLayer: function (layer) {
		layer.off('add remove', this._onLayerChange, this);

		var obj = this._getLayer(stamp(layer));
		if (obj) {
			this._layers.splice(this._layers.indexOf(obj), 1);
		}
		return (this._map) ? this._update() : this;
	},

	// @method expand(): this
	// Expand the control container if collapsed.
	expand: function () {
		addClass(this._container, 'leaflet-control-layers-expanded');
		this._section.style.height = null;
		var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
		if (acceptableHeight < this._section.clientHeight) {
			addClass(this._section, 'leaflet-control-layers-scrollbar');
			this._section.style.height = acceptableHeight + 'px';
		} else {
			removeClass(this._section, 'leaflet-control-layers-scrollbar');
		}
		this._checkDisabledLayers();
		return this;
	},

	// @method collapse(): this
	// Collapse the control container if expanded.
	collapse: function () {
		removeClass(this._container, 'leaflet-control-layers-expanded');
		return this;
	},

	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = create$1('div', className),
		    collapsed = this.options.collapsed;

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		disableClickPropagation(container);
		disableScrollPropagation(container);

		var section = this._section = create$1('section', className + '-list');

		if (collapsed) {
			this._map.on('click', this.collapse, this);

			if (!android) {
				on(container, {
					mouseenter: this.expand,
					mouseleave: this.collapse
				}, this);
			}
		}

		var link = this._layersLink = create$1('a', className + '-toggle', container);
		link.href = '#';
		link.title = 'Layers';

		if (touch) {
			on(link, 'click', stop);
			on(link, 'click', this.expand, this);
		} else {
			on(link, 'focus', this.expand, this);
		}

		if (!collapsed) {
			this.expand();
		}

		this._baseLayersList = create$1('div', className + '-base', section);
		this._separator = create$1('div', className + '-separator', section);
		this._overlaysList = create$1('div', className + '-overlays', section);

		container.appendChild(section);
	},

	_getLayer: function (id) {
		for (var i = 0; i < this._layers.length; i++) {

			if (this._layers[i] && stamp(this._layers[i].layer) === id) {
				return this._layers[i];
			}
		}
	},

	_addLayer: function (layer, name, overlay) {
		if (this._map) {
			layer.on('add remove', this._onLayerChange, this);
		}

		this._layers.push({
			layer: layer,
			name: name,
			overlay: overlay
		});

		if (this.options.sortLayers) {
			this._layers.sort(bind(function (a, b) {
				return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
			}, this));
		}

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}

		this._expandIfNotCollapsed();
	},

	_update: function () {
		if (!this._container) { return this; }

		empty(this._baseLayersList);
		empty(this._overlaysList);

		this._layerControlInputs = [];
		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

		for (i = 0; i < this._layers.length; i++) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
		}

		// Hide base layers section if there's only one layer.
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

		return this;
	},

	_onLayerChange: function (e) {
		if (!this._handlingClick) {
			this._update();
		}

		var obj = this._getLayer(stamp(e.target));

		// @namespace Map
		// @section Layer events
		// @event baselayerchange: LayersControlEvent
		// Fired when the base layer is changed through the [layer control](#control-layers).
		// @event overlayadd: LayersControlEvent
		// Fired when an overlay is selected through the [layer control](#control-layers).
		// @event overlayremove: LayersControlEvent
		// Fired when an overlay is deselected through the [layer control](#control-layers).
		// @namespace Control.Layers
		var type = obj.overlay ?
			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'add' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, obj);
		}
	},

	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},

	_addItem: function (obj) {
		var label = document.createElement('label'),
		    checked = this._map.hasLayer(obj.layer),
		    input;

		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers_' + stamp(this), checked);
		}

		this._layerControlInputs.push(input);
		input.layerId = stamp(obj.layer);

		on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		this._checkDisabledLayers();
		return label;
	},

	_onInputClick: function () {
		var inputs = this._layerControlInputs,
		    input, layer;
		var addedLayers = [],
		    removedLayers = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;

			if (input.checked) {
				addedLayers.push(layer);
			} else if (!input.checked) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedLayers.length; i++) {
			if (this._map.hasLayer(removedLayers[i])) {
				this._map.removeLayer(removedLayers[i]);
			}
		}
		for (i = 0; i < addedLayers.length; i++) {
			if (!this._map.hasLayer(addedLayers[i])) {
				this._map.addLayer(addedLayers[i]);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap();
	},

	_checkDisabledLayers: function () {
		var inputs = this._layerControlInputs,
		    input,
		    layer,
		    zoom = this._map.getZoom();

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;
			input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
			                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

		}
	},

	_expandIfNotCollapsed: function () {
		if (this._map && !this.options.collapsed) {
			this.expand();
		}
		return this;
	},

	_expand: function () {
		// Backward compatibility, remove me in 1.1.
		return this.expand();
	},

	_collapse: function () {
		// Backward compatibility, remove me in 1.1.
		return this.collapse();
	}

});


// @factory L.control.layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
// Creates a layers control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
var layers = function (baseLayers, overlays, options) {
	return new Layers(baseLayers, overlays, options);
};

/*
 * @class Control.Zoom
 * @aka L.Control.Zoom
 * @inherits Control
 *
 * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
 */

var Zoom = Control.extend({
	// @section
	// @aka Control.Zoom options
	options: {
		position: 'topleft',

		// @option zoomInText: String = '+'
		// The text set on the 'zoom in' button.
		zoomInText: '+',

		// @option zoomInTitle: String = 'Zoom in'
		// The title set on the 'zoom in' button.
		zoomInTitle: 'Zoom in',

		// @option zoomOutText: String = '&#x2212;'
		// The text set on the 'zoom out' button.
		zoomOutText: '&#x2212;',

		// @option zoomOutTitle: String = 'Zoom out'
		// The title set on the 'zoom out' button.
		zoomOutTitle: 'Zoom out'
	},

	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
		    container = create$1('div', zoomName + ' leaflet-bar'),
		    options = this.options;

		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn);
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	disable: function () {
		this._disabled = true;
		this._updateDisabled();
		return this;
	},

	enable: function () {
		this._disabled = false;
		this._updateDisabled();
		return this;
	},

	_zoomIn: function (e) {
		if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
			this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_zoomOut: function (e) {
		if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
			this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_createButton: function (html, title, className, container, fn) {
		var link = create$1('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		disableClickPropagation(link);
		on(link, 'click', stop);
		on(link, 'click', fn, this);
		on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
		    className = 'leaflet-disabled';

		removeClass(this._zoomInButton, className);
		removeClass(this._zoomOutButton, className);

		if (this._disabled || map._zoom === map.getMinZoom()) {
			addClass(this._zoomOutButton, className);
		}
		if (this._disabled || map._zoom === map.getMaxZoom()) {
			addClass(this._zoomInButton, className);
		}
	}
});

// @namespace Map
// @section Control options
// @option zoomControl: Boolean = true
// Whether a [zoom control](#control-zoom) is added to the map by default.
Map.mergeOptions({
	zoomControl: true
});

Map.addInitHook(function () {
	if (this.options.zoomControl) {
		// @section Controls
		// @property zoomControl: Control.Zoom
		// The default zoom control (only available if the
		// [`zoomControl` option](#map-zoomcontrol) was `true` when creating the map).
		this.zoomControl = new Zoom();
		this.addControl(this.zoomControl);
	}
});

// @namespace Control.Zoom
// @factory L.control.zoom(options: Control.Zoom options)
// Creates a zoom control
var zoom = function (options) {
	return new Zoom(options);
};

/*
 * @class Control.Scale
 * @aka L.Control.Scale
 * @inherits Control
 *
 * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
 *
 * @example
 *
 * ```js
 * L.control.scale().addTo(map);
 * ```
 */

var Scale = Control.extend({
	// @section
	// @aka Control.Scale options
	options: {
		position: 'bottomleft',

		// @option maxWidth: Number = 100
		// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
		maxWidth: 100,

		// @option metric: Boolean = True
		// Whether to show the metric scale line (m/km).
		metric: true,

		// @option imperial: Boolean = True
		// Whether to show the imperial scale line (mi/ft).
		imperial: true

		// @option updateWhenIdle: Boolean = false
		// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
	},

	onAdd: function (map) {
		var className = 'leaflet-control-scale',
		    container = create$1('div', className),
		    options = this.options;

		this._addScales(options, className + '-line', container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_addScales: function (options, className, container) {
		if (options.metric) {
			this._mScale = create$1('div', className, container);
		}
		if (options.imperial) {
			this._iScale = create$1('div', className, container);
		}
	},

	_update: function () {
		var map = this._map,
		    y = map.getSize().y / 2;

		var maxMeters = map.distance(
			map.containerPointToLatLng([0, y]),
			map.containerPointToLatLng([this.options.maxWidth, y]));

		this._updateScales(maxMeters);
	},

	_updateScales: function (maxMeters) {
		if (this.options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}
		if (this.options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	},

	_updateMetric: function (maxMeters) {
		var meters = this._getRoundNum(maxMeters),
		    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

		this._updateScale(this._mScale, label, meters / maxMeters);
	},

	_updateImperial: function (maxMeters) {
		var maxFeet = maxMeters * 3.2808399,
		    maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);
			this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

		} else {
			feet = this._getRoundNum(maxFeet);
			this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
		}
	},

	_updateScale: function (scale, text, ratio) {
		scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
		scale.innerHTML = text;
	},

	_getRoundNum: function (num) {
		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
		    d = num / pow10;

		d = d >= 10 ? 10 :
		    d >= 5 ? 5 :
		    d >= 3 ? 3 :
		    d >= 2 ? 2 : 1;

		return pow10 * d;
	}
});


// @factory L.control.scale(options?: Control.Scale options)
// Creates an scale control with the given options.
var scale = function (options) {
	return new Scale(options);
};

/*
 * @class Control.Attribution
 * @aka L.Control.Attribution
 * @inherits Control
 *
 * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
 */

var Attribution = Control.extend({
	// @section
	// @aka Control.Attribution options
	options: {
		position: 'bottomright',

		// @option prefix: String = 'Leaflet'
		// The HTML text shown before the attributions. Pass `false` to disable.
		prefix: '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
	},

	initialize: function (options) {
		setOptions(this, options);

		this._attributions = {};
	},

	onAdd: function (map) {
		map.attributionControl = this;
		this._container = create$1('div', 'leaflet-control-attribution');
		disableClickPropagation(this._container);

		// TODO ugly, refactor
		for (var i in map._layers) {
			if (map._layers[i].getAttribution) {
				this.addAttribution(map._layers[i].getAttribution());
			}
		}

		this._update();

		return this._container;
	},

	// @method setPrefix(prefix: String): this
	// Sets the text before the attributions.
	setPrefix: function (prefix) {
		this.options.prefix = prefix;
		this._update();
		return this;
	},

	// @method addAttribution(text: String): this
	// Adds an attribution text (e.g. `'Vector data &copy; Mapbox'`).
	addAttribution: function (text) {
		if (!text) { return this; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();

		return this;
	},

	// @method removeAttribution(text: String): this
	// Removes an attribution text.
	removeAttribution: function (text) {
		if (!text) { return this; }

		if (this._attributions[text]) {
			this._attributions[text]--;
			this._update();
		}

		return this;
	},

	_update: function () {
		if (!this._map) { return; }

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions[i]) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];

		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' | ');
	}
});

// @namespace Map
// @section Control options
// @option attributionControl: Boolean = true
// Whether a [attribution control](#control-attribution) is added to the map by default.
Map.mergeOptions({
	attributionControl: true
});

Map.addInitHook(function () {
	if (this.options.attributionControl) {
		new Attribution().addTo(this);
	}
});

// @namespace Control.Attribution
// @factory L.control.attribution(options: Control.Attribution options)
// Creates an attribution control.
var attribution = function (options) {
	return new Attribution(options);
};

Control.Layers = Layers;
Control.Zoom = Zoom;
Control.Scale = Scale;
Control.Attribution = Attribution;

control.layers = layers;
control.zoom = zoom;
control.scale = scale;
control.attribution = attribution;

/*
	L.Handler is a base class for handler classes that are used internally to inject
	interaction features like dragging to classes like Map and Marker.
*/

// @class Handler
// @aka L.Handler
// Abstract class for map interaction handlers

var Handler = Class.extend({
	initialize: function (map) {
		this._map = map;
	},

	// @method enable(): this
	// Enables the handler
	enable: function () {
		if (this._enabled) { return this; }

		this._enabled = true;
		this.addHooks();
		return this;
	},

	// @method disable(): this
	// Disables the handler
	disable: function () {
		if (!this._enabled) { return this; }

		this._enabled = false;
		this.removeHooks();
		return this;
	},

	// @method enabled(): Boolean
	// Returns `true` if the handler is enabled
	enabled: function () {
		return !!this._enabled;
	}

	// @section Extension methods
	// Classes inheriting from `Handler` must implement the two following methods:
	// @method addHooks()
	// Called when the handler is enabled, should add event hooks.
	// @method removeHooks()
	// Called when the handler is disabled, should remove the event hooks added previously.
});

// @section There is static function which can be called without instantiating L.Handler:
// @function addTo(map: Map, name: String): this
// Adds a new Handler to the given map with the given name.
Handler.addTo = function (map, name) {
	map.addHandler(name, this);
	return this;
};

var Mixin = {Events: Events};

/*
 * @class Draggable
 * @aka L.Draggable
 * @inherits Evented
 *
 * A class for making DOM elements draggable (including touch support).
 * Used internally for map and marker dragging. Only works for elements
 * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
 *
 * @example
 * ```js
 * var draggable = new L.Draggable(elementToDrag);
 * draggable.enable();
 * ```
 */

var START = touch ? 'touchstart mousedown' : 'mousedown';
var END = {
	mousedown: 'mouseup',
	touchstart: 'touchend',
	pointerdown: 'touchend',
	MSPointerDown: 'touchend'
};
var MOVE = {
	mousedown: 'mousemove',
	touchstart: 'touchmove',
	pointerdown: 'touchmove',
	MSPointerDown: 'touchmove'
};


var Draggable = Evented.extend({

	options: {
		// @section
		// @aka Draggable options
		// @option clickTolerance: Number = 3
		// The max number of pixels a user can shift the mouse pointer during a click
		// for it to be considered a valid click (as opposed to a mouse drag).
		clickTolerance: 3
	},

	// @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
	// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
	initialize: function (element, dragStartTarget, preventOutline$$1, options) {
		setOptions(this, options);

		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
		this._preventOutline = preventOutline$$1;
	},

	// @method enable()
	// Enables the dragging ability
	enable: function () {
		if (this._enabled) { return; }

		on(this._dragStartTarget, START, this._onDown, this);

		this._enabled = true;
	},

	// @method disable()
	// Disables the dragging ability
	disable: function () {
		if (!this._enabled) { return; }

		// If we're currently dragging this draggable,
		// disabling it counts as first ending the drag.
		if (Draggable._dragging === this) {
			this.finishDrag();
		}

		off(this._dragStartTarget, START, this._onDown, this);

		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }

		this._moved = false;

		if (hasClass(this._element, 'leaflet-zoom-anim')) { return; }

		if (Draggable._dragging || e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }
		Draggable._dragging = this;  // Prevent dragging multiple objects at once.

		if (this._preventOutline) {
			preventOutline(this._element);
		}

		disableImageDrag();
		disableTextSelection();

		if (this._moving) { return; }

		// @event down: Event
		// Fired when a drag is about to start.
		this.fire('down');

		var first = e.touches ? e.touches[0] : e,
		    sizedParent = getSizedParentNode(this._element);

		this._startPoint = new Point(first.clientX, first.clientY);

		// Cache the scale, so that we can continuously compensate for it during drag (_onMove).
		this._parentScale = getScale(sizedParent);

		on(document, MOVE[e.type], this._onMove, this);
		on(document, END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }

		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }
		if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) { return; }

		// We assume that the parent container's position, border and scale do not change for the duration of the drag.
		// Therefore there is no need to account for the position and border (they are eliminated by the subtraction)
		// and we can use the cached value for the scale.
		offset.x /= this._parentScale.x;
		offset.y /= this._parentScale.y;

		preventDefault(e);

		if (!this._moved) {
			// @event dragstart: Event
			// Fired when a drag starts
			this.fire('dragstart');

			this._moved = true;
			this._startPos = getPosition(this._element).subtract(offset);

			addClass(document.body, 'leaflet-dragging');

			this._lastTarget = e.target || e.srcElement;
			// IE and Edge do not give the <use> element, so fetch it
			// if necessary
			if ((window.SVGElementInstance) && (this._lastTarget instanceof SVGElementInstance)) {
				this._lastTarget = this._lastTarget.correspondingUseElement;
			}
			addClass(this._lastTarget, 'leaflet-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		cancelAnimFrame(this._animRequest);
		this._lastEvent = e;
		this._animRequest = requestAnimFrame(this._updatePosition, this, true);
	},

	_updatePosition: function () {
		var e = {originalEvent: this._lastEvent};

		// @event predrag: Event
		// Fired continuously during dragging *before* each corresponding
		// update of the element's position.
		this.fire('predrag', e);
		setPosition(this._element, this._newPos);

		// @event drag: Event
		// Fired continuously during dragging.
		this.fire('drag', e);
	},

	_onUp: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }
		this.finishDrag();
	},

	finishDrag: function () {
		removeClass(document.body, 'leaflet-dragging');

		if (this._lastTarget) {
			removeClass(this._lastTarget, 'leaflet-drag-target');
			this._lastTarget = null;
		}

		for (var i in MOVE) {
			off(document, MOVE[i], this._onMove, this);
			off(document, END[i], this._onUp, this);
		}

		enableImageDrag();
		enableTextSelection();

		if (this._moved && this._moving) {
			// ensure drag is not fired after dragend
			cancelAnimFrame(this._animRequest);

			// @event dragend: DragEndEvent
			// Fired when the drag ends.
			this.fire('dragend', {
				distance: this._newPos.distanceTo(this._startPos)
			});
		}

		this._moving = false;
		Draggable._dragging = false;
	}

});

/*
 * @namespace LineUtil
 *
 * Various utility functions for polyline points processing, used by Leaflet internally to make polylines lightning-fast.
 */

// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
// Improves rendering performance dramatically by lessening the number of points to draw.

// @function simplify(points: Point[], tolerance: Number): Point[]
// Dramatically reduces the number of points in a polyline while retaining
// its shape and returns a new array of simplified points, using the
// [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
// Used for a huge performance boost when processing/displaying Leaflet polylines for
// each zoom level and also reducing visual noise. tolerance affects the amount of
// simplification (lesser value means higher quality but slower and with more points).
// Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
function simplify(points, tolerance) {
	if (!tolerance || !points.length) {
		return points.slice();
	}

	var sqTolerance = tolerance * tolerance;

	    // stage 1: vertex reduction
	    points = _reducePoints(points, sqTolerance);

	    // stage 2: Douglas-Peucker simplification
	    points = _simplifyDP(points, sqTolerance);

	return points;
}

// @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
// Returns the distance between point `p` and segment `p1` to `p2`.
function pointToSegmentDistance(p, p1, p2) {
	return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
}

// @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
// Returns the closest point from a point `p` on a segment `p1` to `p2`.
function closestPointOnSegment(p, p1, p2) {
	return _sqClosestPointOnSegment(p, p1, p2);
}

// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
function _simplifyDP(points, sqTolerance) {

	var len = points.length,
	    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
	    markers = new ArrayConstructor(len);

	    markers[0] = markers[len - 1] = 1;

	_simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

	var i,
	    newPoints = [];

	for (i = 0; i < len; i++) {
		if (markers[i]) {
			newPoints.push(points[i]);
		}
	}

	return newPoints;
}

function _simplifyDPStep(points, markers, sqTolerance, first, last) {

	var maxSqDist = 0,
	index, i, sqDist;

	for (i = first + 1; i <= last - 1; i++) {
		sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

		if (sqDist > maxSqDist) {
			index = i;
			maxSqDist = sqDist;
		}
	}

	if (maxSqDist > sqTolerance) {
		markers[index] = 1;

		_simplifyDPStep(points, markers, sqTolerance, first, index);
		_simplifyDPStep(points, markers, sqTolerance, index, last);
	}
}

// reduce points that are too close to each other to a single point
function _reducePoints(points, sqTolerance) {
	var reducedPoints = [points[0]];

	for (var i = 1, prev = 0, len = points.length; i < len; i++) {
		if (_sqDist(points[i], points[prev]) > sqTolerance) {
			reducedPoints.push(points[i]);
			prev = i;
		}
	}
	if (prev < len - 1) {
		reducedPoints.push(points[len - 1]);
	}
	return reducedPoints;
}

var _lastCode;

// @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
// Clips the segment a to b by rectangular bounds with the
// [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
// (modifying the segment points directly!). Used by Leaflet to only show polyline
// points that are on the screen or near, increasing performance.
function clipSegment(a, b, bounds, useLastCode, round) {
	var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
	    codeB = _getBitCode(b, bounds),

	    codeOut, p, newCode;

	    // save 2nd code to avoid calculating it on the next segment
	    _lastCode = codeB;

	while (true) {
		// if a,b is inside the clip window (trivial accept)
		if (!(codeA | codeB)) {
			return [a, b];
		}

		// if a,b is outside the clip window (trivial reject)
		if (codeA & codeB) {
			return false;
		}

		// other cases
		codeOut = codeA || codeB;
		p = _getEdgeIntersection(a, b, codeOut, bounds, round);
		newCode = _getBitCode(p, bounds);

		if (codeOut === codeA) {
			a = p;
			codeA = newCode;
		} else {
			b = p;
			codeB = newCode;
		}
	}
}

function _getEdgeIntersection(a, b, code, bounds, round) {
	var dx = b.x - a.x,
	    dy = b.y - a.y,
	    min = bounds.min,
	    max = bounds.max,
	    x, y;

	if (code & 8) { // top
		x = a.x + dx * (max.y - a.y) / dy;
		y = max.y;

	} else if (code & 4) { // bottom
		x = a.x + dx * (min.y - a.y) / dy;
		y = min.y;

	} else if (code & 2) { // right
		x = max.x;
		y = a.y + dy * (max.x - a.x) / dx;

	} else if (code & 1) { // left
		x = min.x;
		y = a.y + dy * (min.x - a.x) / dx;
	}

	return new Point(x, y, round);
}

function _getBitCode(p, bounds) {
	var code = 0;

	if (p.x < bounds.min.x) { // left
		code |= 1;
	} else if (p.x > bounds.max.x) { // right
		code |= 2;
	}

	if (p.y < bounds.min.y) { // bottom
		code |= 4;
	} else if (p.y > bounds.max.y) { // top
		code |= 8;
	}

	return code;
}

// square distance (to avoid unnecessary Math.sqrt calls)
function _sqDist(p1, p2) {
	var dx = p2.x - p1.x,
	    dy = p2.y - p1.y;
	return dx * dx + dy * dy;
}

// return closest point on segment or distance to that point
function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
	var x = p1.x,
	    y = p1.y,
	    dx = p2.x - x,
	    dy = p2.y - y,
	    dot = dx * dx + dy * dy,
	    t;

	if (dot > 0) {
		t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

		if (t > 1) {
			x = p2.x;
			y = p2.y;
		} else if (t > 0) {
			x += dx * t;
			y += dy * t;
		}
	}

	dx = p.x - x;
	dy = p.y - y;

	return sqDist ? dx * dx + dy * dy : new Point(x, y);
}


// @function isFlat(latlngs: LatLng[]): Boolean
// Returns true if `latlngs` is a flat array, false is nested.
function isFlat(latlngs) {
	return !isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
}

function _flat(latlngs) {
	console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
	return isFlat(latlngs);
}


var LineUtil = (Object.freeze || Object)({
	simplify: simplify,
	pointToSegmentDistance: pointToSegmentDistance,
	closestPointOnSegment: closestPointOnSegment,
	clipSegment: clipSegment,
	_getEdgeIntersection: _getEdgeIntersection,
	_getBitCode: _getBitCode,
	_sqClosestPointOnSegment: _sqClosestPointOnSegment,
	isFlat: isFlat,
	_flat: _flat
});

/*
 * @namespace PolyUtil
 * Various utility functions for polygon geometries.
 */

/* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
 * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
 * Used by Leaflet to only show polygon points that are on the screen or near, increasing
 * performance. Note that polygon points needs different algorithm for clipping
 * than polyline, so there's a separate method for it.
 */
function clipPolygon(points, bounds, round) {
	var clippedPoints,
	    edges = [1, 4, 2, 8],
	    i, j, k,
	    a, b,
	    len, edge, p;

	for (i = 0, len = points.length; i < len; i++) {
		points[i]._code = _getBitCode(points[i], bounds);
	}

	// for each edge (left, bottom, right, top)
	for (k = 0; k < 4; k++) {
		edge = edges[k];
		clippedPoints = [];

		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
			a = points[i];
			b = points[j];

			// if a is inside the clip window
			if (!(a._code & edge)) {
				// if b is outside the clip window (a->b goes out of screen)
				if (b._code & edge) {
					p = _getEdgeIntersection(b, a, edge, bounds, round);
					p._code = _getBitCode(p, bounds);
					clippedPoints.push(p);
				}
				clippedPoints.push(a);

			// else if b is inside the clip window (a->b enters the screen)
			} else if (!(b._code & edge)) {
				p = _getEdgeIntersection(b, a, edge, bounds, round);
				p._code = _getBitCode(p, bounds);
				clippedPoints.push(p);
			}
		}
		points = clippedPoints;
	}

	return points;
}


var PolyUtil = (Object.freeze || Object)({
	clipPolygon: clipPolygon
});

/*
 * @namespace Projection
 * @section
 * Leaflet comes with a set of already defined Projections out of the box:
 *
 * @projection L.Projection.LonLat
 *
 * Equirectangular, or Plate Carree projection ??? the most simple projection,
 * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
 * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
 * `EPSG:4326` and `Simple` CRS.
 */

var LonLat = {
	project: function (latlng) {
		return new Point(latlng.lng, latlng.lat);
	},

	unproject: function (point) {
		return new LatLng(point.y, point.x);
	},

	bounds: new Bounds([-180, -90], [180, 90])
};

/*
 * @namespace Projection
 * @projection L.Projection.Mercator
 *
 * Elliptical Mercator projection ??? more complex than Spherical Mercator. Assumes that Earth is an ellipsoid. Used by the EPSG:3395 CRS.
 */

var Mercator = {
	R: 6378137,
	R_MINOR: 6356752.314245179,

	bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

	project: function (latlng) {
		var d = Math.PI / 180,
		    r = this.R,
		    y = latlng.lat * d,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    con = e * Math.sin(y);

		var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
		y = -r * Math.log(Math.max(ts, 1E-10));

		return new Point(latlng.lng * d * r, y);
	},

	unproject: function (point) {
		var d = 180 / Math.PI,
		    r = this.R,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    ts = Math.exp(-point.y / r),
		    phi = Math.PI / 2 - 2 * Math.atan(ts);

		for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
			con = e * Math.sin(phi);
			con = Math.pow((1 - con) / (1 + con), e / 2);
			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
			phi += dphi;
		}

		return new LatLng(phi * d, point.x * d / r);
	}
};

/*
 * @class Projection

 * An object with methods for projecting geographical coordinates of the world onto
 * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).

 * @property bounds: Bounds
 * The bounds (specified in CRS units) where the projection is valid

 * @method project(latlng: LatLng): Point
 * Projects geographical coordinates into a 2D point.
 * Only accepts actual `L.LatLng` instances, not arrays.

 * @method unproject(point: Point): LatLng
 * The inverse of `project`. Projects a 2D point into a geographical location.
 * Only accepts actual `L.Point` instances, not arrays.

 * Note that the projection instances do not inherit from Leafet's `Class` object,
 * and can't be instantiated. Also, new classes can't inherit from them,
 * and methods can't be added to them with the `include` function.

 */




var index = (Object.freeze || Object)({
	LonLat: LonLat,
	Mercator: Mercator,
	SphericalMercator: SphericalMercator
});

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3395
 *
 * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
 */
var EPSG3395 = extend({}, Earth, {
	code: 'EPSG:3395',
	projection: Mercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * Mercator.R);
		return toTransformation(scale, 0.5, -scale, 0.5);
	}())
});

/*
 * @namespace CRS
 * @crs L.CRS.EPSG4326
 *
 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
 *
 * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
 * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
 * with this CRS, ensure that there are two 256x256 pixel tiles covering the
 * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
 * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
 */

var EPSG4326 = extend({}, Earth, {
	code: 'EPSG:4326',
	projection: LonLat,
	transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
});

/*
 * @namespace CRS
 * @crs L.CRS.Simple
 *
 * A simple CRS that maps longitude and latitude into `x` and `y` directly.
 * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
 * axis should still be inverted (going from bottom to top). `distance()` returns
 * simple euclidean distance.
 */

var Simple = extend({}, CRS, {
	projection: LonLat,
	transformation: toTransformation(1, 0, -1, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	},

	zoom: function (scale) {
		return Math.log(scale) / Math.LN2;
	},

	distance: function (latlng1, latlng2) {
		var dx = latlng2.lng - latlng1.lng,
		    dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	},

	infinite: true
});

CRS.Earth = Earth;
CRS.EPSG3395 = EPSG3395;
CRS.EPSG3857 = EPSG3857;
CRS.EPSG900913 = EPSG900913;
CRS.EPSG4326 = EPSG4326;
CRS.Simple = Simple;

/*
 * @class Layer
 * @inherits Evented
 * @aka L.Layer
 * @aka ILayer
 *
 * A set of methods from the Layer base class that all Leaflet layers use.
 * Inherits all methods, options and events from `L.Evented`.
 *
 * @example
 *
 * ```js
 * var layer = L.marker(latlng).addTo(map);
 * layer.addTo(map);
 * layer.remove();
 * ```
 *
 * @event add: Event
 * Fired after the layer is added to a map
 *
 * @event remove: Event
 * Fired after the layer is removed from a map
 */


var Layer = Evented.extend({

	// Classes extending `L.Layer` will inherit the following options:
	options: {
		// @option pane: String = 'overlayPane'
		// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
		pane: 'overlayPane',

		// @option attribution: String = null
		// String to be shown in the attribution control, e.g. "?? OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
		attribution: null,

		bubblingMouseEvents: true
	},

	/* @section
	 * Classes extending `L.Layer` will inherit the following methods:
	 *
	 * @method addTo(map: Map|LayerGroup): this
	 * Adds the layer to the given map or layer group.
	 */
	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	// @method remove: this
	// Removes the layer from the map it is currently active on.
	remove: function () {
		return this.removeFrom(this._map || this._mapToAdd);
	},

	// @method removeFrom(map: Map): this
	// Removes the layer from the given map
	removeFrom: function (obj) {
		if (obj) {
			obj.removeLayer(this);
		}
		return this;
	},

	// @method getPane(name? : String): HTMLElement
	// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
	getPane: function (name) {
		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
	},

	addInteractiveTarget: function (targetEl) {
		this._map._targets[stamp(targetEl)] = this;
		return this;
	},

	removeInteractiveTarget: function (targetEl) {
		delete this._map._targets[stamp(targetEl)];
		return this;
	},

	// @method getAttribution: String
	// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
	getAttribution: function () {
		return this.options.attribution;
	},

	_layerAdd: function (e) {
		var map = e.target;

		// check in case layer gets added and then removed before the map is ready
		if (!map.hasLayer(this)) { return; }

		this._map = map;
		this._zoomAnimated = map._zoomAnimated;

		if (this.getEvents) {
			var events = this.getEvents();
			map.on(events, this);
			this.once('remove', function () {
				map.off(events, this);
			}, this);
		}

		this.onAdd(map);

		if (this.getAttribution && map.attributionControl) {
			map.attributionControl.addAttribution(this.getAttribution());
		}

		this.fire('add');
		map.fire('layeradd', {layer: this});
	}
});

/* @section Extension methods
 * @uninheritable
 *
 * Every layer should extend from `L.Layer` and (re-)implement the following methods.
 *
 * @method onAdd(map: Map): this
 * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
 *
 * @method onRemove(map: Map): this
 * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
 *
 * @method getEvents(): Object
 * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
 *
 * @method getAttribution(): String
 * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
 *
 * @method beforeAdd(map: Map): this
 * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
 */


/* @namespace Map
 * @section Layer events
 *
 * @event layeradd: LayerEvent
 * Fired when a new layer is added to the map.
 *
 * @event layerremove: LayerEvent
 * Fired when some layer is removed from the map
 *
 * @section Methods for Layers and Controls
 */
Map.include({
	// @method addLayer(layer: Layer): this
	// Adds the given layer to the map
	addLayer: function (layer) {
		if (!layer._layerAdd) {
			throw new Error('The provided object is not a Layer.');
		}

		var id = stamp(layer);
		if (this._layers[id]) { return this; }
		this._layers[id] = layer;

		layer._mapToAdd = this;

		if (layer.beforeAdd) {
			layer.beforeAdd(this);
		}

		this.whenReady(layer._layerAdd, layer);

		return this;
	},

	// @method removeLayer(layer: Layer): this
	// Removes the given layer from the map.
	removeLayer: function (layer) {
		var id = stamp(layer);

		if (!this._layers[id]) { return this; }

		if (this._loaded) {
			layer.onRemove(this);
		}

		if (layer.getAttribution && this.attributionControl) {
			this.attributionControl.removeAttribution(layer.getAttribution());
		}

		delete this._layers[id];

		if (this._loaded) {
			this.fire('layerremove', {layer: layer});
			layer.fire('remove');
		}

		layer._map = layer._mapToAdd = null;

		return this;
	},

	// @method hasLayer(layer: Layer): Boolean
	// Returns `true` if the given layer is currently added to the map
	hasLayer: function (layer) {
		return !!layer && (stamp(layer) in this._layers);
	},

	/* @method eachLayer(fn: Function, context?: Object): this
	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	 * ```
	 * map.eachLayer(function(layer){
	 *     layer.bindPopup('Hello');
	 * });
	 * ```
	 */
	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	_addLayers: function (layers) {
		layers = layers ? (isArray(layers) ? layers : [layers]) : [];

		for (var i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},

	_addZoomLimit: function (layer) {
		if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
			this._zoomBoundLayers[stamp(layer)] = layer;
			this._updateZoomLevels();
		}
	},

	_removeZoomLimit: function (layer) {
		var id = stamp(layer);

		if (this._zoomBoundLayers[id]) {
			delete this._zoomBoundLayers[id];
			this._updateZoomLevels();
		}
	},

	_updateZoomLevels: function () {
		var minZoom = Infinity,
		    maxZoom = -Infinity,
		    oldZoomSpan = this._getZoomSpan();

		for (var i in this._zoomBoundLayers) {
			var options = this._zoomBoundLayers[i].options;

			minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
			maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
		}

		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

		// @section Map state change events
		// @event zoomlevelschange: Event
		// Fired when the number of zoomlevels on the map is changed due
		// to adding or removing a layer.
		if (oldZoomSpan !== this._getZoomSpan()) {
			this.fire('zoomlevelschange');
		}

		if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
			this.setZoom(this._layersMaxZoom);
		}
		if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
			this.setZoom(this._layersMinZoom);
		}
	}
});

/*
 * @class LayerGroup
 * @aka L.LayerGroup
 * @inherits Layer
 *
 * Used to group several layers and handle them as one. If you add it to the map,
 * any layers added or removed from the group will be added/removed on the map as
 * well. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * L.layerGroup([marker1, marker2])
 * 	.addLayer(polyline)
 * 	.addTo(map);
 * ```
 */

var LayerGroup = Layer.extend({

	initialize: function (layers, options) {
		setOptions(this, options);

		this._layers = {};

		var i, len;

		if (layers) {
			for (i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	// @method addLayer(layer: Layer): this
	// Adds the given layer to the group.
	addLayer: function (layer) {
		var id = this.getLayerId(layer);

		this._layers[id] = layer;

		if (this._map) {
			this._map.addLayer(layer);
		}

		return this;
	},

	// @method removeLayer(layer: Layer): this
	// Removes the given layer from the group.
	// @alternative
	// @method removeLayer(id: Number): this
	// Removes the layer with the given internal ID from the group.
	removeLayer: function (layer) {
		var id = layer in this._layers ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	},

	// @method hasLayer(layer: Layer): Boolean
	// Returns `true` if the given layer is currently added to the group.
	// @alternative
	// @method hasLayer(id: Number): Boolean
	// Returns `true` if the given internal ID is currently added to the group.
	hasLayer: function (layer) {
		return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
	},

	// @method clearLayers(): this
	// Removes all the layers from the group.
	clearLayers: function () {
		return this.eachLayer(this.removeLayer, this);
	},

	// @method invoke(methodName: String, ???): this
	// Calls `methodName` on every layer contained in this group, passing any
	// additional parameters. Has no effect if the layers contained do not
	// implement `methodName`.
	invoke: function (methodName) {
		var args = Array.prototype.slice.call(arguments, 1),
		    i, layer;

		for (i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd: function (map) {
		this.eachLayer(map.addLayer, map);
	},

	onRemove: function (map) {
		this.eachLayer(map.removeLayer, map);
	},

	// @method eachLayer(fn: Function, context?: Object): this
	// Iterates over the layers of the group, optionally specifying context of the iterator function.
	// ```js
	// group.eachLayer(function (layer) {
	// 	layer.bindPopup('Hello');
	// });
	// ```
	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	// @method getLayer(id: Number): Layer
	// Returns the layer with the given internal ID.
	getLayer: function (id) {
		return this._layers[id];
	},

	// @method getLayers(): Layer[]
	// Returns an array of all the layers added to the group.
	getLayers: function () {
		var layers = [];
		this.eachLayer(layers.push, layers);
		return layers;
	},

	// @method setZIndex(zIndex: Number): this
	// Calls `setZIndex` on every layer contained in this group, passing the z-index.
	setZIndex: function (zIndex) {
		return this.invoke('setZIndex', zIndex);
	},

	// @method getLayerId(layer: Layer): Number
	// Returns the internal ID for a layer
	getLayerId: function (layer) {
		return stamp(layer);
	}
});


// @factory L.layerGroup(layers?: Layer[], options?: Object)
// Create a layer group, optionally given an initial set of layers and an `options` object.
var layerGroup = function (layers, options) {
	return new LayerGroup(layers, options);
};

/*
 * @class FeatureGroup
 * @aka L.FeatureGroup
 * @inherits LayerGroup
 *
 * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
 *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
 *  * Events are propagated to the `FeatureGroup`, so if the group has an event
 * handler, it will handle events from any of the layers. This includes mouse events
 * and custom events.
 *  * Has `layeradd` and `layerremove` events
 *
 * @example
 *
 * ```js
 * L.featureGroup([marker1, marker2, polyline])
 * 	.bindPopup('Hello world!')
 * 	.on('click', function() { alert('Clicked on a member of the group!'); })
 * 	.addTo(map);
 * ```
 */

var FeatureGroup = LayerGroup.extend({

	addLayer: function (layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		layer.addEventParent(this);

		LayerGroup.prototype.addLayer.call(this, layer);

		// @event layeradd: LayerEvent
		// Fired when a layer is added to this `FeatureGroup`
		return this.fire('layeradd', {layer: layer});
	},

	removeLayer: function (layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.removeEventParent(this);

		LayerGroup.prototype.removeLayer.call(this, layer);

		// @event layerremove: LayerEvent
		// Fired when a layer is removed from this `FeatureGroup`
		return this.fire('layerremove', {layer: layer});
	},

	// @method setStyle(style: Path options): this
	// Sets the given path options to each layer of the group that has a `setStyle` method.
	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	// @method bringToFront(): this
	// Brings the layer group to the top of all other layers
	bringToFront: function () {
		return this.invoke('bringToFront');
	},

	// @method bringToBack(): this
	// Brings the layer group to the back of all other layers
	bringToBack: function () {
		return this.invoke('bringToBack');
	},

	// @method getBounds(): LatLngBounds
	// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
	getBounds: function () {
		var bounds = new LatLngBounds();

		for (var id in this._layers) {
			var layer = this._layers[id];
			bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
		}
		return bounds;
	}
});

// @factory L.featureGroup(layers: Layer[])
// Create a feature group, optionally given an initial set of layers.
var featureGroup = function (layers) {
	return new FeatureGroup(layers);
};

/*
 * @class Icon
 * @aka L.Icon
 *
 * Represents an icon to provide when creating a marker.
 *
 * @example
 *
 * ```js
 * var myIcon = L.icon({
 *     iconUrl: 'my-icon.png',
 *     iconRetinaUrl: 'my-icon@2x.png',
 *     iconSize: [38, 95],
 *     iconAnchor: [22, 94],
 *     popupAnchor: [-3, -76],
 *     shadowUrl: 'my-icon-shadow.png',
 *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
 *     shadowSize: [68, 95],
 *     shadowAnchor: [22, 94]
 * });
 *
 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
 * ```
 *
 * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
 *
 */

var Icon = Class.extend({

	/* @section
	 * @aka Icon options
	 *
	 * @option iconUrl: String = null
	 * **(required)** The URL to the icon image (absolute or relative to your script path).
	 *
	 * @option iconRetinaUrl: String = null
	 * The URL to a retina sized version of the icon image (absolute or relative to your
	 * script path). Used for Retina screen devices.
	 *
	 * @option iconSize: Point = null
	 * Size of the icon image in pixels.
	 *
	 * @option iconAnchor: Point = null
	 * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
	 * will be aligned so that this point is at the marker's geographical location. Centered
	 * by default if size is specified, also can be set in CSS with negative margins.
	 *
	 * @option popupAnchor: Point = [0, 0]
	 * The coordinates of the point from which popups will "open", relative to the icon anchor.
	 *
	 * @option tooltipAnchor: Point = [0, 0]
	 * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
	 *
	 * @option shadowUrl: String = null
	 * The URL to the icon shadow image. If not specified, no shadow image will be created.
	 *
	 * @option shadowRetinaUrl: String = null
	 *
	 * @option shadowSize: Point = null
	 * Size of the shadow image in pixels.
	 *
	 * @option shadowAnchor: Point = null
	 * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
	 * as iconAnchor if not specified).
	 *
	 * @option className: String = ''
	 * A custom class name to assign to both icon and shadow images. Empty by default.
	 */

	options: {
		popupAnchor: [0, 0],
		tooltipAnchor: [0, 0]
	},

	initialize: function (options) {
		setOptions(this, options);
	},

	// @method createIcon(oldIcon?: HTMLElement): HTMLElement
	// Called internally when the icon has to be shown, returns a `<img>` HTML element
	// styled according to the options.
	createIcon: function (oldIcon) {
		return this._createIcon('icon', oldIcon);
	},

	// @method createShadow(oldIcon?: HTMLElement): HTMLElement
	// As `createIcon`, but for the shadow beneath it.
	createShadow: function (oldIcon) {
		return this._createIcon('shadow', oldIcon);
	},

	_createIcon: function (name, oldIcon) {
		var src = this._getIconUrl(name);

		if (!src) {
			if (name === 'icon') {
				throw new Error('iconUrl not set in Icon options (see the docs).');
			}
			return null;
		}

		var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
		this._setIconStyles(img, name);

		return img;
	},

	_setIconStyles: function (img, name) {
		var options = this.options;
		var sizeOption = options[name + 'Size'];

		if (typeof sizeOption === 'number') {
			sizeOption = [sizeOption, sizeOption];
		}

		var size = toPoint(sizeOption),
		    anchor = toPoint(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
		            size && size.divideBy(2, true));

		img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

		if (anchor) {
			img.style.marginLeft = (-anchor.x) + 'px';
			img.style.marginTop  = (-anchor.y) + 'px';
		}

		if (size) {
			img.style.width  = size.x + 'px';
			img.style.height = size.y + 'px';
		}
	},

	_createImg: function (src, el) {
		el = el || document.createElement('img');
		el.src = src;
		return el;
	},

	_getIconUrl: function (name) {
		return retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
	}
});


// @factory L.icon(options: Icon options)
// Creates an icon instance with the given options.
function icon(options) {
	return new Icon(options);
}

/*
 * @miniclass Icon.Default (Icon)
 * @aka L.Icon.Default
 * @section
 *
 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
 * no icon is specified. Points to the blue marker image distributed with Leaflet
 * releases.
 *
 * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
 * (which is a set of `Icon options`).
 *
 * If you want to _completely_ replace the default icon, override the
 * `L.Marker.prototype.options.icon` with your own icon instead.
 */

var IconDefault = Icon.extend({

	options: {
		iconUrl:       'marker-icon.png',
		iconRetinaUrl: 'marker-icon-2x.png',
		shadowUrl:     'marker-shadow.png',
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	},

	_getIconUrl: function (name) {
		if (!IconDefault.imagePath) {	// Deprecated, backwards-compatibility only
			IconDefault.imagePath = this._detectIconPath();
		}

		// @option imagePath: String
		// `Icon.Default` will try to auto-detect the location of the
		// blue icon images. If you are placing these images in a non-standard
		// way, set this option to point to the right path.
		return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
	},

	_detectIconPath: function () {
		var el = create$1('div',  'leaflet-default-icon-path', document.body);
		var path = getStyle(el, 'background-image') ||
		           getStyle(el, 'backgroundImage');	// IE8

		document.body.removeChild(el);

		if (path === null || path.indexOf('url') !== 0) {
			path = '';
		} else {
			path = path.replace(/^url\(["']?/, '').replace(/marker-icon\.png["']?\)$/, '');
		}

		return path;
	}
});

/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */


/* @namespace Marker
 * @section Interaction handlers
 *
 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
 *
 * ```js
 * marker.dragging.disable();
 * ```
 *
 * @property dragging: Handler
 * Marker dragging handler (by both mouse and touch). Only valid when the marker is on the map (Otherwise set [`marker.options.draggable`](#marker-draggable)).
 */

var MarkerDrag = Handler.extend({
	initialize: function (marker) {
		this._marker = marker;
	},

	addHooks: function () {
		var icon = this._marker._icon;

		if (!this._draggable) {
			this._draggable = new Draggable(icon, icon, true);
		}

		this._draggable.on({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).enable();

		addClass(icon, 'leaflet-marker-draggable');
	},

	removeHooks: function () {
		this._draggable.off({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		if (this._marker._icon) {
			removeClass(this._marker._icon, 'leaflet-marker-draggable');
		}
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_adjustPan: function (e) {
		var marker = this._marker,
		    map = marker._map,
		    speed = this._marker.options.autoPanSpeed,
		    padding = this._marker.options.autoPanPadding,
		    iconPos = getPosition(marker._icon),
		    bounds = map.getPixelBounds(),
		    origin = map.getPixelOrigin();

		var panBounds = toBounds(
			bounds.min._subtract(origin).add(padding),
			bounds.max._subtract(origin).subtract(padding)
		);

		if (!panBounds.contains(iconPos)) {
			// Compute incremental movement
			var movement = toPoint(
				(Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
				(Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

				(Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
				(Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
			).multiplyBy(speed);

			map.panBy(movement, {animate: false});

			this._draggable._newPos._add(movement);
			this._draggable._startPos._add(movement);

			setPosition(marker._icon, this._draggable._newPos);
			this._onDrag(e);

			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
		}
	},

	_onDragStart: function () {
		// @section Dragging events
		// @event dragstart: Event
		// Fired when the user starts dragging the marker.

		// @event movestart: Event
		// Fired when the marker starts moving (because of dragging).

		this._oldLatLng = this._marker.getLatLng();
		this._marker
		    .closePopup()
		    .fire('movestart')
		    .fire('dragstart');
	},

	_onPreDrag: function (e) {
		if (this._marker.options.autoPan) {
			cancelAnimFrame(this._panRequest);
			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
		}
	},

	_onDrag: function (e) {
		var marker = this._marker,
		    shadow = marker._shadow,
		    iconPos = getPosition(marker._icon),
		    latlng = marker._map.layerPointToLatLng(iconPos);

		// update shadow position
		if (shadow) {
			setPosition(shadow, iconPos);
		}

		marker._latlng = latlng;
		e.latlng = latlng;
		e.oldLatLng = this._oldLatLng;

		// @event drag: Event
		// Fired repeatedly while the user drags the marker.
		marker
		    .fire('move', e)
		    .fire('drag', e);
	},

	_onDragEnd: function (e) {
		// @event dragend: DragEndEvent
		// Fired when the user stops dragging the marker.

		 cancelAnimFrame(this._panRequest);

		// @event moveend: Event
		// Fired when the marker stops moving (because of dragging).
		delete this._oldLatLng;
		this._marker
		    .fire('moveend')
		    .fire('dragend', e);
	}
});

/*
 * @class Marker
 * @inherits Interactive layer
 * @aka L.Marker
 * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * L.marker([50.5, 30.5]).addTo(map);
 * ```
 */

var Marker = Layer.extend({

	// @section
	// @aka Marker options
	options: {
		// @option icon: Icon = *
		// Icon instance to use for rendering the marker.
		// See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
		// If not specified, a common instance of `L.Icon.Default` is used.
		icon: new IconDefault(),

		// Option inherited from "Interactive layer" abstract class
		interactive: true,

		// @option keyboard: Boolean = true
		// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
		keyboard: true,

		// @option title: String = ''
		// Text for the browser tooltip that appear on marker hover (no tooltip by default).
		title: '',

		// @option alt: String = ''
		// Text for the `alt` attribute of the icon image (useful for accessibility).
		alt: '',

		// @option zIndexOffset: Number = 0
		// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
		zIndexOffset: 0,

		// @option opacity: Number = 1.0
		// The opacity of the marker.
		opacity: 1,

		// @option riseOnHover: Boolean = false
		// If `true`, the marker will get on top of others when you hover the mouse over it.
		riseOnHover: false,

		// @option riseOffset: Number = 250
		// The z-index offset used for the `riseOnHover` feature.
		riseOffset: 250,

		// @option pane: String = 'markerPane'
		// `Map pane` where the markers icon will be added.
		pane: 'markerPane',

		// @option pane: String = 'shadowPane'
		// `Map pane` where the markers shadow will be added.
		shadowPane: 'shadowPane',

		// @option bubblingMouseEvents: Boolean = false
		// When `true`, a mouse event on this marker will trigger the same event on the map
		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
		bubblingMouseEvents: false,

		// @section Draggable marker options
		// @option draggable: Boolean = false
		// Whether the marker is draggable with mouse/touch or not.
		draggable: false,

		// @option autoPan: Boolean = false
		// Whether to pan the map when dragging this marker near its edge or not.
		autoPan: false,

		// @option autoPanPadding: Point = Point(50, 50)
		// Distance (in pixels to the left/right and to the top/bottom) of the
		// map edge to start panning the map.
		autoPanPadding: [50, 50],

		// @option autoPanSpeed: Number = 10
		// Number of pixels the map should pan by.
		autoPanSpeed: 10
	},

	/* @section
	 *
	 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
	 */

	initialize: function (latlng, options) {
		setOptions(this, options);
		this._latlng = toLatLng(latlng);
	},

	onAdd: function (map) {
		this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

		if (this._zoomAnimated) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._initIcon();
		this.update();
	},

	onRemove: function (map) {
		if (this.dragging && this.dragging.enabled()) {
			this.options.draggable = true;
			this.dragging.removeHooks();
		}
		delete this.dragging;

		if (this._zoomAnimated) {
			map.off('zoomanim', this._animateZoom, this);
		}

		this._removeIcon();
		this._removeShadow();
	},

	getEvents: function () {
		return {
			zoom: this.update,
			viewreset: this.update
		};
	},

	// @method getLatLng: LatLng
	// Returns the current geographical position of the marker.
	getLatLng: function () {
		return this._latlng;
	},

	// @method setLatLng(latlng: LatLng): this
	// Changes the marker position to the given point.
	setLatLng: function (latlng) {
		var oldLatLng = this._latlng;
		this._latlng = toLatLng(latlng);
		this.update();

		// @event move: Event
		// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
		return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
	},

	// @method setZIndexOffset(offset: Number): this
	// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
	setZIndexOffset: function (offset) {
		this.options.zIndexOffset = offset;
		return this.update();
	},

	// @method getIcon: Icon
	// Returns the current icon used by the marker
	getIcon: function () {
		return this.options.icon;
	},

	// @method setIcon(icon: Icon): this
	// Changes the marker icon.
	setIcon: function (icon) {

		this.options.icon = icon;

		if (this._map) {
			this._initIcon();
			this.update();
		}

		if (this._popup) {
			this.bindPopup(this._popup, this._popup.options);
		}

		return this;
	},

	getElement: function () {
		return this._icon;
	},

	update: function () {

		if (this._icon && this._map) {
			var pos = this._map.latLngToLayerPoint(this._latlng).round();
			this._setPos(pos);
		}

		return this;
	},

	_initIcon: function () {
		var options = this.options,
		    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		var icon = options.icon.createIcon(this._icon),
		    addIcon = false;

		// if we're not reusing the icon, remove the old one and init new one
		if (icon !== this._icon) {
			if (this._icon) {
				this._removeIcon();
			}
			addIcon = true;

			if (options.title) {
				icon.title = options.title;
			}

			if (icon.tagName === 'IMG') {
				icon.alt = options.alt || '';
			}
		}

		addClass(icon, classToAdd);

		if (options.keyboard) {
			icon.tabIndex = '0';
		}

		this._icon = icon;

		if (options.riseOnHover) {
			this.on({
				mouseover: this._bringToFront,
				mouseout: this._resetZIndex
			});
		}

		var newShadow = options.icon.createShadow(this._shadow),
		    addShadow = false;

		if (newShadow !== this._shadow) {
			this._removeShadow();
			addShadow = true;
		}

		if (newShadow) {
			addClass(newShadow, classToAdd);
			newShadow.alt = '';
		}
		this._shadow = newShadow;


		if (options.opacity < 1) {
			this._updateOpacity();
		}


		if (addIcon) {
			this.getPane().appendChild(this._icon);
		}
		this._initInteraction();
		if (newShadow && addShadow) {
			this.getPane(options.shadowPane).appendChild(this._shadow);
		}
	},

	_removeIcon: function () {
		if (this.options.riseOnHover) {
			this.off({
				mouseover: this._bringToFront,
				mouseout: this._resetZIndex
			});
		}

		remove(this._icon);
		this.removeInteractiveTarget(this._icon);

		this._icon = null;
	},

	_removeShadow: function () {
		if (this._shadow) {
			remove(this._shadow);
		}
		this._shadow = null;
	},

	_setPos: function (pos) {

		if (this._icon) {
			setPosition(this._icon, pos);
		}

		if (this._shadow) {
			setPosition(this._shadow, pos);
		}

		this._zIndex = pos.y + this.options.zIndexOffset;

		this._resetZIndex();
	},

	_updateZIndex: function (offset) {
		if (this._icon) {
			this._icon.style.zIndex = this._zIndex + offset;
		}
	},

	_animateZoom: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

		this._setPos(pos);
	},

	_initInteraction: function () {

		if (!this.options.interactive) { return; }

		addClass(this._icon, 'leaflet-interactive');

		this.addInteractiveTarget(this._icon);

		if (MarkerDrag) {
			var draggable = this.options.draggable;
			if (this.dragging) {
				draggable = this.dragging.enabled();
				this.dragging.disable();
			}

			this.dragging = new MarkerDrag(this);

			if (draggable) {
				this.dragging.enable();
			}
		}
	},

	// @method setOpacity(opacity: Number): this
	// Changes the opacity of the marker.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		if (this._map) {
			this._updateOpacity();
		}

		return this;
	},

	_updateOpacity: function () {
		var opacity = this.options.opacity;

		if (this._icon) {
			setOpacity(this._icon, opacity);
		}

		if (this._shadow) {
			setOpacity(this._shadow, opacity);
		}
	},

	_bringToFront: function () {
		this._updateZIndex(this.options.riseOffset);
	},

	_resetZIndex: function () {
		this._updateZIndex(0);
	},

	_getPopupAnchor: function () {
		return this.options.icon.options.popupAnchor;
	},

	_getTooltipAnchor: function () {
		return this.options.icon.options.tooltipAnchor;
	}
});


// factory L.marker(latlng: LatLng, options? : Marker options)

// @factory L.marker(latlng: LatLng, options? : Marker options)
// Instantiates a Marker object given a geographical point and optionally an options object.
function marker(latlng, options) {
	return new Marker(latlng, options);
}

/*
 * @class Path
 * @aka L.Path
 * @inherits Interactive layer
 *
 * An abstract class that contains options and constants shared between vector
 * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
 */

var Path = Layer.extend({

	// @section
	// @aka Path options
	options: {
		// @option stroke: Boolean = true
		// Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
		stroke: true,

		// @option color: String = '#3388ff'
		// Stroke color
		color: '#3388ff',

		// @option weight: Number = 3
		// Stroke width in pixels
		weight: 3,

		// @option opacity: Number = 1.0
		// Stroke opacity
		opacity: 1,

		// @option lineCap: String= 'round'
		// A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
		lineCap: 'round',

		// @option lineJoin: String = 'round'
		// A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
		lineJoin: 'round',

		// @option dashArray: String = null
		// A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
		dashArray: null,

		// @option dashOffset: String = null
		// A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
		dashOffset: null,

		// @option fill: Boolean = depends
		// Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
		fill: false,

		// @option fillColor: String = *
		// Fill color. Defaults to the value of the [`color`](#path-color) option
		fillColor: null,

		// @option fillOpacity: Number = 0.2
		// Fill opacity.
		fillOpacity: 0.2,

		// @option fillRule: String = 'evenodd'
		// A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
		fillRule: 'evenodd',

		// className: '',

		// Option inherited from "Interactive layer" abstract class
		interactive: true,

		// @option bubblingMouseEvents: Boolean = true
		// When `true`, a mouse event on this path will trigger the same event on the map
		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
		bubblingMouseEvents: true
	},

	beforeAdd: function (map) {
		// Renderer is set here because we need to call renderer.getEvents
		// before this.getEvents.
		this._renderer = map.getRenderer(this);
	},

	onAdd: function () {
		this._renderer._initPath(this);
		this._reset();
		this._renderer._addPath(this);
	},

	onRemove: function () {
		this._renderer._removePath(this);
	},

	// @method redraw(): this
	// Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
	redraw: function () {
		if (this._map) {
			this._renderer._updatePath(this);
		}
		return this;
	},

	// @method setStyle(style: Path options): this
	// Changes the appearance of a Path based on the options in the `Path options` object.
	setStyle: function (style) {
		setOptions(this, style);
		if (this._renderer) {
			this._renderer._updateStyle(this);
			if (this.options.stroke && style && style.hasOwnProperty('weight')) {
				this._updateBounds();
			}
		}
		return this;
	},

	// @method bringToFront(): this
	// Brings the layer to the top of all path layers.
	bringToFront: function () {
		if (this._renderer) {
			this._renderer._bringToFront(this);
		}
		return this;
	},

	// @method bringToBack(): this
	// Brings the layer to the bottom of all path layers.
	bringToBack: function () {
		if (this._renderer) {
			this._renderer._bringToBack(this);
		}
		return this;
	},

	getElement: function () {
		return this._path;
	},

	_reset: function () {
		// defined in child classes
		this._project();
		this._update();
	},

	_clickTolerance: function () {
		// used when doing hit detection for Canvas layers
		return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
	}
});

/*
 * @class CircleMarker
 * @aka L.CircleMarker
 * @inherits Path
 *
 * A circle of a fixed size with radius specified in pixels. Extends `Path`.
 */

var CircleMarker = Path.extend({

	// @section
	// @aka CircleMarker options
	options: {
		fill: true,

		// @option radius: Number = 10
		// Radius of the circle marker, in pixels
		radius: 10
	},

	initialize: function (latlng, options) {
		setOptions(this, options);
		this._latlng = toLatLng(latlng);
		this._radius = this.options.radius;
	},

	// @method setLatLng(latLng: LatLng): this
	// Sets the position of a circle marker to a new location.
	setLatLng: function (latlng) {
		var oldLatLng = this._latlng;
		this._latlng = toLatLng(latlng);
		this.redraw();

		// @event move: Event
		// Fired when the marker is moved via [`setLatLng`](#circlemarker-setlatlng). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
		return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
	},

	// @method getLatLng(): LatLng
	// Returns the current geographical position of the circle marker
	getLatLng: function () {
		return this._latlng;
	},

	// @method setRadius(radius: Number): this
	// Sets the radius of a circle marker. Units are in pixels.
	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	// @method getRadius(): Number
	// Returns the current radius of the circle
	getRadius: function () {
		return this._radius;
	},

	setStyle : function (options) {
		var radius = options && options.radius || this._radius;
		Path.prototype.setStyle.call(this, options);
		this.setRadius(radius);
		return this;
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._updateBounds();
	},

	_updateBounds: function () {
		var r = this._radius,
		    r2 = this._radiusY || r,
		    w = this._clickTolerance(),
		    p = [r + w, r2 + w];
		this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
	},

	_update: function () {
		if (this._map) {
			this._updatePath();
		}
	},

	_updatePath: function () {
		this._renderer._updateCircle(this);
	},

	_empty: function () {
		return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p) {
		return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
	}
});


// @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
// Instantiates a circle marker object given a geographical point, and an optional options object.
function circleMarker(latlng, options) {
	return new CircleMarker(latlng, options);
}

/*
 * @class Circle
 * @aka L.Circle
 * @inherits CircleMarker
 *
 * A class for drawing circle overlays on a map. Extends `CircleMarker`.
 *
 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
 *
 * @example
 *
 * ```js
 * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
 * ```
 */

var Circle = CircleMarker.extend({

	initialize: function (latlng, options, legacyOptions) {
		if (typeof options === 'number') {
			// Backwards compatibility with 0.7.x factory (latlng, radius, options?)
			options = extend({}, legacyOptions, {radius: options});
		}
		setOptions(this, options);
		this._latlng = toLatLng(latlng);

		if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }

		// @section
		// @aka Circle options
		// @option radius: Number; Radius of the circle, in meters.
		this._mRadius = this.options.radius;
	},

	// @method setRadius(radius: Number): this
	// Sets the radius of a circle. Units are in meters.
	setRadius: function (radius) {
		this._mRadius = radius;
		return this.redraw();
	},

	// @method getRadius(): Number
	// Returns the current radius of a circle. Units are in meters.
	getRadius: function () {
		return this._mRadius;
	},

	// @method getBounds(): LatLngBounds
	// Returns the `LatLngBounds` of the path.
	getBounds: function () {
		var half = [this._radius, this._radiusY || this._radius];

		return new LatLngBounds(
			this._map.layerPointToLatLng(this._point.subtract(half)),
			this._map.layerPointToLatLng(this._point.add(half)));
	},

	setStyle: Path.prototype.setStyle,

	_project: function () {

		var lng = this._latlng.lng,
		    lat = this._latlng.lat,
		    map = this._map,
		    crs = map.options.crs;

		if (crs.distance === Earth.distance) {
			var d = Math.PI / 180,
			    latR = (this._mRadius / Earth.R) / d,
			    top = map.project([lat + latR, lng]),
			    bottom = map.project([lat - latR, lng]),
			    p = top.add(bottom).divideBy(2),
			    lat2 = map.unproject(p).lat,
			    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
			            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

			if (isNaN(lngR) || lngR === 0) {
				lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
			}

			this._point = p.subtract(map.getPixelOrigin());
			this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
			this._radiusY = p.y - top.y;

		} else {
			var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

			this._point = map.latLngToLayerPoint(this._latlng);
			this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
		}

		this._updateBounds();
	}
});

// @factory L.circle(latlng: LatLng, options?: Circle options)
// Instantiates a circle object given a geographical point, and an options object
// which contains the circle radius.
// @alternative
// @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
// Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
// Do not use in new applications or plugins.
function circle(latlng, options, legacyOptions) {
	return new Circle(latlng, options, legacyOptions);
}

/*
 * @class Polyline
 * @aka L.Polyline
 * @inherits Path
 *
 * A class for drawing polyline overlays on a map. Extends `Path`.
 *
 * @example
 *
 * ```js
 * // create a red polyline from an array of LatLng points
 * var latlngs = [
 * 	[45.51, -122.68],
 * 	[37.77, -122.43],
 * 	[34.04, -118.2]
 * ];
 *
 * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
 *
 * // zoom the map to the polyline
 * map.fitBounds(polyline.getBounds());
 * ```
 *
 * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
 *
 * ```js
 * // create a red polyline from an array of arrays of LatLng points
 * var latlngs = [
 * 	[[45.51, -122.68],
 * 	 [37.77, -122.43],
 * 	 [34.04, -118.2]],
 * 	[[40.78, -73.91],
 * 	 [41.83, -87.62],
 * 	 [32.76, -96.72]]
 * ];
 * ```
 */


var Polyline = Path.extend({

	// @section
	// @aka Polyline options
	options: {
		// @option smoothFactor: Number = 1.0
		// How much to simplify the polyline on each zoom level. More means
		// better performance and smoother look, and less means more accurate representation.
		smoothFactor: 1.0,

		// @option noClip: Boolean = false
		// Disable polyline clipping.
		noClip: false
	},

	initialize: function (latlngs, options) {
		setOptions(this, options);
		this._setLatLngs(latlngs);
	},

	// @method getLatLngs(): LatLng[]
	// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
	getLatLngs: function () {
		return this._latlngs;
	},

	// @method setLatLngs(latlngs: LatLng[]): this
	// Replaces all the points in the polyline with the given array of geographical points.
	setLatLngs: function (latlngs) {
		this._setLatLngs(latlngs);
		return this.redraw();
	},

	// @method isEmpty(): Boolean
	// Returns `true` if the Polyline has no LatLngs.
	isEmpty: function () {
		return !this._latlngs.length;
	},

	// @method closestLayerPoint(p: Point): Point
	// Returns the point closest to `p` on the Polyline.
	closestLayerPoint: function (p) {
		var minDistance = Infinity,
		    minPoint = null,
		    closest = _sqClosestPointOnSegment,
		    p1, p2;

		for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
			var points = this._parts[j];

			for (var i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];

				var sqDist = closest(p, p1, p2, true);

				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = closest(p, p1, p2);
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return minPoint;
	},

	// @method getCenter(): LatLng
	// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
	getCenter: function () {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}

		var i, halfDist, segDist, dist, p1, p2, ratio,
		    points = this._rings[0],
		    len = points.length;

		if (!len) { return null; }

		// polyline centroid algorithm; only uses the first ring if there are multiple

		for (i = 0, halfDist = 0; i < len - 1; i++) {
			halfDist += points[i].distanceTo(points[i + 1]) / 2;
		}

		// The line is so small in the current view that all points are on the same pixel.
		if (halfDist === 0) {
			return this._map.layerPointToLatLng(points[0]);
		}

		for (i = 0, dist = 0; i < len - 1; i++) {
			p1 = points[i];
			p2 = points[i + 1];
			segDist = p1.distanceTo(p2);
			dist += segDist;

			if (dist > halfDist) {
				ratio = (dist - halfDist) / segDist;
				return this._map.layerPointToLatLng([
					p2.x - ratio * (p2.x - p1.x),
					p2.y - ratio * (p2.y - p1.y)
				]);
			}
		}
	},

	// @method getBounds(): LatLngBounds
	// Returns the `LatLngBounds` of the path.
	getBounds: function () {
		return this._bounds;
	},

	// @method addLatLng(latlng: LatLng, latlngs? LatLng[]): this
	// Adds a given point to the polyline. By default, adds to the first ring of
	// the polyline in case of a multi-polyline, but can be overridden by passing
	// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
	addLatLng: function (latlng, latlngs) {
		latlngs = latlngs || this._defaultShape();
		latlng = toLatLng(latlng);
		latlngs.push(latlng);
		this._bounds.extend(latlng);
		return this.redraw();
	},

	_setLatLngs: function (latlngs) {
		this._bounds = new LatLngBounds();
		this._latlngs = this._convertLatLngs(latlngs);
	},

	_defaultShape: function () {
		return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
	},

	// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
	_convertLatLngs: function (latlngs) {
		var result = [],
		    flat = isFlat(latlngs);

		for (var i = 0, len = latlngs.length; i < len; i++) {
			if (flat) {
				result[i] = toLatLng(latlngs[i]);
				this._bounds.extend(result[i]);
			} else {
				result[i] = this._convertLatLngs(latlngs[i]);
			}
		}

		return result;
	},

	_project: function () {
		var pxBounds = new Bounds();
		this._rings = [];
		this._projectLatlngs(this._latlngs, this._rings, pxBounds);

		if (this._bounds.isValid() && pxBounds.isValid()) {
			this._rawPxBounds = pxBounds;
			this._updateBounds();
		}
	},

	_updateBounds: function () {
		var w = this._clickTolerance(),
		    p = new Point(w, w);
		this._pxBounds = new Bounds([
			this._rawPxBounds.min.subtract(p),
			this._rawPxBounds.max.add(p)
		]);
	},

	// recursively turns latlngs into a set of rings with projected coordinates
	_projectLatlngs: function (latlngs, result, projectedBounds) {
		var flat = latlngs[0] instanceof LatLng,
		    len = latlngs.length,
		    i, ring;

		if (flat) {
			ring = [];
			for (i = 0; i < len; i++) {
				ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
				projectedBounds.extend(ring[i]);
			}
			result.push(ring);
		} else {
			for (i = 0; i < len; i++) {
				this._projectLatlngs(latlngs[i], result, projectedBounds);
			}
		}
	},

	// clip polyline by renderer bounds so that we have less to render for performance
	_clipPoints: function () {
		var bounds = this._renderer._bounds;

		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		var parts = this._parts,
		    i, j, k, len, len2, segment, points;

		for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
			points = this._rings[i];

			for (j = 0, len2 = points.length; j < len2 - 1; j++) {
				segment = clipSegment(points[j], points[j + 1], bounds, j, true);

				if (!segment) { continue; }

				parts[k] = parts[k] || [];
				parts[k].push(segment[0]);

				// if segment goes out of screen, or it's the last one, it's the end of the line part
				if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
					parts[k].push(segment[1]);
					k++;
				}
			}
		}
	},

	// simplify each clipped part of the polyline for performance
	_simplifyPoints: function () {
		var parts = this._parts,
		    tolerance = this.options.smoothFactor;

		for (var i = 0, len = parts.length; i < len; i++) {
			parts[i] = simplify(parts[i], tolerance);
		}
	},

	_update: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();
		this._updatePath();
	},

	_updatePath: function () {
		this._renderer._updatePoly(this);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p, closed) {
		var i, j, k, len, len2, part,
		    w = this._clickTolerance();

		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

		// hit detection for polylines
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) { continue; }

				if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
					return true;
				}
			}
		}
		return false;
	}
});

// @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
// Instantiates a polyline object given an array of geographical points and
// optionally an options object. You can create a `Polyline` object with
// multiple separate lines (`MultiPolyline`) by passing an array of arrays
// of geographic points.
function polyline(latlngs, options) {
	return new Polyline(latlngs, options);
}

// Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
Polyline._flat = _flat;

/*
 * @class Polygon
 * @aka L.Polygon
 * @inherits Polyline
 *
 * A class for drawing polygon overlays on a map. Extends `Polyline`.
 *
 * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one ??? it's better to filter out such points.
 *
 *
 * @example
 *
 * ```js
 * // create a red polygon from an array of LatLng points
 * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
 *
 * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
 *
 * // zoom the map to the polygon
 * map.fitBounds(polygon.getBounds());
 * ```
 *
 * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
 *
 * ```js
 * var latlngs = [
 *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
 *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
 * ];
 * ```
 *
 * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
 *
 * ```js
 * var latlngs = [
 *   [ // first polygon
 *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
 *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
 *   ],
 *   [ // second polygon
 *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
 *   ]
 * ];
 * ```
 */

var Polygon = Polyline.extend({

	options: {
		fill: true
	},

	isEmpty: function () {
		return !this._latlngs.length || !this._latlngs[0].length;
	},

	getCenter: function () {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}

		var i, j, p1, p2, f, area, x, y, center,
		    points = this._rings[0],
		    len = points.length;

		if (!len) { return null; }

		// polygon centroid algorithm; only uses the first ring if there are multiple

		area = x = y = 0;

		for (i = 0, j = len - 1; i < len; j = i++) {
			p1 = points[i];
			p2 = points[j];

			f = p1.y * p2.x - p2.y * p1.x;
			x += (p1.x + p2.x) * f;
			y += (p1.y + p2.y) * f;
			area += f * 3;
		}

		if (area === 0) {
			// Polygon is so small that all points are on same pixel.
			center = points[0];
		} else {
			center = [x / area, y / area];
		}
		return this._map.layerPointToLatLng(center);
	},

	_convertLatLngs: function (latlngs) {
		var result = Polyline.prototype._convertLatLngs.call(this, latlngs),
		    len = result.length;

		// remove last point if it equals first one
		if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
			result.pop();
		}
		return result;
	},

	_setLatLngs: function (latlngs) {
		Polyline.prototype._setLatLngs.call(this, latlngs);
		if (isFlat(this._latlngs)) {
			this._latlngs = [this._latlngs];
		}
	},

	_defaultShape: function () {
		return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
	},

	_clipPoints: function () {
		// polygons need a different clipping algorithm so we redefine that

		var bounds = this._renderer._bounds,
		    w = this.options.weight,
		    p = new Point(w, w);

		// increase clip padding by stroke width to avoid stroke on clip edges
		bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
			clipped = clipPolygon(this._rings[i], bounds, true);
			if (clipped.length) {
				this._parts.push(clipped);
			}
		}
	},

	_updatePath: function () {
		this._renderer._updatePoly(this, true);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p) {
		var inside = false,
		    part, p1, p2, i, j, k, len, len2;

		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

		// ray casting algorithm for detecting if point is in polygon
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];

				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}

		// also check if it's on polygon stroke
		return inside || Polyline.prototype._containsPoint.call(this, p, true);
	}

});


// @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
function polygon(latlngs, options) {
	return new Polygon(latlngs, options);
}

/*
 * @class GeoJSON
 * @aka L.GeoJSON
 * @inherits FeatureGroup
 *
 * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
 * GeoJSON data and display it on the map. Extends `FeatureGroup`.
 *
 * @example
 *
 * ```js
 * L.geoJSON(data, {
 * 	style: function (feature) {
 * 		return {color: feature.properties.color};
 * 	}
 * }).bindPopup(function (layer) {
 * 	return layer.feature.properties.description;
 * }).addTo(map);
 * ```
 */

var GeoJSON = FeatureGroup.extend({

	/* @section
	 * @aka GeoJSON options
	 *
	 * @option pointToLayer: Function = *
	 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
	 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
	 * The default is to spawn a default `Marker`:
	 * ```js
	 * function(geoJsonPoint, latlng) {
	 * 	return L.marker(latlng);
	 * }
	 * ```
	 *
	 * @option style: Function = *
	 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
	 * called internally when data is added.
	 * The default value is to not override any defaults:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return {}
	 * }
	 * ```
	 *
	 * @option onEachFeature: Function = *
	 * A `Function` that will be called once for each created `Feature`, after it has
	 * been created and styled. Useful for attaching events and popups to features.
	 * The default is to do nothing with the newly created layers:
	 * ```js
	 * function (feature, layer) {}
	 * ```
	 *
	 * @option filter: Function = *
	 * A `Function` that will be used to decide whether to include a feature or not.
	 * The default is to include all features:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return true;
	 * }
	 * ```
	 * Note: dynamically changing the `filter` option will have effect only on newly
	 * added data. It will _not_ re-evaluate already included features.
	 *
	 * @option coordsToLatLng: Function = *
	 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
	 * The default is the `coordsToLatLng` static method.
	 *
	 * @option markersInheritOptions: Boolean = false
	 * Whether default Markers for "Point" type Features inherit from group options.
	 */

	initialize: function (geojson, options) {
		setOptions(this, options);

		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	// @method addData( <GeoJSON> data ): this
	// Adds a GeoJSON object to the layer.
	addData: function (geojson) {
		var features = isArray(geojson) ? geojson : geojson.features,
		    i, len, feature;

		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				// only add this if geometry or geometries are set and not null
				feature = features[i];
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(feature);
				}
			}
			return this;
		}

		var options = this.options;

		if (options.filter && !options.filter(geojson)) { return this; }

		var layer = geometryToLayer(geojson, options);
		if (!layer) {
			return this;
		}
		layer.feature = asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	// @method resetStyle( <Path> layer? ): this
	// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
	// If `layer` is omitted, the style of all features in the current layer is reset.
	resetStyle: function (layer) {
		if (layer === undefined) {
			return this.eachLayer(this.resetStyle, this);
		}
		// reset any custom styles
		layer.options = extend({}, layer.defaultOptions);
		this._setLayerStyle(layer, this.options.style);
		return this;
	},

	// @method setStyle( <Function> style ): this
	// Changes styles of GeoJSON vector layers with the given style function.
	setStyle: function (style) {
		return this.eachLayer(function (layer) {
			this._setLayerStyle(layer, style);
		}, this);
	},

	_setLayerStyle: function (layer, style) {
		if (layer.setStyle) {
			if (typeof style === 'function') {
				style = style(layer.feature);
			}
			layer.setStyle(style);
		}
	}
});

// @section
// There are several static functions which can be called without instantiating L.GeoJSON:

// @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
// Creates a `Layer` from a given GeoJSON feature. Can use a custom
// [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
// functions if provided as options.
function geometryToLayer(geojson, options) {

	var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
	    coords = geometry ? geometry.coordinates : null,
	    layers = [],
	    pointToLayer = options && options.pointToLayer,
	    _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng,
	    latlng, latlngs, i, len;

	if (!coords && !geometry) {
		return null;
	}

	switch (geometry.type) {
	case 'Point':
		latlng = _coordsToLatLng(coords);
		return _pointToLayer(pointToLayer, geojson, latlng, options);

	case 'MultiPoint':
		for (i = 0, len = coords.length; i < len; i++) {
			latlng = _coordsToLatLng(coords[i]);
			layers.push(_pointToLayer(pointToLayer, geojson, latlng, options));
		}
		return new FeatureGroup(layers);

	case 'LineString':
	case 'MultiLineString':
		latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
		return new Polyline(latlngs, options);

	case 'Polygon':
	case 'MultiPolygon':
		latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
		return new Polygon(latlngs, options);

	case 'GeometryCollection':
		for (i = 0, len = geometry.geometries.length; i < len; i++) {
			var layer = geometryToLayer({
				geometry: geometry.geometries[i],
				type: 'Feature',
				properties: geojson.properties
			}, options);

			if (layer) {
				layers.push(layer);
			}
		}
		return new FeatureGroup(layers);

	default:
		throw new Error('Invalid GeoJSON object.');
	}
}

function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
	return pointToLayerFn ?
		pointToLayerFn(geojson, latlng) :
		new Marker(latlng, options && options.markersInheritOptions && options);
}

// @function coordsToLatLng(coords: Array): LatLng
// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
function coordsToLatLng(coords) {
	return new LatLng(coords[1], coords[0], coords[2]);
}

// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
// `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
	var latlngs = [];

	for (var i = 0, len = coords.length, latlng; i < len; i++) {
		latlng = levelsDeep ?
			coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) :
			(_coordsToLatLng || coordsToLatLng)(coords[i]);

		latlngs.push(latlng);
	}

	return latlngs;
}

// @function latLngToCoords(latlng: LatLng, precision?: Number): Array
// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
function latLngToCoords(latlng, precision) {
	precision = typeof precision === 'number' ? precision : 6;
	return latlng.alt !== undefined ?
		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] :
		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
}

// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
// `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
	var coords = [];

	for (var i = 0, len = latlngs.length; i < len; i++) {
		coords.push(levelsDeep ?
			latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) :
			latLngToCoords(latlngs[i], precision));
	}

	if (!levelsDeep && closed) {
		coords.push(coords[0]);
	}

	return coords;
}

function getFeature(layer, newGeometry) {
	return layer.feature ?
		extend({}, layer.feature, {geometry: newGeometry}) :
		asFeature(newGeometry);
}

// @function asFeature(geojson: Object): Object
// Normalize GeoJSON geometries/features into GeoJSON features.
function asFeature(geojson) {
	if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
		return geojson;
	}

	return {
		type: 'Feature',
		properties: {},
		geometry: geojson
	};
}

var PointToGeoJSON = {
	toGeoJSON: function (precision) {
		return getFeature(this, {
			type: 'Point',
			coordinates: latLngToCoords(this.getLatLng(), precision)
		});
	}
};

// @namespace Marker
// @section Other methods
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
Marker.include(PointToGeoJSON);

// @namespace CircleMarker
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
Circle.include(PointToGeoJSON);
CircleMarker.include(PointToGeoJSON);


// @namespace Polyline
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
Polyline.include({
	toGeoJSON: function (precision) {
		var multi = !isFlat(this._latlngs);

		var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

		return getFeature(this, {
			type: (multi ? 'Multi' : '') + 'LineString',
			coordinates: coords
		});
	}
});

// @namespace Polygon
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
Polygon.include({
	toGeoJSON: function (precision) {
		var holes = !isFlat(this._latlngs),
		    multi = holes && !isFlat(this._latlngs[0]);

		var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

		if (!holes) {
			coords = [coords];
		}

		return getFeature(this, {
			type: (multi ? 'Multi' : '') + 'Polygon',
			coordinates: coords
		});
	}
});


// @namespace LayerGroup
LayerGroup.include({
	toMultiPoint: function (precision) {
		var coords = [];

		this.eachLayer(function (layer) {
			coords.push(layer.toGeoJSON(precision).geometry.coordinates);
		});

		return getFeature(this, {
			type: 'MultiPoint',
			coordinates: coords
		});
	},

	// @method toGeoJSON(precision?: Number): Object
	// `precision` is the number of decimal places for coordinates.
	// The default value is 6 places.
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
	toGeoJSON: function (precision) {

		var type = this.feature && this.feature.geometry && this.feature.geometry.type;

		if (type === 'MultiPoint') {
			return this.toMultiPoint(precision);
		}

		var isGeometryCollection = type === 'GeometryCollection',
		    jsons = [];

		this.eachLayer(function (layer) {
			if (layer.toGeoJSON) {
				var json = layer.toGeoJSON(precision);
				if (isGeometryCollection) {
					jsons.push(json.geometry);
				} else {
					var feature = asFeature(json);
					// Squash nested feature collections
					if (feature.type === 'FeatureCollection') {
						jsons.push.apply(jsons, feature.features);
					} else {
						jsons.push(feature);
					}
				}
			}
		});

		if (isGeometryCollection) {
			return getFeature(this, {
				geometries: jsons,
				type: 'GeometryCollection'
			});
		}

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}
});

// @namespace GeoJSON
// @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
// Creates a GeoJSON layer. Optionally accepts an object in
// [GeoJSON format](https://tools.ietf.org/html/rfc7946) to display on the map
// (you can alternatively add it later with `addData` method) and an `options` object.
function geoJSON(geojson, options) {
	return new GeoJSON(geojson, options);
}

// Backward compatibility.
var geoJson = geoJSON;

/*
 * @class ImageOverlay
 * @aka L.ImageOverlay
 * @inherits Interactive layer
 *
 * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
 * L.imageOverlay(imageUrl, imageBounds).addTo(map);
 * ```
 */

var ImageOverlay = Layer.extend({

	// @section
	// @aka ImageOverlay options
	options: {
		// @option opacity: Number = 1.0
		// The opacity of the image overlay.
		opacity: 1,

		// @option alt: String = ''
		// Text for the `alt` attribute of the image (useful for accessibility).
		alt: '',

		// @option interactive: Boolean = false
		// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
		interactive: false,

		// @option crossOrigin: Boolean|String = false
		// Whether the crossOrigin attribute will be added to the image.
		// If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
		// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
		crossOrigin: false,

		// @option errorOverlayUrl: String = ''
		// URL to the overlay image to show in place of the overlay that failed to load.
		errorOverlayUrl: '',

		// @option zIndex: Number = 1
		// The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
		zIndex: 1,

		// @option className: String = ''
		// A custom class name to assign to the image. Empty by default.
		className: ''
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = toLatLngBounds(bounds);

		setOptions(this, options);
	},

	onAdd: function () {
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		if (this.options.interactive) {
			addClass(this._image, 'leaflet-interactive');
			this.addInteractiveTarget(this._image);
		}

		this.getPane().appendChild(this._image);
		this._reset();
	},

	onRemove: function () {
		remove(this._image);
		if (this.options.interactive) {
			this.removeInteractiveTarget(this._image);
		}
	},

	// @method setOpacity(opacity: Number): this
	// Sets the opacity of the overlay.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._image) {
			this._updateOpacity();
		}
		return this;
	},

	setStyle: function (styleOpts) {
		if (styleOpts.opacity) {
			this.setOpacity(styleOpts.opacity);
		}
		return this;
	},

	// @method bringToFront(): this
	// Brings the layer to the top of all overlays.
	bringToFront: function () {
		if (this._map) {
			toFront(this._image);
		}
		return this;
	},

	// @method bringToBack(): this
	// Brings the layer to the bottom of all overlays.
	bringToBack: function () {
		if (this._map) {
			toBack(this._image);
		}
		return this;
	},

	// @method setUrl(url: String): this
	// Changes the URL of the image.
	setUrl: function (url) {
		this._url = url;

		if (this._image) {
			this._image.src = url;
		}
		return this;
	},

	// @method setBounds(bounds: LatLngBounds): this
	// Update the bounds that this ImageOverlay covers
	setBounds: function (bounds) {
		this._bounds = toLatLngBounds(bounds);

		if (this._map) {
			this._reset();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			zoom: this._reset,
			viewreset: this._reset
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	// @method setZIndex(value: Number): this
	// Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
	setZIndex: function (value) {
		this.options.zIndex = value;
		this._updateZIndex();
		return this;
	},

	// @method getBounds(): LatLngBounds
	// Get the bounds that this ImageOverlay covers
	getBounds: function () {
		return this._bounds;
	},

	// @method getElement(): HTMLElement
	// Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
	// used by this overlay.
	getElement: function () {
		return this._image;
	},

	_initImage: function () {
		var wasElementSupplied = this._url.tagName === 'IMG';
		var img = this._image = wasElementSupplied ? this._url : create$1('img');

		addClass(img, 'leaflet-image-layer');
		if (this._zoomAnimated) { addClass(img, 'leaflet-zoom-animated'); }
		if (this.options.className) { addClass(img, this.options.className); }

		img.onselectstart = falseFn;
		img.onmousemove = falseFn;

		// @event load: Event
		// Fired when the ImageOverlay layer has loaded its image
		img.onload = bind(this.fire, this, 'load');
		img.onerror = bind(this._overlayOnError, this, 'error');

		if (this.options.crossOrigin || this.options.crossOrigin === '') {
			img.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
		}

		if (this.options.zIndex) {
			this._updateZIndex();
		}

		if (wasElementSupplied) {
			this._url = img.src;
			return;
		}

		img.src = this._url;
		img.alt = this.options.alt;
	},

	_animateZoom: function (e) {
		var scale = this._map.getZoomScale(e.zoom),
		    offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

		setTransform(this._image, offset, scale);
	},

	_reset: function () {
		var image = this._image,
		    bounds = new Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		setPosition(image, bounds.min);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_updateOpacity: function () {
		setOpacity(this._image, this.options.opacity);
	},

	_updateZIndex: function () {
		if (this._image && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._image.style.zIndex = this.options.zIndex;
		}
	},

	_overlayOnError: function () {
		// @event error: Event
		// Fired when the ImageOverlay layer fails to load its image
		this.fire('error');

		var errorUrl = this.options.errorOverlayUrl;
		if (errorUrl && this._url !== errorUrl) {
			this._url = errorUrl;
			this._image.src = errorUrl;
		}
	}
});

// @factory L.imageOverlay(imageUrl: String, bounds: LatLngBounds, options?: ImageOverlay options)
// Instantiates an image overlay object given the URL of the image and the
// geographical bounds it is tied to.
var imageOverlay = function (url, bounds, options) {
	return new ImageOverlay(url, bounds, options);
};

/*
 * @class VideoOverlay
 * @aka L.VideoOverlay
 * @inherits ImageOverlay
 *
 * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
 *
 * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
 * HTML5 element.
 *
 * @example
 *
 * ```js
 * var videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
 * 	videoBounds = [[ 32, -130], [ 13, -100]];
 * L.videoOverlay(videoUrl, videoBounds ).addTo(map);
 * ```
 */

var VideoOverlay = ImageOverlay.extend({

	// @section
	// @aka VideoOverlay options
	options: {
		// @option autoplay: Boolean = true
		// Whether the video starts playing automatically when loaded.
		autoplay: true,

		// @option loop: Boolean = true
		// Whether the video will loop back to the beginning when played.
		loop: true,

		// @option keepAspectRatio: Boolean = true
		// Whether the video will save aspect ratio after the projection.
		// Relevant for supported browsers. Browser compatibility- https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
		keepAspectRatio: true
	},

	_initImage: function () {
		var wasElementSupplied = this._url.tagName === 'VIDEO';
		var vid = this._image = wasElementSupplied ? this._url : create$1('video');

		addClass(vid, 'leaflet-image-layer');
		if (this._zoomAnimated) { addClass(vid, 'leaflet-zoom-animated'); }
		if (this.options.className) { addClass(vid, this.options.className); }

		vid.onselectstart = falseFn;
		vid.onmousemove = falseFn;

		// @event load: Event
		// Fired when the video has finished loading the first frame
		vid.onloadeddata = bind(this.fire, this, 'load');

		if (wasElementSupplied) {
			var sourceElements = vid.getElementsByTagName('source');
			var sources = [];
			for (var j = 0; j < sourceElements.length; j++) {
				sources.push(sourceElements[j].src);
			}

			this._url = (sourceElements.length > 0) ? sources : [vid.src];
			return;
		}

		if (!isArray(this._url)) { this._url = [this._url]; }

		if (!this.options.keepAspectRatio && vid.style.hasOwnProperty('objectFit')) { vid.style['objectFit'] = 'fill'; }
		vid.autoplay = !!this.options.autoplay;
		vid.loop = !!this.options.loop;
		for (var i = 0; i < this._url.length; i++) {
			var source = create$1('source');
			source.src = this._url[i];
			vid.appendChild(source);
		}
	}

	// @method getElement(): HTMLVideoElement
	// Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
	// used by this overlay.
});


// @factory L.videoOverlay(video: String|Array|HTMLVideoElement, bounds: LatLngBounds, options?: VideoOverlay options)
// Instantiates an image overlay object given the URL of the video (or array of URLs, or even a video element) and the
// geographical bounds it is tied to.

function videoOverlay(video, bounds, options) {
	return new VideoOverlay(video, bounds, options);
}

/*
 * @class SVGOverlay
 * @aka L.SVGOverlay
 * @inherits ImageOverlay
 *
 * Used to load, display and provide DOM access to an SVG file over specific bounds of the map. Extends `ImageOverlay`.
 *
 * An SVG overlay uses the [`<svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/svg) element.
 *
 * @example
 *
 * ```js
 * var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
 * svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
 * svgElement.setAttribute('viewBox', "0 0 200 200");
 * svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
 * var svgElementBounds = [ [ 32, -130 ], [ 13, -100 ] ];
 * L.svgOverlay(svgElement, svgElementBounds).addTo(map);
 * ```
 */

var SVGOverlay = ImageOverlay.extend({
	_initImage: function () {
		var el = this._image = this._url;

		addClass(el, 'leaflet-image-layer');
		if (this._zoomAnimated) { addClass(el, 'leaflet-zoom-animated'); }
		if (this.options.className) { addClass(el, this.options.className); }

		el.onselectstart = falseFn;
		el.onmousemove = falseFn;
	}

	// @method getElement(): SVGElement
	// Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
	// used by this overlay.
});


// @factory L.svgOverlay(svg: String|SVGElement, bounds: LatLngBounds, options?: SVGOverlay options)
// Instantiates an image overlay object given an SVG element and the geographical bounds it is tied to.
// A viewBox attribute is required on the SVG element to zoom in and out properly.

function svgOverlay(el, bounds, options) {
	return new SVGOverlay(el, bounds, options);
}

/*
 * @class DivOverlay
 * @inherits Layer
 * @aka L.DivOverlay
 * Base model for L.Popup and L.Tooltip. Inherit from it for custom popup like plugins.
 */

// @namespace DivOverlay
var DivOverlay = Layer.extend({

	// @section
	// @aka DivOverlay options
	options: {
		// @option offset: Point = Point(0, 7)
		// The offset of the popup position. Useful to control the anchor
		// of the popup when opening it on some overlays.
		offset: [0, 7],

		// @option className: String = ''
		// A custom CSS class name to assign to the popup.
		className: '',

		// @option pane: String = 'popupPane'
		// `Map pane` where the popup will be added.
		pane: 'popupPane'
	},

	initialize: function (options, source) {
		setOptions(this, options);

		this._source = source;
	},

	onAdd: function (map) {
		this._zoomAnimated = map._zoomAnimated;

		if (!this._container) {
			this._initLayout();
		}

		if (map._fadeAnimated) {
			setOpacity(this._container, 0);
		}

		clearTimeout(this._removeTimeout);
		this.getPane().appendChild(this._container);
		this.update();

		if (map._fadeAnimated) {
			setOpacity(this._container, 1);
		}

		this.bringToFront();
	},

	onRemove: function (map) {
		if (map._fadeAnimated) {
			setOpacity(this._container, 0);
			this._removeTimeout = setTimeout(bind(remove, undefined, this._container), 200);
		} else {
			remove(this._container);
		}
	},

	// @namespace Popup
	// @method getLatLng: LatLng
	// Returns the geographical point of popup.
	getLatLng: function () {
		return this._latlng;
	},

	// @method setLatLng(latlng: LatLng): this
	// Sets the geographical point where the popup will open.
	setLatLng: function (latlng) {
		this._latlng = toLatLng(latlng);
		if (this._map) {
			this._updatePosition();
			this._adjustPan();
		}
		return this;
	},

	// @method getContent: String|HTMLElement
	// Returns the content of the popup.
	getContent: function () {
		return this._content;
	},

	// @method setContent(htmlContent: String|HTMLElement|Function): this
	// Sets the HTML content of the popup. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the popup.
	setContent: function (content) {
		this._content = content;
		this.update();
		return this;
	},

	// @method getElement: String|HTMLElement
	// Alias for [getContent()](#popup-getcontent)
	getElement: function () {
		return this._container;
	},

	// @method update: null
	// Updates the popup content, layout and position. Useful for updating the popup after something inside changed, e.g. image loaded.
	update: function () {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	getEvents: function () {
		var events = {
			zoom: this._updatePosition,
			viewreset: this._updatePosition
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}
		return events;
	},

	// @method isOpen: Boolean
	// Returns `true` when the popup is visible on the map.
	isOpen: function () {
		return !!this._map && this._map.hasLayer(this);
	},

	// @method bringToFront: this
	// Brings this popup in front of other popups (in the same map pane).
	bringToFront: function () {
		if (this._map) {
			toFront(this._container);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings this popup to the back of other popups (in the same map pane).
	bringToBack: function () {
		if (this._map) {
			toBack(this._container);
		}
		return this;
	},

	_prepareOpen: function (parent, layer, latlng) {
		if (!(layer instanceof Layer)) {
			latlng = layer;
			layer = parent;
		}

		if (layer instanceof FeatureGroup) {
			for (var id in parent._layers) {
				layer = parent._layers[id];
				break;
			}
		}

		if (!latlng) {
			if (layer.getCenter) {
				latlng = layer.getCenter();
			} else if (layer.getLatLng) {
				latlng = layer.getLatLng();
			} else {
				throw new Error('Unable to get source layer LatLng.');
			}
		}

		// set overlay source to this layer
		this._source = layer;

		// update the overlay (content, layout, ect...)
		this.update();

		return latlng;
	},

	_updateContent: function () {
		if (!this._content) { return; }

		var node = this._contentNode;
		var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

		if (typeof content === 'string') {
			node.innerHTML = content;
		} else {
			while (node.hasChildNodes()) {
				node.removeChild(node.firstChild);
			}
			node.appendChild(content);
		}
		this.fire('contentupdate');
	},

	_updatePosition: function () {
		if (!this._map) { return; }

		var pos = this._map.latLngToLayerPoint(this._latlng),
		    offset = toPoint(this.options.offset),
		    anchor = this._getAnchor();

		if (this._zoomAnimated) {
			setPosition(this._container, pos.add(anchor));
		} else {
			offset = offset.add(pos).add(anchor);
		}

		var bottom = this._containerBottom = -offset.y,
		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		// bottom position the popup in case the height of the popup changes (images loading etc)
		this._container.style.bottom = bottom + 'px';
		this._container.style.left = left + 'px';
	},

	_getAnchor: function () {
		return [0, 0];
	}

});

/*
 * @class Popup
 * @inherits DivOverlay
 * @aka L.Popup
 * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup) to
 * open popups while making sure that only one popup is open at one time
 * (recommended for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
 *
 * @example
 *
 * If you want to just bind a popup to marker click and then open it, it's really easy:
 *
 * ```js
 * marker.bindPopup(popupContent).openPopup();
 * ```
 * Path overlays like polylines also have a `bindPopup` method.
 * Here's a more complicated way to open a popup on a map:
 *
 * ```js
 * var popup = L.popup()
 * 	.setLatLng(latlng)
 * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
 * 	.openOn(map);
 * ```
 */


// @namespace Popup
var Popup = DivOverlay.extend({

	// @section
	// @aka Popup options
	options: {
		// @option maxWidth: Number = 300
		// Max width of the popup, in pixels.
		maxWidth: 300,

		// @option minWidth: Number = 50
		// Min width of the popup, in pixels.
		minWidth: 50,

		// @option maxHeight: Number = null
		// If set, creates a scrollable container of the given height
		// inside a popup if its content exceeds it.
		maxHeight: null,

		// @option autoPan: Boolean = true
		// Set it to `false` if you don't want the map to do panning animation
		// to fit the opened popup.
		autoPan: true,

		// @option autoPanPaddingTopLeft: Point = null
		// The margin between the popup and the top left corner of the map
		// view after autopanning was performed.
		autoPanPaddingTopLeft: null,

		// @option autoPanPaddingBottomRight: Point = null
		// The margin between the popup and the bottom right corner of the map
		// view after autopanning was performed.
		autoPanPaddingBottomRight: null,

		// @option autoPanPadding: Point = Point(5, 5)
		// Equivalent of setting both top left and bottom right autopan padding to the same value.
		autoPanPadding: [5, 5],

		// @option keepInView: Boolean = false
		// Set it to `true` if you want to prevent users from panning the popup
		// off of the screen while it is open.
		keepInView: false,

		// @option closeButton: Boolean = true
		// Controls the presence of a close button in the popup.
		closeButton: true,

		// @option autoClose: Boolean = true
		// Set it to `false` if you want to override the default behavior of
		// the popup closing when another popup is opened.
		autoClose: true,

		// @option closeOnEscapeKey: Boolean = true
		// Set it to `false` if you want to override the default behavior of
		// the ESC key for closing of the popup.
		closeOnEscapeKey: true,

		// @option closeOnClick: Boolean = *
		// Set it if you want to override the default behavior of the popup closing when user clicks
		// on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.

		// @option className: String = ''
		// A custom CSS class name to assign to the popup.
		className: ''
	},

	// @namespace Popup
	// @method openOn(map: Map): this
	// Adds the popup to the map and closes the previous one. The same as `map.openPopup(popup)`.
	openOn: function (map) {
		map.openPopup(this);
		return this;
	},

	onAdd: function (map) {
		DivOverlay.prototype.onAdd.call(this, map);

		// @namespace Map
		// @section Popup events
		// @event popupopen: PopupEvent
		// Fired when a popup is opened in the map
		map.fire('popupopen', {popup: this});

		if (this._source) {
			// @namespace Layer
			// @section Popup events
			// @event popupopen: PopupEvent
			// Fired when a popup bound to this layer is opened
			this._source.fire('popupopen', {popup: this}, true);
			// For non-path layers, we toggle the popup when clicking
			// again the layer, so prevent the map to reopen it.
			if (!(this._source instanceof Path)) {
				this._source.on('preclick', stopPropagation);
			}
		}
	},

	onRemove: function (map) {
		DivOverlay.prototype.onRemove.call(this, map);

		// @namespace Map
		// @section Popup events
		// @event popupclose: PopupEvent
		// Fired when a popup in the map is closed
		map.fire('popupclose', {popup: this});

		if (this._source) {
			// @namespace Layer
			// @section Popup events
			// @event popupclose: PopupEvent
			// Fired when a popup bound to this layer is closed
			this._source.fire('popupclose', {popup: this}, true);
			if (!(this._source instanceof Path)) {
				this._source.off('preclick', stopPropagation);
			}
		}
	},

	getEvents: function () {
		var events = DivOverlay.prototype.getEvents.call(this);

		if (this.options.closeOnClick !== undefined ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
			events.preclick = this._close;
		}

		if (this.options.keepInView) {
			events.moveend = this._adjustPan;
		}

		return events;
	},

	_close: function () {
		if (this._map) {
			this._map.closePopup(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-popup',
		    container = this._container = create$1('div',
			prefix + ' ' + (this.options.className || '') +
			' leaflet-zoom-animated');

		var wrapper = this._wrapper = create$1('div', prefix + '-content-wrapper', container);
		this._contentNode = create$1('div', prefix + '-content', wrapper);

		disableClickPropagation(wrapper);
		disableScrollPropagation(this._contentNode);
		on(wrapper, 'contextmenu', stopPropagation);

		this._tipContainer = create$1('div', prefix + '-tip-container', container);
		this._tip = create$1('div', prefix + '-tip', this._tipContainer);

		if (this.options.closeButton) {
			var closeButton = this._closeButton = create$1('a', prefix + '-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';

			on(closeButton, 'click', this._onCloseButtonClick, this);
		}
	},

	_updateLayout: function () {
		var container = this._contentNode,
		    style = container.style;

		style.width = '';
		style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		style.width = (width + 1) + 'px';
		style.whiteSpace = '';

		style.height = '';

		var height = container.offsetHeight,
		    maxHeight = this.options.maxHeight,
		    scrolledClass = 'leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			style.height = maxHeight + 'px';
			addClass(container, scrolledClass);
		} else {
			removeClass(container, scrolledClass);
		}

		this._containerWidth = this._container.offsetWidth;
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
		    anchor = this._getAnchor();
		setPosition(this._container, pos.add(anchor));
	},

	_adjustPan: function () {
		if (!this.options.autoPan) { return; }
		if (this._map._panAnim) { this._map._panAnim.stop(); }

		var map = this._map,
		    marginBottom = parseInt(getStyle(this._container, 'marginBottom'), 10) || 0,
		    containerHeight = this._container.offsetHeight + marginBottom,
		    containerWidth = this._containerWidth,
		    layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);

		layerPos._add(getPosition(this._container));

		var containerPos = map.layerPointToContainerPoint(layerPos),
		    padding = toPoint(this.options.autoPanPadding),
		    paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding),
		    paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding),
		    size = map.getSize(),
		    dx = 0,
		    dy = 0;

		if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
			dx = containerPos.x + containerWidth - size.x + paddingBR.x;
		}
		if (containerPos.x - dx - paddingTL.x < 0) { // left
			dx = containerPos.x - paddingTL.x;
		}
		if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
			dy = containerPos.y + containerHeight - size.y + paddingBR.y;
		}
		if (containerPos.y - dy - paddingTL.y < 0) { // top
			dy = containerPos.y - paddingTL.y;
		}

		// @namespace Map
		// @section Popup events
		// @event autopanstart: Event
		// Fired when the map starts autopanning when opening a popup.
		if (dx || dy) {
			map
			    .fire('autopanstart')
			    .panBy([dx, dy]);
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		stop(e);
	},

	_getAnchor: function () {
		// Where should we anchor the popup on the source layer?
		return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
	}

});

// @namespace Popup
// @factory L.popup(options?: Popup options, source?: Layer)
// Instantiates a `Popup` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the popup with a reference to the Layer to which it refers.
var popup = function (options, source) {
	return new Popup(options, source);
};


/* @namespace Map
 * @section Interaction Options
 * @option closePopupOnClick: Boolean = true
 * Set it to `false` if you don't want popups to close when user clicks the map.
 */
Map.mergeOptions({
	closePopupOnClick: true
});


// @namespace Map
// @section Methods for Layers and Controls
Map.include({
	// @method openPopup(popup: Popup): this
	// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
	// @alternative
	// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
	// Creates a popup with the specified content and options and opens it in the given point on a map.
	openPopup: function (popup, latlng, options) {
		if (!(popup instanceof Popup)) {
			popup = new Popup(options).setContent(popup);
		}

		if (latlng) {
			popup.setLatLng(latlng);
		}

		if (this.hasLayer(popup)) {
			return this;
		}

		if (this._popup && this._popup.options.autoClose) {
			this.closePopup();
		}

		this._popup = popup;
		return this.addLayer(popup);
	},

	// @method closePopup(popup?: Popup): this
	// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
	closePopup: function (popup) {
		if (!popup || popup === this._popup) {
			popup = this._popup;
			this._popup = null;
		}
		if (popup) {
			this.removeLayer(popup);
		}
		return this;
	}
});

/*
 * @namespace Layer
 * @section Popup methods example
 *
 * All layers share a set of methods convenient for binding popups to it.
 *
 * ```js
 * var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
 * layer.openPopup();
 * layer.closePopup();
 * ```
 *
 * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from the map or another popup is opened.
 */

// @section Popup methods
Layer.include({

	// @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
	// Binds a popup to the layer with the passed `content` and sets up the
	// necessary event listeners. If a `Function` is passed it will receive
	// the layer as the first argument and should return a `String` or `HTMLElement`.
	bindPopup: function (content, options) {

		if (content instanceof Popup) {
			setOptions(content, options);
			this._popup = content;
			content._source = this;
		} else {
			if (!this._popup || options) {
				this._popup = new Popup(options, this);
			}
			this._popup.setContent(content);
		}

		if (!this._popupHandlersAdded) {
			this.on({
				click: this._openPopup,
				keypress: this._onKeyPress,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popupHandlersAdded = true;
		}

		return this;
	},

	// @method unbindPopup(): this
	// Removes the popup previously bound with `bindPopup`.
	unbindPopup: function () {
		if (this._popup) {
			this.off({
				click: this._openPopup,
				keypress: this._onKeyPress,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popupHandlersAdded = false;
			this._popup = null;
		}
		return this;
	},

	// @method openPopup(latlng?: LatLng): this
	// Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
	openPopup: function (layer, latlng) {
		if (this._popup && this._map) {
			latlng = this._popup._prepareOpen(this, layer, latlng);

			// open the popup on the map
			this._map.openPopup(this._popup, latlng);
		}

		return this;
	},

	// @method closePopup(): this
	// Closes the popup bound to this layer if it is open.
	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	// @method togglePopup(): this
	// Opens or closes the popup bound to this layer depending on its current state.
	togglePopup: function (target) {
		if (this._popup) {
			if (this._popup._map) {
				this.closePopup();
			} else {
				this.openPopup(target);
			}
		}
		return this;
	},

	// @method isPopupOpen(): boolean
	// Returns `true` if the popup bound to this layer is currently open.
	isPopupOpen: function () {
		return (this._popup ? this._popup.isOpen() : false);
	},

	// @method setPopupContent(content: String|HTMLElement|Popup): this
	// Sets the content of the popup bound to this layer.
	setPopupContent: function (content) {
		if (this._popup) {
			this._popup.setContent(content);
		}
		return this;
	},

	// @method getPopup(): Popup
	// Returns the popup bound to this layer.
	getPopup: function () {
		return this._popup;
	},

	_openPopup: function (e) {
		var layer = e.layer || e.target;

		if (!this._popup) {
			return;
		}

		if (!this._map) {
			return;
		}

		// prevent map click
		stop(e);

		// if this inherits from Path its a vector and we can just
		// open the popup at the new location
		if (layer instanceof Path) {
			this.openPopup(e.layer || e.target, e.latlng);
			return;
		}

		// otherwise treat it like a marker and figure out
		// if we should toggle it open/closed
		if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
			this.closePopup();
		} else {
			this.openPopup(layer, e.latlng);
		}
	},

	_movePopup: function (e) {
		this._popup.setLatLng(e.latlng);
	},

	_onKeyPress: function (e) {
		if (e.originalEvent.keyCode === 13) {
			this._openPopup(e);
		}
	}
});

/*
 * @class Tooltip
 * @inherits DivOverlay
 * @aka L.Tooltip
 * Used to display small texts on top of map layers.
 *
 * @example
 *
 * ```js
 * marker.bindTooltip("my tooltip text").openTooltip();
 * ```
 * Note about tooltip offset. Leaflet takes two options in consideration
 * for computing tooltip offsetting:
 * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
 *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
 *   move it to the bottom. Negatives will move to the left and top.
 * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
 *   should adapt this value if you use a custom icon.
 */


// @namespace Tooltip
var Tooltip = DivOverlay.extend({

	// @section
	// @aka Tooltip options
	options: {
		// @option pane: String = 'tooltipPane'
		// `Map pane` where the tooltip will be added.
		pane: 'tooltipPane',

		// @option offset: Point = Point(0, 0)
		// Optional offset of the tooltip position.
		offset: [0, 0],

		// @option direction: String = 'auto'
		// Direction where to open the tooltip. Possible values are: `right`, `left`,
		// `top`, `bottom`, `center`, `auto`.
		// `auto` will dynamically switch between `right` and `left` according to the tooltip
		// position on the map.
		direction: 'auto',

		// @option permanent: Boolean = false
		// Whether to open the tooltip permanently or only on mouseover.
		permanent: false,

		// @option sticky: Boolean = false
		// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
		sticky: false,

		// @option interactive: Boolean = false
		// If true, the tooltip will listen to the feature events.
		interactive: false,

		// @option opacity: Number = 0.9
		// Tooltip container opacity.
		opacity: 0.9
	},

	onAdd: function (map) {
		DivOverlay.prototype.onAdd.call(this, map);
		this.setOpacity(this.options.opacity);

		// @namespace Map
		// @section Tooltip events
		// @event tooltipopen: TooltipEvent
		// Fired when a tooltip is opened in the map.
		map.fire('tooltipopen', {tooltip: this});

		if (this._source) {
			// @namespace Layer
			// @section Tooltip events
			// @event tooltipopen: TooltipEvent
			// Fired when a tooltip bound to this layer is opened.
			this._source.fire('tooltipopen', {tooltip: this}, true);
		}
	},

	onRemove: function (map) {
		DivOverlay.prototype.onRemove.call(this, map);

		// @namespace Map
		// @section Tooltip events
		// @event tooltipclose: TooltipEvent
		// Fired when a tooltip in the map is closed.
		map.fire('tooltipclose', {tooltip: this});

		if (this._source) {
			// @namespace Layer
			// @section Tooltip events
			// @event tooltipclose: TooltipEvent
			// Fired when a tooltip bound to this layer is closed.
			this._source.fire('tooltipclose', {tooltip: this}, true);
		}
	},

	getEvents: function () {
		var events = DivOverlay.prototype.getEvents.call(this);

		if (touch && !this.options.permanent) {
			events.preclick = this._close;
		}

		return events;
	},

	_close: function () {
		if (this._map) {
			this._map.closeTooltip(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-tooltip',
		    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		this._contentNode = this._container = create$1('div', className);
	},

	_updateLayout: function () {},

	_adjustPan: function () {},

	_setPosition: function (pos) {
		var map = this._map,
		    container = this._container,
		    centerPoint = map.latLngToContainerPoint(map.getCenter()),
		    tooltipPoint = map.layerPointToContainerPoint(pos),
		    direction = this.options.direction,
		    tooltipWidth = container.offsetWidth,
		    tooltipHeight = container.offsetHeight,
		    offset = toPoint(this.options.offset),
		    anchor = this._getAnchor();

		if (direction === 'top') {
			pos = pos.add(toPoint(-tooltipWidth / 2 + offset.x, -tooltipHeight + offset.y + anchor.y, true));
		} else if (direction === 'bottom') {
			pos = pos.subtract(toPoint(tooltipWidth / 2 - offset.x, -offset.y, true));
		} else if (direction === 'center') {
			pos = pos.subtract(toPoint(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y, true));
		} else if (direction === 'right' || direction === 'auto' && tooltipPoint.x < centerPoint.x) {
			direction = 'right';
			pos = pos.add(toPoint(offset.x + anchor.x, anchor.y - tooltipHeight / 2 + offset.y, true));
		} else {
			direction = 'left';
			pos = pos.subtract(toPoint(tooltipWidth + anchor.x - offset.x, tooltipHeight / 2 - anchor.y - offset.y, true));
		}

		removeClass(container, 'leaflet-tooltip-right');
		removeClass(container, 'leaflet-tooltip-left');
		removeClass(container, 'leaflet-tooltip-top');
		removeClass(container, 'leaflet-tooltip-bottom');
		addClass(container, 'leaflet-tooltip-' + direction);
		setPosition(container, pos);
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);
		this._setPosition(pos);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._container) {
			setOpacity(this._container, opacity);
		}
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
		this._setPosition(pos);
	},

	_getAnchor: function () {
		// Where should we anchor the tooltip on the source layer?
		return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
	}

});

// @namespace Tooltip
// @factory L.tooltip(options?: Tooltip options, source?: Layer)
// Instantiates a Tooltip object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
var tooltip = function (options, source) {
	return new Tooltip(options, source);
};

// @namespace Map
// @section Methods for Layers and Controls
Map.include({

	// @method openTooltip(tooltip: Tooltip): this
	// Opens the specified tooltip.
	// @alternative
	// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
	// Creates a tooltip with the specified content and options and open it.
	openTooltip: function (tooltip, latlng, options) {
		if (!(tooltip instanceof Tooltip)) {
			tooltip = new Tooltip(options).setContent(tooltip);
		}

		if (latlng) {
			tooltip.setLatLng(latlng);
		}

		if (this.hasLayer(tooltip)) {
			return this;
		}

		return this.addLayer(tooltip);
	},

	// @method closeTooltip(tooltip?: Tooltip): this
	// Closes the tooltip given as parameter.
	closeTooltip: function (tooltip) {
		if (tooltip) {
			this.removeLayer(tooltip);
		}
		return this;
	}

});

/*
 * @namespace Layer
 * @section Tooltip methods example
 *
 * All layers share a set of methods convenient for binding tooltips to it.
 *
 * ```js
 * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
 * layer.openTooltip();
 * layer.closeTooltip();
 * ```
 */

// @section Tooltip methods
Layer.include({

	// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
	// Binds a tooltip to the layer with the passed `content` and sets up the
	// necessary event listeners. If a `Function` is passed it will receive
	// the layer as the first argument and should return a `String` or `HTMLElement`.
	bindTooltip: function (content, options) {

		if (content instanceof Tooltip) {
			setOptions(content, options);
			this._tooltip = content;
			content._source = this;
		} else {
			if (!this._tooltip || options) {
				this._tooltip = new Tooltip(options, this);
			}
			this._tooltip.setContent(content);

		}

		this._initTooltipInteractions();

		if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
			this.openTooltip();
		}

		return this;
	},

	// @method unbindTooltip(): this
	// Removes the tooltip previously bound with `bindTooltip`.
	unbindTooltip: function () {
		if (this._tooltip) {
			this._initTooltipInteractions(true);
			this.closeTooltip();
			this._tooltip = null;
		}
		return this;
	},

	_initTooltipInteractions: function (remove$$1) {
		if (!remove$$1 && this._tooltipHandlersAdded) { return; }
		var onOff = remove$$1 ? 'off' : 'on',
		    events = {
			remove: this.closeTooltip,
			move: this._moveTooltip
		    };
		if (!this._tooltip.options.permanent) {
			events.mouseover = this._openTooltip;
			events.mouseout = this.closeTooltip;
			if (this._tooltip.options.sticky) {
				events.mousemove = this._moveTooltip;
			}
			if (touch) {
				events.click = this._openTooltip;
			}
		} else {
			events.add = this._openTooltip;
		}
		this[onOff](events);
		this._tooltipHandlersAdded = !remove$$1;
	},

	// @method openTooltip(latlng?: LatLng): this
	// Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
	openTooltip: function (layer, latlng) {
		if (this._tooltip && this._map) {
			latlng = this._tooltip._prepareOpen(this, layer, latlng);

			// open the tooltip on the map
			this._map.openTooltip(this._tooltip, latlng);

			// Tooltip container may not be defined if not permanent and never
			// opened.
			if (this._tooltip.options.interactive && this._tooltip._container) {
				addClass(this._tooltip._container, 'leaflet-clickable');
				this.addInteractiveTarget(this._tooltip._container);
			}
		}

		return this;
	},

	// @method closeTooltip(): this
	// Closes the tooltip bound to this layer if it is open.
	closeTooltip: function () {
		if (this._tooltip) {
			this._tooltip._close();
			if (this._tooltip.options.interactive && this._tooltip._container) {
				removeClass(this._tooltip._container, 'leaflet-clickable');
				this.removeInteractiveTarget(this._tooltip._container);
			}
		}
		return this;
	},

	// @method toggleTooltip(): this
	// Opens or closes the tooltip bound to this layer depending on its current state.
	toggleTooltip: function (target) {
		if (this._tooltip) {
			if (this._tooltip._map) {
				this.closeTooltip();
			} else {
				this.openTooltip(target);
			}
		}
		return this;
	},

	// @method isTooltipOpen(): boolean
	// Returns `true` if the tooltip bound to this layer is currently open.
	isTooltipOpen: function () {
		return this._tooltip.isOpen();
	},

	// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
	// Sets the content of the tooltip bound to this layer.
	setTooltipContent: function (content) {
		if (this._tooltip) {
			this._tooltip.setContent(content);
		}
		return this;
	},

	// @method getTooltip(): Tooltip
	// Returns the tooltip bound to this layer.
	getTooltip: function () {
		return this._tooltip;
	},

	_openTooltip: function (e) {
		var layer = e.layer || e.target;

		if (!this._tooltip || !this._map) {
			return;
		}
		this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : undefined);
	},

	_moveTooltip: function (e) {
		var latlng = e.latlng, containerPoint, layerPoint;
		if (this._tooltip.options.sticky && e.originalEvent) {
			containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
			latlng = this._map.layerPointToLatLng(layerPoint);
		}
		this._tooltip.setLatLng(latlng);
	}
});

/*
 * @class DivIcon
 * @aka L.DivIcon
 * @inherits Icon
 *
 * Represents a lightweight icon for markers that uses a simple `<div>`
 * element instead of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
 *
 * @example
 * ```js
 * var myIcon = L.divIcon({className: 'my-div-icon'});
 * // you can set .my-div-icon styles in CSS
 *
 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
 * ```
 *
 * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
 */

var DivIcon = Icon.extend({
	options: {
		// @section
		// @aka DivIcon options
		iconSize: [12, 12], // also can be set through CSS

		// iconAnchor: (Point),
		// popupAnchor: (Point),

		// @option html: String|HTMLElement = ''
		// Custom HTML code to put inside the div element, empty by default. Alternatively,
		// an instance of `HTMLElement`.
		html: false,

		// @option bgPos: Point = [0, 0]
		// Optional relative position of the background, in pixels
		bgPos: null,

		className: 'leaflet-div-icon'
	},

	createIcon: function (oldIcon) {
		var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
		    options = this.options;

		if (options.html instanceof Element) {
			empty(div);
			div.appendChild(options.html);
		} else {
			div.innerHTML = options.html !== false ? options.html : '';
		}

		if (options.bgPos) {
			var bgPos = toPoint(options.bgPos);
			div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
		}
		this._setIconStyles(div, 'icon');

		return div;
	},

	createShadow: function () {
		return null;
	}
});

// @factory L.divIcon(options: DivIcon options)
// Creates a `DivIcon` instance with the given options.
function divIcon(options) {
	return new DivIcon(options);
}

Icon.Default = IconDefault;

/*
 * @class GridLayer
 * @inherits Layer
 * @aka L.GridLayer
 *
 * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
 * GridLayer can be extended to create a tiled grid of HTML elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
 *
 *
 * @section Synchronous usage
 * @example
 *
 * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
 *
 * ```js
 * var CanvasLayer = L.GridLayer.extend({
 *     createTile: function(coords){
 *         // create a <canvas> element for drawing
 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         var size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
 *         var ctx = tile.getContext('2d');
 *
 *         // return the tile so it can be rendered on screen
 *         return tile;
 *     }
 * });
 * ```
 *
 * @section Asynchronous usage
 * @example
 *
 * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
 *
 * ```js
 * var CanvasLayer = L.GridLayer.extend({
 *     createTile: function(coords, done){
 *         var error;
 *
 *         // create a <canvas> element for drawing
 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         var size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // draw something asynchronously and pass the tile to the done() callback
 *         setTimeout(function() {
 *             done(error, tile);
 *         }, 1000);
 *
 *         return tile;
 *     }
 * });
 * ```
 *
 * @section
 */


var GridLayer = Layer.extend({

	// @section
	// @aka GridLayer options
	options: {
		// @option tileSize: Number|Point = 256
		// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
		tileSize: 256,

		// @option opacity: Number = 1.0
		// Opacity of the tiles. Can be used in the `createTile()` function.
		opacity: 1,

		// @option updateWhenIdle: Boolean = (depends)
		// Load new tiles only when panning ends.
		// `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
		// `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
		// [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
		updateWhenIdle: mobile,

		// @option updateWhenZooming: Boolean = true
		// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
		updateWhenZooming: true,

		// @option updateInterval: Number = 200
		// Tiles will not update more than once every `updateInterval` milliseconds when panning.
		updateInterval: 200,

		// @option zIndex: Number = 1
		// The explicit zIndex of the tile layer.
		zIndex: 1,

		// @option bounds: LatLngBounds = undefined
		// If set, tiles will only be loaded inside the set `LatLngBounds`.
		bounds: null,

		// @option minZoom: Number = 0
		// The minimum zoom level down to which this layer will be displayed (inclusive).
		minZoom: 0,

		// @option maxZoom: Number = undefined
		// The maximum zoom level up to which this layer will be displayed (inclusive).
		maxZoom: undefined,

		// @option maxNativeZoom: Number = undefined
		// Maximum zoom number the tile source has available. If it is specified,
		// the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
		// from `maxNativeZoom` level and auto-scaled.
		maxNativeZoom: undefined,

		// @option minNativeZoom: Number = undefined
		// Minimum zoom number the tile source has available. If it is specified,
		// the tiles on all zoom levels lower than `minNativeZoom` will be loaded
		// from `minNativeZoom` level and auto-scaled.
		minNativeZoom: undefined,

		// @option noWrap: Boolean = false
		// Whether the layer is wrapped around the antimeridian. If `true`, the
		// GridLayer will only be displayed once at low zoom levels. Has no
		// effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
		// in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
		// tiles outside the CRS limits.
		noWrap: false,

		// @option pane: String = 'tilePane'
		// `Map pane` where the grid layer will be added.
		pane: 'tilePane',

		// @option className: String = ''
		// A custom class name to assign to the tile layer. Empty by default.
		className: '',

		// @option keepBuffer: Number = 2
		// When panning the map, keep this many rows and columns of tiles before unloading them.
		keepBuffer: 2
	},

	initialize: function (options) {
		setOptions(this, options);
	},

	onAdd: function () {
		this._initContainer();

		this._levels = {};
		this._tiles = {};

		this._resetView();
		this._update();
	},

	beforeAdd: function (map) {
		map._addZoomLimit(this);
	},

	onRemove: function (map) {
		this._removeAllTiles();
		remove(this._container);
		map._removeZoomLimit(this);
		this._container = null;
		this._tileZoom = undefined;
	},

	// @method bringToFront: this
	// Brings the tile layer to the top of all tile layers.
	bringToFront: function () {
		if (this._map) {
			toFront(this._container);
			this._setAutoZIndex(Math.max);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings the tile layer to the bottom of all tile layers.
	bringToBack: function () {
		if (this._map) {
			toBack(this._container);
			this._setAutoZIndex(Math.min);
		}
		return this;
	},

	// @method getContainer: HTMLElement
	// Returns the HTML element that contains the tiles for this layer.
	getContainer: function () {
		return this._container;
	},

	// @method setOpacity(opacity: Number): this
	// Changes the [opacity](#gridlayer-opacity) of the grid layer.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// @method setZIndex(zIndex: Number): this
	// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
	setZIndex: function (zIndex) {
		this.options.zIndex = zIndex;
		this._updateZIndex();

		return this;
	},

	// @method isLoading: Boolean
	// Returns `true` if any tile in the grid layer has not finished loading.
	isLoading: function () {
		return this._loading;
	},

	// @method redraw: this
	// Causes the layer to clear all the tiles and request them again.
	redraw: function () {
		if (this._map) {
			this._removeAllTiles();
			this._update();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			viewprereset: this._invalidateAll,
			viewreset: this._resetView,
			zoom: this._resetView,
			moveend: this._onMoveEnd
		};

		if (!this.options.updateWhenIdle) {
			// update tiles on move, but not more often than once per given interval
			if (!this._onMove) {
				this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
			}

			events.move = this._onMove;
		}

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	// @section Extension methods
	// Layers extending `GridLayer` shall reimplement the following method.
	// @method createTile(coords: Object, done?: Function): HTMLElement
	// Called only internally, must be overridden by classes extending `GridLayer`.
	// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
	// is specified, it must be called when the tile has finished loading and drawing.
	createTile: function () {
		return document.createElement('div');
	},

	// @section
	// @method getTileSize: Point
	// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
	getTileSize: function () {
		var s = this.options.tileSize;
		return s instanceof Point ? s : new Point(s, s);
	},

	_updateZIndex: function () {
		if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._container.style.zIndex = this.options.zIndex;
		}
	},

	_setAutoZIndex: function (compare) {
		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

		var layers = this.getPane().children,
		    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

		for (var i = 0, len = layers.length, zIndex; i < len; i++) {

			zIndex = layers[i].style.zIndex;

			if (layers[i] !== this._container && zIndex) {
				edgeZIndex = compare(edgeZIndex, +zIndex);
			}
		}

		if (isFinite(edgeZIndex)) {
			this.options.zIndex = edgeZIndex + compare(-1, 1);
			this._updateZIndex();
		}
	},

	_updateOpacity: function () {
		if (!this._map) { return; }

		// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
		if (ielt9) { return; }

		setOpacity(this._container, this.options.opacity);

		var now = +new Date(),
		    nextFrame = false,
		    willPrune = false;

		for (var key in this._tiles) {
			var tile = this._tiles[key];
			if (!tile.current || !tile.loaded) { continue; }

			var fade = Math.min(1, (now - tile.loaded) / 200);

			setOpacity(tile.el, fade);
			if (fade < 1) {
				nextFrame = true;
			} else {
				if (tile.active) {
					willPrune = true;
				} else {
					this._onOpaqueTile(tile);
				}
				tile.active = true;
			}
		}

		if (willPrune && !this._noPrune) { this._pruneTiles(); }

		if (nextFrame) {
			cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
		}
	},

	_onOpaqueTile: falseFn,

	_initContainer: function () {
		if (this._container) { return; }

		this._container = create$1('div', 'leaflet-layer ' + (this.options.className || ''));
		this._updateZIndex();

		if (this.options.opacity < 1) {
			this._updateOpacity();
		}

		this.getPane().appendChild(this._container);
	},

	_updateLevels: function () {

		var zoom = this._tileZoom,
		    maxZoom = this.options.maxZoom;

		if (zoom === undefined) { return undefined; }

		for (var z in this._levels) {
			if (this._levels[z].el.children.length || z === zoom) {
				this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
				this._onUpdateLevel(z);
			} else {
				remove(this._levels[z].el);
				this._removeTilesAtZoom(z);
				this._onRemoveLevel(z);
				delete this._levels[z];
			}
		}

		var level = this._levels[zoom],
		    map = this._map;

		if (!level) {
			level = this._levels[zoom] = {};

			level.el = create$1('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
			level.el.style.zIndex = maxZoom;

			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
			level.zoom = zoom;

			this._setZoomTransform(level, map.getCenter(), map.getZoom());

			// force the browser to consider the newly added element for transition
			falseFn(level.el.offsetWidth);

			this._onCreateLevel(level);
		}

		this._level = level;

		return level;
	},

	_onUpdateLevel: falseFn,

	_onRemoveLevel: falseFn,

	_onCreateLevel: falseFn,

	_pruneTiles: function () {
		if (!this._map) {
			return;
		}

		var key, tile;

		var zoom = this._map.getZoom();
		if (zoom > this.options.maxZoom ||
			zoom < this.options.minZoom) {
			this._removeAllTiles();
			return;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			tile.retain = tile.current;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			if (tile.current && !tile.active) {
				var coords = tile.coords;
				if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
					this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
				}
			}
		}

		for (key in this._tiles) {
			if (!this._tiles[key].retain) {
				this._removeTile(key);
			}
		}
	},

	_removeTilesAtZoom: function (zoom) {
		for (var key in this._tiles) {
			if (this._tiles[key].coords.z !== zoom) {
				continue;
			}
			this._removeTile(key);
		}
	},

	_removeAllTiles: function () {
		for (var key in this._tiles) {
			this._removeTile(key);
		}
	},

	_invalidateAll: function () {
		for (var z in this._levels) {
			remove(this._levels[z].el);
			this._onRemoveLevel(z);
			delete this._levels[z];
		}
		this._removeAllTiles();

		this._tileZoom = undefined;
	},

	_retainParent: function (x, y, z, minZoom) {
		var x2 = Math.floor(x / 2),
		    y2 = Math.floor(y / 2),
		    z2 = z - 1,
		    coords2 = new Point(+x2, +y2);
		coords2.z = +z2;

		var key = this._tileCoordsToKey(coords2),
		    tile = this._tiles[key];

		if (tile && tile.active) {
			tile.retain = true;
			return true;

		} else if (tile && tile.loaded) {
			tile.retain = true;
		}

		if (z2 > minZoom) {
			return this._retainParent(x2, y2, z2, minZoom);
		}

		return false;
	},

	_retainChildren: function (x, y, z, maxZoom) {

		for (var i = 2 * x; i < 2 * x + 2; i++) {
			for (var j = 2 * y; j < 2 * y + 2; j++) {

				var coords = new Point(i, j);
				coords.z = z + 1;

				var key = this._tileCoordsToKey(coords),
				    tile = this._tiles[key];

				if (tile && tile.active) {
					tile.retain = true;
					continue;

				} else if (tile && tile.loaded) {
					tile.retain = true;
				}

				if (z + 1 < maxZoom) {
					this._retainChildren(i, j, z + 1, maxZoom);
				}
			}
		}
	},

	_resetView: function (e) {
		var animating = e && (e.pinch || e.flyTo);
		this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
	},

	_animateZoom: function (e) {
		this._setView(e.center, e.zoom, true, e.noUpdate);
	},

	_clampZoom: function (zoom) {
		var options = this.options;

		if (undefined !== options.minNativeZoom && zoom < options.minNativeZoom) {
			return options.minNativeZoom;
		}

		if (undefined !== options.maxNativeZoom && options.maxNativeZoom < zoom) {
			return options.maxNativeZoom;
		}

		return zoom;
	},

	_setView: function (center, zoom, noPrune, noUpdate) {
		var tileZoom = this._clampZoom(Math.round(zoom));
		if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
		    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
			tileZoom = undefined;
		}

		var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

		if (!noUpdate || tileZoomChanged) {

			this._tileZoom = tileZoom;

			if (this._abortLoading) {
				this._abortLoading();
			}

			this._updateLevels();
			this._resetGrid();

			if (tileZoom !== undefined) {
				this._update(center);
			}

			if (!noPrune) {
				this._pruneTiles();
			}

			// Flag to prevent _updateOpacity from pruning tiles during
			// a zoom anim or a pinch gesture
			this._noPrune = !!noPrune;
		}

		this._setZoomTransforms(center, zoom);
	},

	_setZoomTransforms: function (center, zoom) {
		for (var i in this._levels) {
			this._setZoomTransform(this._levels[i], center, zoom);
		}
	},

	_setZoomTransform: function (level, center, zoom) {
		var scale = this._map.getZoomScale(zoom, level.zoom),
		    translate = level.origin.multiplyBy(scale)
		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		if (any3d) {
			setTransform(level.el, translate, scale);
		} else {
			setPosition(level.el, translate);
		}
	},

	_resetGrid: function () {
		var map = this._map,
		    crs = map.options.crs,
		    tileSize = this._tileSize = this.getTileSize(),
		    tileZoom = this._tileZoom;

		var bounds = this._map.getPixelWorldBounds(this._tileZoom);
		if (bounds) {
			this._globalTileRange = this._pxBoundsToTileRange(bounds);
		}

		this._wrapX = crs.wrapLng && !this.options.noWrap && [
			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
		];
		this._wrapY = crs.wrapLat && !this.options.noWrap && [
			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
		];
	},

	_onMoveEnd: function () {
		if (!this._map || this._map._animatingZoom) { return; }

		this._update();
	},

	_getTiledPixelBounds: function (center) {
		var map = this._map,
		    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
		    scale = map.getZoomScale(mapZoom, this._tileZoom),
		    pixelCenter = map.project(center, this._tileZoom).floor(),
		    halfSize = map.getSize().divideBy(scale * 2);

		return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
	},

	// Private method to load tiles in the grid's active zoom level according to map bounds
	_update: function (center) {
		var map = this._map;
		if (!map) { return; }
		var zoom = this._clampZoom(map.getZoom());

		if (center === undefined) { center = map.getCenter(); }
		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

		var pixelBounds = this._getTiledPixelBounds(center),
		    tileRange = this._pxBoundsToTileRange(pixelBounds),
		    tileCenter = tileRange.getCenter(),
		    queue = [],
		    margin = this.options.keepBuffer,
		    noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
		                              tileRange.getTopRight().add([margin, -margin]));

		// Sanity check: panic if the tile range contains Infinity somewhere.
		if (!(isFinite(tileRange.min.x) &&
		      isFinite(tileRange.min.y) &&
		      isFinite(tileRange.max.x) &&
		      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

		for (var key in this._tiles) {
			var c = this._tiles[key].coords;
			if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
				this._tiles[key].current = false;
			}
		}

		// _update just loads more tiles. If the tile zoom level differs too much
		// from the map's, let _setView reset levels and prune old tiles.
		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

		// create a queue of coordinates to load tiles from
		for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
			for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
				var coords = new Point(i, j);
				coords.z = this._tileZoom;

				if (!this._isValidTile(coords)) { continue; }

				var tile = this._tiles[this._tileCoordsToKey(coords)];
				if (tile) {
					tile.current = true;
				} else {
					queue.push(coords);
				}
			}
		}

		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
		});

		if (queue.length !== 0) {
			// if it's the first batch of tiles to load
			if (!this._loading) {
				this._loading = true;
				// @event loading: Event
				// Fired when the grid layer starts loading tiles.
				this.fire('loading');
			}

			// create DOM fragment to append tiles in one batch
			var fragment = document.createDocumentFragment();

			for (i = 0; i < queue.length; i++) {
				this._addTile(queue[i], fragment);
			}

			this._level.el.appendChild(fragment);
		}
	},

	_isValidTile: function (coords) {
		var crs = this._map.options.crs;

		if (!crs.infinite) {
			// don't load tile if it's out of bounds and not wrapped
			var bounds = this._globalTileRange;
			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
		}

		if (!this.options.bounds) { return true; }

		// don't load tile if it doesn't intersect the bounds in options
		var tileBounds = this._tileCoordsToBounds(coords);
		return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
	},

	_keyToBounds: function (key) {
		return this._tileCoordsToBounds(this._keyToTileCoords(key));
	},

	_tileCoordsToNwSe: function (coords) {
		var map = this._map,
		    tileSize = this.getTileSize(),
		    nwPoint = coords.scaleBy(tileSize),
		    sePoint = nwPoint.add(tileSize),
		    nw = map.unproject(nwPoint, coords.z),
		    se = map.unproject(sePoint, coords.z);
		return [nw, se];
	},

	// converts tile coordinates to its geographical bounds
	_tileCoordsToBounds: function (coords) {
		var bp = this._tileCoordsToNwSe(coords),
		    bounds = new LatLngBounds(bp[0], bp[1]);

		if (!this.options.noWrap) {
			bounds = this._map.wrapLatLngBounds(bounds);
		}
		return bounds;
	},
	// converts tile coordinates to key for the tile cache
	_tileCoordsToKey: function (coords) {
		return coords.x + ':' + coords.y + ':' + coords.z;
	},

	// converts tile cache key to coordinates
	_keyToTileCoords: function (key) {
		var k = key.split(':'),
		    coords = new Point(+k[0], +k[1]);
		coords.z = +k[2];
		return coords;
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];
		if (!tile) { return; }

		remove(tile.el);

		delete this._tiles[key];

		// @event tileunload: TileEvent
		// Fired when a tile is removed (e.g. when a tile goes off the screen).
		this.fire('tileunload', {
			tile: tile.el,
			coords: this._keyToTileCoords(key)
		});
	},

	_initTile: function (tile) {
		addClass(tile, 'leaflet-tile');

		var tileSize = this.getTileSize();
		tile.style.width = tileSize.x + 'px';
		tile.style.height = tileSize.y + 'px';

		tile.onselectstart = falseFn;
		tile.onmousemove = falseFn;

		// update opacity on tiles in IE7-8 because of filter inheritance problems
		if (ielt9 && this.options.opacity < 1) {
			setOpacity(tile, this.options.opacity);
		}

		// without this hack, tiles disappear after zoom on Chrome for Android
		// https://github.com/Leaflet/Leaflet/issues/2078
		if (android && !android23) {
			tile.style.WebkitBackfaceVisibility = 'hidden';
		}
	},

	_addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords),
		    key = this._tileCoordsToKey(coords);

		var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
			requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
		}

		setPosition(tile, tilePos);

		// save tile in cache
		this._tiles[key] = {
			el: tile,
			coords: coords,
			current: true
		};

		container.appendChild(tile);
		// @event tileloadstart: TileEvent
		// Fired when a tile is requested and starts loading.
		this.fire('tileloadstart', {
			tile: tile,
			coords: coords
		});
	},

	_tileReady: function (coords, err, tile) {
		if (err) {
			// @event tileerror: TileErrorEvent
			// Fired when there is an error loading a tile.
			this.fire('tileerror', {
				error: err,
				tile: tile,
				coords: coords
			});
		}

		var key = this._tileCoordsToKey(coords);

		tile = this._tiles[key];
		if (!tile) { return; }

		tile.loaded = +new Date();
		if (this._map._fadeAnimated) {
			setOpacity(tile.el, 0);
			cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
		} else {
			tile.active = true;
			this._pruneTiles();
		}

		if (!err) {
			addClass(tile.el, 'leaflet-tile-loaded');

			// @event tileload: TileEvent
			// Fired when a tile loads.
			this.fire('tileload', {
				tile: tile.el,
				coords: coords
			});
		}

		if (this._noTilesToLoad()) {
			this._loading = false;
			// @event load: Event
			// Fired when the grid layer loaded all visible tiles.
			this.fire('load');

			if (ielt9 || !this._map._fadeAnimated) {
				requestAnimFrame(this._pruneTiles, this);
			} else {
				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
				// to trigger a pruning.
				setTimeout(bind(this._pruneTiles, this), 250);
			}
		}
	},

	_getTilePos: function (coords) {
		return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
	},

	_wrapCoords: function (coords) {
		var newCoords = new Point(
			this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x,
			this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y);
		newCoords.z = coords.z;
		return newCoords;
	},

	_pxBoundsToTileRange: function (bounds) {
		var tileSize = this.getTileSize();
		return new Bounds(
			bounds.min.unscaleBy(tileSize).floor(),
			bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
	},

	_noTilesToLoad: function () {
		for (var key in this._tiles) {
			if (!this._tiles[key].loaded) { return false; }
		}
		return true;
	}
});

// @factory L.gridLayer(options?: GridLayer options)
// Creates a new instance of GridLayer with the supplied options.
function gridLayer(options) {
	return new GridLayer(options);
}

/*
 * @class TileLayer
 * @inherits GridLayer
 * @aka L.TileLayer
 * Used to load and display tile layers on the map. Note that most tile servers require attribution, which you can set under `Layer`. Extends `GridLayer`.
 *
 * @example
 *
 * ```js
 * L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);
 * ```
 *
 * @section URL template
 * @example
 *
 * A string of the following form:
 *
 * ```
 * 'http://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
 * ```
 *
 * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` ??? zoom level, `{x}` and `{y}` ??? tile coordinates. `{r}` can be used to add "&commat;2x" to the URL to load retina tiles.
 *
 * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
 *
 * ```
 * L.tileLayer('http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
 * ```
 */


var TileLayer = GridLayer.extend({

	// @section
	// @aka TileLayer options
	options: {
		// @option minZoom: Number = 0
		// The minimum zoom level down to which this layer will be displayed (inclusive).
		minZoom: 0,

		// @option maxZoom: Number = 18
		// The maximum zoom level up to which this layer will be displayed (inclusive).
		maxZoom: 18,

		// @option subdomains: String|String[] = 'abc'
		// Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
		subdomains: 'abc',

		// @option errorTileUrl: String = ''
		// URL to the tile image to show in place of the tile that failed to load.
		errorTileUrl: '',

		// @option zoomOffset: Number = 0
		// The zoom number used in tile URLs will be offset with this value.
		zoomOffset: 0,

		// @option tms: Boolean = false
		// If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
		tms: false,

		// @option zoomReverse: Boolean = false
		// If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
		zoomReverse: false,

		// @option detectRetina: Boolean = false
		// If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
		detectRetina: false,

		// @option crossOrigin: Boolean|String = false
		// Whether the crossOrigin attribute will be added to the tiles.
		// If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
		// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
		crossOrigin: false
	},

	initialize: function (url, options) {

		this._url = url;

		options = setOptions(this, options);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (options.detectRetina && retina && options.maxZoom > 0) {

			options.tileSize = Math.floor(options.tileSize / 2);

			if (!options.zoomReverse) {
				options.zoomOffset++;
				options.maxZoom--;
			} else {
				options.zoomOffset--;
				options.minZoom++;
			}

			options.minZoom = Math.max(0, options.minZoom);
		}

		if (typeof options.subdomains === 'string') {
			options.subdomains = options.subdomains.split('');
		}

		// for https://github.com/Leaflet/Leaflet/issues/137
		if (!android) {
			this.on('tileunload', this._onTileRemove);
		}
	},

	// @method setUrl(url: String, noRedraw?: Boolean): this
	// Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
	// If the URL does not change, the layer will not be redrawn unless
	// the noRedraw parameter is set to false.
	setUrl: function (url, noRedraw) {
		if (this._url === url && noRedraw === undefined) {
			noRedraw = true;
		}

		this._url = url;

		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	// @method createTile(coords: Object, done?: Function): HTMLElement
	// Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
	// to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
	// callback is called when the tile has been loaded.
	createTile: function (coords, done) {
		var tile = document.createElement('img');

		on(tile, 'load', bind(this._tileOnLoad, this, done, tile));
		on(tile, 'error', bind(this._tileOnError, this, done, tile));

		if (this.options.crossOrigin || this.options.crossOrigin === '') {
			tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
		}

		/*
		 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
		 http://www.w3.org/TR/WCAG20-TECHS/H67
		*/
		tile.alt = '';

		/*
		 Set role="presentation" to force screen readers to ignore this
		 https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
		*/
		tile.setAttribute('role', 'presentation');

		tile.src = this.getTileUrl(coords);

		return tile;
	},

	// @section Extension methods
	// @uninheritable
	// Layers extending `TileLayer` might reimplement the following method.
	// @method getTileUrl(coords: Object): String
	// Called only internally, returns the URL for a tile given its coordinates.
	// Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
	getTileUrl: function (coords) {
		var data = {
			r: retina ? '@2x' : '',
			s: this._getSubdomain(coords),
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl()
		};
		if (this._map && !this._map.options.crs.infinite) {
			var invertedY = this._globalTileRange.max.y - coords.y;
			if (this.options.tms) {
				data['y'] = invertedY;
			}
			data['-y'] = invertedY;
		}

		return template(this._url, extend(data, this.options));
	},

	_tileOnLoad: function (done, tile) {
		// For https://github.com/Leaflet/Leaflet/issues/3332
		if (ielt9) {
			setTimeout(bind(done, this, null, tile), 0);
		} else {
			done(null, tile);
		}
	},

	_tileOnError: function (done, tile, e) {
		var errorUrl = this.options.errorTileUrl;
		if (errorUrl && tile.getAttribute('src') !== errorUrl) {
			tile.src = errorUrl;
		}
		done(e, tile);
	},

	_onTileRemove: function (e) {
		e.tile.onload = null;
	},

	_getZoomForUrl: function () {
		var zoom = this._tileZoom,
		maxZoom = this.options.maxZoom,
		zoomReverse = this.options.zoomReverse,
		zoomOffset = this.options.zoomOffset;

		if (zoomReverse) {
			zoom = maxZoom - zoom;
		}

		return zoom + zoomOffset;
	},

	_getSubdomain: function (tilePoint) {
		var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
		return this.options.subdomains[index];
	},

	// stops loading all tiles in the background layer
	_abortLoading: function () {
		var i, tile;
		for (i in this._tiles) {
			if (this._tiles[i].coords.z !== this._tileZoom) {
				tile = this._tiles[i].el;

				tile.onload = falseFn;
				tile.onerror = falseFn;

				if (!tile.complete) {
					tile.src = emptyImageUrl;
					remove(tile);
					delete this._tiles[i];
				}
			}
		}
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];
		if (!tile) { return; }

		// Cancels any pending http requests associated with the tile
		// unless we're on Android's stock browser,
		// see https://github.com/Leaflet/Leaflet/issues/137
		if (!androidStock) {
			tile.el.setAttribute('src', emptyImageUrl);
		}

		return GridLayer.prototype._removeTile.call(this, key);
	},

	_tileReady: function (coords, err, tile) {
		if (!this._map || (tile && tile.getAttribute('src') === emptyImageUrl)) {
			return;
		}

		return GridLayer.prototype._tileReady.call(this, coords, err, tile);
	}
});


// @factory L.tilelayer(urlTemplate: String, options?: TileLayer options)
// Instantiates a tile layer object given a `URL template` and optionally an options object.

function tileLayer(url, options) {
	return new TileLayer(url, options);
}

/*
 * @class TileLayer.WMS
 * @inherits TileLayer
 * @aka L.TileLayer.WMS
 * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
 *
 * @example
 *
 * ```js
 * var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
 * 	layers: 'nexrad-n0r-900913',
 * 	format: 'image/png',
 * 	transparent: true,
 * 	attribution: "Weather data ?? 2012 IEM Nexrad"
 * });
 * ```
 */

var TileLayerWMS = TileLayer.extend({

	// @section
	// @aka TileLayer.WMS options
	// If any custom options not documented here are used, they will be sent to the
	// WMS server as extra parameters in each request URL. This can be useful for
	// [non-standard vendor WMS parameters](http://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',

		// @option layers: String = ''
		// **(required)** Comma-separated list of WMS layers to show.
		layers: '',

		// @option styles: String = ''
		// Comma-separated list of WMS styles.
		styles: '',

		// @option format: String = 'image/jpeg'
		// WMS image format (use `'image/png'` for layers with transparency).
		format: 'image/jpeg',

		// @option transparent: Boolean = false
		// If `true`, the WMS service will return images with transparency.
		transparent: false,

		// @option version: String = '1.1.1'
		// Version of the WMS service to use
		version: '1.1.1'
	},

	options: {
		// @option crs: CRS = null
		// Coordinate Reference System to use for the WMS requests, defaults to
		// map CRS. Don't change this if you're not sure what it means.
		crs: null,

		// @option uppercase: Boolean = false
		// If `true`, WMS request parameter keys will be uppercase.
		uppercase: false
	},

	initialize: function (url, options) {

		this._url = url;

		var wmsParams = extend({}, this.defaultWmsParams);

		// all keys that are not TileLayer options go to WMS params
		for (var i in options) {
			if (!(i in this.options)) {
				wmsParams[i] = options[i];
			}
		}

		options = setOptions(this, options);

		var realRetina = options.detectRetina && retina ? 2 : 1;
		var tileSize = this.getTileSize();
		wmsParams.width = tileSize.x * realRetina;
		wmsParams.height = tileSize.y * realRetina;

		this.wmsParams = wmsParams;
	},

	onAdd: function (map) {

		this._crs = this.options.crs || map.options.crs;
		this._wmsVersion = parseFloat(this.wmsParams.version);

		var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = this._crs.code;

		TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl: function (coords) {

		var tileBounds = this._tileCoordsToNwSe(coords),
		    crs = this._crs,
		    bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])),
		    min = bounds.min,
		    max = bounds.max,
		    bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ?
		    [min.y, min.x, max.y, max.x] :
		    [min.x, min.y, max.x, max.y]).join(','),
		    url = TileLayer.prototype.getTileUrl.call(this, coords);
		return url +
			getParamString(this.wmsParams, url, this.options.uppercase) +
			(this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
	},

	// @method setParams(params: Object, noRedraw?: Boolean): this
	// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
	setParams: function (params, noRedraw) {

		extend(this.wmsParams, params);

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
});


// @factory L.tileLayer.wms(baseUrl: String, options: TileLayer.WMS options)
// Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
function tileLayerWMS(url, options) {
	return new TileLayerWMS(url, options);
}

TileLayer.WMS = TileLayerWMS;
tileLayer.wms = tileLayerWMS;

/*
 * @class Renderer
 * @inherits Layer
 * @aka L.Renderer
 *
 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
 * DOM container of the renderer, its bounds, and its zoom animation.
 *
 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
 * itself can be added or removed to the map. All paths use a renderer, which can
 * be implicit (the map will decide the type of renderer and use it automatically)
 * or explicit (using the [`renderer`](#path-renderer) option of the path).
 *
 * Do not use this class directly, use `SVG` and `Canvas` instead.
 *
 * @event update: Event
 * Fired when the renderer updates its bounds, center and zoom, for example when
 * its map has moved
 */

var Renderer = Layer.extend({

	// @section
	// @aka Renderer options
	options: {
		// @option padding: Number = 0.1
		// How much to extend the clip area around the map view (relative to its size)
		// e.g. 0.1 would be 10% of map view in each direction
		padding: 0.1,

		// @option tolerance: Number = 0
		// How much to extend click tolerance round a path/object on the map
		tolerance : 0
	},

	initialize: function (options) {
		setOptions(this, options);
		stamp(this);
		this._layers = this._layers || {};
	},

	onAdd: function () {
		if (!this._container) {
			this._initContainer(); // defined by renderer implementations

			if (this._zoomAnimated) {
				addClass(this._container, 'leaflet-zoom-animated');
			}
		}

		this.getPane().appendChild(this._container);
		this._update();
		this.on('update', this._updatePaths, this);
	},

	onRemove: function () {
		this.off('update', this._updatePaths, this);
		this._destroyContainer();
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset,
			zoom: this._onZoom,
			moveend: this._update,
			zoomend: this._onZoomEnd
		};
		if (this._zoomAnimated) {
			events.zoomanim = this._onAnimZoom;
		}
		return events;
	},

	_onAnimZoom: function (ev) {
		this._updateTransform(ev.center, ev.zoom);
	},

	_onZoom: function () {
		this._updateTransform(this._map.getCenter(), this._map.getZoom());
	},

	_updateTransform: function (center, zoom) {
		var scale = this._map.getZoomScale(zoom, this._zoom),
		    position = getPosition(this._container),
		    viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
		    currentCenterPoint = this._map.project(this._center, zoom),
		    destCenterPoint = this._map.project(center, zoom),
		    centerOffset = destCenterPoint.subtract(currentCenterPoint),

		    topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

		if (any3d) {
			setTransform(this._container, topLeftOffset, scale);
		} else {
			setPosition(this._container, topLeftOffset);
		}
	},

	_reset: function () {
		this._update();
		this._updateTransform(this._center, this._zoom);

		for (var id in this._layers) {
			this._layers[id]._reset();
		}
	},

	_onZoomEnd: function () {
		for (var id in this._layers) {
			this._layers[id]._project();
		}
	},

	_updatePaths: function () {
		for (var id in this._layers) {
			this._layers[id]._update();
		}
	},

	_update: function () {
		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
		// Subclasses are responsible of firing the 'update' event.
		var p = this.options.padding,
		    size = this._map.getSize(),
		    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

		this._center = this._map.getCenter();
		this._zoom = this._map.getZoom();
	}
});

/*
 * @class Canvas
 * @inherits Renderer
 * @aka L.Canvas
 *
 * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
 * Inherits `Renderer`.
 *
 * Due to [technical limitations](http://caniuse.com/#search=canvas), Canvas is not
 * available in all web browsers, notably IE8, and overlapping geometries might
 * not display properly in some edge cases.
 *
 * @example
 *
 * Use Canvas by default for all paths in the map:
 *
 * ```js
 * var map = L.map('map', {
 * 	renderer: L.canvas()
 * });
 * ```
 *
 * Use a Canvas renderer with extra padding for specific vector geometries:
 *
 * ```js
 * var map = L.map('map');
 * var myRenderer = L.canvas({ padding: 0.5 });
 * var line = L.polyline( coordinates, { renderer: myRenderer } );
 * var circle = L.circle( center, { renderer: myRenderer } );
 * ```
 */

var Canvas = Renderer.extend({
	getEvents: function () {
		var events = Renderer.prototype.getEvents.call(this);
		events.viewprereset = this._onViewPreReset;
		return events;
	},

	_onViewPreReset: function () {
		// Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
		this._postponeUpdatePaths = true;
	},

	onAdd: function () {
		Renderer.prototype.onAdd.call(this);

		// Redraw vectors since canvas is cleared upon removal,
		// in case of removing the renderer itself from the map.
		this._draw();
	},

	_initContainer: function () {
		var container = this._container = document.createElement('canvas');

		on(container, 'mousemove', this._onMouseMove, this);
		on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);
		on(container, 'mouseout', this._handleMouseOut, this);

		this._ctx = container.getContext('2d');
	},

	_destroyContainer: function () {
		cancelAnimFrame(this._redrawRequest);
		delete this._ctx;
		remove(this._container);
		off(this._container);
		delete this._container;
	},

	_updatePaths: function () {
		if (this._postponeUpdatePaths) { return; }

		var layer;
		this._redrawBounds = null;
		for (var id in this._layers) {
			layer = this._layers[id];
			layer._update();
		}
		this._redraw();
	},

	_update: function () {
		if (this._map._animatingZoom && this._bounds) { return; }

		Renderer.prototype._update.call(this);

		var b = this._bounds,
		    container = this._container,
		    size = b.getSize(),
		    m = retina ? 2 : 1;

		setPosition(container, b.min);

		// set canvas size (also clearing it); use double size on retina
		container.width = m * size.x;
		container.height = m * size.y;
		container.style.width = size.x + 'px';
		container.style.height = size.y + 'px';

		if (retina) {
			this._ctx.scale(2, 2);
		}

		// translate so we use the same path coordinates after canvas element moves
		this._ctx.translate(-b.min.x, -b.min.y);

		// Tell paths to redraw themselves
		this.fire('update');
	},

	_reset: function () {
		Renderer.prototype._reset.call(this);

		if (this._postponeUpdatePaths) {
			this._postponeUpdatePaths = false;
			this._updatePaths();
		}
	},

	_initPath: function (layer) {
		this._updateDashArray(layer);
		this._layers[stamp(layer)] = layer;

		var order = layer._order = {
			layer: layer,
			prev: this._drawLast,
			next: null
		};
		if (this._drawLast) { this._drawLast.next = order; }
		this._drawLast = order;
		this._drawFirst = this._drawFirst || this._drawLast;
	},

	_addPath: function (layer) {
		this._requestRedraw(layer);
	},

	_removePath: function (layer) {
		var order = layer._order;
		var next = order.next;
		var prev = order.prev;

		if (next) {
			next.prev = prev;
		} else {
			this._drawLast = prev;
		}
		if (prev) {
			prev.next = next;
		} else {
			this._drawFirst = next;
		}

		delete layer._order;

		delete this._layers[stamp(layer)];

		this._requestRedraw(layer);
	},

	_updatePath: function (layer) {
		// Redraw the union of the layer's old pixel
		// bounds and the new pixel bounds.
		this._extendRedrawBounds(layer);
		layer._project();
		layer._update();
		// The redraw will extend the redraw bounds
		// with the new pixel bounds.
		this._requestRedraw(layer);
	},

	_updateStyle: function (layer) {
		this._updateDashArray(layer);
		this._requestRedraw(layer);
	},

	_updateDashArray: function (layer) {
		if (typeof layer.options.dashArray === 'string') {
			var parts = layer.options.dashArray.split(/[, ]+/),
			    dashArray = [],
			    dashValue,
			    i;
			for (i = 0; i < parts.length; i++) {
				dashValue = Number(parts[i]);
				// Ignore dash array containing invalid lengths
				if (isNaN(dashValue)) { return; }
				dashArray.push(dashValue);
			}
			layer.options._dashArray = dashArray;
		} else {
			layer.options._dashArray = layer.options.dashArray;
		}
	},

	_requestRedraw: function (layer) {
		if (!this._map) { return; }

		this._extendRedrawBounds(layer);
		this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
	},

	_extendRedrawBounds: function (layer) {
		if (layer._pxBounds) {
			var padding = (layer.options.weight || 0) + 1;
			this._redrawBounds = this._redrawBounds || new Bounds();
			this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
			this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
		}
	},

	_redraw: function () {
		this._redrawRequest = null;

		if (this._redrawBounds) {
			this._redrawBounds.min._floor();
			this._redrawBounds.max._ceil();
		}

		this._clear(); // clear layers in redraw bounds
		this._draw(); // draw layers

		this._redrawBounds = null;
	},

	_clear: function () {
		var bounds = this._redrawBounds;
		if (bounds) {
			var size = bounds.getSize();
			this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
		} else {
			this._ctx.clearRect(0, 0, this._container.width, this._container.height);
		}
	},

	_draw: function () {
		var layer, bounds = this._redrawBounds;
		this._ctx.save();
		if (bounds) {
			var size = bounds.getSize();
			this._ctx.beginPath();
			this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
			this._ctx.clip();
		}

		this._drawing = true;

		for (var order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
				layer._updatePath();
			}
		}

		this._drawing = false;

		this._ctx.restore();  // Restore state before clipping.
	},

	_updatePoly: function (layer, closed) {
		if (!this._drawing) { return; }

		var i, j, len2, p,
		    parts = layer._parts,
		    len = parts.length,
		    ctx = this._ctx;

		if (!len) { return; }

		ctx.beginPath();

		for (i = 0; i < len; i++) {
			for (j = 0, len2 = parts[i].length; j < len2; j++) {
				p = parts[i][j];
				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
			}
			if (closed) {
				ctx.closePath();
			}
		}

		this._fillStroke(ctx, layer);

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_updateCircle: function (layer) {

		if (!this._drawing || layer._empty()) { return; }

		var p = layer._point,
		    ctx = this._ctx,
		    r = Math.max(Math.round(layer._radius), 1),
		    s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

		if (s !== 1) {
			ctx.save();
			ctx.scale(1, s);
		}

		ctx.beginPath();
		ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

		if (s !== 1) {
			ctx.restore();
		}

		this._fillStroke(ctx, layer);
	},

	_fillStroke: function (ctx, layer) {
		var options = layer.options;

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fillStyle = options.fillColor || options.color;
			ctx.fill(options.fillRule || 'evenodd');
		}

		if (options.stroke && options.weight !== 0) {
			if (ctx.setLineDash) {
				ctx.setLineDash(layer.options && layer.options._dashArray || []);
			}
			ctx.globalAlpha = options.opacity;
			ctx.lineWidth = options.weight;
			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke();
		}
	},

	// Canvas obviously doesn't have mouse events for individual drawn objects,
	// so we emulate that by calculating what's under the mouse on mousemove/click manually

	_onClick: function (e) {
		var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;

		for (var order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (layer.options.interactive && layer._containsPoint(point) && !this._map._draggableMoved(layer)) {
				clickedLayer = layer;
			}
		}
		if (clickedLayer)  {
			fakeStop(e);
			this._fireEvent([clickedLayer], e);
		}
	},

	_onMouseMove: function (e) {
		if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) { return; }

		var point = this._map.mouseEventToLayerPoint(e);
		this._handleMouseHover(e, point);
	},


	_handleMouseOut: function (e) {
		var layer = this._hoveredLayer;
		if (layer) {
			// if we're leaving the layer, fire mouseout
			removeClass(this._container, 'leaflet-interactive');
			this._fireEvent([layer], e, 'mouseout');
			this._hoveredLayer = null;
			this._mouseHoverThrottled = false;
		}
	},

	_handleMouseHover: function (e, point) {
		if (this._mouseHoverThrottled) {
			return;
		}

		var layer, candidateHoveredLayer;

		for (var order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (layer.options.interactive && layer._containsPoint(point)) {
				candidateHoveredLayer = layer;
			}
		}

		if (candidateHoveredLayer !== this._hoveredLayer) {
			this._handleMouseOut(e);

			if (candidateHoveredLayer) {
				addClass(this._container, 'leaflet-interactive'); // change cursor
				this._fireEvent([candidateHoveredLayer], e, 'mouseover');
				this._hoveredLayer = candidateHoveredLayer;
			}
		}

		if (this._hoveredLayer) {
			this._fireEvent([this._hoveredLayer], e);
		}

		this._mouseHoverThrottled = true;
		setTimeout(L.bind(function () {
			this._mouseHoverThrottled = false;
		}, this), 32);
	},

	_fireEvent: function (layers, e, type) {
		this._map._fireDOMEvent(e, type || e.type, layers);
	},

	_bringToFront: function (layer) {
		var order = layer._order;

		if (!order) { return; }

		var next = order.next;
		var prev = order.prev;

		if (next) {
			next.prev = prev;
		} else {
			// Already last
			return;
		}
		if (prev) {
			prev.next = next;
		} else if (next) {
			// Update first entry unless this is the
			// single entry
			this._drawFirst = next;
		}

		order.prev = this._drawLast;
		this._drawLast.next = order;

		order.next = null;
		this._drawLast = order;

		this._requestRedraw(layer);
	},

	_bringToBack: function (layer) {
		var order = layer._order;

		if (!order) { return; }

		var next = order.next;
		var prev = order.prev;

		if (prev) {
			prev.next = next;
		} else {
			// Already first
			return;
		}
		if (next) {
			next.prev = prev;
		} else if (prev) {
			// Update last entry unless this is the
			// single entry
			this._drawLast = prev;
		}

		order.prev = null;

		order.next = this._drawFirst;
		this._drawFirst.prev = order;
		this._drawFirst = order;

		this._requestRedraw(layer);
	}
});

// @factory L.canvas(options?: Renderer options)
// Creates a Canvas renderer with the given options.
function canvas$1(options) {
	return canvas ? new Canvas(options) : null;
}

/*
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */


var vmlCreate = (function () {
	try {
		document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
		return function (name) {
			return document.createElement('<lvml:' + name + ' class="lvml">');
		};
	} catch (e) {
		return function (name) {
			return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
		};
	}
})();


/*
 * @class SVG
 *
 *
 * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
 * with old versions of Internet Explorer.
 */

// mixin to redefine some SVG methods to handle VML syntax which is similar but with some differences
var vmlMixin = {

	_initContainer: function () {
		this._container = create$1('div', 'leaflet-vml-container');
	},

	_update: function () {
		if (this._map._animatingZoom) { return; }
		Renderer.prototype._update.call(this);
		this.fire('update');
	},

	_initPath: function (layer) {
		var container = layer._container = vmlCreate('shape');

		addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

		container.coordsize = '1 1';

		layer._path = vmlCreate('path');
		container.appendChild(layer._path);

		this._updateStyle(layer);
		this._layers[stamp(layer)] = layer;
	},

	_addPath: function (layer) {
		var container = layer._container;
		this._container.appendChild(container);

		if (layer.options.interactive) {
			layer.addInteractiveTarget(container);
		}
	},

	_removePath: function (layer) {
		var container = layer._container;
		remove(container);
		layer.removeInteractiveTarget(container);
		delete this._layers[stamp(layer)];
	},

	_updateStyle: function (layer) {
		var stroke = layer._stroke,
		    fill = layer._fill,
		    options = layer.options,
		    container = layer._container;

		container.stroked = !!options.stroke;
		container.filled = !!options.fill;

		if (options.stroke) {
			if (!stroke) {
				stroke = layer._stroke = vmlCreate('stroke');
			}
			container.appendChild(stroke);
			stroke.weight = options.weight + 'px';
			stroke.color = options.color;
			stroke.opacity = options.opacity;

			if (options.dashArray) {
				stroke.dashStyle = isArray(options.dashArray) ?
				    options.dashArray.join(' ') :
				    options.dashArray.replace(/( *, *)/g, ' ');
			} else {
				stroke.dashStyle = '';
			}
			stroke.endcap = options.lineCap.replace('butt', 'flat');
			stroke.joinstyle = options.lineJoin;

		} else if (stroke) {
			container.removeChild(stroke);
			layer._stroke = null;
		}

		if (options.fill) {
			if (!fill) {
				fill = layer._fill = vmlCreate('fill');
			}
			container.appendChild(fill);
			fill.color = options.fillColor || options.color;
			fill.opacity = options.fillOpacity;

		} else if (fill) {
			container.removeChild(fill);
			layer._fill = null;
		}
	},

	_updateCircle: function (layer) {
		var p = layer._point.round(),
		    r = Math.round(layer._radius),
		    r2 = Math.round(layer._radiusY || r);

		this._setPath(layer, layer._empty() ? 'M0 0' :
			'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
	},

	_setPath: function (layer, path) {
		layer._path.v = path;
	},

	_bringToFront: function (layer) {
		toFront(layer._container);
	},

	_bringToBack: function (layer) {
		toBack(layer._container);
	}
};

var create$2 = vml ? vmlCreate : svgCreate;

/*
 * @class SVG
 * @inherits Renderer
 * @aka L.SVG
 *
 * Allows vector layers to be displayed with [SVG](https://developer.mozilla.org/docs/Web/SVG).
 * Inherits `Renderer`.
 *
 * Due to [technical limitations](http://caniuse.com/#search=svg), SVG is not
 * available in all web browsers, notably Android 2.x and 3.x.
 *
 * Although SVG is not available on IE7 and IE8, these browsers support
 * [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language)
 * (a now deprecated technology), and the SVG renderer will fall back to VML in
 * this case.
 *
 * @example
 *
 * Use SVG by default for all paths in the map:
 *
 * ```js
 * var map = L.map('map', {
 * 	renderer: L.svg()
 * });
 * ```
 *
 * Use a SVG renderer with extra padding for specific vector geometries:
 *
 * ```js
 * var map = L.map('map');
 * var myRenderer = L.svg({ padding: 0.5 });
 * var line = L.polyline( coordinates, { renderer: myRenderer } );
 * var circle = L.circle( center, { renderer: myRenderer } );
 * ```
 */

var SVG = Renderer.extend({

	getEvents: function () {
		var events = Renderer.prototype.getEvents.call(this);
		events.zoomstart = this._onZoomStart;
		return events;
	},

	_initContainer: function () {
		this._container = create$2('svg');

		// makes it possible to click through svg root; we'll reset it back in individual paths
		this._container.setAttribute('pointer-events', 'none');

		this._rootGroup = create$2('g');
		this._container.appendChild(this._rootGroup);
	},

	_destroyContainer: function () {
		remove(this._container);
		off(this._container);
		delete this._container;
		delete this._rootGroup;
		delete this._svgSize;
	},

	_onZoomStart: function () {
		// Drag-then-pinch interactions might mess up the center and zoom.
		// In this case, the easiest way to prevent this is re-do the renderer
		//   bounds and padding when the zooming starts.
		this._update();
	},

	_update: function () {
		if (this._map._animatingZoom && this._bounds) { return; }

		Renderer.prototype._update.call(this);

		var b = this._bounds,
		    size = b.getSize(),
		    container = this._container;

		// set size of svg-container if changed
		if (!this._svgSize || !this._svgSize.equals(size)) {
			this._svgSize = size;
			container.setAttribute('width', size.x);
			container.setAttribute('height', size.y);
		}

		// movement: update container viewBox so that we don't have to change coordinates of individual layers
		setPosition(container, b.min);
		container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

		this.fire('update');
	},

	// methods below are called by vector layers implementations

	_initPath: function (layer) {
		var path = layer._path = create$2('path');

		// @namespace Path
		// @option className: String = null
		// Custom class name set on an element. Only for SVG renderer.
		if (layer.options.className) {
			addClass(path, layer.options.className);
		}

		if (layer.options.interactive) {
			addClass(path, 'leaflet-interactive');
		}

		this._updateStyle(layer);
		this._layers[stamp(layer)] = layer;
	},

	_addPath: function (layer) {
		if (!this._rootGroup) { this._initContainer(); }
		this._rootGroup.appendChild(layer._path);
		layer.addInteractiveTarget(layer._path);
	},

	_removePath: function (layer) {
		remove(layer._path);
		layer.removeInteractiveTarget(layer._path);
		delete this._layers[stamp(layer)];
	},

	_updatePath: function (layer) {
		layer._project();
		layer._update();
	},

	_updateStyle: function (layer) {
		var path = layer._path,
		    options = layer.options;

		if (!path) { return; }

		if (options.stroke) {
			path.setAttribute('stroke', options.color);
			path.setAttribute('stroke-opacity', options.opacity);
			path.setAttribute('stroke-width', options.weight);
			path.setAttribute('stroke-linecap', options.lineCap);
			path.setAttribute('stroke-linejoin', options.lineJoin);

			if (options.dashArray) {
				path.setAttribute('stroke-dasharray', options.dashArray);
			} else {
				path.removeAttribute('stroke-dasharray');
			}

			if (options.dashOffset) {
				path.setAttribute('stroke-dashoffset', options.dashOffset);
			} else {
				path.removeAttribute('stroke-dashoffset');
			}
		} else {
			path.setAttribute('stroke', 'none');
		}

		if (options.fill) {
			path.setAttribute('fill', options.fillColor || options.color);
			path.setAttribute('fill-opacity', options.fillOpacity);
			path.setAttribute('fill-rule', options.fillRule || 'evenodd');
		} else {
			path.setAttribute('fill', 'none');
		}
	},

	_updatePoly: function (layer, closed) {
		this._setPath(layer, pointsToPath(layer._parts, closed));
	},

	_updateCircle: function (layer) {
		var p = layer._point,
		    r = Math.max(Math.round(layer._radius), 1),
		    r2 = Math.max(Math.round(layer._radiusY), 1) || r,
		    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

		// drawing a circle with two half-arcs
		var d = layer._empty() ? 'M0 0' :
			'M' + (p.x - r) + ',' + p.y +
			arc + (r * 2) + ',0 ' +
			arc + (-r * 2) + ',0 ';

		this._setPath(layer, d);
	},

	_setPath: function (layer, path) {
		layer._path.setAttribute('d', path);
	},

	// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
	_bringToFront: function (layer) {
		toFront(layer._path);
	},

	_bringToBack: function (layer) {
		toBack(layer._path);
	}
});

if (vml) {
	SVG.include(vmlMixin);
}

// @namespace SVG
// @factory L.svg(options?: Renderer options)
// Creates a SVG renderer with the given options.
function svg$1(options) {
	return svg || vml ? new SVG(options) : null;
}

Map.include({
	// @namespace Map; @method getRenderer(layer: Path): Renderer
	// Returns the instance of `Renderer` that should be used to render the given
	// `Path`. It will ensure that the `renderer` options of the map and paths
	// are respected, and that the renderers do exist on the map.
	getRenderer: function (layer) {
		// @namespace Path; @option renderer: Renderer
		// Use this specific instance of `Renderer` for this path. Takes
		// precedence over the map's [default renderer](#map-renderer).
		var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

		if (!renderer) {
			renderer = this._renderer = this._createRenderer();
		}

		if (!this.hasLayer(renderer)) {
			this.addLayer(renderer);
		}
		return renderer;
	},

	_getPaneRenderer: function (name) {
		if (name === 'overlayPane' || name === undefined) {
			return false;
		}

		var renderer = this._paneRenderers[name];
		if (renderer === undefined) {
			renderer = this._createRenderer({pane: name});
			this._paneRenderers[name] = renderer;
		}
		return renderer;
	},

	_createRenderer: function (options) {
		// @namespace Map; @option preferCanvas: Boolean = false
		// Whether `Path`s should be rendered on a `Canvas` renderer.
		// By default, all `Path`s are rendered in a `SVG` renderer.
		return (this.options.preferCanvas && canvas$1(options)) || svg$1(options);
	}
});

/*
 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
 */

/*
 * @class Rectangle
 * @aka L.Rectangle
 * @inherits Polygon
 *
 * A class for drawing rectangle overlays on a map. Extends `Polygon`.
 *
 * @example
 *
 * ```js
 * // define rectangle geographical bounds
 * var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
 *
 * // create an orange rectangle
 * L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
 *
 * // zoom the map to the rectangle bounds
 * map.fitBounds(bounds);
 * ```
 *
 */


var Rectangle = Polygon.extend({
	initialize: function (latLngBounds, options) {
		Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
	},

	// @method setBounds(latLngBounds: LatLngBounds): this
	// Redraws the rectangle with the passed bounds.
	setBounds: function (latLngBounds) {
		return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
	},

	_boundsToLatLngs: function (latLngBounds) {
		latLngBounds = toLatLngBounds(latLngBounds);
		return [
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast()
		];
	}
});


// @factory L.rectangle(latLngBounds: LatLngBounds, options?: Polyline options)
function rectangle(latLngBounds, options) {
	return new Rectangle(latLngBounds, options);
}

SVG.create = create$2;
SVG.pointsToPath = pointsToPath;

GeoJSON.geometryToLayer = geometryToLayer;
GeoJSON.coordsToLatLng = coordsToLatLng;
GeoJSON.coordsToLatLngs = coordsToLatLngs;
GeoJSON.latLngToCoords = latLngToCoords;
GeoJSON.latLngsToCoords = latLngsToCoords;
GeoJSON.getFeature = getFeature;
GeoJSON.asFeature = asFeature;

/*
 * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
 * (zoom to a selected bounding box), enabled by default.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @option boxZoom: Boolean = true
	// Whether the map can be zoomed to a rectangular area specified by
	// dragging the mouse while pressing the shift key.
	boxZoom: true
});

var BoxZoom = Handler.extend({
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
		this._resetStateTimeout = 0;
		map.on('unload', this._destroy, this);
	},

	addHooks: function () {
		on(this._container, 'mousedown', this._onMouseDown, this);
	},

	removeHooks: function () {
		off(this._container, 'mousedown', this._onMouseDown, this);
	},

	moved: function () {
		return this._moved;
	},

	_destroy: function () {
		remove(this._pane);
		delete this._pane;
	},

	_resetState: function () {
		this._resetStateTimeout = 0;
		this._moved = false;
	},

	_clearDeferredResetState: function () {
		if (this._resetStateTimeout !== 0) {
			clearTimeout(this._resetStateTimeout);
			this._resetStateTimeout = 0;
		}
	},

	_onMouseDown: function (e) {
		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

		// Clear the deferred resetState if it hasn't executed yet, otherwise it
		// will interrupt the interaction and orphan a box element in the container.
		this._clearDeferredResetState();
		this._resetState();

		disableTextSelection();
		disableImageDrag();

		this._startPoint = this._map.mouseEventToContainerPoint(e);

		on(document, {
			contextmenu: stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseMove: function (e) {
		if (!this._moved) {
			this._moved = true;

			this._box = create$1('div', 'leaflet-zoom-box', this._container);
			addClass(this._container, 'leaflet-crosshair');

			this._map.fire('boxzoomstart');
		}

		this._point = this._map.mouseEventToContainerPoint(e);

		var bounds = new Bounds(this._point, this._startPoint),
		    size = bounds.getSize();

		setPosition(this._box, bounds.min);

		this._box.style.width  = size.x + 'px';
		this._box.style.height = size.y + 'px';
	},

	_finish: function () {
		if (this._moved) {
			remove(this._box);
			removeClass(this._container, 'leaflet-crosshair');
		}

		enableTextSelection();
		enableImageDrag();

		off(document, {
			contextmenu: stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseUp: function (e) {
		if ((e.which !== 1) && (e.button !== 1)) { return; }

		this._finish();

		if (!this._moved) { return; }
		// Postpone to next JS tick so internal click event handling
		// still see it as "moved".
		this._clearDeferredResetState();
		this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);

		var bounds = new LatLngBounds(
		        this._map.containerPointToLatLng(this._startPoint),
		        this._map.containerPointToLatLng(this._point));

		this._map
			.fitBounds(bounds)
			.fire('boxzoomend', {boxZoomBounds: bounds});
	},

	_onKeyDown: function (e) {
		if (e.keyCode === 27) {
			this._finish();
		}
	}
});

// @section Handlers
// @property boxZoom: Handler
// Box (shift-drag with mouse) zoom handler.
Map.addInitHook('addHandler', 'boxZoom', BoxZoom);

/*
 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

// @namespace Map
// @section Interaction Options

Map.mergeOptions({
	// @option doubleClickZoom: Boolean|String = true
	// Whether the map can be zoomed in by double clicking on it and
	// zoomed out by double clicking while holding shift. If passed
	// `'center'`, double-click zoom will zoom to the center of the
	//  view regardless of where the mouse was.
	doubleClickZoom: true
});

var DoubleClickZoom = Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick, this);
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick, this);
	},

	_onDoubleClick: function (e) {
		var map = this._map,
		    oldZoom = map.getZoom(),
		    delta = map.options.zoomDelta,
		    zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

		if (map.options.doubleClickZoom === 'center') {
			map.setZoom(zoom);
		} else {
			map.setZoomAround(e.containerPoint, zoom);
		}
	}
});

// @section Handlers
//
// Map properties include interaction handlers that allow you to control
// interaction behavior in runtime, enabling or disabling certain features such
// as dragging or touch zoom (see `Handler` methods). For example:
//
// ```js
// map.doubleClickZoom.disable();
// ```
//
// @property doubleClickZoom: Handler
// Double click zoom handler.
Map.addInitHook('addHandler', 'doubleClickZoom', DoubleClickZoom);

/*
 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @option dragging: Boolean = true
	// Whether the map be draggable with mouse/touch or not.
	dragging: true,

	// @section Panning Inertia Options
	// @option inertia: Boolean = *
	// If enabled, panning of the map will have an inertia effect where
	// the map builds momentum while dragging and continues moving in
	// the same direction for some time. Feels especially nice on touch
	// devices. Enabled by default unless running on old Android devices.
	inertia: !android23,

	// @option inertiaDeceleration: Number = 3000
	// The rate with which the inertial movement slows down, in pixels/second??.
	inertiaDeceleration: 3400, // px/s^2

	// @option inertiaMaxSpeed: Number = Infinity
	// Max speed of the inertial movement, in pixels/second.
	inertiaMaxSpeed: Infinity, // px/s

	// @option easeLinearity: Number = 0.2
	easeLinearity: 0.2,

	// TODO refactor, move to CRS
	// @option worldCopyJump: Boolean = false
	// With this option enabled, the map tracks when you pan to another "copy"
	// of the world and seamlessly jumps to the original one so that all overlays
	// like markers and vector layers are still visible.
	worldCopyJump: false,

	// @option maxBoundsViscosity: Number = 0.0
	// If `maxBounds` is set, this option will control how solid the bounds
	// are when dragging the map around. The default value of `0.0` allows the
	// user to drag outside the bounds at normal speed, higher values will
	// slow down map dragging outside bounds, and `1.0` makes the bounds fully
	// solid, preventing the user from dragging outside the bounds.
	maxBoundsViscosity: 0.0
});

var Drag = Handler.extend({
	addHooks: function () {
		if (!this._draggable) {
			var map = this._map;

			this._draggable = new Draggable(map._mapPane, map._container);

			this._draggable.on({
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this);

			this._draggable.on('predrag', this._onPreDragLimit, this);
			if (map.options.worldCopyJump) {
				this._draggable.on('predrag', this._onPreDragWrap, this);
				map.on('zoomend', this._onZoomEnd, this);

				map.whenReady(this._onZoomEnd, this);
			}
		}
		addClass(this._map._container, 'leaflet-grab leaflet-touch-drag');
		this._draggable.enable();
		this._positions = [];
		this._times = [];
	},

	removeHooks: function () {
		removeClass(this._map._container, 'leaflet-grab');
		removeClass(this._map._container, 'leaflet-touch-drag');
		this._draggable.disable();
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	moving: function () {
		return this._draggable && this._draggable._moving;
	},

	_onDragStart: function () {
		var map = this._map;

		map._stop();
		if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
			var bounds = toLatLngBounds(this._map.options.maxBounds);

			this._offsetLimit = toBounds(
				this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
				this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
					.add(this._map.getSize()));

			this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
		} else {
			this._offsetLimit = null;
		}

		map
		    .fire('movestart')
		    .fire('dragstart');

		if (map.options.inertia) {
			this._positions = [];
			this._times = [];
		}
	},

	_onDrag: function (e) {
		if (this._map.options.inertia) {
			var time = this._lastTime = +new Date(),
			    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

			this._positions.push(pos);
			this._times.push(time);

			this._prunePositions(time);
		}

		this._map
		    .fire('move', e)
		    .fire('drag', e);
	},

	_prunePositions: function (time) {
		while (this._positions.length > 1 && time - this._times[0] > 50) {
			this._positions.shift();
			this._times.shift();
		}
	},

	_onZoomEnd: function () {
		var pxCenter = this._map.getSize().divideBy(2),
		    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
		this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
	},

	_viscousLimit: function (value, threshold) {
		return value - (value - threshold) * this._viscosity;
	},

	_onPreDragLimit: function () {
		if (!this._viscosity || !this._offsetLimit) { return; }

		var offset = this._draggable._newPos.subtract(this._draggable._startPos);

		var limit = this._offsetLimit;
		if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
		if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
		if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
		if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }

		this._draggable._newPos = this._draggable._startPos.add(offset);
	},

	_onPreDragWrap: function () {
		// TODO refactor to be able to adjust map pane position after zoom
		var worldWidth = this._worldWidth,
		    halfWidth = Math.round(worldWidth / 2),
		    dx = this._initialWorldOffset,
		    x = this._draggable._newPos.x,
		    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
		    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
		    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

		this._draggable._absPos = this._draggable._newPos.clone();
		this._draggable._newPos.x = newX;
	},

	_onDragEnd: function (e) {
		var map = this._map,
		    options = map.options,

		    noInertia = !options.inertia || this._times.length < 2;

		map.fire('dragend', e);

		if (noInertia) {
			map.fire('moveend');

		} else {
			this._prunePositions(+new Date());

			var direction = this._lastPos.subtract(this._positions[0]),
			    duration = (this._lastTime - this._times[0]) / 1000,
			    ease = options.easeLinearity,

			    speedVector = direction.multiplyBy(ease / duration),
			    speed = speedVector.distanceTo([0, 0]),

			    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
			    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

			    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
			    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

			if (!offset.x && !offset.y) {
				map.fire('moveend');

			} else {
				offset = map._limitOffset(offset, map.options.maxBounds);

				requestAnimFrame(function () {
					map.panBy(offset, {
						duration: decelerationDuration,
						easeLinearity: ease,
						noMoveStart: true,
						animate: true
					});
				});
			}
		}
	}
});

// @section Handlers
// @property dragging: Handler
// Map dragging handler (by both mouse and touch).
Map.addInitHook('addHandler', 'dragging', Drag);

/*
 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
 */

// @namespace Map
// @section Keyboard Navigation Options
Map.mergeOptions({
	// @option keyboard: Boolean = true
	// Makes the map focusable and allows users to navigate the map with keyboard
	// arrows and `+`/`-` keys.
	keyboard: true,

	// @option keyboardPanDelta: Number = 80
	// Amount of pixels to pan when pressing an arrow key.
	keyboardPanDelta: 80
});

var Keyboard = Handler.extend({

	keyCodes: {
		left:    [37],
		right:   [39],
		down:    [40],
		up:      [38],
		zoomIn:  [187, 107, 61, 171],
		zoomOut: [189, 109, 54, 173]
	},

	initialize: function (map) {
		this._map = map;

		this._setPanDelta(map.options.keyboardPanDelta);
		this._setZoomDelta(map.options.zoomDelta);
	},

	addHooks: function () {
		var container = this._map._container;

		// make the container focusable by tabbing
		if (container.tabIndex <= 0) {
			container.tabIndex = '0';
		}

		on(container, {
			focus: this._onFocus,
			blur: this._onBlur,
			mousedown: this._onMouseDown
		}, this);

		this._map.on({
			focus: this._addHooks,
			blur: this._removeHooks
		}, this);
	},

	removeHooks: function () {
		this._removeHooks();

		off(this._map._container, {
			focus: this._onFocus,
			blur: this._onBlur,
			mousedown: this._onMouseDown
		}, this);

		this._map.off({
			focus: this._addHooks,
			blur: this._removeHooks
		}, this);
	},

	_onMouseDown: function () {
		if (this._focused) { return; }

		var body = document.body,
		    docEl = document.documentElement,
		    top = body.scrollTop || docEl.scrollTop,
		    left = body.scrollLeft || docEl.scrollLeft;

		this._map._container.focus();

		window.scrollTo(left, top);
	},

	_onFocus: function () {
		this._focused = true;
		this._map.fire('focus');
	},

	_onBlur: function () {
		this._focused = false;
		this._map.fire('blur');
	},

	_setPanDelta: function (panDelta) {
		var keys = this._panKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.left.length; i < len; i++) {
			keys[codes.left[i]] = [-1 * panDelta, 0];
		}
		for (i = 0, len = codes.right.length; i < len; i++) {
			keys[codes.right[i]] = [panDelta, 0];
		}
		for (i = 0, len = codes.down.length; i < len; i++) {
			keys[codes.down[i]] = [0, panDelta];
		}
		for (i = 0, len = codes.up.length; i < len; i++) {
			keys[codes.up[i]] = [0, -1 * panDelta];
		}
	},

	_setZoomDelta: function (zoomDelta) {
		var keys = this._zoomKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.zoomIn.length; i < len; i++) {
			keys[codes.zoomIn[i]] = zoomDelta;
		}
		for (i = 0, len = codes.zoomOut.length; i < len; i++) {
			keys[codes.zoomOut[i]] = -zoomDelta;
		}
	},

	_addHooks: function () {
		on(document, 'keydown', this._onKeyDown, this);
	},

	_removeHooks: function () {
		off(document, 'keydown', this._onKeyDown, this);
	},

	_onKeyDown: function (e) {
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		var key = e.keyCode,
		    map = this._map,
		    offset;

		if (key in this._panKeys) {
			if (!map._panAnim || !map._panAnim._inProgress) {
				offset = this._panKeys[key];
				if (e.shiftKey) {
					offset = toPoint(offset).multiplyBy(3);
				}

				map.panBy(offset);

				if (map.options.maxBounds) {
					map.panInsideBounds(map.options.maxBounds);
				}
			}
		} else if (key in this._zoomKeys) {
			map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);

		} else if (key === 27 && map._popup && map._popup.options.closeOnEscapeKey) {
			map.closePopup();

		} else {
			return;
		}

		stop(e);
	}
});

// @section Handlers
// @section Handlers
// @property keyboard: Handler
// Keyboard navigation handler.
Map.addInitHook('addHandler', 'keyboard', Keyboard);

/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Mousewheel options
	// @option scrollWheelZoom: Boolean|String = true
	// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
	// it will zoom to the center of the view regardless of where the mouse was.
	scrollWheelZoom: true,

	// @option wheelDebounceTime: Number = 40
	// Limits the rate at which a wheel can fire (in milliseconds). By default
	// user can't zoom via wheel more often than once per 40 ms.
	wheelDebounceTime: 40,

	// @option wheelPxPerZoomLevel: Number = 60
	// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
	// mean a change of one full zoom level. Smaller values will make wheel-zooming
	// faster (and vice versa).
	wheelPxPerZoomLevel: 60
});

var ScrollWheelZoom = Handler.extend({
	addHooks: function () {
		on(this._map._container, 'mousewheel', this._onWheelScroll, this);

		this._delta = 0;
	},

	removeHooks: function () {
		off(this._map._container, 'mousewheel', this._onWheelScroll, this);
	},

	_onWheelScroll: function (e) {
		var delta = getWheelDelta(e);

		var debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(bind(this._performZoom, this), left);

		stop(e);
	},

	_performZoom: function () {
		var map = this._map,
		    zoom = map.getZoom(),
		    snap = this._map.options.zoomSnap || 0;

		map._stop(); // stop panning and fly animations if any

		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
		var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
		    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
		    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
		    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta) { return; }

		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta);
		} else {
			map.setZoomAround(this._lastMousePos, zoom + delta);
		}
	}
});

// @section Handlers
// @property scrollWheelZoom: Handler
// Scroll wheel zoom handler.
Map.addInitHook('addHandler', 'scrollWheelZoom', ScrollWheelZoom);

/*
 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option tap: Boolean = true
	// Enables mobile hacks for supporting instant taps (fixing 200ms click
	// delay on iOS/Android) and touch holds (fired as `contextmenu` events).
	tap: true,

	// @option tapTolerance: Number = 15
	// The max number of pixels a user can shift his finger during touch
	// for it to be considered a valid tap.
	tapTolerance: 15
});

var Tap = Handler.extend({
	addHooks: function () {
		on(this._map._container, 'touchstart', this._onDown, this);
	},

	removeHooks: function () {
		off(this._map._container, 'touchstart', this._onDown, this);
	},

	_onDown: function (e) {
		if (!e.touches) { return; }

		preventDefault(e);

		this._fireClick = true;

		// don't simulate click or track longpress if more than 1 touch
		if (e.touches.length > 1) {
			this._fireClick = false;
			clearTimeout(this._holdTimeout);
			return;
		}

		var first = e.touches[0],
		    el = first.target;

		this._startPos = this._newPos = new Point(first.clientX, first.clientY);

		// if touching a link, highlight it
		if (el.tagName && el.tagName.toLowerCase() === 'a') {
			addClass(el, 'leaflet-active');
		}

		// simulate long hold but setting a timeout
		this._holdTimeout = setTimeout(bind(function () {
			if (this._isTapValid()) {
				this._fireClick = false;
				this._onUp();
				this._simulateEvent('contextmenu', first);
			}
		}, this), 1000);

		this._simulateEvent('mousedown', first);

		on(document, {
			touchmove: this._onMove,
			touchend: this._onUp
		}, this);
	},

	_onUp: function (e) {
		clearTimeout(this._holdTimeout);

		off(document, {
			touchmove: this._onMove,
			touchend: this._onUp
		}, this);

		if (this._fireClick && e && e.changedTouches) {

			var first = e.changedTouches[0],
			    el = first.target;

			if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
				removeClass(el, 'leaflet-active');
			}

			this._simulateEvent('mouseup', first);

			// simulate click if the touch didn't move too much
			if (this._isTapValid()) {
				this._simulateEvent('click', first);
			}
		}
	},

	_isTapValid: function () {
		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
	},

	_onMove: function (e) {
		var first = e.touches[0];
		this._newPos = new Point(first.clientX, first.clientY);
		this._simulateEvent('mousemove', first);
	},

	_simulateEvent: function (type, e) {
		var simulatedEvent = document.createEvent('MouseEvents');

		simulatedEvent._simulated = true;
		e.target._simulatedClick = true;

		simulatedEvent.initMouseEvent(
		        type, true, true, window, 1,
		        e.screenX, e.screenY,
		        e.clientX, e.clientY,
		        false, false, false, false, 0, null);

		e.target.dispatchEvent(simulatedEvent);
	}
});

// @section Handlers
// @property tap: Handler
// Mobile touch hacks (quick tap and touch hold) handler.
if (touch && !pointer) {
	Map.addInitHook('addHandler', 'tap', Tap);
}

/*
 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option touchZoom: Boolean|String = *
	// Whether the map can be zoomed by touch-dragging with two fingers. If
	// passed `'center'`, it will zoom to the center of the view regardless of
	// where the touch events (fingers) were. Enabled for touch-capable web
	// browsers except for old Androids.
	touchZoom: touch && !android23,

	// @option bounceAtZoomLimits: Boolean = true
	// Set it to false if you don't want the map to zoom beyond min/max zoom
	// and then bounce back when pinch-zooming.
	bounceAtZoomLimits: true
});

var TouchZoom = Handler.extend({
	addHooks: function () {
		addClass(this._map._container, 'leaflet-touch-zoom');
		on(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		removeClass(this._map._container, 'leaflet-touch-zoom');
		off(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		var map = this._map;
		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

		var p1 = map.mouseEventToContainerPoint(e.touches[0]),
		    p2 = map.mouseEventToContainerPoint(e.touches[1]);

		this._centerPoint = map.getSize()._divideBy(2);
		this._startLatLng = map.containerPointToLatLng(this._centerPoint);
		if (map.options.touchZoom !== 'center') {
			this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
		}

		this._startDist = p1.distanceTo(p2);
		this._startZoom = map.getZoom();

		this._moved = false;
		this._zooming = true;

		map._stop();

		on(document, 'touchmove', this._onTouchMove, this);
		on(document, 'touchend', this._onTouchEnd, this);

		preventDefault(e);
	},

	_onTouchMove: function (e) {
		if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

		var map = this._map,
		    p1 = map.mouseEventToContainerPoint(e.touches[0]),
		    p2 = map.mouseEventToContainerPoint(e.touches[1]),
		    scale = p1.distanceTo(p2) / this._startDist;

		this._zoom = map.getScaleZoom(scale, this._startZoom);

		if (!map.options.bounceAtZoomLimits && (
			(this._zoom < map.getMinZoom() && scale < 1) ||
			(this._zoom > map.getMaxZoom() && scale > 1))) {
			this._zoom = map._limitZoom(this._zoom);
		}

		if (map.options.touchZoom === 'center') {
			this._center = this._startLatLng;
			if (scale === 1) { return; }
		} else {
			// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
			var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
			if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
			this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
		}

		if (!this._moved) {
			map._moveStart(true, false);
			this._moved = true;
		}

		cancelAnimFrame(this._animRequest);

		var moveFn = bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
		this._animRequest = requestAnimFrame(moveFn, this, true);

		preventDefault(e);
	},

	_onTouchEnd: function () {
		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		this._zooming = false;
		cancelAnimFrame(this._animRequest);

		off(document, 'touchmove', this._onTouchMove);
		off(document, 'touchend', this._onTouchEnd);

		// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
		if (this._map.options.zoomAnimation) {
			this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
		} else {
			this._map._resetView(this._center, this._map._limitZoom(this._zoom));
		}
	}
});

// @section Handlers
// @property touchZoom: Handler
// Touch zoom handler.
Map.addInitHook('addHandler', 'touchZoom', TouchZoom);

Map.BoxZoom = BoxZoom;
Map.DoubleClickZoom = DoubleClickZoom;
Map.Drag = Drag;
Map.Keyboard = Keyboard;
Map.ScrollWheelZoom = ScrollWheelZoom;
Map.Tap = Tap;
Map.TouchZoom = TouchZoom;

Object.freeze = freeze;

exports.version = version;
exports.Control = Control;
exports.control = control;
exports.Browser = Browser;
exports.Evented = Evented;
exports.Mixin = Mixin;
exports.Util = Util;
exports.Class = Class;
exports.Handler = Handler;
exports.extend = extend;
exports.bind = bind;
exports.stamp = stamp;
exports.setOptions = setOptions;
exports.DomEvent = DomEvent;
exports.DomUtil = DomUtil;
exports.PosAnimation = PosAnimation;
exports.Draggable = Draggable;
exports.LineUtil = LineUtil;
exports.PolyUtil = PolyUtil;
exports.Point = Point;
exports.point = toPoint;
exports.Bounds = Bounds;
exports.bounds = toBounds;
exports.Transformation = Transformation;
exports.transformation = toTransformation;
exports.Projection = index;
exports.LatLng = LatLng;
exports.latLng = toLatLng;
exports.LatLngBounds = LatLngBounds;
exports.latLngBounds = toLatLngBounds;
exports.CRS = CRS;
exports.GeoJSON = GeoJSON;
exports.geoJSON = geoJSON;
exports.geoJson = geoJson;
exports.Layer = Layer;
exports.LayerGroup = LayerGroup;
exports.layerGroup = layerGroup;
exports.FeatureGroup = FeatureGroup;
exports.featureGroup = featureGroup;
exports.ImageOverlay = ImageOverlay;
exports.imageOverlay = imageOverlay;
exports.VideoOverlay = VideoOverlay;
exports.videoOverlay = videoOverlay;
exports.SVGOverlay = SVGOverlay;
exports.svgOverlay = svgOverlay;
exports.DivOverlay = DivOverlay;
exports.Popup = Popup;
exports.popup = popup;
exports.Tooltip = Tooltip;
exports.tooltip = tooltip;
exports.Icon = Icon;
exports.icon = icon;
exports.DivIcon = DivIcon;
exports.divIcon = divIcon;
exports.Marker = Marker;
exports.marker = marker;
exports.TileLayer = TileLayer;
exports.tileLayer = tileLayer;
exports.GridLayer = GridLayer;
exports.gridLayer = gridLayer;
exports.SVG = SVG;
exports.svg = svg$1;
exports.Renderer = Renderer;
exports.Canvas = Canvas;
exports.canvas = canvas$1;
exports.Path = Path;
exports.CircleMarker = CircleMarker;
exports.circleMarker = circleMarker;
exports.Circle = Circle;
exports.circle = circle;
exports.Polyline = Polyline;
exports.polyline = polyline;
exports.Polygon = Polygon;
exports.polygon = polygon;
exports.Rectangle = Rectangle;
exports.rectangle = rectangle;
exports.Map = Map;
exports.map = createMap;

var oldL = window.L;
exports.noConflict = function() {
	window.L = oldL;
	return this;
}

// Always export us to window global (see #2364)
window.L = exports;

})));


},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};
},{}],"node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.min.js":[function(require,module,exports) {
var process = require("process");
(() => {
  var t = {
      9705: (t, e, i) => {
        "use strict";

        var n = i(1540);
        function r(t) {
          var e = [Infinity, Infinity, -Infinity, -Infinity];
          return n.coordEach(t, function (t) {
            e[0] > t[0] && (e[0] = t[0]), e[1] > t[1] && (e[1] = t[1]), e[2] < t[0] && (e[2] = t[0]), e[3] < t[1] && (e[3] = t[1]);
          }), e;
        }
        r["default"] = r, e.Z = r;
      },
      4102: (t, e) => {
        "use strict";

        function i(t, e, i) {
          void 0 === i && (i = {});
          var n = {
            type: "Feature"
          };
          return (0 === i.id || i.id) && (n.id = i.id), i.bbox && (n.bbox = i.bbox), n.properties = e || {}, n.geometry = t, n;
        }
        function n(t, e, n) {
          if (void 0 === n && (n = {}), !t) throw new Error("coordinates is required");
          if (!Array.isArray(t)) throw new Error("coordinates must be an Array");
          if (t.length < 2) throw new Error("coordinates must be at least 2 numbers long");
          if (!d(t[0]) || !d(t[1])) throw new Error("coordinates must contain numbers");
          return i({
            type: "Point",
            coordinates: t
          }, e, n);
        }
        function r(t, e, n) {
          void 0 === n && (n = {});
          for (var r = 0, a = t; r < a.length; r++) {
            var o = a[r];
            if (o.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
            for (var s = 0; s < o[o.length - 1].length; s++) if (o[o.length - 1][s] !== o[0][s]) throw new Error("First and last Position are not equivalent.");
          }
          return i({
            type: "Polygon",
            coordinates: t
          }, e, n);
        }
        function a(t, e, n) {
          if (void 0 === n && (n = {}), t.length < 2) throw new Error("coordinates must be an array of two or more positions");
          return i({
            type: "LineString",
            coordinates: t
          }, e, n);
        }
        function o(t, e) {
          void 0 === e && (e = {});
          var i = {
            type: "FeatureCollection"
          };
          return e.id && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.features = t, i;
        }
        function s(t, e, n) {
          return void 0 === n && (n = {}), i({
            type: "MultiLineString",
            coordinates: t
          }, e, n);
        }
        function l(t, e, n) {
          return void 0 === n && (n = {}), i({
            type: "MultiPoint",
            coordinates: t
          }, e, n);
        }
        function h(t, e, n) {
          return void 0 === n && (n = {}), i({
            type: "MultiPolygon",
            coordinates: t
          }, e, n);
        }
        function u(t, i) {
          void 0 === i && (i = "kilometers");
          var n = e.factors[i];
          if (!n) throw new Error(i + " units is invalid");
          return t * n;
        }
        function c(t, i) {
          void 0 === i && (i = "kilometers");
          var n = e.factors[i];
          if (!n) throw new Error(i + " units is invalid");
          return t / n;
        }
        function p(t) {
          return 180 * (t % (2 * Math.PI)) / Math.PI;
        }
        function d(t) {
          return !isNaN(t) && null !== t && !Array.isArray(t);
        }
        Object.defineProperty(e, "__esModule", {
          value: !0
        }), e.earthRadius = 6371008.8, e.factors = {
          centimeters: 100 * e.earthRadius,
          centimetres: 100 * e.earthRadius,
          degrees: e.earthRadius / 111325,
          feet: 3.28084 * e.earthRadius,
          inches: 39.37 * e.earthRadius,
          kilometers: e.earthRadius / 1e3,
          kilometres: e.earthRadius / 1e3,
          meters: e.earthRadius,
          metres: e.earthRadius,
          miles: e.earthRadius / 1609.344,
          millimeters: 1e3 * e.earthRadius,
          millimetres: 1e3 * e.earthRadius,
          nauticalmiles: e.earthRadius / 1852,
          radians: 1,
          yards: 1.0936 * e.earthRadius
        }, e.unitsFactors = {
          centimeters: 100,
          centimetres: 100,
          degrees: 1 / 111325,
          feet: 3.28084,
          inches: 39.37,
          kilometers: .001,
          kilometres: .001,
          meters: 1,
          metres: 1,
          miles: 1 / 1609.344,
          millimeters: 1e3,
          millimetres: 1e3,
          nauticalmiles: 1 / 1852,
          radians: 1 / e.earthRadius,
          yards: 1.0936133
        }, e.areaFactors = {
          acres: 247105e-9,
          centimeters: 1e4,
          centimetres: 1e4,
          feet: 10.763910417,
          hectares: 1e-4,
          inches: 1550.003100006,
          kilometers: 1e-6,
          kilometres: 1e-6,
          meters: 1,
          metres: 1,
          miles: 386e-9,
          millimeters: 1e6,
          millimetres: 1e6,
          yards: 1.195990046
        }, e.feature = i, e.geometry = function (t, e, i) {
          switch (void 0 === i && (i = {}), t) {
            case "Point":
              return n(e).geometry;
            case "LineString":
              return a(e).geometry;
            case "Polygon":
              return r(e).geometry;
            case "MultiPoint":
              return l(e).geometry;
            case "MultiLineString":
              return s(e).geometry;
            case "MultiPolygon":
              return h(e).geometry;
            default:
              throw new Error(t + " is invalid");
          }
        }, e.point = n, e.points = function (t, e, i) {
          return void 0 === i && (i = {}), o(t.map(function (t) {
            return n(t, e);
          }), i);
        }, e.polygon = r, e.polygons = function (t, e, i) {
          return void 0 === i && (i = {}), o(t.map(function (t) {
            return r(t, e);
          }), i);
        }, e.lineString = a, e.lineStrings = function (t, e, i) {
          return void 0 === i && (i = {}), o(t.map(function (t) {
            return a(t, e);
          }), i);
        }, e.featureCollection = o, e.multiLineString = s, e.multiPoint = l, e.multiPolygon = h, e.geometryCollection = function (t, e, n) {
          return void 0 === n && (n = {}), i({
            type: "GeometryCollection",
            geometries: t
          }, e, n);
        }, e.round = function (t, e) {
          if (void 0 === e && (e = 0), e && !(e >= 0)) throw new Error("precision must be a positive number");
          var i = Math.pow(10, e || 0);
          return Math.round(t * i) / i;
        }, e.radiansToLength = u, e.lengthToRadians = c, e.lengthToDegrees = function (t, e) {
          return p(c(t, e));
        }, e.bearingToAzimuth = function (t) {
          var e = t % 360;
          return e < 0 && (e += 360), e;
        }, e.radiansToDegrees = p, e.degreesToRadians = function (t) {
          return t % 360 * Math.PI / 180;
        }, e.convertLength = function (t, e, i) {
          if (void 0 === e && (e = "kilometers"), void 0 === i && (i = "kilometers"), !(t >= 0)) throw new Error("length must be a positive number");
          return u(c(t, e), i);
        }, e.convertArea = function (t, i, n) {
          if (void 0 === i && (i = "meters"), void 0 === n && (n = "kilometers"), !(t >= 0)) throw new Error("area must be a positive number");
          var r = e.areaFactors[i];
          if (!r) throw new Error("invalid original units");
          var a = e.areaFactors[n];
          if (!a) throw new Error("invalid final units");
          return t / r * a;
        }, e.isNumber = d, e.isObject = function (t) {
          return !!t && t.constructor === Object;
        }, e.validateBBox = function (t) {
          if (!t) throw new Error("bbox is required");
          if (!Array.isArray(t)) throw new Error("bbox must be an Array");
          if (4 !== t.length && 6 !== t.length) throw new Error("bbox must be an Array of 4 or 6 numbers");
          t.forEach(function (t) {
            if (!d(t)) throw new Error("bbox must only contain numbers");
          });
        }, e.validateId = function (t) {
          if (!t) throw new Error("id is required");
          if (-1 === ["string", "number"].indexOf(typeof t)) throw new Error("id must be a number or a string");
        };
      },
      1540: (t, e, i) => {
        "use strict";

        Object.defineProperty(e, "__esModule", {
          value: !0
        });
        var n = i(4102);
        function r(t, e, i) {
          if (null !== t) for (var n, a, o, s, l, h, u, c, p = 0, d = 0, f = t.type, g = "FeatureCollection" === f, _ = "Feature" === f, m = g ? t.features.length : 1, y = 0; y < m; y++) {
            l = (c = !!(u = g ? t.features[y].geometry : _ ? t.geometry : t) && "GeometryCollection" === u.type) ? u.geometries.length : 1;
            for (var v = 0; v < l; v++) {
              var L = 0,
                b = 0;
              if (null !== (s = c ? u.geometries[v] : u)) {
                h = s.coordinates;
                var k = s.type;
                switch (p = !i || "Polygon" !== k && "MultiPolygon" !== k ? 0 : 1, k) {
                  case null:
                    break;
                  case "Point":
                    if (!1 === e(h, d, y, L, b)) return !1;
                    d++, L++;
                    break;
                  case "LineString":
                  case "MultiPoint":
                    for (n = 0; n < h.length; n++) {
                      if (!1 === e(h[n], d, y, L, b)) return !1;
                      d++, "MultiPoint" === k && L++;
                    }
                    "LineString" === k && L++;
                    break;
                  case "Polygon":
                  case "MultiLineString":
                    for (n = 0; n < h.length; n++) {
                      for (a = 0; a < h[n].length - p; a++) {
                        if (!1 === e(h[n][a], d, y, L, b)) return !1;
                        d++;
                      }
                      "MultiLineString" === k && L++, "Polygon" === k && b++;
                    }
                    "Polygon" === k && L++;
                    break;
                  case "MultiPolygon":
                    for (n = 0; n < h.length; n++) {
                      for (b = 0, a = 0; a < h[n].length; a++) {
                        for (o = 0; o < h[n][a].length - p; o++) {
                          if (!1 === e(h[n][a][o], d, y, L, b)) return !1;
                          d++;
                        }
                        b++;
                      }
                      L++;
                    }
                    break;
                  case "GeometryCollection":
                    for (n = 0; n < s.geometries.length; n++) if (!1 === r(s.geometries[n], e, i)) return !1;
                    break;
                  default:
                    throw new Error("Unknown Geometry Type");
                }
              }
            }
          }
        }
        function a(t, e) {
          var i;
          switch (t.type) {
            case "FeatureCollection":
              for (i = 0; i < t.features.length && !1 !== e(t.features[i].properties, i); i++);
              break;
            case "Feature":
              e(t.properties, 0);
          }
        }
        function o(t, e) {
          if ("Feature" === t.type) e(t, 0);else if ("FeatureCollection" === t.type) for (var i = 0; i < t.features.length && !1 !== e(t.features[i], i); i++);
        }
        function s(t, e) {
          var i,
            n,
            r,
            a,
            o,
            s,
            l,
            h,
            u,
            c,
            p = 0,
            d = "FeatureCollection" === t.type,
            f = "Feature" === t.type,
            g = d ? t.features.length : 1;
          for (i = 0; i < g; i++) {
            for (s = d ? t.features[i].geometry : f ? t.geometry : t, h = d ? t.features[i].properties : f ? t.properties : {}, u = d ? t.features[i].bbox : f ? t.bbox : undefined, c = d ? t.features[i].id : f ? t.id : undefined, o = (l = !!s && "GeometryCollection" === s.type) ? s.geometries.length : 1, r = 0; r < o; r++) if (null !== (a = l ? s.geometries[r] : s)) switch (a.type) {
              case "Point":
              case "LineString":
              case "MultiPoint":
              case "Polygon":
              case "MultiLineString":
              case "MultiPolygon":
                if (!1 === e(a, p, h, u, c)) return !1;
                break;
              case "GeometryCollection":
                for (n = 0; n < a.geometries.length; n++) if (!1 === e(a.geometries[n], p, h, u, c)) return !1;
                break;
              default:
                throw new Error("Unknown Geometry Type");
            } else if (!1 === e(null, p, h, u, c)) return !1;
            p++;
          }
        }
        function l(t, e) {
          s(t, function (t, i, r, a, o) {
            var s,
              l = null === t ? null : t.type;
            switch (l) {
              case null:
              case "Point":
              case "LineString":
              case "Polygon":
                return !1 !== e(n.feature(t, r, {
                  bbox: a,
                  id: o
                }), i, 0) && void 0;
            }
            switch (l) {
              case "MultiPoint":
                s = "Point";
                break;
              case "MultiLineString":
                s = "LineString";
                break;
              case "MultiPolygon":
                s = "Polygon";
            }
            for (var h = 0; h < t.coordinates.length; h++) {
              var u = {
                type: s,
                coordinates: t.coordinates[h]
              };
              if (!1 === e(n.feature(u, r), i, h)) return !1;
            }
          });
        }
        function h(t, e) {
          l(t, function (t, i, a) {
            var o = 0;
            if (t.geometry) {
              var s = t.geometry.type;
              if ("Point" !== s && "MultiPoint" !== s) {
                var l,
                  h = 0,
                  u = 0,
                  c = 0;
                return !1 !== r(t, function (r, s, p, d, f) {
                  if (l === undefined || i > h || d > u || f > c) return l = r, h = i, u = d, c = f, void (o = 0);
                  var g = n.lineString([l, r], t.properties);
                  if (!1 === e(g, i, a, f, o)) return !1;
                  o++, l = r;
                }) && void 0;
              }
            }
          });
        }
        function u(t, e) {
          if (!t) throw new Error("geojson is required");
          l(t, function (t, i, r) {
            if (null !== t.geometry) {
              var a = t.geometry.type,
                o = t.geometry.coordinates;
              switch (a) {
                case "LineString":
                  if (!1 === e(t, i, r, 0, 0)) return !1;
                  break;
                case "Polygon":
                  for (var s = 0; s < o.length; s++) if (!1 === e(n.lineString(o[s], t.properties), i, r, s)) return !1;
              }
            }
          });
        }
        e.coordAll = function (t) {
          var e = [];
          return r(t, function (t) {
            e.push(t);
          }), e;
        }, e.coordEach = r, e.coordReduce = function (t, e, i, n) {
          var a = i;
          return r(t, function (t, n, r, o, s) {
            a = 0 === n && i === undefined ? t : e(a, t, n, r, o, s);
          }, n), a;
        }, e.featureEach = o, e.featureReduce = function (t, e, i) {
          var n = i;
          return o(t, function (t, r) {
            n = 0 === r && i === undefined ? t : e(n, t, r);
          }), n;
        }, e.findPoint = function (t, e) {
          if (e = e || {}, !n.isObject(e)) throw new Error("options is invalid");
          var i,
            r = e.featureIndex || 0,
            a = e.multiFeatureIndex || 0,
            o = e.geometryIndex || 0,
            s = e.coordIndex || 0,
            l = e.properties;
          switch (t.type) {
            case "FeatureCollection":
              r < 0 && (r = t.features.length + r), l = l || t.features[r].properties, i = t.features[r].geometry;
              break;
            case "Feature":
              l = l || t.properties, i = t.geometry;
              break;
            case "Point":
            case "MultiPoint":
              return null;
            case "LineString":
            case "Polygon":
            case "MultiLineString":
            case "MultiPolygon":
              i = t;
              break;
            default:
              throw new Error("geojson is invalid");
          }
          if (null === i) return null;
          var h = i.coordinates;
          switch (i.type) {
            case "Point":
              return n.point(h, l, e);
            case "MultiPoint":
              return a < 0 && (a = h.length + a), n.point(h[a], l, e);
            case "LineString":
              return s < 0 && (s = h.length + s), n.point(h[s], l, e);
            case "Polygon":
              return o < 0 && (o = h.length + o), s < 0 && (s = h[o].length + s), n.point(h[o][s], l, e);
            case "MultiLineString":
              return a < 0 && (a = h.length + a), s < 0 && (s = h[a].length + s), n.point(h[a][s], l, e);
            case "MultiPolygon":
              return a < 0 && (a = h.length + a), o < 0 && (o = h[a].length + o), s < 0 && (s = h[a][o].length - s), n.point(h[a][o][s], l, e);
          }
          throw new Error("geojson is invalid");
        }, e.findSegment = function (t, e) {
          if (e = e || {}, !n.isObject(e)) throw new Error("options is invalid");
          var i,
            r = e.featureIndex || 0,
            a = e.multiFeatureIndex || 0,
            o = e.geometryIndex || 0,
            s = e.segmentIndex || 0,
            l = e.properties;
          switch (t.type) {
            case "FeatureCollection":
              r < 0 && (r = t.features.length + r), l = l || t.features[r].properties, i = t.features[r].geometry;
              break;
            case "Feature":
              l = l || t.properties, i = t.geometry;
              break;
            case "Point":
            case "MultiPoint":
              return null;
            case "LineString":
            case "Polygon":
            case "MultiLineString":
            case "MultiPolygon":
              i = t;
              break;
            default:
              throw new Error("geojson is invalid");
          }
          if (null === i) return null;
          var h = i.coordinates;
          switch (i.type) {
            case "Point":
            case "MultiPoint":
              return null;
            case "LineString":
              return s < 0 && (s = h.length + s - 1), n.lineString([h[s], h[s + 1]], l, e);
            case "Polygon":
              return o < 0 && (o = h.length + o), s < 0 && (s = h[o].length + s - 1), n.lineString([h[o][s], h[o][s + 1]], l, e);
            case "MultiLineString":
              return a < 0 && (a = h.length + a), s < 0 && (s = h[a].length + s - 1), n.lineString([h[a][s], h[a][s + 1]], l, e);
            case "MultiPolygon":
              return a < 0 && (a = h.length + a), o < 0 && (o = h[a].length + o), s < 0 && (s = h[a][o].length - s - 1), n.lineString([h[a][o][s], h[a][o][s + 1]], l, e);
          }
          throw new Error("geojson is invalid");
        }, e.flattenEach = l, e.flattenReduce = function (t, e, i) {
          var n = i;
          return l(t, function (t, r, a) {
            n = 0 === r && 0 === a && i === undefined ? t : e(n, t, r, a);
          }), n;
        }, e.geomEach = s, e.geomReduce = function (t, e, i) {
          var n = i;
          return s(t, function (t, r, a, o, s) {
            n = 0 === r && i === undefined ? t : e(n, t, r, a, o, s);
          }), n;
        }, e.lineEach = u, e.lineReduce = function (t, e, i) {
          var n = i;
          return u(t, function (t, r, a, o) {
            n = 0 === r && i === undefined ? t : e(n, t, r, a, o);
          }), n;
        }, e.propEach = a, e.propReduce = function (t, e, i) {
          var n = i;
          return a(t, function (t, r) {
            n = 0 === r && i === undefined ? t : e(n, t, r);
          }), n;
        }, e.segmentEach = h, e.segmentReduce = function (t, e, i) {
          var n = i,
            r = !1;
          return h(t, function (t, a, o, s, l) {
            n = !1 === r && i === undefined ? t : e(n, t, a, o, s, l), r = !0;
          }), n;
        };
      },
      414: (t, e, i) => {
        "use strict";

        i(7107);
        var n = i(2492),
          r = i.n(n);
        const a = JSON.parse('{"tooltips":{"placeMarker":"Click to place marker","firstVertex":"Click to place first vertex","continueLine":"Click to continue drawing","finishLine":"Click any existing marker to finish","finishPoly":"Click first marker to finish","finishRect":"Click to finish","startCircle":"Click to place circle center","finishCircle":"Click to finish circle","placeCircleMarker":"Click to place circle marker","placeText":"Click to place text"},"actions":{"finish":"Finish","cancel":"Cancel","removeLastVertex":"Remove Last Vertex"},"buttonTitles":{"drawMarkerButton":"Draw Marker","drawPolyButton":"Draw Polygons","drawLineButton":"Draw Polyline","drawCircleButton":"Draw Circle","drawRectButton":"Draw Rectangle","editButton":"Edit Layers","dragButton":"Drag Layers","cutButton":"Cut Layers","deleteButton":"Remove Layers","drawCircleMarkerButton":"Draw Circle Marker","snappingButton":"Snap dragged marker to other layers and vertices","pinningButton":"Pin shared vertices together","rotateButton":"Rotate Layers","drawTextButton":"Draw Text"}}'),
          o = JSON.parse('{"tooltips":{"placeMarker":"Platziere den Marker mit Klick","firstVertex":"Platziere den ersten Marker mit Klick","continueLine":"Klicke, um weiter zu zeichnen","finishLine":"Beende mit Klick auf existierenden Marker","finishPoly":"Beende mit Klick auf ersten Marker","finishRect":"Beende mit Klick","startCircle":"Platziere das Kreiszentrum mit Klick","finishCircle":"Beende den Kreis mit Klick","placeCircleMarker":"Platziere den Kreismarker mit Klick","placeText":"Platziere den Text mit Klick"},"actions":{"finish":"Beenden","cancel":"Abbrechen","removeLastVertex":"Letzten Vertex l??schen"},"buttonTitles":{"drawMarkerButton":"Marker zeichnen","drawPolyButton":"Polygon zeichnen","drawLineButton":"Polyline zeichnen","drawCircleButton":"Kreis zeichnen","drawRectButton":"Rechteck zeichnen","editButton":"Layer editieren","dragButton":"Layer bewegen","cutButton":"Layer schneiden","deleteButton":"Layer l??schen","drawCircleMarkerButton":"Kreismarker zeichnen","snappingButton":"Bewegter Layer an andere Layer oder Vertexe einhacken","pinningButton":"Vertexe an der gleichen Position verkn??pfen","rotateButton":"Layer drehen","drawTextButton":"Text zeichnen"}}'),
          s = JSON.parse('{"tooltips":{"placeMarker":"Clicca per posizionare un Marker","firstVertex":"Clicca per posizionare il primo vertice","continueLine":"Clicca per continuare a disegnare","finishLine":"Clicca qualsiasi marker esistente per terminare","finishPoly":"Clicca il primo marker per terminare","finishRect":"Clicca per terminare","startCircle":"Clicca per posizionare il punto centrale del cerchio","finishCircle":"Clicca per terminare il cerchio","placeCircleMarker":"Clicca per posizionare un Marker del cherchio"},"actions":{"finish":"Termina","cancel":"Annulla","removeLastVertex":"Rimuovi l\'ultimo vertice"},"buttonTitles":{"drawMarkerButton":"Disegna Marker","drawPolyButton":"Disegna Poligoni","drawLineButton":"Disegna Polilinea","drawCircleButton":"Disegna Cerchio","drawRectButton":"Disegna Rettangolo","editButton":"Modifica Livelli","dragButton":"Sposta Livelli","cutButton":"Ritaglia Livelli","deleteButton":"Elimina Livelli","drawCircleMarkerButton":"Disegna Marker del Cerchio","snappingButton":"Snap ha trascinato il pennarello su altri strati e vertici","pinningButton":"Pin condiviso vertici insieme"}}'),
          l = JSON.parse('{"tooltips":{"placeMarker":"Klik untuk menempatkan marker","firstVertex":"Klik untuk menempatkan vertex pertama","continueLine":"Klik untuk meneruskan digitasi","finishLine":"Klik pada sembarang marker yang ada untuk mengakhiri","finishPoly":"Klik marker pertama untuk mengakhiri","finishRect":"Klik untuk mengakhiri","startCircle":"Klik untuk menempatkan titik pusat lingkaran","finishCircle":"Klik untuk mengakhiri lingkaran","placeCircleMarker":"Klik untuk menempatkan penanda lingkarann"},"actions":{"finish":"Selesai","cancel":"Batal","removeLastVertex":"Hilangkan Vertex Terakhir"},"buttonTitles":{"drawMarkerButton":"Digitasi Marker","drawPolyButton":"Digitasi Polygon","drawLineButton":"Digitasi Polyline","drawCircleButton":"Digitasi Lingkaran","drawRectButton":"Digitasi Segi Empat","editButton":"Edit Layer","dragButton":"Geser Layer","cutButton":"Potong Layer","deleteButton":"Hilangkan Layer","drawCircleMarkerButton":"Digitasi Penanda Lingkaran","snappingButton":"Jepretkan penanda yang ditarik ke lapisan dan simpul lain","pinningButton":"Sematkan simpul bersama bersama"}}'),
          h = JSON.parse('{"tooltips":{"placeMarker":"Adaug?? un punct","firstVertex":"Apas?? aici pentru a ad??uga primul Vertex","continueLine":"Apas?? aici pentru a continua desenul","finishLine":"Apas?? pe orice obiect pentru a finisa desenul","finishPoly":"Apas?? pe primul obiect pentru a finisa","finishRect":"Apas?? pentru a finisa","startCircle":"Apas?? pentru a desena un cerc","finishCircle":"Apas?? pentru a finisa un cerc","placeCircleMarker":"Adaug?? un punct"},"actions":{"finish":"Termin??","cancel":"Anuleaz??","removeLastVertex":"??terge ultimul Vertex"},"buttonTitles":{"drawMarkerButton":"Adaug?? o bulin??","drawPolyButton":"Deseneaz?? un poligon","drawLineButton":"Deseneaz?? o linie","drawCircleButton":"Deseneaz?? un cerc","drawRectButton":"Deseneaz?? un dreptunghi","editButton":"Editeaz?? straturile","dragButton":"Mut?? straturile","cutButton":"Taie straturile","deleteButton":"??terge straturile","drawCircleMarkerButton":"Deseneaz?? marcatorul cercului","snappingButton":"Fixa??i marcatorul glisat pe alte straturi ??i v??rfuri","pinningButton":"Fixa??i v??rfurile partajate ??mpreun??"}}'),
          u = JSON.parse('{"tooltips":{"placeMarker":"??????????????, ?????????? ?????????????? ????????????","firstVertex":"??????????????, ?????????? ?????????????? ???????????? ????????????","continueLine":"??????????????, ?????????? ???????????????????? ??????????????????","finishLine":"?????????????? ?????????? ???????????????????????? ???????????? ?????? ????????????????????","finishPoly":"???????????????? ???????????? ??????????, ?????????? ??????????????????","finishRect":"??????????????, ?????????? ??????????????????","startCircle":"??????????????, ?????????? ???????????????? ?????????? ??????????","finishCircle":"??????????????, ?????????? ???????????? ????????????","placeCircleMarker":"??????????????, ?????????? ?????????????? ???????????????? ????????????"},"actions":{"finish":"??????????????????","cancel":"????????????????","removeLastVertex":"???????????????? ?????????????????? ????????????????"},"buttonTitles":{"drawMarkerButton":"???????????????? ????????????","drawPolyButton":"???????????????? ??????????????","drawLineButton":"???????????????? ????????????","drawCircleButton":"???????????????? ????????","drawRectButton":"???????????????? ??????????????????????????","editButton":"?????????????????????????? ????????","dragButton":"?????????????????? ????????","cutButton":"???????????????? ????????","deleteButton":"?????????????? ????????","drawCircleMarkerButton":"???????????????? ???????????????? ????????????","snappingButton":"?????????????????? ?????????????????????????????? ???????????? ?? ???????????? ?????????? ?? ????????????????","pinningButton":"?????????????? ?????????? ?????????? ????????????"}}'),
          c = JSON.parse('{"tooltips":{"placeMarker":"Presiona para colocar un marcador","firstVertex":"Presiona para colocar el primer v??rtice","continueLine":"Presiona para continuar dibujando","finishLine":"Presiona cualquier marcador existente para finalizar","finishPoly":"Presiona el primer marcador para finalizar","finishRect":"Presiona para finalizar","startCircle":"Presiona para colocar el centro del circulo","finishCircle":"Presiona para finalizar el circulo","placeCircleMarker":"Presiona para colocar un marcador de circulo"},"actions":{"finish":"Finalizar","cancel":"Cancelar","removeLastVertex":"Remover ultimo v??rtice"},"buttonTitles":{"drawMarkerButton":"Dibujar Marcador","drawPolyButton":"Dibujar Pol??gono","drawLineButton":"Dibujar L??nea","drawCircleButton":"Dibujar Circulo","drawRectButton":"Dibujar Rect??ngulo","editButton":"Editar Capas","dragButton":"Arrastrar Capas","cutButton":"Cortar Capas","deleteButton":"Remover Capas","drawCircleMarkerButton":"Dibujar Marcador de Circulo","snappingButton":"El marcador de Snap arrastrado a otras capas y v??rtices","pinningButton":"Fijar juntos los v??rtices compartidos"}}'),
          p = JSON.parse('{"tooltips":{"placeMarker":"Klik om een marker te plaatsen","firstVertex":"Klik om het eerste punt te plaatsen","continueLine":"Klik om te blijven tekenen","finishLine":"Klik op een bestaand punt om te be??indigen","finishPoly":"Klik op het eerst punt om te be??indigen","finishRect":"Klik om te be??indigen","startCircle":"Klik om het middelpunt te plaatsen","finishCircle":"Klik om de cirkel te be??indigen","placeCircleMarker":"Klik om een marker te plaatsen"},"actions":{"finish":"Bewaar","cancel":"Annuleer","removeLastVertex":"Verwijder laatste punt"},"buttonTitles":{"drawMarkerButton":"Plaats Marker","drawPolyButton":"Teken een vlak","drawLineButton":"Teken een lijn","drawCircleButton":"Teken een cirkel","drawRectButton":"Teken een vierkant","editButton":"Bewerk","dragButton":"Verplaats","cutButton":"Knip","deleteButton":"Verwijder","drawCircleMarkerButton":"Plaats Marker","snappingButton":"Snap gesleepte marker naar andere lagen en hoekpunten","pinningButton":"Speld gedeelde hoekpunten samen"}}'),
          d = JSON.parse('{"tooltips":{"placeMarker":"Cliquez pour placer un marqueur","firstVertex":"Cliquez pour placer le premier sommet","continueLine":"Cliquez pour continuer ?? dessiner","finishLine":"Cliquez sur n\'importe quel marqueur pour terminer","finishPoly":"Cliquez sur le premier marqueur pour terminer","finishRect":"Cliquez pour terminer","startCircle":"Cliquez pour placer le centre du cercle","finishCircle":"Cliquez pour finir le cercle","placeCircleMarker":"Cliquez pour placer le marqueur circulaire"},"actions":{"finish":"Terminer","cancel":"Annuler","removeLastVertex":"Retirer le dernier sommet"},"buttonTitles":{"drawMarkerButton":"Placer des marqueurs","drawPolyButton":"Dessiner des polygones","drawLineButton":"Dessiner des polylignes","drawCircleButton":"Dessiner un cercle","drawRectButton":"Dessiner un rectangle","editButton":"??diter des calques","dragButton":"D??placer des calques","cutButton":"Couper des calques","deleteButton":"Supprimer des calques","drawCircleMarkerButton":"Dessiner un marqueur circulaire","snappingButton":"Glisser le marqueur vers d\'autres couches et sommets","pinningButton":"??pingler ensemble les sommets partag??s","rotateButton":"Tourner des calques"}}'),
          f = JSON.parse('{"tooltips":{"placeMarker":"??????????????????","firstVertex":"????????????????????????","continueLine":"??????????????????","finishLine":"????????????????????????????????????","finishPoly":"??????????????????????????????","finishRect":"????????????","startCircle":"??????????????????","finishCircle":"??????????????????","placeCircleMarker":"????????????????????????"},"actions":{"finish":"??????","cancel":"??????","removeLastVertex":"?????????????????????"},"buttonTitles":{"drawMarkerButton":"????????????","drawPolyButton":"???????????????","drawLineButton":"????????????","drawCircleButton":"????????????","drawRectButton":"???????????????","editButton":"????????????","dragButton":"????????????","cutButton":"????????????","deleteButton":"????????????","drawCircleMarkerButton":"???????????????","snappingButton":"????????????????????????????????????????????????","pinningButton":"??????????????????????????????"}}'),
          g = JSON.parse('{"tooltips":{"placeMarker":"??????????????????","firstVertex":"???????????????????????????","continueLine":"??????????????????","finishLine":"????????????????????????????????????","finishPoly":"??????????????????????????????","finishRect":"????????????","startCircle":"??????????????????","finishCircle":"??????????????????","placeCircleMarker":"????????????????????????"},"actions":{"finish":"??????","cancel":"??????","removeLastVertex":"????????????????????????"},"buttonTitles":{"drawMarkerButton":"????????????","drawPolyButton":"???????????????","drawLineButton":"????????????","drawCircleButton":"????????????","drawRectButton":"????????????","editButton":"????????????","dragButton":"????????????","cutButton":"????????????","deleteButton":"????????????","drawCircleMarkerButton":"???????????????","snappingButton":"????????????????????????????????????????????????","pinningButton":"??????????????????????????????"}}'),
          _ = {
            en: a,
            de: o,
            it: s,
            id: l,
            ro: h,
            ru: u,
            es: c,
            nl: p,
            fr: d,
            pt_br: JSON.parse('{"tooltips":{"placeMarker":"Clique para posicionar o marcador","firstVertex":"Clique para posicionar o primeiro v??rtice","continueLine":"Clique para continuar desenhando","finishLine":"Clique em qualquer marcador existente para finalizar","finishPoly":"Clique no primeiro ponto para fechar o pol??gono","finishRect":"Clique para finalizar","startCircle":"Clique para posicionar o centro do c??rculo","finishCircle":"Clique para fechar o c??rculo","placeCircleMarker":"Clique para posicionar o marcador circular"},"actions":{"finish":"Finalizar","cancel":"Cancelar","removeLastVertex":"Remover ??ltimo v??rtice"},"buttonTitles":{"drawMarkerButton":"Desenhar um marcador","drawPolyButton":"Desenhar um pol??gono","drawLineButton":"Desenhar uma polilinha","drawCircleButton":"Desenhar um c??rculo","drawRectButton":"Desenhar um ret??ngulo","editButton":"Editar camada(s)","dragButton":"Mover camada(s)","cutButton":"Recortar camada(s)","deleteButton":"Remover camada(s)","drawCircleMarkerButton":"Marcador de c??rculos de desenho","snappingButton":"Marcador arrastado para outras camadas e v??rtices","pinningButton":"V??rtices compartilhados de pinos juntos"}}'),
            zh: f,
            zh_tw: g,
            pl: JSON.parse('{"tooltips":{"placeMarker":"Kliknij, aby ustawi?? znacznik","firstVertex":"Kliknij, aby ustawi?? pierwszy punkt","continueLine":"Kliknij, aby kontynuowa?? rysowanie","finishLine":"Kliknij dowolny punkt, aby zako??czy??","finishPoly":"Kliknij pierwszy punkt, aby zako??czy??","finishRect":"Kliknij, aby zako??czy??","startCircle":"Kliknij, aby ustawi?? ??rodek ko??a","finishCircle":"Kliknij, aby zako??czy?? rysowanie ko??a","placeCircleMarker":"Kliknij, aby ustawi?? okr??g??y znacznik"},"actions":{"finish":"Zako??cz","cancel":"Anuluj","removeLastVertex":"Usu?? ostatni punkt"},"buttonTitles":{"drawMarkerButton":"Narysuj znacznik","drawPolyButton":"Narysuj wielok??t","drawLineButton":"Narysuj ??cie??k??","drawCircleButton":"Narysuj ko??o","drawRectButton":"Narysuj prostok??t","editButton":"Edytuj","dragButton":"Przesu??","cutButton":"Wytnij","deleteButton":"Usu??","drawCircleMarkerButton":"Narysuj okr??g??y znacznik","snappingButton":"Snap przeci??gni??ty marker na inne warstwy i wierzcho??ki","pinningButton":"Sworze?? wsp??lne wierzcho??ki razem"}}'),
            sv: JSON.parse('{"tooltips":{"placeMarker":"Klicka f??r att placera mark??r","firstVertex":"Klicka f??r att placera f??rsta h??rnet","continueLine":"Klicka f??r att forts??tta rita","finishLine":"Klicka p?? en existerande punkt f??r att slutf??ra","finishPoly":"Klicka p?? den f??rsta punkten f??r att slutf??ra","finishRect":"Klicka f??r att slutf??ra","startCircle":"Klicka f??r att placera cirkelns centrum","finishCircle":"Klicka f??r att slutf??ra cirkeln","placeCircleMarker":"Klicka f??r att placera cirkelmark??r"},"actions":{"finish":"Slutf??r","cancel":"Avbryt","removeLastVertex":"Ta bort sista h??rnet"},"buttonTitles":{"drawMarkerButton":"Rita Mark??r","drawPolyButton":"Rita Polygoner","drawLineButton":"Rita Linje","drawCircleButton":"Rita Cirkel","drawRectButton":"Rita Rektangel","editButton":"Redigera Lager","dragButton":"Dra Lager","cutButton":"Klipp i Lager","deleteButton":"Ta bort Lager","drawCircleMarkerButton":"Rita Cirkelmark??r","snappingButton":"Sn??pp dra mark??ren till andra lager och h??rn","pinningButton":"F??st delade h??rn tillsammans"}}'),
            el: JSON.parse('{"tooltips":{"placeMarker":"?????????? ???????? ?????? ???? ???????????????????????? ????????????","firstVertex":"?????????? ???????? ?????? ???? ???????????????????????? ???? ?????????? ????????????","continueLine":"?????????? ???????? ?????? ???? ???????????????????? ???? ????????????????????","finishLine":"?????????? ???????? ???? ???????????????????????? ?????????????? ???????????? ?????? ???? ??????????????????????","finishPoly":"?????????? ???????? ?????? ?????????? ???????????? ?????? ???? ????????????????????","finishRect":"?????????? ???????? ?????? ???? ????????????????????","startCircle":"?????????? ???????? ?????? ???? ???????????????????????? ???????????? ????????????","finishCircle":"?????????? ???????? ?????? ???? ???????????????????????? ?????? ??????????","placeCircleMarker":"?????????? ???????? ?????? ???? ???????????????????????? ?????????????? ????????????"},"actions":{"finish":"??????????","cancel":"??????????????","removeLastVertex":"?????????????????? ???????????????????? ??????????????"},"buttonTitles":{"drawMarkerButton":"???????????????? ????????????","drawPolyButton":"???????????????? ??????????????????","drawLineButton":"???????????????? ??????????????","drawCircleButton":"???????????????? ????????????","drawRectButton":"???????????????? ????????????????????","editButton":"?????????????????????? ????????????????","dragButton":"???????????????? ????????????????","cutButton":"?????????????? ????????????????","deleteButton":"?????????????????? ????????????????","drawCircleMarkerButton":"???????????????? ???????????????? ????????????","snappingButton":"?????????????????????? ?????? ???????????? ?????????????????? ???? ???????? ?????????????? ?????? ??????????????","pinningButton":"???????????????? ???????????? ?????????????? ????????"}}'),
            hu: JSON.parse('{"tooltips":{"placeMarker":"Kattintson a jel??l?? elhelyez??s??hez","firstVertex":"Kattintson az els?? pont elhelyez??s??hez","continueLine":"Kattintson a k??vetkez?? pont elhelyez??s??hez","finishLine":"A befejez??shez kattintson egy megl??v?? pontra","finishPoly":"A befejez??shez kattintson az els?? pontra","finishRect":"Kattintson a befejez??shez","startCircle":"Kattintson a k??r k??z??ppontj??nak elhelyez??s??hez","finishCircle":"Kattintson a k??r befejez??s??hez","placeCircleMarker":"Kattintson a k??rjel??l?? elhelyez??s??hez"},"actions":{"finish":"Befejez??s","cancel":"M??gse","removeLastVertex":"Utols?? pont elt??vol??t??sa"},"buttonTitles":{"drawMarkerButton":"Jel??l?? rajzol??sa","drawPolyButton":"Poligon rajzol??sa","drawLineButton":"Vonal rajzol??sa","drawCircleButton":"K??r rajzol??sa","drawRectButton":"N??gyzet rajzol??sa","editButton":"Elemek szerkeszt??se","dragButton":"Elemek mozgat??sa","cutButton":"Elemek v??g??sa","deleteButton":"Elemek t??rl??se","drawCircleMarkerButton":"K??r jel??l?? rajzol??sa","snappingButton":"Kapcsolja a jel??lt??t m??sik elemhez vagy ponthoz","pinningButton":"K??z??s pontok ??sszek??t??se"}}'),
            da: JSON.parse('{"tooltips":{"placeMarker":"Tryk for at placere en mark??r","firstVertex":"Tryk for at placere det f??rste punkt","continueLine":"Tryk for at forts??tte linjen","finishLine":"Tryk p?? et eksisterende punkt for at afslutte","finishPoly":"Tryk p?? det f??rste punkt for at afslutte","finishRect":"Tryk for at afslutte","startCircle":"Tryk for at placere cirklens center","finishCircle":"Tryk for at afslutte cirklen","placeCircleMarker":"Tryk for at placere en cirkelmark??r"},"actions":{"finish":"Afslut","cancel":"Afbryd","removeLastVertex":"Fjern sidste punkt"},"buttonTitles":{"drawMarkerButton":"Placer mark??r","drawPolyButton":"Tegn polygon","drawLineButton":"Tegn linje","drawCircleButton":"Tegn cirkel","drawRectButton":"Tegn firkant","editButton":"Rediger","dragButton":"Tr??k","cutButton":"Klip","deleteButton":"Fjern","drawCircleMarkerButton":"Tegn cirkelmark??r","snappingButton":"Fastg??r trukket mark??r til andre elementer","pinningButton":"Sammenl??g delte elementer"}}'),
            no: JSON.parse('{"tooltips":{"placeMarker":"Klikk for ?? plassere punkt","firstVertex":"Klikk for ?? plassere f??rste punkt","continueLine":"Klikk for ?? tegne videre","finishLine":"Klikk p?? et eksisterende punkt for ?? fullf??re","finishPoly":"Klikk f??rste punkt for ?? fullf??re","finishRect":"Klikk for ?? fullf??re","startCircle":"Klikk for ?? sette sirkel midtpunkt","finishCircle":"Klikk for ?? fullf??re sirkel","placeCircleMarker":"Klikk for ?? plassere sirkel"},"actions":{"finish":"Fullf??r","cancel":"Kanseller","removeLastVertex":"Fjern forrige punkt"},"buttonTitles":{"drawMarkerButton":"Tegn Punkt","drawPolyButton":"Tegn Flate","drawLineButton":"Tegn Linje","drawCircleButton":"Tegn Sirkel","drawRectButton":"Tegn rektangel","editButton":"Rediger Objekter","dragButton":"Dra Objekter","cutButton":"Kutt Objekter","deleteButton":"Fjern Objekter","drawCircleMarkerButton":"Tegn sirkel-punkt","snappingButton":"Fest dratt punkt til andre objekter og punkt","pinningButton":"Pin delte punkt sammen"}}'),
            fa: JSON.parse('{"tooltips":{"placeMarker":"???????? ???????? ?????????????? ????????","firstVertex":"???????? ???????? ?????? ?????????? ??????","continueLine":"???????? ???????? ?????????? ??????","finishLine":"???????? ?????? ???? ???????? ?????????? ???????? ??????????","finishPoly":"???????? ?????? ?????????? ???????? ???????? ??????????","finishRect":"???????? ???????? ??????????","startCircle":"???????? ???????? ?????? ???????? ??????????","finishCircle":"???????? ???????? ?????????? ?????? ??????????","placeCircleMarker":"???????? ???????? ?????? ???????? ??????????"},"actions":{"finish":"??????????","cancel":"??????","removeLastVertex":"?????? ?????????? ??????"},"buttonTitles":{"drawMarkerButton":"?????? ????????","drawPolyButton":"?????? ??????????????","drawLineButton":"?????? ????","drawCircleButton":"?????? ??????????","drawRectButton":"?????? ????????????????","editButton":"???????????? ???????????????","dragButton":"?????????????? ???????????????","cutButton":"?????? ???????????????","deleteButton":"?????? ???????????????","drawCircleMarkerButton":"?????? ???????? ??????????","snappingButton":"???????????? ???? ???? ??????????????? ?? ???????? ???????? ??????????","pinningButton":"???????? ?????????? ???? ???? ???? ?????? ????????","rotateButton":"???????? ????????"}}'),
            ua: JSON.parse('{"tooltips":{"placeMarker":"??????????????????, ?????? ?????????????? ????????????","firstVertex":"??????????????????, ?????? ?????????????? ?????????? ??????????????","continueLine":"??????????????????, ?????? ???????????????????? ????????????????","finishLine":"?????????????????? ????????-???????? ???????????????? ???????????? ?????? ????????????????????","finishPoly":"???????????????? ???????????? ????????????, ?????? ??????????????????","finishRect":"??????????????????, ?????? ??????????????????","startCircle":"??????????????????, ?????? ???????????? ?????????? ????????","finishCircle":"??????????????????, ?????? ?????????????????? ????????","placeCircleMarker":"??????????????????, ?????? ?????????????? ???????????????? ????????????"},"actions":{"finish":"??????????????????","cancel":"??????????????????","removeLastVertex":"???????????????? ?????????????????? ??????????????"},"buttonTitles":{"drawMarkerButton":"???????????????? ????????????","drawPolyButton":"???????????????? ??????????????","drawLineButton":"???????????????? ??????????","drawCircleButton":"???????????????? ????????","drawRectButton":"???????????????? ??????????????????????","editButton":"???????????????????? ????????","dragButton":"?????????????????? ????????","cutButton":"???????????????? ????????","deleteButton":"???????????????? ????????","drawCircleMarkerButton":"???????????????? ???????????????? ????????????","snappingButton":"????????????????????? ???????????????????????? ???????????? ???? ?????????? ?????????? ???? ????????????","pinningButton":"????\'?????????? ?????????????? ?????????????? ??????????"}}'),
            tr: JSON.parse('{"tooltips":{"placeMarker":"????aret??i yerle??tirmek i??in t??klay??n","firstVertex":"??lk tepe noktas??n?? yerle??tirmek i??in t??klay??n","continueLine":"??izime devam etmek i??in t??klay??n","finishLine":"Bitirmek i??in mevcut herhangi bir i??aret??iyi t??klay??n","finishPoly":"Bitirmek i??in ilk i??aret??iyi t??klay??n","finishRect":"Bitirmek i??in t??klay??n","startCircle":"Daire merkezine yerle??tirmek i??in t??klay??n","finishCircle":"Daireyi bitirmek i??in t??klay??n","placeCircleMarker":"Daire i??aret??isi yerle??tirmek i??in t??klay??n"},"actions":{"finish":"Bitir","cancel":"??ptal","removeLastVertex":"Son k????eyi kald??r"},"buttonTitles":{"drawMarkerButton":"??izim ????aret??isi","drawPolyButton":"??okgenler ??iz","drawLineButton":"??oklu ??izgi ??iz","drawCircleButton":"??ember ??iz","drawRectButton":"Dikd??rtgen ??iz","editButton":"Katmanlar?? d??zenle","dragButton":"Katmanlar?? s??r??kle","cutButton":"Katmanlar?? kes","deleteButton":"Katmanlar?? kald??r","drawCircleMarkerButton":"Daire i??aret??isi ??iz","snappingButton":"S??r??klenen i??aret??iyi di??er katmanlara ve k????elere yap????t??r","pinningButton":"Payla????lan k????eleri birbirine sabitle"}}'),
            cz: JSON.parse('{"tooltips":{"placeMarker":"Kliknut??m vytvo????te zna??ku","firstVertex":"Kliknut??m vytvo????te prvn?? objekt","continueLine":"Kliknut??m pokra??ujte v kreslen??","finishLine":"Kliknut?? na libovolnou existuj??c?? zna??ku pro dokon??en??","finishPoly":"Vyberte prvn?? bod pro dokon??en??","finishRect":"Klikn??te pro dokon??en??","startCircle":"Kliknut??m p??idejte st??ed kruhu","finishCircle":"??????????????, ?????????? ???????????? ????????????","placeCircleMarker":"Kliknut??m nastavte polom??r"},"actions":{"finish":"Dokon??it","cancel":"Zru??it","removeLastVertex":"Zru??it posledn?? akci"},"buttonTitles":{"drawMarkerButton":"P??idat zna??ku","drawPolyButton":"Nakreslit polygon","drawLineButton":"Nakreslit k??ivku","drawCircleButton":"Nakreslit kruh","drawRectButton":"Nakreslit obd??ln??k","editButton":"Upravit vrstvu","dragButton":"P??eneste vrstvu","cutButton":"Vyjmout vrstvu","deleteButton":"Smazat vrstvu","drawCircleMarkerButton":"P??idat kruhovou zna??ku","snappingButton":"Nav??zat ta??nou zna??ku k dal????m vrstv??m a vrchol??m","pinningButton":"Spojit spole??n?? body dohromady"}}')
          };
        function m(t, e) {
          var i = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e && (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })), i.push.apply(i, n);
          }
          return i;
        }
        function y(t) {
          for (var e = 1; e < arguments.length; e++) {
            var i = null != arguments[e] ? arguments[e] : {};
            e % 2 ? m(Object(i), !0).forEach(function (e) {
              v(t, e, i[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : m(Object(i)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
            });
          }
          return t;
        }
        function v(t, e, i) {
          return e in t ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[e] = i, t;
        }
        const b = {
          _globalEditModeEnabled: !1,
          enableGlobalEditMode: function (t) {
            this._globalEditModeEnabled = !0, this.Toolbar.toggleButton("editMode", this.globalEditModeEnabled()), L.PM.Utils.findLayers(this.map).forEach(function (e) {
              e.pm.enable(t);
            }), this.throttledReInitEdit || (this.throttledReInitEdit = L.Util.throttle(this.handleLayerAdditionInGlobalEditMode, 100, this)), this._addedLayers = {}, this.map.on("layeradd", this._layerAdded, this), this.map.on("layeradd", this.throttledReInitEdit, this), this._fireGlobalEditModeToggled(!0);
          },
          disableGlobalEditMode: function () {
            this._globalEditModeEnabled = !1, L.PM.Utils.findLayers(this.map).forEach(function (t) {
              t.pm.disable();
            }), this.map.off("layeradd", this.throttledReInitEdit, this), this.Toolbar.toggleButton("editMode", this.globalEditModeEnabled()), this._fireGlobalEditModeToggled(!1);
          },
          globalEditEnabled: function () {
            return this.globalEditModeEnabled();
          },
          globalEditModeEnabled: function () {
            return this._globalEditModeEnabled;
          },
          toggleGlobalEditMode: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.globalOptions;
            this.globalEditModeEnabled() ? this.disableGlobalEditMode() : this.enableGlobalEditMode(t);
          },
          handleLayerAdditionInGlobalEditMode: function () {
            var t = this._addedLayers;
            for (var e in this._addedLayers = {}, t) {
              var i = t[e];
              this._isRelevantForEdit(i) && this.globalEditModeEnabled() && i.pm.enable(y({}, this.globalOptions));
            }
          },
          _layerAdded: function (t) {
            var e = t.layer;
            this._addedLayers[L.stamp(e)] = e;
          },
          _isRelevantForEdit: function (t) {
            return t.pm && !(t instanceof L.LayerGroup) && (!L.PM.optIn && !t.options.pmIgnore || L.PM.optIn && !1 === t.options.pmIgnore) && !t._pmTempLayer && t.pm.options.allowEditing;
          }
        };
        const k = {
          _globalDragModeEnabled: !1,
          enableGlobalDragMode: function () {
            var t = L.PM.Utils.findLayers(this.map);
            this._globalDragModeEnabled = !0, this._addedLayersDrag = {}, t.forEach(function (t) {
              t.pm.enableLayerDrag();
            }), this.throttledReInitDrag || (this.throttledReInitDrag = L.Util.throttle(this.reinitGlobalDragMode, 100, this)), this.map.on("layeradd", this.throttledReInitDrag, this), this.map.on("layeradd", this._layerAddedDrag, this), this.Toolbar.toggleButton("dragMode", this.globalDragModeEnabled()), this._fireGlobalDragModeToggled(!0);
          },
          disableGlobalDragMode: function () {
            var t = L.PM.Utils.findLayers(this.map);
            this._globalDragModeEnabled = !1, t.forEach(function (t) {
              t.pm.disableLayerDrag();
            }), this.map.off("layeradd", this.throttledReInitDrag, this), this.Toolbar.toggleButton("dragMode", this.globalDragModeEnabled()), this._fireGlobalDragModeToggled(!1);
          },
          globalDragModeEnabled: function () {
            return !!this._globalDragModeEnabled;
          },
          toggleGlobalDragMode: function () {
            this.globalDragModeEnabled() ? this.disableGlobalDragMode() : this.enableGlobalDragMode();
          },
          reinitGlobalDragMode: function () {
            var t = this._addedLayersDrag;
            for (var e in this._addedLayersDrag = {}, t) {
              var i = t[e];
              this._isRelevantForDrag(i) && this.globalDragModeEnabled() && i.pm.enableLayerDrag();
            }
          },
          _layerAddedDrag: function (t) {
            var e = t.layer;
            this._addedLayersDrag[L.stamp(e)] = e;
          },
          _isRelevantForDrag: function (t) {
            return t.pm && !(t instanceof L.LayerGroup) && (!L.PM.optIn && !t.options.pmIgnore || L.PM.optIn && !1 === t.options.pmIgnore) && !t._pmTempLayer && t.pm.options.draggable;
          }
        };
        const M = {
          _globalRemovalModeEnabled: !1,
          enableGlobalRemovalMode: function () {
            var t = this;
            this._globalRemovalModeEnabled = !0, this.map.eachLayer(function (e) {
              t._isRelevantForRemoval(e) && (e.pm.disable(), e.on("click", t.removeLayer, t));
            }), this.throttledReInitRemoval || (this.throttledReInitRemoval = L.Util.throttle(this.reinitGlobalRemovalMode, 100, this)), this.map.on("layeradd", this.throttledReInitRemoval, this), this.Toolbar.toggleButton("removalMode", this.globalRemovalModeEnabled()), this._fireGlobalRemovalModeToggled(!0);
          },
          disableGlobalRemovalMode: function () {
            var t = this;
            this._globalRemovalModeEnabled = !1, this.map.eachLayer(function (e) {
              e.off("click", t.removeLayer, t);
            }), this.map.off("layeradd", this.throttledReInitRemoval, this), this.Toolbar.toggleButton("removalMode", this.globalRemovalModeEnabled()), this._fireGlobalRemovalModeToggled(!1);
          },
          globalRemovalEnabled: function () {
            return this.globalRemovalModeEnabled();
          },
          globalRemovalModeEnabled: function () {
            return !!this._globalRemovalModeEnabled;
          },
          toggleGlobalRemovalMode: function () {
            this.globalRemovalModeEnabled() ? this.disableGlobalRemovalMode() : this.enableGlobalRemovalMode();
          },
          reinitGlobalRemovalMode: function (t) {
            var e = t.layer;
            this._isRelevantForRemoval(e) && this.globalRemovalModeEnabled() && (this.disableGlobalRemovalMode(), this.enableGlobalRemovalMode());
          },
          removeLayer: function (t) {
            var e = t.target;
            this._isRelevantForRemoval(e) && !e.pm.dragging() && (e.removeFrom(this.map.pm._getContainingLayer()), e.remove(), e instanceof L.LayerGroup ? (this._fireRemoveLayerGroup(e), this._fireRemoveLayerGroup(this.map, e)) : (e.pm._fireRemove(e), e.pm._fireRemove(this.map, e)));
          },
          _isRelevantForRemoval: function (t) {
            return t.pm && !(t instanceof L.LayerGroup) && (!L.PM.optIn && !t.options.pmIgnore || L.PM.optIn && !1 === t.options.pmIgnore) && !t._pmTempLayer && t.pm.options.allowRemoval;
          }
        };
        const x = {
          _globalRotateModeEnabled: !1,
          enableGlobalRotateMode: function () {
            var t = this;
            this._globalRotateModeEnabled = !0, L.PM.Utils.findLayers(this.map).filter(function (t) {
              return t instanceof L.Polyline;
            }).forEach(function (e) {
              t._isRelevantForRotate(e) && e.pm.enableRotate();
            }), this.throttledReInitRotate || (this.throttledReInitRotate = L.Util.throttle(this._reinitGlobalRotateMode, 100, this)), this.map.on("layeradd", this.throttledReInitRotate, this), this.Toolbar.toggleButton("rotateMode", this.globalRotateModeEnabled()), this._fireGlobalRotateModeToggled();
          },
          disableGlobalRotateMode: function () {
            this._globalRotateModeEnabled = !1, L.PM.Utils.findLayers(this.map).filter(function (t) {
              return t instanceof L.Polyline;
            }).forEach(function (t) {
              t.pm.disableRotate();
            }), this.map.off("layeradd", this.throttledReInitRotate, this), this.Toolbar.toggleButton("rotateMode", this.globalRotateModeEnabled()), this._fireGlobalRotateModeToggled();
          },
          globalRotateModeEnabled: function () {
            return !!this._globalRotateModeEnabled;
          },
          toggleGlobalRotateMode: function () {
            this.globalRotateModeEnabled() ? this.disableGlobalRotateMode() : this.enableGlobalRotateMode();
          },
          _reinitGlobalRotateMode: function (t) {
            var e = t.layer;
            this._isRelevantForRotate(e) && this.globalRotateModeEnabled() && (this.disableGlobalRotateMode(), this.enableGlobalRotateMode());
          },
          _isRelevantForRotate: function (t) {
            return t.pm && !(t instanceof L.LayerGroup) && (!L.PM.optIn && !t.options.pmIgnore || L.PM.optIn && !1 === t.options.pmIgnore) && !t._pmTempLayer && t.pm.options.allowRotation;
          }
        };
        function w(t, e) {
          var i = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e && (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })), i.push.apply(i, n);
          }
          return i;
        }
        function C(t) {
          for (var e = 1; e < arguments.length; e++) {
            var i = null != arguments[e] ? arguments[e] : {};
            e % 2 ? w(Object(i), !0).forEach(function (e) {
              P(t, e, i[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : w(Object(i)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
            });
          }
          return t;
        }
        function P(t, e, i) {
          return e in t ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[e] = i, t;
        }
        var E = {
          _fireDrawStart: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Draw",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._map, "pm:drawstart", {
              shape: this._shape,
              workingLayer: this._layer
            }, t, e);
          },
          _fireDrawEnd: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Draw",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._map, "pm:drawend", {
              shape: this._shape
            }, t, e);
          },
          _fireCreate: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Draw",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this._map, "pm:create", {
              shape: this._shape,
              marker: t,
              layer: t
            }, e, i);
          },
          _fireCenterPlaced: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Draw",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
              i = "Draw" === t ? this._layer : undefined,
              n = "Draw" !== t ? this._layer : undefined;
            this.__fire(this._layer, "pm:centerplaced", {
              shape: this._shape,
              workingLayer: i,
              layer: n,
              latlng: this._layer.getLatLng()
            }, t, e);
          },
          _fireCut: function (t, e, i) {
            var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Draw",
              r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            this.__fire(t, "pm:cut", {
              shape: this._shape,
              layer: e,
              originalLayer: i
            }, n, r);
          },
          _fireEdit: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._layer,
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Edit",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(t, "pm:edit", {
              layer: this._layer,
              shape: this.getShape()
            }, e, i);
          },
          _fireEnable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Edit",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._layer, "pm:enable", {
              layer: this._layer,
              shape: this.getShape()
            }, t, e);
          },
          _fireDisable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Edit",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._layer, "pm:disable", {
              layer: this._layer,
              shape: this.getShape()
            }, t, e);
          },
          _fireUpdate: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Edit",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._layer, "pm:update", {
              layer: this._layer,
              shape: this.getShape()
            }, t, e);
          },
          _fireMarkerDragStart: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined,
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Edit",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(this._layer, "pm:markerdragstart", {
              layer: this._layer,
              markerEvent: t,
              shape: this.getShape(),
              indexPath: e
            }, i, n);
          },
          _fireMarkerDrag: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined,
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Edit",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(this._layer, "pm:markerdrag", {
              layer: this._layer,
              markerEvent: t,
              shape: this.getShape(),
              indexPath: e
            }, i, n);
          },
          _fireMarkerDragEnd: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined,
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined,
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Edit",
              r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            this.__fire(this._layer, "pm:markerdragend", {
              layer: this._layer,
              markerEvent: t,
              shape: this.getShape(),
              indexPath: e,
              intersectionReset: i
            }, n, r);
          },
          _fireDragStart: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Edit",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._layer, "pm:dragstart", {
              layer: this._layer,
              shape: this.getShape()
            }, t, e);
          },
          _fireDrag: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Edit",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this._layer, "pm:drag", C(C({}, t), {}, {
              shape: this.getShape()
            }), e, i);
          },
          _fireDragEnd: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Edit",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._layer, "pm:dragend", {
              layer: this._layer,
              shape: this.getShape()
            }, t, e);
          },
          _fireDragEnable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Edit",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._layer, "pm:dragenable", {
              layer: this._layer,
              shape: this.getShape()
            }, t, e);
          },
          _fireDragDisable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Edit",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._layer, "pm:dragdisable", {
              layer: this._layer,
              shape: this.getShape()
            }, t, e);
          },
          _fireRemove: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : t,
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Edit",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(t, "pm:remove", {
              layer: e,
              shape: this.getShape()
            }, i, n);
          },
          _fireVertexAdded: function (t, e, i) {
            var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Edit",
              r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            this.__fire(this._layer, "pm:vertexadded", {
              layer: this._layer,
              workingLayer: this._layer,
              marker: t,
              indexPath: e,
              latlng: i,
              shape: this.getShape()
            }, n, r);
          },
          _fireVertexRemoved: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Edit",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(this._layer, "pm:vertexremoved", {
              layer: this._layer,
              marker: t,
              indexPath: e,
              shape: this.getShape()
            }, i, n);
          },
          _fireVertexClick: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Edit",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(this._layer, "pm:vertexclick", {
              layer: this._layer,
              markerEvent: t,
              indexPath: e,
              shape: this.getShape()
            }, i, n);
          },
          _fireIntersect: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Edit",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this._layer, "pm:intersect", {
              layer: this._layer,
              intersection: t,
              shape: this.getShape()
            }, e, i);
          },
          _fireLayerReset: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Edit",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(this._layer, "pm:layerreset", {
              layer: this._layer,
              markerEvent: t,
              indexPath: e,
              shape: this.getShape()
            }, i, n);
          },
          _fireChange: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Edit",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this._layer, "pm:change", {
              layer: this._layer,
              latlngs: t,
              shape: this.getShape()
            }, e, i);
          },
          _fireTextChange: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Edit",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this._layer, "pm:textchange", {
              layer: this._layer,
              text: t,
              shape: this.getShape()
            }, e, i);
          },
          _fireSnapDrag: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Snapping",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(t, "pm:snapdrag", e, i, n);
          },
          _fireSnap: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Snapping",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(t, "pm:snap", e, i, n);
          },
          _fireUnsnap: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Snapping",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(t, "pm:unsnap", e, i, n);
          },
          _fireRotationEnable: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Rotation",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(t, "pm:rotateenable", {
              layer: this._layer,
              helpLayer: this._rotatePoly,
              shape: this.getShape()
            }, i, n);
          },
          _fireRotationDisable: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Rotation",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(t, "pm:rotatedisable", {
              layer: this._layer,
              shape: this.getShape()
            }, e, i);
          },
          _fireRotationStart: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Rotation",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(t, "pm:rotatestart", {
              layer: this._rotationLayer,
              helpLayer: this._layer,
              startAngle: this._startAngle,
              originLatLngs: e
            }, i, n);
          },
          _fireRotation: function (t, e, i) {
            var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this._rotationLayer,
              r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "Rotation",
              a = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
            this.__fire(t, "pm:rotate", {
              layer: n,
              helpLayer: this._layer,
              startAngle: this._startAngle,
              angle: n.pm.getAngle(),
              angleDiff: e,
              oldLatLngs: i,
              newLatLngs: n.getLatLngs()
            }, r, a);
          },
          _fireRotationEnd: function (t, e, i) {
            var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Rotation",
              r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            this.__fire(t, "pm:rotateend", {
              layer: this._rotationLayer,
              helpLayer: this._layer,
              startAngle: e,
              angle: this._rotationLayer.pm.getAngle(),
              originLatLngs: i,
              newLatLngs: this._rotationLayer.getLatLngs()
            }, n, r);
          },
          _fireActionClick: function (t, e, i) {
            var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Toolbar",
              r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            this.__fire(this._map, "pm:actionclick", {
              text: t.text,
              action: t,
              btnName: e,
              button: i
            }, n, r);
          },
          _fireButtonClick: function (t, e) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Toolbar",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(this._map, "pm:buttonclick", {
              btnName: t,
              button: e
            }, i, n);
          },
          _fireLangChange: function (t, e, i, n) {
            var r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "Global",
              a = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
            this.__fire(this.map, "pm:langchange", {
              oldLang: t,
              activeLang: e,
              fallback: i,
              translations: n
            }, r, a);
          },
          _fireGlobalDragModeToggled: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Global",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this.map, "pm:globaldragmodetoggled", {
              enabled: t,
              map: this.map
            }, e, i);
          },
          _fireGlobalEditModeToggled: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Global",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this.map, "pm:globaleditmodetoggled", {
              enabled: t,
              map: this.map
            }, e, i);
          },
          _fireGlobalRemovalModeToggled: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Global",
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            this.__fire(this.map, "pm:globalremovalmodetoggled", {
              enabled: t,
              map: this.map
            }, e, i);
          },
          _fireGlobalCutModeToggled: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Global",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._map, "pm:globalcutmodetoggled", {
              enabled: !!this._enabled,
              map: this._map
            }, t, e);
          },
          _fireGlobalDrawModeToggled: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Global",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this._map, "pm:globaldrawmodetoggled", {
              enabled: this._enabled,
              shape: this._shape,
              map: this._map
            }, t, e);
          },
          _fireGlobalRotateModeToggled: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Global",
              e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.__fire(this.map, "pm:globalrotatemodetoggled", {
              enabled: this.globalRotateModeEnabled(),
              map: this.map
            }, t, e);
          },
          _fireRemoveLayerGroup: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : t,
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Edit",
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            this.__fire(t, "pm:remove", {
              layer: e,
              shape: undefined
            }, i, n);
          },
          _fireKeyeventEvent: function (t, e, i) {
            var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Global",
              r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            this.__fire(this.map, "pm:keyevent", {
              event: t,
              eventType: e,
              focusOn: i
            }, n, r);
          },
          __fire: function (t, e, i, n) {
            var a = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            i = r()(i, a, {
              source: n
            }), L.PM.Utils._fireEvent(t, e, i);
          }
        };
        const S = E;
        const O = {
          _lastEvents: {
            keydown: undefined,
            keyup: undefined,
            current: undefined
          },
          _initKeyListener: function (t) {
            this.map = t, L.DomEvent.on(document, "keydown keyup", this._onKeyListener, this), L.DomEvent.on(window, "blur", this._onBlur, this);
          },
          _onKeyListener: function (t) {
            var e = "document";
            this.map.getContainer().contains(t.target) && (e = "map");
            var i = {
              event: t,
              eventType: t.type,
              focusOn: e
            };
            this._lastEvents[t.type] = i, this._lastEvents.current = i, this.map.pm._fireKeyeventEvent(t, t.type, e);
          },
          _onBlur: function (t) {
            t.altKey = !1;
            var e = {
              event: t,
              eventType: t.type,
              focusOn: "document"
            };
            this._lastEvents[t.type] = e, this._lastEvents.current = e;
          },
          getLastKeyEvent: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "current";
            return this._lastEvents[t];
          },
          isShiftKeyPressed: function () {
            var t;
            return null === (t = this._lastEvents.current) || void 0 === t ? void 0 : t.event.shiftKey;
          },
          isAltKeyPressed: function () {
            var t;
            return null === (t = this._lastEvents.current) || void 0 === t ? void 0 : t.event.altKey;
          },
          isCtrlKeyPressed: function () {
            var t;
            return null === (t = this._lastEvents.current) || void 0 === t ? void 0 : t.event.ctrlKey;
          },
          isMetaKeyPressed: function () {
            var t;
            return null === (t = this._lastEvents.current) || void 0 === t ? void 0 : t.event.metaKey;
          },
          getPressedKey: function () {
            var t;
            return null === (t = this._lastEvents.current) || void 0 === t ? void 0 : t.event.key;
          }
        };
        var D = i(7361),
          R = i.n(D),
          B = i(8721),
          T = i.n(B);
        function I(t) {
          var e = L.PM.activeLang;
          return T()(_, e) || (e = "en"), R()(_[e], t);
        }
        function j(t) {
          return !function e(t) {
            return t.filter(function (t) {
              return ![null, "", undefined].includes(t);
            }).reduce(function (t, i) {
              return t.concat(Array.isArray(i) ? e(i) : i);
            }, []);
          }(t).length;
        }
        function A(t) {
          return t.reduce(function (t, e) {
            return 0 !== e.length && t.push(Array.isArray(e) ? A(e) : e), t;
          }, []);
        }
        function G(t, e, i) {
          for (var n, r, a, o = 6378137, s = 6356752.3142, l = 1 / 298.257223563, h = t.lng, u = t.lat, c = i, p = Math.PI, d = e * p / 180, f = Math.sin(d), g = Math.cos(d), _ = (1 - l) * Math.tan(u * p / 180), m = 1 / Math.sqrt(1 + _ * _), y = _ * m, v = Math.atan2(_, g), b = m * f, k = 1 - b * b, M = k * (o * o - s * s) / (s * s), x = 1 + M / 16384 * (4096 + M * (M * (320 - 175 * M) - 768)), w = M / 1024 * (256 + M * (M * (74 - 47 * M) - 128)), C = c / (s * x), P = 2 * Math.PI; Math.abs(C - P) > 1e-12;) {
            n = Math.cos(2 * v + C), P = C, C = c / (s * x) + w * (r = Math.sin(C)) * (n + w / 4 * ((a = Math.cos(C)) * (2 * n * n - 1) - w / 6 * n * (4 * r * r - 3) * (4 * n * n - 3)));
          }
          var E = y * r - m * a * g,
            S = Math.atan2(y * a + m * r * g, (1 - l) * Math.sqrt(b * b + E * E)),
            O = l / 16 * k * (4 + l * (4 - 3 * k)),
            D = h + 180 * (Math.atan2(r * f, m * a - y * r * g) - (1 - O) * l * b * (C + O * r * (n + O * a * (2 * n * n - 1)))) / p,
            R = 180 * S / p;
          return L.latLng(D, R);
        }
        function N(t, e, i, n) {
          for (var r, a, o = !(arguments.length > 4 && arguments[4] !== undefined) || arguments[4], s = [], l = 0; l < i; l += 1) {
            if (o) r = G(t, 360 * l / i + n, e), a = L.latLng(r.lng, r.lat);else {
              var h = t.lat + Math.cos(2 * l * Math.PI / i) * e,
                u = t.lng + Math.sin(2 * l * Math.PI / i) * e;
              a = L.latLng(h, u);
            }
            s.push(a);
          }
          return s;
        }
        function z(t, e, i, n) {
          var r = function (t, e, i) {
            var n = t.latLngToContainerPoint(e),
              r = t.latLngToContainerPoint(i),
              a = 180 * Math.atan2(r.y - n.y, r.x - n.x) / Math.PI + 90;
            return a + (a < 0 ? 360 : 0);
          }(t, e, i);
          return function (t, e, i) {
            e = (e + 360) % 360;
            var n = Math.PI / 180,
              r = 180 / Math.PI,
              a = 6378137,
              o = t.lng * n,
              s = t.lat * n,
              l = e * n,
              h = Math.sin(s),
              u = Math.cos(s),
              c = Math.cos(i / a),
              p = Math.sin(i / a),
              d = Math.asin(h * c + u * p * Math.cos(l)),
              f = o + Math.atan2(Math.sin(l) * p * u, c - h * Math.sin(d));
            return f = (f *= r) > 180 ? f - 360 : f < -180 ? f + 360 : f, L.latLng([d * r, f]);
          }(e, r, n);
        }
        function U(t) {
          var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : t.getLatLngs();
          return t instanceof L.Polygon ? L.polygon(e).getLatLngs() : L.polyline(e).getLatLngs();
        }
        function F(t, e) {
          var i, n;
          if (null !== (i = e.options.crs) && void 0 !== i && null !== (n = i.projection) && void 0 !== n && n.MAX_LATITUDE) {
            var r,
              a,
              o = null === (r = e.options.crs) || void 0 === r || null === (a = r.projection) || void 0 === a ? void 0 : a.MAX_LATITUDE;
            t.lat = Math.max(Math.min(o, t.lat), -o);
          }
          return t;
        }
        function V(t) {
          return t.options.renderer || t._map && (t._map._getPaneRenderer(t.options.pane) || t._map.options.renderer || t._map._renderer) || t._renderer;
        }
        const K = L.Class.extend({
          includes: [b, k, M, x, S],
          initialize: function (t) {
            this.map = t, this.Draw = new L.PM.Draw(t), this.Toolbar = new L.PM.Toolbar(t), this.Keyboard = O, this.globalOptions = {
              snappable: !0,
              layerGroup: undefined,
              snappingOrder: ["Marker", "CircleMarker", "Circle", "Line", "Polygon", "Rectangle"],
              panes: {
                vertexPane: "markerPane",
                layerPane: "overlayPane",
                markerPane: "markerPane"
              },
              draggable: !0
            }, this.Keyboard._initKeyListener(t);
          },
          setLang: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en",
              e = arguments.length > 1 ? arguments[1] : undefined,
              i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "en",
              n = L.PM.activeLang;
            e && (_[t] = r()(_[i], e)), L.PM.activeLang = t, this.map.pm.Toolbar.reinit(), this._fireLangChange(n, t, i, _[t]);
          },
          addControls: function (t) {
            this.Toolbar.addControls(t);
          },
          removeControls: function () {
            this.Toolbar.removeControls();
          },
          toggleControls: function () {
            this.Toolbar.toggleControls();
          },
          controlsVisible: function () {
            return this.Toolbar.isVisible;
          },
          enableDraw: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Polygon",
              e = arguments.length > 1 ? arguments[1] : undefined;
            "Poly" === t && (t = "Polygon"), this.Draw.enable(t, e);
          },
          disableDraw: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Polygon";
            "Poly" === t && (t = "Polygon"), this.Draw.disable(t);
          },
          setPathOptions: function (t) {
            var e = this,
              i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
              n = i.ignoreShapes || [],
              r = i.merge || !1;
            this.map.pm.Draw.shapes.forEach(function (i) {
              -1 === n.indexOf(i) && e.map.pm.Draw[i].setPathOptions(t, r);
            });
          },
          getGlobalOptions: function () {
            return this.globalOptions;
          },
          setGlobalOptions: function (t) {
            var e = this,
              i = r()(this.globalOptions, t),
              n = !1;
            this.map.pm.Draw.CircleMarker.enabled() && this.map.pm.Draw.CircleMarker.options.editable !== i.editable && (this.map.pm.Draw.CircleMarker.disable(), n = !0), this.map.pm.Draw.shapes.forEach(function (t) {
              e.map.pm.Draw[t].setOptions(i);
            }), n && this.map.pm.Draw.CircleMarker.enable(), L.PM.Utils.findLayers(this.map).forEach(function (t) {
              t.pm.setOptions(i);
            }), this.applyGlobalOptions(), this.globalOptions = i;
          },
          applyGlobalOptions: function () {
            L.PM.Utils.findLayers(this.map).forEach(function (t) {
              t.pm.enabled() && t.pm.applyOptions();
            });
          },
          globalDrawModeEnabled: function () {
            return !!this.Draw.getActiveShape();
          },
          globalCutModeEnabled: function () {
            return !!this.Draw.Cut.enabled();
          },
          enableGlobalCutMode: function (t) {
            return this.Draw.Cut.enable(t);
          },
          toggleGlobalCutMode: function (t) {
            return this.Draw.Cut.toggle(t);
          },
          disableGlobalCutMode: function () {
            return this.Draw.Cut.disable();
          },
          getGeomanLayers: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined && arguments[0],
              e = L.PM.Utils.findLayers(this.map);
            if (!t) return e;
            var i = L.featureGroup();
            return i._pmTempLayer = !0, e.forEach(function (t) {
              i.addLayer(t);
            }), i;
          },
          getGeomanDrawLayers: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined && arguments[0],
              e = L.PM.Utils.findLayers(this.map).filter(function (t) {
                return !0 === t._drawnByGeoman;
              });
            if (!t) return e;
            var i = L.featureGroup();
            return i._pmTempLayer = !0, e.forEach(function (t) {
              i.addLayer(t);
            }), i;
          },
          _getContainingLayer: function () {
            return this.globalOptions.layerGroup && this.globalOptions.layerGroup instanceof L.LayerGroup ? this.globalOptions.layerGroup : this.map;
          },
          _isCRSSimple: function () {
            return this.map.options.crs === L.CRS.Simple;
          },
          _touchEventCounter: 0,
          _addTouchEvents: function (t) {
            0 === this._touchEventCounter && (L.DomEvent.on(t, "touchmove", this._canvasTouchMove, this), L.DomEvent.on(t, "touchstart touchend touchcancel", this._canvasTouchClick, this)), this._touchEventCounter += 1;
          },
          _removeTouchEvents: function (t) {
            1 === this._touchEventCounter && (L.DomEvent.off(t, "touchmove", this._canvasTouchMove, this), L.DomEvent.off(t, "touchstart touchend touchcancel", this._canvasTouchClick, this)), this._touchEventCounter = this._touchEventCounter <= 1 ? 0 : this._touchEventCounter - 1;
          },
          _canvasTouchMove: function (t) {
            V(this.map)._onMouseMove(this._createMouseEvent("mousemove", t));
          },
          _canvasTouchClick: function (t) {
            var e = "";
            "touchstart" === t.type || "pointerdown" === t.type ? e = "mousedown" : "touchend" === t.type || "pointerup" === t.type ? e = "mouseup" : "touchcancel" !== t.type && "pointercancel" !== t.type || (e = "mouseup"), e && V(this.map)._onClick(this._createMouseEvent(e, t));
          },
          _createMouseEvent: function (t, e) {
            var i,
              n = e.touches[0] || e.changedTouches[0];
            try {
              i = new MouseEvent(t, {
                bubbles: e.bubbles,
                cancelable: e.cancelable,
                view: e.view,
                detail: n.detail,
                screenX: n.screenX,
                screenY: n.screenY,
                clientX: n.clientX,
                clientY: n.clientY,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey,
                button: e.button,
                relatedTarget: e.relatedTarget
              });
            } catch (r) {
              (i = document.createEvent("MouseEvents")).initMouseEvent(t, e.bubbles, e.cancelable, e.view, n.detail, n.screenX, n.screenY, n.clientX, n.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
            }
            return i;
          }
        });
        function H(t, e) {
          var i = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e && (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })), i.push.apply(i, n);
          }
          return i;
        }
        function q(t) {
          for (var e = 1; e < arguments.length; e++) {
            var i = null != arguments[e] ? arguments[e] : {};
            e % 2 ? H(Object(i), !0).forEach(function (e) {
              J(t, e, i[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : H(Object(i)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
            });
          }
          return t;
        }
        function J(t, e, i) {
          return e in t ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[e] = i, t;
        }
        const Y = L.Control.extend({
          includes: [S],
          options: {
            position: "topleft"
          },
          initialize: function (t) {
            this._button = q(q({}, this.options), t);
          },
          onAdd: function (t) {
            return this._map = t, this._map.pm.Toolbar.options.oneBlock ? this._container = this._map.pm.Toolbar._createContainer(this.options.position) : "edit" === this._button.tool ? this._container = this._map.pm.Toolbar.editContainer : "options" === this._button.tool ? this._container = this._map.pm.Toolbar.optionsContainer : "custom" === this._button.tool ? this._container = this._map.pm.Toolbar.customContainer : this._container = this._map.pm.Toolbar.drawContainer, this.buttonsDomNode = this._makeButton(this._button), this._container.appendChild(this.buttonsDomNode), this._container;
          },
          onRemove: function () {
            return this.buttonsDomNode.remove(), this._container;
          },
          getText: function () {
            return this._button.text;
          },
          getIconUrl: function () {
            return this._button.iconUrl;
          },
          destroy: function () {
            this._button = {}, this._update();
          },
          toggle: function (t) {
            return this._button.toggleStatus = "boolean" == typeof t ? t : !this._button.toggleStatus, this._applyStyleClasses(), this._button.toggleStatus;
          },
          toggled: function () {
            return this._button.toggleStatus;
          },
          onCreate: function () {
            this.toggle(!1);
          },
          disable: function () {
            this.toggle(!1), this._button.disabled = !0, this._updateDisabled();
          },
          enable: function () {
            this._button.disabled = !1, this._updateDisabled();
          },
          _triggerClick: function (t) {
            t && t.preventDefault(), this._button.disabled || (this._button.onClick(t, {
              button: this,
              event: t
            }), this._clicked(t), this._button.afterClick(t, {
              button: this,
              event: t
            }));
          },
          _makeButton: function (t) {
            var e = this,
              i = this.options.position.indexOf("right") > -1 ? "pos-right" : "",
              n = L.DomUtil.create("div", "button-container  ".concat(i), this._container);
            t.title && n.setAttribute("title", t.title);
            var r = L.DomUtil.create("a", "leaflet-buttons-control-button", n);
            r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.href = "#";
            var a = L.DomUtil.create("div", "leaflet-pm-actions-container ".concat(i), n),
              o = t.actions,
              s = {
                cancel: {
                  text: I("actions.cancel"),
                  onClick: function () {
                    this._triggerClick();
                  }
                },
                finishMode: {
                  text: I("actions.finish"),
                  onClick: function () {
                    this._triggerClick();
                  }
                },
                removeLastVertex: {
                  text: I("actions.removeLastVertex"),
                  onClick: function () {
                    this._map.pm.Draw[t.jsClass]._removeLastVertex();
                  }
                },
                finish: {
                  text: I("actions.finish"),
                  onClick: function (e) {
                    this._map.pm.Draw[t.jsClass]._finishShape(e);
                  }
                }
              };
            o.forEach(function (n) {
              var r,
                o = "string" == typeof n ? n : n.name;
              if (s[o]) r = s[o];else {
                if (!n.text) return;
                r = n;
              }
              var l = L.DomUtil.create("a", "leaflet-pm-action ".concat(i, " action-").concat(o), a);
              if (l.setAttribute("role", "button"), l.setAttribute("tabindex", "0"), l.href = "#", l.innerHTML = r.text, L.DomEvent.disableClickPropagation(l), L.DomEvent.on(l, "click", L.DomEvent.stop), !t.disabled && r.onClick) {
                L.DomEvent.addListener(l, "click", function (i) {
                  i.preventDefault();
                  var n = "",
                    a = e._map.pm.Toolbar.buttons;
                  for (var o in a) if (a[o]._button === t) {
                    n = o;
                    break;
                  }
                  e._fireActionClick(r, n, t);
                }, e), L.DomEvent.addListener(l, "click", r.onClick, e);
              }
            }), t.toggleStatus && L.DomUtil.addClass(n, "active");
            var l = L.DomUtil.create("div", "control-icon", r);
            return t.iconUrl && l.setAttribute("src", t.iconUrl), t.className && L.DomUtil.addClass(l, t.className), L.DomEvent.disableClickPropagation(r), L.DomEvent.on(r, "click", L.DomEvent.stop), t.disabled || (L.DomEvent.addListener(r, "click", this._onBtnClick, this), L.DomEvent.addListener(r, "click", this._triggerClick, this)), t.disabled && (L.DomUtil.addClass(r, "pm-disabled"), r.setAttribute("aria-disabled", "true")), n;
          },
          _applyStyleClasses: function () {
            this._container && (this._button.toggleStatus && !1 !== this._button.cssToggle ? (L.DomUtil.addClass(this.buttonsDomNode, "active"), L.DomUtil.addClass(this._container, "activeChild")) : (L.DomUtil.removeClass(this.buttonsDomNode, "active"), L.DomUtil.removeClass(this._container, "activeChild")));
          },
          _onBtnClick: function () {
            this._button.disableOtherButtons && this._map.pm.Toolbar.triggerClickOnToggledButtons(this);
            var t = "",
              e = this._map.pm.Toolbar.buttons;
            for (var i in e) if (e[i]._button === this._button) {
              t = i;
              break;
            }
            this._fireButtonClick(t, this._button);
          },
          _clicked: function () {
            this._button.doToggle && this.toggle();
          },
          _updateDisabled: function () {
            if (this._container) {
              var t = "pm-disabled",
                e = this.buttonsDomNode.children[0];
              this._button.disabled ? (L.DomUtil.addClass(e, t), e.setAttribute("aria-disabled", "true"), L.DomEvent.off(e, "click", this._triggerClick, this), L.DomEvent.off(e, "click", this._onBtnClick, this)) : (L.DomUtil.removeClass(e, t), e.setAttribute("aria-disabled", "false"), L.DomEvent.on(e, "click", this._triggerClick, this), L.DomEvent.on(e, "click", this._onBtnClick, this));
            }
          }
        });
        function X(t, e) {
          var i = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e && (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })), i.push.apply(i, n);
          }
          return i;
        }
        function Z(t) {
          for (var e = 1; e < arguments.length; e++) {
            var i = null != arguments[e] ? arguments[e] : {};
            e % 2 ? X(Object(i), !0).forEach(function (e) {
              $(t, e, i[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : X(Object(i)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
            });
          }
          return t;
        }
        function $(t, e, i) {
          return e in t ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[e] = i, t;
        }
        function W(t) {
          return W = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t;
          } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
          }, W(t);
        }
        L.Control.PMButton = Y;
        const Q = L.Class.extend({
          options: {
            drawMarker: !0,
            drawRectangle: !0,
            drawPolyline: !0,
            drawPolygon: !0,
            drawCircle: !0,
            drawCircleMarker: !0,
            drawText: !0,
            editMode: !0,
            dragMode: !0,
            cutPolygon: !0,
            removalMode: !0,
            rotateMode: !0,
            snappingOption: !0,
            drawControls: !0,
            editControls: !0,
            optionsControls: !0,
            customControls: !0,
            oneBlock: !1,
            position: "topleft",
            positions: {
              draw: "",
              edit: "",
              options: "",
              custom: ""
            }
          },
          customButtons: [],
          initialize: function (t) {
            this.init(t);
          },
          reinit: function () {
            var t = this.isVisible;
            this.removeControls(), this._defineButtons(), t && this.addControls();
          },
          init: function (t) {
            this.map = t, this.buttons = {}, this.isVisible = !1, this.drawContainer = L.DomUtil.create("div", "leaflet-pm-toolbar leaflet-pm-draw leaflet-bar leaflet-control"), this.editContainer = L.DomUtil.create("div", "leaflet-pm-toolbar leaflet-pm-edit leaflet-bar leaflet-control"), this.optionsContainer = L.DomUtil.create("div", "leaflet-pm-toolbar leaflet-pm-options leaflet-bar leaflet-control"), this.customContainer = L.DomUtil.create("div", "leaflet-pm-toolbar leaflet-pm-custom leaflet-bar leaflet-control"), this._defineButtons();
          },
          _createContainer: function (t) {
            var e = "".concat(t, "Container");
            return this[e] || (this[e] = L.DomUtil.create("div", "leaflet-pm-toolbar leaflet-pm-".concat(t, " leaflet-bar leaflet-control"))), this[e];
          },
          getButtons: function () {
            return this.buttons;
          },
          addControls: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options;
            "undefined" != typeof t.editPolygon && (t.editMode = t.editPolygon), "undefined" != typeof t.deleteLayer && (t.removalMode = t.deleteLayer), L.Util.setOptions(this, t), this.applyIconStyle(), this.isVisible = !0, this._showHideButtons();
          },
          applyIconStyle: function () {
            var t = this.getButtons(),
              e = {
                geomanIcons: {
                  drawMarker: "control-icon leaflet-pm-icon-marker",
                  drawPolyline: "control-icon leaflet-pm-icon-polyline",
                  drawRectangle: "control-icon leaflet-pm-icon-rectangle",
                  drawPolygon: "control-icon leaflet-pm-icon-polygon",
                  drawCircle: "control-icon leaflet-pm-icon-circle",
                  drawCircleMarker: "control-icon leaflet-pm-icon-circle-marker",
                  editMode: "control-icon leaflet-pm-icon-edit",
                  dragMode: "control-icon leaflet-pm-icon-drag",
                  cutPolygon: "control-icon leaflet-pm-icon-cut",
                  removalMode: "control-icon leaflet-pm-icon-delete",
                  drawText: "control-icon leaflet-pm-icon-text"
                }
              };
            for (var i in t) {
              var n = t[i];
              L.Util.setOptions(n, {
                className: e.geomanIcons[i]
              });
            }
          },
          removeControls: function () {
            var t = this.getButtons();
            for (var e in t) t[e].remove();
            this.isVisible = !1;
          },
          toggleControls: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options;
            this.isVisible ? this.removeControls() : this.addControls(t);
          },
          _addButton: function (t, e) {
            return this.buttons[t] = e, this.options[t] = this.options[t] || !1, this.buttons[t];
          },
          triggerClickOnToggledButtons: function (t) {
            var e = ["snappingOption"];
            for (var i in this.buttons) !e.includes(i) && this.buttons[i] !== t && this.buttons[i].toggled() && this.buttons[i]._triggerClick();
          },
          toggleButton: function (t, e) {
            var i = !(arguments.length > 2 && arguments[2] !== undefined) || arguments[2];
            return "editPolygon" === t && (t = "editMode"), "deleteLayer" === t && (t = "removalMode"), i && this.triggerClickOnToggledButtons(this.buttons[t]), !!this.buttons[t] && this.buttons[t].toggle(e);
          },
          _defineButtons: function () {
            var t = this,
              e = {
                className: "control-icon leaflet-pm-icon-marker",
                title: I("buttonTitles.drawMarkerButton"),
                jsClass: "Marker",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                actions: ["cancel"]
              },
              i = {
                title: I("buttonTitles.drawPolyButton"),
                className: "control-icon leaflet-pm-icon-polygon",
                jsClass: "Polygon",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                actions: ["finish", "removeLastVertex", "cancel"]
              },
              n = {
                className: "control-icon leaflet-pm-icon-polyline",
                title: I("buttonTitles.drawLineButton"),
                jsClass: "Line",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                actions: ["finish", "removeLastVertex", "cancel"]
              },
              r = {
                title: I("buttonTitles.drawCircleButton"),
                className: "control-icon leaflet-pm-icon-circle",
                jsClass: "Circle",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                actions: ["cancel"]
              },
              a = {
                title: I("buttonTitles.drawCircleMarkerButton"),
                className: "control-icon leaflet-pm-icon-circle-marker",
                jsClass: "CircleMarker",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                actions: ["cancel"]
              },
              o = {
                title: I("buttonTitles.drawRectButton"),
                className: "control-icon leaflet-pm-icon-rectangle",
                jsClass: "Rectangle",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                actions: ["cancel"]
              },
              s = {
                title: I("buttonTitles.editButton"),
                className: "control-icon leaflet-pm-icon-edit",
                onClick: function () {},
                afterClick: function () {
                  t.map.pm.toggleGlobalEditMode();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                tool: "edit",
                actions: ["finishMode"]
              },
              l = {
                title: I("buttonTitles.dragButton"),
                className: "control-icon leaflet-pm-icon-drag",
                onClick: function () {},
                afterClick: function () {
                  t.map.pm.toggleGlobalDragMode();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                tool: "edit",
                actions: ["finishMode"]
              },
              h = {
                title: I("buttonTitles.cutButton"),
                className: "control-icon leaflet-pm-icon-cut",
                jsClass: "Cut",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle({
                    snappable: !0,
                    cursorMarker: !0,
                    allowSelfIntersection: !1
                  });
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                tool: "edit",
                actions: ["finish", "removeLastVertex", "cancel"]
              },
              u = {
                title: I("buttonTitles.deleteButton"),
                className: "control-icon leaflet-pm-icon-delete",
                onClick: function () {},
                afterClick: function () {
                  t.map.pm.toggleGlobalRemovalMode();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                tool: "edit",
                actions: ["finishMode"]
              },
              c = {
                title: I("buttonTitles.rotateButton"),
                className: "control-icon leaflet-pm-icon-rotate",
                onClick: function () {},
                afterClick: function () {
                  t.map.pm.toggleGlobalRotateMode();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                tool: "edit",
                actions: ["finishMode"]
              },
              p = {
                className: "control-icon leaflet-pm-icon-text",
                title: I("buttonTitles.drawTextButton"),
                jsClass: "Text",
                onClick: function () {},
                afterClick: function (e, i) {
                  t.map.pm.Draw[i.button._button.jsClass].toggle();
                },
                doToggle: !0,
                toggleStatus: !1,
                disableOtherButtons: !0,
                position: this.options.position,
                actions: ["cancel"]
              };
            this._addButton("drawMarker", new L.Control.PMButton(e)), this._addButton("drawPolyline", new L.Control.PMButton(n)), this._addButton("drawRectangle", new L.Control.PMButton(o)), this._addButton("drawPolygon", new L.Control.PMButton(i)), this._addButton("drawCircle", new L.Control.PMButton(r)), this._addButton("drawCircleMarker", new L.Control.PMButton(a)), this._addButton("drawText", new L.Control.PMButton(p)), this._addButton("editMode", new L.Control.PMButton(s)), this._addButton("dragMode", new L.Control.PMButton(l)), this._addButton("cutPolygon", new L.Control.PMButton(h)), this._addButton("removalMode", new L.Control.PMButton(u)), this._addButton("rotateMode", new L.Control.PMButton(c));
          },
          _showHideButtons: function () {
            if (this.isVisible) {
              this.removeControls(), this.isVisible = !0;
              var t = this.getButtons(),
                e = [];
              for (var i in !1 === this.options.drawControls && (e = e.concat(Object.keys(t).filter(function (e) {
                return !t[e]._button.tool;
              }))), !1 === this.options.editControls && (e = e.concat(Object.keys(t).filter(function (e) {
                return "edit" === t[e]._button.tool;
              }))), !1 === this.options.optionsControls && (e = e.concat(Object.keys(t).filter(function (e) {
                return "options" === t[e]._button.tool;
              }))), !1 === this.options.customControls && (e = e.concat(Object.keys(t).filter(function (e) {
                return "custom" === t[e]._button.tool;
              }))), t) if (this.options[i] && -1 === e.indexOf(i)) {
                var n = t[i]._button.tool;
                n || (n = "draw"), t[i].setPosition(this._getBtnPosition(n)), t[i].addTo(this.map);
              }
            }
          },
          _getBtnPosition: function (t) {
            return this.options.positions && this.options.positions[t] ? this.options.positions[t] : this.options.position;
          },
          setBlockPosition: function (t, e) {
            this.options.positions[t] = e, this._showHideButtons(), this.changeControlOrder();
          },
          getBlockPositions: function () {
            return this.options.positions;
          },
          copyDrawControl: function (t, e) {
            if (!e) throw new TypeError("Button has no name");
            "object" !== W(e) && (e = {
              name: e
            });
            var i = this._btnNameMapping(t);
            if (!e.name) throw new TypeError("Button has no name");
            if (this.buttons[e.name]) throw new TypeError("Button with this name already exists");
            var n = this.map.pm.Draw.createNewDrawInstance(e.name, i);
            return e = Z(Z({}, this.buttons[i]._button), e), {
              drawInstance: n,
              control: this.createCustomControl(e)
            };
          },
          createCustomControl: function (t) {
            if (!t.name) throw new TypeError("Button has no name");
            if (this.buttons[t.name]) throw new TypeError("Button with this name already exists");
            t.onClick || (t.onClick = function () {}), t.afterClick || (t.afterClick = function () {}), !1 !== t.toggle && (t.toggle = !0), t.block && (t.block = t.block.toLowerCase()), t.block && "draw" !== t.block || (t.block = ""), t.className ? -1 === t.className.indexOf("control-icon") && (t.className = "control-icon ".concat(t.className)) : t.className = "control-icon";
            var e = {
              tool: t.block,
              className: t.className,
              title: t.title || "",
              jsClass: t.name,
              onClick: t.onClick,
              afterClick: t.afterClick,
              doToggle: t.toggle,
              toggleStatus: !1,
              disableOtherButtons: !0,
              cssToggle: t.toggle,
              position: this.options.position,
              actions: t.actions || [],
              disabled: !!t.disabled
            };
            !1 !== this.options[t.name] && (this.options[t.name] = !0);
            var i = this._addButton(t.name, new L.Control.PMButton(e));
            return this.changeControlOrder(), i;
          },
          changeControlOrder: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
              e = this._shapeMapping(),
              i = [];
            t.forEach(function (t) {
              e[t] ? i.push(e[t]) : i.push(t);
            });
            var n = this.getButtons(),
              r = {};
            i.forEach(function (t) {
              n[t] && (r[t] = n[t]);
            });
            var a = Object.keys(n).filter(function (t) {
              return !n[t]._button.tool;
            });
            a.forEach(function (t) {
              -1 === i.indexOf(t) && (r[t] = n[t]);
            });
            var o = Object.keys(n).filter(function (t) {
              return "edit" === n[t]._button.tool;
            });
            o.forEach(function (t) {
              -1 === i.indexOf(t) && (r[t] = n[t]);
            });
            var s = Object.keys(n).filter(function (t) {
              return "options" === n[t]._button.tool;
            });
            s.forEach(function (t) {
              -1 === i.indexOf(t) && (r[t] = n[t]);
            });
            var l = Object.keys(n).filter(function (t) {
              return "custom" === n[t]._button.tool;
            });
            l.forEach(function (t) {
              -1 === i.indexOf(t) && (r[t] = n[t]);
            }), Object.keys(n).forEach(function (t) {
              -1 === i.indexOf(t) && (r[t] = n[t]);
            }), this.map.pm.Toolbar.buttons = r, this._showHideButtons();
          },
          getControlOrder: function () {
            var t = this.getButtons(),
              e = [];
            for (var i in t) e.push(i);
            return e;
          },
          changeActionsOfControl: function (t, e) {
            var i = this._btnNameMapping(t);
            if (!i) throw new TypeError("No name passed");
            if (!e) throw new TypeError("No actions passed");
            if (!this.buttons[i]) throw new TypeError("Button with this name not exists");
            this.buttons[i]._button.actions = e, this.changeControlOrder();
          },
          setButtonDisabled: function (t, e) {
            var i = this._btnNameMapping(t);
            e ? this.buttons[i].disable() : this.buttons[i].enable();
          },
          _shapeMapping: function () {
            return {
              Marker: "drawMarker",
              Circle: "drawCircle",
              Polygon: "drawPolygon",
              Rectangle: "drawRectangle",
              Polyline: "drawPolyline",
              Line: "drawPolyline",
              CircleMarker: "drawCircleMarker",
              Edit: "editMode",
              Drag: "dragMode",
              Cut: "cutPolygon",
              Removal: "removalMode",
              Rotate: "rotateMode",
              Text: "drawText"
            };
          },
          _btnNameMapping: function (t) {
            var e = this._shapeMapping();
            return e[t] ? e[t] : t;
          }
        });
        function tt(t, e) {
          var i = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e && (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })), i.push.apply(i, n);
          }
          return i;
        }
        function et(t) {
          for (var e = 1; e < arguments.length; e++) {
            var i = null != arguments[e] ? arguments[e] : {};
            e % 2 ? tt(Object(i), !0).forEach(function (e) {
              it(t, e, i[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : tt(Object(i)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
            });
          }
          return t;
        }
        function it(t, e, i) {
          return e in t ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[e] = i, t;
        }
        var nt = {
          _initSnappableMarkers: function () {
            this.options.snapDistance = this.options.snapDistance || 30, this.options.snapSegment = this.options.snapSegment === undefined || this.options.snapSegment, this._assignEvents(this._markers), this._layer.off("pm:dragstart", this._unsnap, this), this._layer.on("pm:dragstart", this._unsnap, this);
          },
          _disableSnapping: function () {
            this._layer.off("pm:dragstart", this._unsnap, this);
          },
          _assignEvents: function (t) {
            var e = this;
            t.forEach(function (t) {
              Array.isArray(t) ? e._assignEvents(t) : (t.off("drag", e._handleSnapping, e), t.on("drag", e._handleSnapping, e), t.off("dragend", e._cleanupSnapping, e), t.on("dragend", e._cleanupSnapping, e));
            });
          },
          _cleanupSnapping: function () {
            delete this._snapList, this.throttledList && (this._map.off("layeradd", this.throttledList, this), this.throttledList = undefined), this._map.off("pm:remove", this._handleSnapLayerRemoval, this), this.debugIndicatorLines && this.debugIndicatorLines.forEach(function (t) {
              t.remove();
            });
          },
          _handleThrottleSnapping: function () {
            this.throttledList && this._createSnapList();
          },
          _handleSnapping: function (t) {
            var e = this,
              i = t.target;
            if (i._snapped = !1, this.throttledList || (this.throttledList = L.Util.throttle(this._handleThrottleSnapping, 100, this)), this._map.pm.Keyboard.isAltKeyPressed()) return !1;
            if (this._snapList === undefined && (this._createSnapList(), this._map.off("layeradd", this.throttledList, this), this._map.on("layeradd", this.throttledList, this)), this._snapList.length <= 0) return !1;
            var n = this._calcClosestLayer(i.getLatLng(), this._snapList);
            if (0 === Object.keys(n).length) return !1;
            var r,
              a = n.layer instanceof L.Marker || n.layer instanceof L.CircleMarker || !this.options.snapSegment;
            r = a ? n.latlng : this._checkPrioritiySnapping(n);
            var o = this.options.snapDistance,
              s = {
                marker: i,
                shape: this._shape,
                snapLatLng: r,
                segment: n.segment,
                layer: this._layer,
                workingLayer: this._layer,
                layerInteractedWith: n.layer,
                distance: n.distance
              };
            if (this._fireSnapDrag(s.marker, s), this._fireSnapDrag(this._layer, s), n.distance < o) {
              i._orgLatLng = i.getLatLng(), i.setLatLng(r), i._snapped = !0, i._snapInfo = s;
              var l = this._snapLatLng || {},
                h = r || {};
              l.lat === h.lat && l.lng === h.lng || (e._snapLatLng = r, e._fireSnap(i, s), e._fireSnap(e._layer, s));
            } else this._snapLatLng && (this._unsnap(s), i._snapped = !1, this._fireUnsnap(s.marker, s), this._fireUnsnap(this._layer, s));
            return !0;
          },
          _createSnapList: function () {
            var t = this,
              e = [],
              i = [],
              n = this._map;
            n.off("pm:remove", this._handleSnapLayerRemoval, this), n.on("pm:remove", this._handleSnapLayerRemoval, this), n.eachLayer(function (t) {
              if ((t instanceof L.Polyline || t instanceof L.Marker || t instanceof L.CircleMarker || t instanceof L.ImageOverlay) && !0 !== t.options.snapIgnore) {
                if (t.options.snapIgnore === undefined && (!L.PM.optIn && !0 === t.options.pmIgnore || L.PM.optIn && !1 !== t.options.pmIgnore)) return;
                (t instanceof L.Circle || t instanceof L.CircleMarker) && t.pm && t.pm._hiddenPolyCircle ? e.push(t.pm._hiddenPolyCircle) : t instanceof L.ImageOverlay && (t = L.rectangle(t.getBounds())), e.push(t);
                var n = L.polyline([], {
                  color: "red",
                  pmIgnore: !0
                });
                n._pmTempLayer = !0, i.push(n), (t instanceof L.Circle || t instanceof L.CircleMarker) && i.push(n);
              }
            }), e = (e = (e = e.filter(function (e) {
              return t._layer !== e;
            })).filter(function (t) {
              return t._latlng || t._latlngs && !j(t._latlngs);
            })).filter(function (t) {
              return !t._pmTempLayer;
            }), this._otherSnapLayers ? (this._otherSnapLayers.forEach(function () {
              var t = L.polyline([], {
                color: "red",
                pmIgnore: !0
              });
              t._pmTempLayer = !0, i.push(t);
            }), this._snapList = e.concat(this._otherSnapLayers)) : this._snapList = e, this.debugIndicatorLines = i;
          },
          _handleSnapLayerRemoval: function (t) {
            var e = t.layer,
              i = this._snapList.findIndex(function (t) {
                return t._leaflet_id === e._leaflet_id;
              });
            this._snapList.splice(i, 1);
          },
          _calcClosestLayer: function (t, e) {
            var i = this,
              n = [],
              r = {};
            return e.forEach(function (e, a) {
              if (!e._parentCopy || e._parentCopy !== i._layer) {
                var o = i._calcLayerDistances(t, e);
                i.debugIndicatorLines[a] && i.debugIndicatorLines[a].setLatLngs([t, o.latlng]), (r.distance === undefined || o.distance <= r.distance) && (o.distance < r.distance && (n = []), (r = o).layer = e, n.push(r));
              }
            }), this._getClosestLayerByPriority(n);
          },
          _calcLayerDistances: function (t, e) {
            var i,
              n,
              r,
              a = this,
              o = this._map,
              s = e instanceof L.Marker || e instanceof L.CircleMarker,
              l = e instanceof L.Polygon,
              h = t,
              u = s ? e.getLatLng() : e.getLatLngs();
            if (s) return {
              latlng: et({}, u),
              distance: this._getDistance(o, u, h)
            };
            return function c(t) {
              t.forEach(function (e, s) {
                if (Array.isArray(e)) c(e);else if (a.options.snapSegment) {
                  var u,
                    p = e;
                  u = l ? s + 1 === t.length ? 0 : s + 1 : s + 1 === t.length ? undefined : s + 1;
                  var d = t[u];
                  if (d) {
                    var f = a._getDistanceToSegment(o, h, p, d);
                    (n === undefined || f < n) && (n = f, r = [p, d]);
                  }
                } else {
                  var g = a._getDistance(o, h, e);
                  (n === undefined || g < n) && (n = g, i = e);
                }
              });
            }(u), this.options.snapSegment ? {
              latlng: et({}, this._getClosestPointOnSegment(o, t, r[0], r[1])),
              segment: r,
              distance: n
            } : {
              latlng: i,
              distance: n
            };
          },
          _getClosestLayerByPriority: function (t) {
            t = t.sort(function (t, e) {
              return t._leaflet_id - e._leaflet_id;
            });
            var e = this._map.pm.globalOptions.snappingOrder || [],
              i = 0,
              n = {};
            return e.concat(["Marker", "CircleMarker", "Circle", "Line", "Polygon", "Rectangle"]).forEach(function (t) {
              n[t] || (i += 1, n[t] = i);
            }), t.sort(function (t, e) {
              var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "asc";
              if (!e || 0 === Object.keys(e).length) return function (t, e) {
                return t - e;
              };
              for (var n, r = Object.keys(e), a = r.length - 1, o = {}; a >= 0;) n = r[a], o[n.toLowerCase()] = e[n], a -= 1;
              function s(t) {
                return t instanceof L.Marker ? "Marker" : t instanceof L.Circle ? "Circle" : t instanceof L.CircleMarker ? "CircleMarker" : t instanceof L.Rectangle ? "Rectangle" : t instanceof L.Polygon ? "Polygon" : t instanceof L.Polyline ? "Line" : undefined;
              }
              return function (e, n) {
                var r, a;
                if ("instanceofShape" === t) {
                  if (r = s(e.layer).toLowerCase(), a = s(n.layer).toLowerCase(), !r || !a) return 0;
                } else {
                  if (!e.hasOwnProperty(t) || !n.hasOwnProperty(t)) return 0;
                  r = e[t].toLowerCase(), a = n[t].toLowerCase();
                }
                var l = r in o ? o[r] : Number.MAX_SAFE_INTEGER,
                  h = a in o ? o[a] : Number.MAX_SAFE_INTEGER,
                  u = 0;
                return l < h ? u = -1 : l > h && (u = 1), "desc" === i ? -1 * u : u;
              };
            }("instanceofShape", n)), t[0] || {};
          },
          _checkPrioritiySnapping: function (t) {
            var e = this._map,
              i = t.segment[0],
              n = t.segment[1],
              r = t.latlng,
              a = this._getDistance(e, i, r),
              o = this._getDistance(e, n, r),
              s = a < o ? i : n,
              l = a < o ? a : o;
            if (this.options.snapMiddle) {
              var h = L.PM.Utils.calcMiddleLatLng(e, i, n),
                u = this._getDistance(e, h, r);
              u < a && u < o && (s = h, l = u);
            }
            return et({}, l < this.options.snapDistance ? s : r);
          },
          _unsnap: function () {
            delete this._snapLatLng;
          },
          _getClosestPointOnSegment: function (t, e, i, n) {
            var r = t.getMaxZoom();
            r === Infinity && (r = t.getZoom());
            var a = t.project(e, r),
              o = t.project(i, r),
              s = t.project(n, r),
              l = L.LineUtil.closestPointOnSegment(a, o, s);
            return t.unproject(l, r);
          },
          _getDistanceToSegment: function (t, e, i, n) {
            var r = t.latLngToLayerPoint(e),
              a = t.latLngToLayerPoint(i),
              o = t.latLngToLayerPoint(n);
            return L.LineUtil.pointToSegmentDistance(r, a, o);
          },
          _getDistance: function (t, e, i) {
            return t.latLngToLayerPoint(e).distanceTo(t.latLngToLayerPoint(i));
          }
        };
        const rt = nt;
        const at = L.Class.extend({
          includes: [rt, S],
          options: {
            snappable: !0,
            snapDistance: 20,
            snapMiddle: !1,
            allowSelfIntersection: !0,
            tooltips: !0,
            templineStyle: {},
            hintlineStyle: {
              color: "#3388ff",
              dashArray: "5,5"
            },
            pathOptions: null,
            cursorMarker: !0,
            finishOn: null,
            markerStyle: {
              draggable: !0,
              icon: L.icon()
            },
            hideMiddleMarkers: !1,
            minRadiusCircle: null,
            maxRadiusCircle: null,
            minRadiusCircleMarker: null,
            maxRadiusCircleMarker: null,
            editable: !1,
            markerEditable: !0,
            continueDrawing: !1,
            snapSegment: !0,
            requireSnapToFinish: !1
          },
          setOptions: function (t) {
            L.Util.setOptions(this, t);
          },
          getOptions: function () {
            return this.options;
          },
          initialize: function (t) {
            var e = this,
              i = new L.Icon.Default();
            i.options.tooltipAnchor = [0, 0], this.options.markerStyle.icon = i, this._map = t, this.shapes = ["Marker", "CircleMarker", "Line", "Polygon", "Rectangle", "Circle", "Cut", "Text"], this.shapes.forEach(function (t) {
              e[t] = new L.PM.Draw[t](e._map);
            }), this.Marker.setOptions({
              continueDrawing: !0
            }), this.CircleMarker.setOptions({
              continueDrawing: !0
            });
          },
          setPathOptions: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined && arguments[1];
            this.options.pathOptions = e ? r()(this.options.pathOptions, t) : t;
          },
          getShapes: function () {
            return this.shapes;
          },
          getShape: function () {
            return this._shape;
          },
          enable: function (t, e) {
            if (!t) throw new Error("Error: Please pass a shape as a parameter. Possible shapes are: ".concat(this.getShapes().join(",")));
            this.disable(), this[t].enable(e);
          },
          disable: function () {
            var t = this;
            this.shapes.forEach(function (e) {
              t[e].disable();
            });
          },
          addControls: function () {
            var t = this;
            this.shapes.forEach(function (e) {
              t[e].addButton();
            });
          },
          getActiveShape: function () {
            var t,
              e = this;
            return this.shapes.forEach(function (i) {
              e[i]._enabled && (t = i);
            }), t;
          },
          _setGlobalDrawMode: function () {
            "Cut" === this._shape ? this._fireGlobalCutModeToggled() : this._fireGlobalDrawModeToggled();
            var t = L.PM.Utils.findLayers(this._map);
            this._enabled ? t.forEach(function (t) {
              L.PM.Utils.disablePopup(t);
            }) : t.forEach(function (t) {
              L.PM.Utils.enablePopup(t);
            });
          },
          createNewDrawInstance: function (t, e) {
            var i = this._getShapeFromBtnName(e);
            if (this[t]) throw new TypeError("Draw Type already exists");
            if (!L.PM.Draw[i]) throw new TypeError("There is no class L.PM.Draw.".concat(i));
            return this[t] = new L.PM.Draw[i](this._map), this[t].toolbarButtonName = t, this[t]._shape = t, this.shapes.push(t), this[e] && this[t].setOptions(this[e].options), this[t].setOptions(this[t].options), this[t];
          },
          _getShapeFromBtnName: function (t) {
            var e = {
              drawMarker: "Marker",
              drawCircle: "Circle",
              drawPolygon: "Polygon",
              drawPolyline: "Line",
              drawRectangle: "Rectangle",
              drawCircleMarker: "CircleMarker",
              editMode: "Edit",
              dragMode: "Drag",
              cutPolygon: "Cut",
              removalMode: "Removal",
              rotateMode: "Rotate",
              drawText: "Text"
            };
            return e[t] ? e[t] : this[t] ? this[t]._shape : t;
          },
          _finishLayer: function (t) {
            t.pm && (t.pm.setOptions(this.options), t.pm._shape = this._shape, t.pm._map = this._map), this._addDrawnLayerProp(t);
          },
          _addDrawnLayerProp: function (t) {
            t._drawnByGeoman = !0;
          },
          _setPane: function (t, e) {
            "layerPane" === e ? t.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.layerPane || "overlayPane" : "vertexPane" === e ? t.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.vertexPane || "markerPane" : "markerPane" === e && (t.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.markerPane || "markerPane");
          },
          _isFirstLayer: function () {
            return 0 === (this._map || this._layer._map).pm.getGeomanLayers().length;
          }
        });
        at.Marker = at.extend({
          initialize: function (t) {
            this._map = t, this._shape = "Marker", this.toolbarButtonName = "drawMarker";
          },
          enable: function (t) {
            var e = this;
            L.Util.setOptions(this, t), this._enabled = !0, this._map.on("click", this._createMarker, this), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !0), this._hintMarker = L.marker([0, 0], this.options.markerStyle), this._setPane(this._hintMarker, "markerPane"), this._hintMarker._pmTempLayer = !0, this._hintMarker.addTo(this._map), this.options.tooltips && this._hintMarker.bindTooltip(I("tooltips.placeMarker"), {
              permanent: !0,
              offset: L.point(0, 10),
              direction: "bottom",
              opacity: .8
            }).openTooltip(), this._layer = this._hintMarker, this._map.on("mousemove", this._syncHintMarker, this), this.options.markerEditable && this._map.eachLayer(function (t) {
              e.isRelevantMarker(t) && t.pm.enable();
            }), this._fireDrawStart(), this._setGlobalDrawMode();
          },
          disable: function () {
            var t = this;
            this._enabled && (this._enabled = !1, this._map.off("click", this._createMarker, this), this._hintMarker.remove(), this._map.off("mousemove", this._syncHintMarker, this), this._map.eachLayer(function (e) {
              t.isRelevantMarker(e) && e.pm.disable();
            }), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !1), this.options.snappable && this._cleanupSnapping(), this._fireDrawEnd(), this._setGlobalDrawMode());
          },
          enabled: function () {
            return this._enabled;
          },
          toggle: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          isRelevantMarker: function (t) {
            return t instanceof L.Marker && t.pm && !t._pmTempLayer && !t.pm._initTextMarker;
          },
          _syncHintMarker: function (t) {
            if (this._hintMarker.setLatLng(t.latlng), this.options.snappable) {
              var e = t;
              e.target = this._hintMarker, this._handleSnapping(e);
            }
            this._fireChange(this._hintMarker.getLatLng(), "Draw");
          },
          _createMarker: function (t) {
            if (t.latlng && (!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer())) {
              this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
              var e = this._hintMarker.getLatLng(),
                i = new L.Marker(e, this.options.markerStyle);
              this._setPane(i, "markerPane"), this._finishLayer(i), i.pm || (i.options.draggable = !1), i.addTo(this._map.pm._getContainingLayer()), i.pm && this.options.markerEditable ? i.pm.enable() : i.dragging && i.dragging.disable(), this._fireCreate(i), this._cleanupSnapping(), this.options.continueDrawing || this.disable();
            }
          }
        });
        var ot = 6371008.8,
          st = {
            centimeters: 637100880,
            centimetres: 637100880,
            degrees: 57.22891354143274,
            feet: 20902260.511392,
            inches: 39.37 * ot,
            kilometers: 6371.0088,
            kilometres: 6371.0088,
            meters: ot,
            metres: ot,
            miles: 3958.761333810546,
            millimeters: 6371008800,
            millimetres: 6371008800,
            nauticalmiles: ot / 1852,
            radians: 1,
            yards: 6967335.223679999
          };
        function lt(t, e, i) {
          void 0 === i && (i = {});
          var n = {
            type: "Feature"
          };
          return (0 === i.id || i.id) && (n.id = i.id), i.bbox && (n.bbox = i.bbox), n.properties = e || {}, n.geometry = t, n;
        }
        function ht(t, e, i) {
          if (void 0 === i && (i = {}), !t) throw new Error("coordinates is required");
          if (!Array.isArray(t)) throw new Error("coordinates must be an Array");
          if (t.length < 2) throw new Error("coordinates must be at least 2 numbers long");
          if (!_t(t[0]) || !_t(t[1])) throw new Error("coordinates must contain numbers");
          return lt({
            type: "Point",
            coordinates: t
          }, e, i);
        }
        function ut(t, e, i) {
          if (void 0 === i && (i = {}), t.length < 2) throw new Error("coordinates must be an array of two or more positions");
          return lt({
            type: "LineString",
            coordinates: t
          }, e, i);
        }
        function ct(t, e) {
          void 0 === e && (e = {});
          var i = {
            type: "FeatureCollection"
          };
          return e.id && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.features = t, i;
        }
        function pt(t, e) {
          void 0 === e && (e = "kilometers");
          var i = st[e];
          if (!i) throw new Error(e + " units is invalid");
          return t * i;
        }
        function dt(t, e) {
          void 0 === e && (e = "kilometers");
          var i = st[e];
          if (!i) throw new Error(e + " units is invalid");
          return t / i;
        }
        function ft(t) {
          return 180 * (t % (2 * Math.PI)) / Math.PI;
        }
        function gt(t) {
          return t % 360 * Math.PI / 180;
        }
        function _t(t) {
          return !isNaN(t) && null !== t && !Array.isArray(t);
        }
        function mt(t) {
          var e,
            i,
            n = {
              type: "FeatureCollection",
              features: []
            };
          if ("LineString" === (i = "Feature" === t.type ? t.geometry : t).type) e = [i.coordinates];else if ("MultiLineString" === i.type) e = i.coordinates;else if ("MultiPolygon" === i.type) e = [].concat.apply([], i.coordinates);else {
            if ("Polygon" !== i.type) throw new Error("Input must be a LineString, MultiLineString, Polygon, or MultiPolygon Feature or Geometry");
            e = i.coordinates;
          }
          return e.forEach(function (t) {
            e.forEach(function (e) {
              for (var i = 0; i < t.length - 1; i++) for (var r = i; r < e.length - 1; r++) {
                if (t === e) {
                  if (1 === Math.abs(i - r)) continue;
                  if (0 === i && r === t.length - 2 && t[i][0] === t[t.length - 1][0] && t[i][1] === t[t.length - 1][1]) continue;
                }
                var a = yt(t[i][0], t[i][1], t[i + 1][0], t[i + 1][1], e[r][0], e[r][1], e[r + 1][0], e[r + 1][1]);
                a && n.features.push(ht([a[0], a[1]]));
              }
            });
          }), n;
        }
        function yt(t, e, i, n, r, a, o, s) {
          var l,
            h,
            u,
            c,
            p = {
              x: null,
              y: null,
              onLine1: !1,
              onLine2: !1
            };
          return 0 === (l = (s - a) * (i - t) - (o - r) * (n - e)) ? null !== p.x && null !== p.y && p : (c = (i - t) * (h = e - a) - (n - e) * (u = t - r), h = ((o - r) * h - (s - a) * u) / l, u = c / l, p.x = t + h * (i - t), p.y = e + h * (n - e), h >= 0 && h <= 1 && (p.onLine1 = !0), u >= 0 && u <= 1 && (p.onLine2 = !0), !(!p.onLine1 || !p.onLine2) && [p.x, p.y]);
        }
        function vt(t, e) {
          var i = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e && (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })), i.push.apply(i, n);
          }
          return i;
        }
        function Lt(t) {
          for (var e = 1; e < arguments.length; e++) {
            var i = null != arguments[e] ? arguments[e] : {};
            e % 2 ? vt(Object(i), !0).forEach(function (e) {
              bt(t, e, i[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : vt(Object(i)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
            });
          }
          return t;
        }
        function bt(t, e, i) {
          return e in t ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[e] = i, t;
        }
        function kt(t, e) {
          var i = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e && (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })), i.push.apply(i, n);
          }
          return i;
        }
        function Mt(t) {
          for (var e = 1; e < arguments.length; e++) {
            var i = null != arguments[e] ? arguments[e] : {};
            e % 2 ? kt(Object(i), !0).forEach(function (e) {
              xt(t, e, i[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : kt(Object(i)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
            });
          }
          return t;
        }
        function xt(t, e, i) {
          return e in t ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[e] = i, t;
        }
        function wt(t) {
          if (!t) throw new Error("coord is required");
          if (!Array.isArray(t)) {
            if ("Feature" === t.type && null !== t.geometry && "Point" === t.geometry.type) return t.geometry.coordinates;
            if ("Point" === t.type) return t.coordinates;
          }
          if (Array.isArray(t) && t.length >= 2 && !Array.isArray(t[0]) && !Array.isArray(t[1])) return t;
          throw new Error("coord must be GeoJSON Point or an Array of numbers");
        }
        function Ct(t) {
          if (Array.isArray(t)) return t;
          if ("Feature" === t.type) {
            if (null !== t.geometry) return t.geometry.coordinates;
          } else if (t.coordinates) return t.coordinates;
          throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
        }
        function Pt(t) {
          return "Feature" === t.type ? t.geometry : t;
        }
        function Et(t, e) {
          return "FeatureCollection" === t.type ? "FeatureCollection" : "GeometryCollection" === t.type ? "GeometryCollection" : "Feature" === t.type && null !== t.geometry ? t.geometry.type : t.type;
        }
        function St(t, e, i) {
          if (null !== t) for (var n, r, a, o, s, l, h, u, c = 0, p = 0, d = t.type, f = "FeatureCollection" === d, g = "Feature" === d, _ = f ? t.features.length : 1, m = 0; m < _; m++) {
            s = (u = !!(h = f ? t.features[m].geometry : g ? t.geometry : t) && "GeometryCollection" === h.type) ? h.geometries.length : 1;
            for (var y = 0; y < s; y++) {
              var v = 0,
                L = 0;
              if (null !== (o = u ? h.geometries[y] : h)) {
                l = o.coordinates;
                var b = o.type;
                switch (c = !i || "Polygon" !== b && "MultiPolygon" !== b ? 0 : 1, b) {
                  case null:
                    break;
                  case "Point":
                    if (!1 === e(l, p, m, v, L)) return !1;
                    p++, v++;
                    break;
                  case "LineString":
                  case "MultiPoint":
                    for (n = 0; n < l.length; n++) {
                      if (!1 === e(l[n], p, m, v, L)) return !1;
                      p++, "MultiPoint" === b && v++;
                    }
                    "LineString" === b && v++;
                    break;
                  case "Polygon":
                  case "MultiLineString":
                    for (n = 0; n < l.length; n++) {
                      for (r = 0; r < l[n].length - c; r++) {
                        if (!1 === e(l[n][r], p, m, v, L)) return !1;
                        p++;
                      }
                      "MultiLineString" === b && v++, "Polygon" === b && L++;
                    }
                    "Polygon" === b && v++;
                    break;
                  case "MultiPolygon":
                    for (n = 0; n < l.length; n++) {
                      for (L = 0, r = 0; r < l[n].length; r++) {
                        for (a = 0; a < l[n][r].length - c; a++) {
                          if (!1 === e(l[n][r][a], p, m, v, L)) return !1;
                          p++;
                        }
                        L++;
                      }
                      v++;
                    }
                    break;
                  case "GeometryCollection":
                    for (n = 0; n < o.geometries.length; n++) if (!1 === St(o.geometries[n], e, i)) return !1;
                    break;
                  default:
                    throw new Error("Unknown Geometry Type");
                }
              }
            }
          }
        }
        function Ot(t, e) {
          if ("Feature" === t.type) e(t, 0);else if ("FeatureCollection" === t.type) for (var i = 0; i < t.features.length && !1 !== e(t.features[i], i); i++);
        }
        function Dt(t, e) {
          var i,
            n,
            r,
            a,
            o,
            s,
            l,
            h,
            u,
            c,
            p = 0,
            d = "FeatureCollection" === t.type,
            f = "Feature" === t.type,
            g = d ? t.features.length : 1;
          for (i = 0; i < g; i++) {
            for (s = d ? t.features[i].geometry : f ? t.geometry : t, h = d ? t.features[i].properties : f ? t.properties : {}, u = d ? t.features[i].bbox : f ? t.bbox : undefined, c = d ? t.features[i].id : f ? t.id : undefined, o = (l = !!s && "GeometryCollection" === s.type) ? s.geometries.length : 1, r = 0; r < o; r++) if (null !== (a = l ? s.geometries[r] : s)) switch (a.type) {
              case "Point":
              case "LineString":
              case "MultiPoint":
              case "Polygon":
              case "MultiLineString":
              case "MultiPolygon":
                if (!1 === e(a, p, h, u, c)) return !1;
                break;
              case "GeometryCollection":
                for (n = 0; n < a.geometries.length; n++) if (!1 === e(a.geometries[n], p, h, u, c)) return !1;
                break;
              default:
                throw new Error("Unknown Geometry Type");
            } else if (!1 === e(null, p, h, u, c)) return !1;
            p++;
          }
        }
        function Rt(t, e) {
          Dt(t, function (t, i, n, r, a) {
            var o,
              s = null === t ? null : t.type;
            switch (s) {
              case null:
              case "Point":
              case "LineString":
              case "Polygon":
                return !1 !== e(lt(t, n, {
                  bbox: r,
                  id: a
                }), i, 0) && void 0;
            }
            switch (s) {
              case "MultiPoint":
                o = "Point";
                break;
              case "MultiLineString":
                o = "LineString";
                break;
              case "MultiPolygon":
                o = "Polygon";
            }
            for (var l = 0; l < t.coordinates.length; l++) {
              var h = t.coordinates[l];
              if (!1 === e(lt({
                type: o,
                coordinates: h
              }, n), i, l)) return !1;
            }
          });
        }
        at.Line = at.extend({
          initialize: function (t) {
            this._map = t, this._shape = "Line", this.toolbarButtonName = "drawPolyline", this._doesSelfIntersect = !1;
          },
          enable: function (t) {
            L.Util.setOptions(this, t), this._enabled = !0, this._layerGroup = new L.LayerGroup(), this._layerGroup._pmTempLayer = !0, this._layerGroup.addTo(this._map), this._layer = L.polyline([], this.options.templineStyle), this._setPane(this._layer, "layerPane"), this._layer._pmTempLayer = !0, this._layerGroup.addLayer(this._layer), this._hintline = L.polyline([], this.options.hintlineStyle), this._setPane(this._hintline, "layerPane"), this._hintline._pmTempLayer = !0, this._layerGroup.addLayer(this._hintline), this._hintMarker = L.marker(this._map.getCenter(), {
              interactive: !1,
              zIndexOffset: 100,
              icon: L.divIcon({
                className: "marker-icon cursor-marker"
              })
            }), this._setPane(this._hintMarker, "vertexPane"), this._hintMarker._pmTempLayer = !0, this._layerGroup.addLayer(this._hintMarker), this.options.cursorMarker && L.DomUtil.addClass(this._hintMarker._icon, "visible"), this.options.tooltips && this._hintMarker.bindTooltip(I("tooltips.firstVertex"), {
              permanent: !0,
              offset: L.point(0, 10),
              direction: "bottom",
              opacity: .8
            }).openTooltip(), this._map._container.style.cursor = "crosshair", this._map.on("click", this._createVertex, this), this.options.finishOn && "snap" !== this.options.finishOn && this._map.on(this.options.finishOn, this._finishShape, this), "dblclick" === this.options.finishOn && (this.tempMapDoubleClickZoomState = this._map.doubleClickZoom._enabled, this.tempMapDoubleClickZoomState && this._map.doubleClickZoom.disable()), this._map.on("mousemove", this._syncHintMarker, this), this._hintMarker.on("move", this._syncHintLine, this), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !0), this._otherSnapLayers = [], this._fireDrawStart(), this._setGlobalDrawMode();
          },
          disable: function () {
            this._enabled && (this._enabled = !1, this._map._container.style.cursor = "", this._map.off("click", this._createVertex, this), this._map.off("mousemove", this._syncHintMarker, this), this.options.finishOn && "snap" !== this.options.finishOn && this._map.off(this.options.finishOn, this._finishShape, this), this.tempMapDoubleClickZoomState && this._map.doubleClickZoom.enable(), this._map.removeLayer(this._layerGroup), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !1), this.options.snappable && this._cleanupSnapping(), this._fireDrawEnd(), this._setGlobalDrawMode());
          },
          enabled: function () {
            return this._enabled;
          },
          toggle: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          _syncHintLine: function () {
            var t = this._layer.getLatLngs();
            if (t.length > 0) {
              var e = t[t.length - 1];
              this._hintline.setLatLngs([e, this._hintMarker.getLatLng()]);
            }
          },
          _syncHintMarker: function (t) {
            if (this._hintMarker.setLatLng(t.latlng), this.options.snappable) {
              var e = t;
              e.target = this._hintMarker, this._handleSnapping(e);
            }
            this.options.allowSelfIntersection || this._handleSelfIntersection(!0, t.latlng);
            var i = this._layer._defaultShape().slice();
            i.push(this._hintMarker.getLatLng()), this._change(i);
          },
          hasSelfIntersection: function () {
            return mt(this._layer.toGeoJSON(15)).features.length > 0;
          },
          _handleSelfIntersection: function (t, e) {
            var i = L.polyline(this._layer.getLatLngs());
            t && (e || (e = this._hintMarker.getLatLng()), i.addLatLng(e));
            var n = mt(i.toGeoJSON(15));
            this._doesSelfIntersect = n.features.length > 0, this._doesSelfIntersect ? this._hintline.setStyle({
              color: "#f00000ff"
            }) : this._hintline.isEmpty() || this._hintline.setStyle(this.options.hintlineStyle);
          },
          _createVertex: function (t) {
            if (this.options.allowSelfIntersection || (this._handleSelfIntersection(!0, t.latlng), !this._doesSelfIntersect)) {
              this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
              var e = this._hintMarker.getLatLng();
              if (e.equals(this._layer.getLatLngs()[0])) this._finishShape(t);else {
                this._layer._latlngInfo = this._layer._latlngInfo || [], this._layer._latlngInfo.push({
                  latlng: e,
                  snapInfo: this._hintMarker._snapInfo
                }), this._layer.addLatLng(e);
                var i = this._createMarker(e);
                this._setTooltipText(), this._hintline.setLatLngs([e, e]), this._fireVertexAdded(i, undefined, e, "Draw"), this._change(this._layer.getLatLngs()), "snap" === this.options.finishOn && this._hintMarker._snapped && this._finishShape(t);
              }
            }
          },
          _removeLastVertex: function () {
            var t = this._layer.getLatLngs(),
              e = t.pop();
            if (t.length < 1) this.disable();else {
              var i = this._layerGroup.getLayers().filter(function (t) {
                  return t instanceof L.Marker;
                }).filter(function (t) {
                  return !L.DomUtil.hasClass(t._icon, "cursor-marker");
                }).find(function (t) {
                  return t.getLatLng() === e;
                }),
                n = this._layerGroup.getLayers().filter(function (t) {
                  return t instanceof L.Marker;
                }),
                r = L.PM.Utils.findDeepMarkerIndex(n, i).indexPath;
              this._layerGroup.removeLayer(i), this._layer.setLatLngs(t), this._syncHintLine(), this._setTooltipText(), this._fireVertexRemoved(i, r, "Draw"), this._change(this._layer.getLatLngs());
            }
          },
          _finishShape: function () {
            if ((this.options.allowSelfIntersection || (this._handleSelfIntersection(!1), !this._doesSelfIntersect)) && (!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer())) {
              var t = this._layer.getLatLngs();
              if (!(t.length <= 1)) {
                var e = L.polyline(t, this.options.pathOptions);
                this._setPane(e, "layerPane"), this._finishLayer(e), e.addTo(this._map.pm._getContainingLayer()), this._fireCreate(e), this.options.snappable && this._cleanupSnapping(), this.disable(), this.options.continueDrawing && this.enable();
              }
            }
          },
          _createMarker: function (t) {
            var e = new L.Marker(t, {
              draggable: !1,
              icon: L.divIcon({
                className: "marker-icon"
              })
            });
            return this._setPane(e, "vertexPane"), e._pmTempLayer = !0, this._layerGroup.addLayer(e), e.on("click", this._finishShape, this), e;
          },
          _setTooltipText: function () {
            var t = "";
            t = I(this._layer.getLatLngs().flat().length <= 1 ? "tooltips.continueLine" : "tooltips.finishLine"), this._hintMarker.setTooltipContent(t);
          },
          _change: function (t) {
            this._fireChange(t, "Draw");
          }
        }), at.Polygon = at.Line.extend({
          initialize: function (t) {
            this._map = t, this._shape = "Polygon", this.toolbarButtonName = "drawPolygon";
          },
          _createMarker: function (t) {
            var e = new L.Marker(t, {
              draggable: !1,
              icon: L.divIcon({
                className: "marker-icon"
              })
            });
            return this._setPane(e, "vertexPane"), e._pmTempLayer = !0, this._layerGroup.addLayer(e), 1 === this._layer.getLatLngs().flat().length ? (e.on("click", this._finishShape, this), this._tempSnapLayerIndex = this._otherSnapLayers.push(e) - 1, this.options.snappable && this._cleanupSnapping()) : e.on("click", function () {
              return 1;
            }), e;
          },
          _setTooltipText: function () {
            var t = "";
            t = I(this._layer.getLatLngs().flat().length <= 2 ? "tooltips.continueLine" : "tooltips.finishPoly"), this._hintMarker.setTooltipContent(t);
          },
          _finishShape: function () {
            if ((this.options.allowSelfIntersection || (this._handleSelfIntersection(!0, this._layer.getLatLngs()[0]), !this._doesSelfIntersect)) && (!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer())) {
              var t = this._layer.getLatLngs();
              if (!(t.length <= 2)) {
                var e = L.polygon(t, this.options.pathOptions);
                this._setPane(e, "layerPane"), this._finishLayer(e), e.addTo(this._map.pm._getContainingLayer()), this._fireCreate(e), this._cleanupSnapping(), this._otherSnapLayers.splice(this._tempSnapLayerIndex, 1), delete this._tempSnapLayerIndex, this.disable(), this.options.continueDrawing && this.enable();
              }
            }
          }
        }), at.Rectangle = at.extend({
          initialize: function (t) {
            this._map = t, this._shape = "Rectangle", this.toolbarButtonName = "drawRectangle";
          },
          enable: function (t) {
            if (L.Util.setOptions(this, t), this._enabled = !0, this._layerGroup = new L.LayerGroup(), this._layerGroup._pmTempLayer = !0, this._layerGroup.addTo(this._map), this._layer = L.rectangle([[0, 0], [0, 0]], this.options.pathOptions), this._setPane(this._layer, "layerPane"), this._layer._pmTempLayer = !0, this._startMarker = L.marker([0, 0], {
              icon: L.divIcon({
                className: "marker-icon rect-start-marker"
              }),
              draggable: !1,
              zIndexOffset: -100,
              opacity: this.options.cursorMarker ? 1 : 0
            }), this._setPane(this._startMarker, "vertexPane"), this._startMarker._pmTempLayer = !0, this._layerGroup.addLayer(this._startMarker), this._hintMarker = L.marker([0, 0], {
              zIndexOffset: 150,
              icon: L.divIcon({
                className: "marker-icon cursor-marker"
              })
            }), this._setPane(this._hintMarker, "vertexPane"), this._hintMarker._pmTempLayer = !0, this._layerGroup.addLayer(this._hintMarker), this.options.tooltips && this._hintMarker.bindTooltip(I("tooltips.firstVertex"), {
              permanent: !0,
              offset: L.point(0, 10),
              direction: "bottom",
              opacity: .8
            }).openTooltip(), this.options.cursorMarker) {
              L.DomUtil.addClass(this._hintMarker._icon, "visible"), this._styleMarkers = [];
              for (var e = 0; e < 2; e += 1) {
                var i = L.marker([0, 0], {
                  icon: L.divIcon({
                    className: "marker-icon rect-style-marker"
                  }),
                  draggable: !1,
                  zIndexOffset: 100
                });
                this._setPane(i, "vertexPane"), i._pmTempLayer = !0, this._layerGroup.addLayer(i), this._styleMarkers.push(i);
              }
            }
            this._map._container.style.cursor = "crosshair", this._map.on("click", this._placeStartingMarkers, this), this._map.on("mousemove", this._syncHintMarker, this), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !0), this._otherSnapLayers = [], this._fireDrawStart(), this._setGlobalDrawMode();
          },
          disable: function () {
            this._enabled && (this._enabled = !1, this._map._container.style.cursor = "", this._map.off("click", this._finishShape, this), this._map.off("click", this._placeStartingMarkers, this), this._map.off("mousemove", this._syncHintMarker, this), this._map.removeLayer(this._layerGroup), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !1), this.options.snappable && this._cleanupSnapping(), this._fireDrawEnd(), this._setGlobalDrawMode());
          },
          enabled: function () {
            return this._enabled;
          },
          toggle: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          _placeStartingMarkers: function (t) {
            this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
            var e = this._hintMarker.getLatLng();
            L.DomUtil.addClass(this._startMarker._icon, "visible"), this._startMarker.setLatLng(e), this.options.cursorMarker && this._styleMarkers && this._styleMarkers.forEach(function (t) {
              L.DomUtil.addClass(t._icon, "visible"), t.setLatLng(e);
            }), this._map.off("click", this._placeStartingMarkers, this), this._map.on("click", this._finishShape, this), this._hintMarker.setTooltipContent(I("tooltips.finishRect")), this._setRectangleOrigin();
          },
          _setRectangleOrigin: function () {
            var t = this._startMarker.getLatLng();
            t && (this._layerGroup.addLayer(this._layer), this._layer.setLatLngs([t, t]), this._hintMarker.on("move", this._syncRectangleSize, this));
          },
          _syncHintMarker: function (t) {
            if (this._hintMarker.setLatLng(t.latlng), this.options.snappable) {
              var e = t;
              e.target = this._hintMarker, this._handleSnapping(e);
            }
            var i = this._layerGroup && this._layerGroup.hasLayer(this._layer) ? this._layer.getLatLngs() : [this._hintMarker.getLatLng()];
            this._fireChange(i, "Draw");
          },
          _syncRectangleSize: function () {
            var t = this,
              e = F(this._startMarker.getLatLng(), this._map),
              i = F(this._hintMarker.getLatLng(), this._map),
              n = L.PM.Utils._getRotatedRectangle(e, i, this.options.rectangleAngle || 0, this._map);
            if (this._layer.setLatLngs(n), this.options.cursorMarker && this._styleMarkers) {
              var r = [];
              n.forEach(function (t) {
                t.equals(e, 1e-8) || t.equals(i, 1e-8) || r.push(t);
              }), r.forEach(function (e, i) {
                try {
                  t._styleMarkers[i].setLatLng(e);
                } catch (n) {}
              });
            }
          },
          _findCorners: function () {
            var t = this._layer.getBounds();
            return [t.getNorthWest(), t.getNorthEast(), t.getSouthEast(), t.getSouthWest()];
          },
          _finishShape: function (t) {
            this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
            var e = this._hintMarker.getLatLng(),
              i = this._startMarker.getLatLng();
            if (!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer()) {
              var n = L.rectangle([i, e], this.options.pathOptions);
              if (this.options.rectangleAngle) {
                var r = L.PM.Utils._getRotatedRectangle(i, e, this.options.rectangleAngle || 0, this._map);
                n.setLatLngs(r), n.pm && n.pm._setAngle(this.options.rectangleAngle || 0);
              }
              this._setPane(n, "layerPane"), this._finishLayer(n), n.addTo(this._map.pm._getContainingLayer()), this._fireCreate(n), this.disable(), this.options.continueDrawing && this.enable();
            }
          }
        }), at.Circle = at.extend({
          initialize: function (t) {
            this._map = t, this._shape = "Circle", this.toolbarButtonName = "drawCircle";
          },
          enable: function (t) {
            L.Util.setOptions(this, t), this.options.radius = 0, this._enabled = !0, this._layerGroup = new L.LayerGroup(), this._layerGroup._pmTempLayer = !0, this._layerGroup.addTo(this._map), this._layer = L.circle([0, 0], Lt(Lt({}, this.options.templineStyle), {}, {
              radius: 0
            })), this._setPane(this._layer, "layerPane"), this._layer._pmTempLayer = !0, this._centerMarker = L.marker([0, 0], {
              icon: L.divIcon({
                className: "marker-icon"
              }),
              draggable: !1,
              zIndexOffset: 100
            }), this._setPane(this._centerMarker, "vertexPane"), this._centerMarker._pmTempLayer = !0, this._hintMarker = L.marker([0, 0], {
              zIndexOffset: 110,
              icon: L.divIcon({
                className: "marker-icon cursor-marker"
              })
            }), this._setPane(this._hintMarker, "vertexPane"), this._hintMarker._pmTempLayer = !0, this._layerGroup.addLayer(this._hintMarker), this.options.cursorMarker && L.DomUtil.addClass(this._hintMarker._icon, "visible"), this.options.tooltips && this._hintMarker.bindTooltip(I("tooltips.startCircle"), {
              permanent: !0,
              offset: L.point(0, 10),
              direction: "bottom",
              opacity: .8
            }).openTooltip(), this._hintline = L.polyline([], this.options.hintlineStyle), this._setPane(this._hintline, "layerPane"), this._hintline._pmTempLayer = !0, this._layerGroup.addLayer(this._hintline), this._map._container.style.cursor = "crosshair", this._map.on("click", this._placeCenterMarker, this), this._map.on("mousemove", this._syncHintMarker, this), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !0), this._otherSnapLayers = [], this._fireDrawStart(), this._setGlobalDrawMode();
          },
          disable: function () {
            this._enabled && (this._enabled = !1, this._map._container.style.cursor = "", this._map.off("click", this._finishShape, this), this._map.off("click", this._placeCenterMarker, this), this._map.off("mousemove", this._syncHintMarker, this), this._map.removeLayer(this._layerGroup), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !1), this.options.snappable && this._cleanupSnapping(), this._fireDrawEnd(), this._setGlobalDrawMode());
          },
          enabled: function () {
            return this._enabled;
          },
          toggle: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          _syncHintLine: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._getNewDestinationOfHintMarker();
            this._hintline.setLatLngs([t, e]);
          },
          _syncCircleRadius: function () {
            var t,
              e = this._centerMarker.getLatLng(),
              i = this._hintMarker.getLatLng();
            t = this._map.options.crs === L.CRS.Simple ? this._map.distance(e, i) : e.distanceTo(i), this.options.minRadiusCircle && t < this.options.minRadiusCircle ? this._layer.setRadius(this.options.minRadiusCircle) : this.options.maxRadiusCircle && t > this.options.maxRadiusCircle ? this._layer.setRadius(this.options.maxRadiusCircle) : this._layer.setRadius(t);
          },
          _syncHintMarker: function (t) {
            if (this._hintMarker.setLatLng(t.latlng), this._hintMarker.setLatLng(this._getNewDestinationOfHintMarker()), this.options.snappable) {
              var e = t;
              e.target = this._hintMarker, this._handleSnapping(e);
            }
            this._handleHintMarkerSnapping();
            var i = this._layerGroup && this._layerGroup.hasLayer(this._centerMarker) ? this._centerMarker.getLatLng() : this._hintMarker.getLatLng();
            this._fireChange(i, "Draw");
          },
          _placeCenterMarker: function (t) {
            this._layerGroup.addLayer(this._layer), this._layerGroup.addLayer(this._centerMarker), this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
            var e = this._hintMarker.getLatLng();
            this._layerGroup.addLayer(this._layer), this._centerMarker.setLatLng(e), this._map.off("click", this._placeCenterMarker, this), this._map.on("click", this._finishShape, this), this._placeCircleCenter();
          },
          _placeCircleCenter: function () {
            var t = this._centerMarker.getLatLng();
            t && (this._layer.setLatLng(t), this._hintMarker.on("move", this._syncHintLine, this), this._hintMarker.on("move", this._syncCircleRadius, this), this._hintMarker.setTooltipContent(I("tooltips.finishCircle")), this._fireCenterPlaced(), this._fireChange(this._layer.getLatLng(), "Draw"));
          },
          _finishShape: function (t) {
            if (!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer()) {
              this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
              var e,
                i = this._centerMarker.getLatLng(),
                n = this._hintMarker.getLatLng();
              e = this._map.options.crs === L.CRS.Simple ? this._map.distance(i, n) : i.distanceTo(n), this.options.minRadiusCircle && e < this.options.minRadiusCircle ? e = this.options.minRadiusCircle : this.options.maxRadiusCircle && e > this.options.maxRadiusCircle && (e = this.options.maxRadiusCircle);
              var r = Lt(Lt({}, this.options.pathOptions), {}, {
                  radius: e
                }),
                a = L.circle(i, r);
              this._setPane(a, "layerPane"), this._finishLayer(a), a.addTo(this._map.pm._getContainingLayer()), a.pm && a.pm._updateHiddenPolyCircle(), this._fireCreate(a), this.disable(), this.options.continueDrawing && this.enable();
            }
          },
          _getNewDestinationOfHintMarker: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._hintMarker.getLatLng(),
              i = t.distanceTo(e);
            return t.equals(L.latLng([0, 0])) || (this.options.minRadiusCircle && i < this.options.minRadiusCircle ? e = z(this._map, t, e, this.options.minRadiusCircle) : this.options.maxRadiusCircle && i > this.options.maxRadiusCircle && (e = z(this._map, t, e, this.options.maxRadiusCircle))), e;
          },
          _handleHintMarkerSnapping: function () {
            if (this._hintMarker._snapped) {
              var t = this._centerMarker.getLatLng(),
                e = this._hintMarker.getLatLng(),
                i = t.distanceTo(e);
              t.equals(L.latLng([0, 0])) || (this.options.minRadiusCircle && i < this.options.minRadiusCircle || this.options.maxRadiusCircle && i > this.options.maxRadiusCircle) && this._hintMarker.setLatLng(this._hintMarker._orgLatLng);
            }
            this._hintMarker.setLatLng(this._getNewDestinationOfHintMarker());
          }
        }), at.CircleMarker = at.Marker.extend({
          initialize: function (t) {
            this._map = t, this._shape = "CircleMarker", this.toolbarButtonName = "drawCircleMarker", this._layerIsDragging = !1;
          },
          enable: function (t) {
            var e = this;
            if (L.Util.setOptions(this, t), this._enabled = !0, this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !0), this.options.editable) {
              var i = {};
              L.setOptions(i, this.options.templineStyle), i.radius = 0, this._layerGroup = new L.LayerGroup(), this._layerGroup._pmTempLayer = !0, this._layerGroup.addTo(this._map), this._layer = L.circleMarker([0, 0], i), this._setPane(this._layer, "layerPane"), this._layer._pmTempLayer = !0, this._centerMarker = L.marker([0, 0], {
                icon: L.divIcon({
                  className: "marker-icon"
                }),
                draggable: !1,
                zIndexOffset: 100
              }), this._setPane(this._centerMarker, "vertexPane"), this._centerMarker._pmTempLayer = !0, this._hintMarker = L.marker([0, 0], {
                zIndexOffset: 110,
                icon: L.divIcon({
                  className: "marker-icon cursor-marker"
                })
              }), this._setPane(this._hintMarker, "vertexPane"), this._hintMarker._pmTempLayer = !0, this._layerGroup.addLayer(this._hintMarker), this.options.cursorMarker && L.DomUtil.addClass(this._hintMarker._icon, "visible"), this.options.tooltips && this._hintMarker.bindTooltip(I("tooltips.startCircle"), {
                permanent: !0,
                offset: L.point(0, 10),
                direction: "bottom",
                opacity: .8
              }).openTooltip(), this._hintline = L.polyline([], this.options.hintlineStyle), this._setPane(this._hintline, "layerPane"), this._hintline._pmTempLayer = !0, this._layerGroup.addLayer(this._hintline), this._map.on("click", this._placeCenterMarker, this), this._map._container.style.cursor = "crosshair";
            } else this._map.on("click", this._createMarker, this), this._hintMarker = L.circleMarker([0, 0], this.options.templineStyle), this._setPane(this._hintMarker, "layerPane"), this._hintMarker._pmTempLayer = !0, this._hintMarker.addTo(this._map), this._layer = this._hintMarker, this.options.tooltips && this._hintMarker.bindTooltip(I("tooltips.placeCircleMarker"), {
              permanent: !0,
              offset: L.point(0, 10),
              direction: "bottom",
              opacity: .8
            }).openTooltip();
            this._map.on("mousemove", this._syncHintMarker, this), !this.options.editable && this.options.markerEditable && this._map.eachLayer(function (t) {
              e.isRelevantMarker(t) && t.pm.enable();
            }), this._layer.bringToBack(), this._fireDrawStart(), this._setGlobalDrawMode();
          },
          disable: function () {
            var t = this;
            this._enabled && (this._enabled = !1, this.options.editable ? (this._map._container.style.cursor = "", this._map.off("click", this._finishShape, this), this._map.off("click", this._placeCenterMarker, this), this._map.removeLayer(this._layerGroup)) : (this._map.off("click", this._createMarker, this), this._map.eachLayer(function (e) {
              t.isRelevantMarker(e) && e.pm.disable();
            }), this._hintMarker.remove()), this._map.off("mousemove", this._syncHintMarker, this), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !1), this.options.snappable && this._cleanupSnapping(), this._fireDrawEnd(), this._setGlobalDrawMode());
          },
          _placeCenterMarker: function (t) {
            this._layerGroup.addLayer(this._layer), this._layerGroup.addLayer(this._centerMarker), this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
            var e = this._hintMarker.getLatLng();
            this._layerGroup.addLayer(this._layer), this._centerMarker.setLatLng(e), this._map.off("click", this._placeCenterMarker, this), this._map.on("click", this._finishShape, this), this._placeCircleCenter();
          },
          _placeCircleCenter: function () {
            var t = this._centerMarker.getLatLng();
            t && (this._layer.setLatLng(t), this._hintMarker.on("move", this._syncHintLine, this), this._hintMarker.on("move", this._syncCircleRadius, this), this._hintMarker.setTooltipContent(I("tooltips.finishCircle")), this._fireCenterPlaced(), this._fireChange(this._layer.getLatLng(), "Draw"));
          },
          _syncHintLine: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._getNewDestinationOfHintMarker();
            this._hintline.setLatLngs([t, e]);
          },
          _syncCircleRadius: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._hintMarker.getLatLng(),
              i = this._map.project(t).distanceTo(this._map.project(e));
            this.options.minRadiusCircleMarker && i < this.options.minRadiusCircleMarker ? this._layer.setRadius(this.options.minRadiusCircleMarker) : this.options.maxRadiusCircleMarker && i > this.options.maxRadiusCircleMarker ? this._layer.setRadius(this.options.maxRadiusCircleMarker) : this._layer.setRadius(i);
          },
          _syncHintMarker: function (t) {
            if (this._hintMarker.setLatLng(t.latlng), this._hintMarker.setLatLng(this._getNewDestinationOfHintMarker()), this.options.snappable) {
              var e = t;
              e.target = this._hintMarker, this._handleSnapping(e);
            }
            this._handleHintMarkerSnapping();
            var i = this._layerGroup && this._layerGroup.hasLayer(this._centerMarker) ? this._centerMarker.getLatLng() : this._hintMarker.getLatLng();
            this._fireChange(i, "Draw");
          },
          isRelevantMarker: function (t) {
            return t instanceof L.CircleMarker && !(t instanceof L.Circle) && t.pm && !t._pmTempLayer;
          },
          _createMarker: function (t) {
            if ((!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer()) && t.latlng && !this._layerIsDragging) {
              this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
              var e = this._hintMarker.getLatLng(),
                i = L.circleMarker(e, this.options.pathOptions);
              this._setPane(i, "layerPane"), this._finishLayer(i), i.addTo(this._map.pm._getContainingLayer()), i.pm && this.options.markerEditable && i.pm.enable(), this._fireCreate(i), this._cleanupSnapping(), this.options.continueDrawing || this.disable();
            }
          },
          _finishShape: function (t) {
            if (!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer()) {
              this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
              var e = this._centerMarker.getLatLng(),
                i = this._hintMarker.getLatLng(),
                n = this._map.project(e).distanceTo(this._map.project(i));
              this.options.editable && (this.options.minRadiusCircleMarker && n < this.options.minRadiusCircleMarker ? n = this.options.minRadiusCircleMarker : this.options.maxRadiusCircleMarker && n > this.options.maxRadiusCircleMarker && (n = this.options.maxRadiusCircleMarker));
              var r = Mt(Mt({}, this.options.pathOptions), {}, {
                  radius: n
                }),
                a = L.circleMarker(e, r);
              this._setPane(a, "layerPane"), this._finishLayer(a), a.addTo(this._map.pm._getContainingLayer()), a.pm && a.pm._updateHiddenPolyCircle(), this._fireCreate(a), this.disable(), this.options.continueDrawing && this.enable();
            }
          },
          _getNewDestinationOfHintMarker: function () {
            var t = this._hintMarker.getLatLng();
            if (this.options.editable) {
              var e = this._centerMarker.getLatLng();
              if (e.equals(L.latLng([0, 0]))) return t;
              var i = this._map.project(e).distanceTo(this._map.project(t));
              this.options.minRadiusCircleMarker && i < this.options.minRadiusCircleMarker ? t = z(this._map, e, t, this._pxRadiusToMeter(this.options.minRadiusCircleMarker)) : this.options.maxRadiusCircleMarker && i > this.options.maxRadiusCircleMarker && (t = z(this._map, e, t, this._pxRadiusToMeter(this.options.maxRadiusCircleMarker)));
            }
            return t;
          },
          _handleHintMarkerSnapping: function () {
            if (this.options.editable) {
              if (this._hintMarker._snapped) {
                var t = this._centerMarker.getLatLng(),
                  e = this._hintMarker.getLatLng(),
                  i = this._map.project(t).distanceTo(this._map.project(e));
                (this.options.minRadiusCircleMarker && i < this.options.minRadiusCircleMarker || this.options.maxRadiusCircleMarker && i > this.options.maxRadiusCircleMarker) && this._hintMarker.setLatLng(this._hintMarker._orgLatLng);
              }
              this._hintMarker.setLatLng(this._getNewDestinationOfHintMarker());
            }
          },
          _pxRadiusToMeter: function (t) {
            var e = this._centerMarker.getLatLng(),
              i = this._map.project(e),
              n = L.point(i.x + t, i.y);
            return this._map.unproject(n).distanceTo(e);
          }
        });
        const Bt = function (t) {
          if (!t) throw new Error("geojson is required");
          var e = [];
          return Rt(t, function (t) {
            !function (t, e) {
              var i = [],
                n = t.geometry;
              if (null !== n) {
                switch (n.type) {
                  case "Polygon":
                    i = Ct(n);
                    break;
                  case "LineString":
                    i = [Ct(n)];
                }
                i.forEach(function (i) {
                  var n = function (t, e) {
                    var i = [];
                    return t.reduce(function (t, n) {
                      var r,
                        a,
                        o,
                        s,
                        l,
                        h,
                        u = ut([t, n], e);
                      return u.bbox = (a = n, o = (r = t)[0], s = r[1], l = a[0], h = a[1], [o < l ? o : l, s < h ? s : h, o > l ? o : l, s > h ? s : h]), i.push(u), n;
                    }), i;
                  }(i, t.properties);
                  n.forEach(function (t) {
                    t.id = e.length, e.push(t);
                  });
                });
              }
            }(t, e);
          }), ct(e);
        };
        var Tt = i(1787);
        function It(t, e) {
          var i = Ct(t),
            n = Ct(e);
          if (2 !== i.length) throw new Error("<intersects> line1 must only contain 2 coordinates");
          if (2 !== n.length) throw new Error("<intersects> line2 must only contain 2 coordinates");
          var r = i[0][0],
            a = i[0][1],
            o = i[1][0],
            s = i[1][1],
            l = n[0][0],
            h = n[0][1],
            u = n[1][0],
            c = n[1][1],
            p = (c - h) * (o - r) - (u - l) * (s - a),
            d = (u - l) * (a - h) - (c - h) * (r - l),
            f = (o - r) * (a - h) - (s - a) * (r - l);
          if (0 === p) return null;
          var g = d / p,
            _ = f / p;
          return g >= 0 && g <= 1 && _ >= 0 && _ <= 1 ? ht([r + g * (o - r), a + g * (s - a)]) : null;
        }
        const jt = function (t, e) {
          var i = {},
            n = [];
          if ("LineString" === t.type && (t = lt(t)), "LineString" === e.type && (e = lt(e)), "Feature" === t.type && "Feature" === e.type && null !== t.geometry && null !== e.geometry && "LineString" === t.geometry.type && "LineString" === e.geometry.type && 2 === t.geometry.coordinates.length && 2 === e.geometry.coordinates.length) {
            var r = It(t, e);
            return r && n.push(r), ct(n);
          }
          var a = Tt();
          return a.load(Bt(e)), Ot(Bt(t), function (t) {
            Ot(a.search(t), function (e) {
              var r = It(t, e);
              if (r) {
                var a = Ct(r).join(",");
                i[a] || (i[a] = !0, n.push(r));
              }
            });
          }), ct(n);
        };
        const At = function (t, e, i) {
          void 0 === i && (i = {});
          var n = wt(t),
            r = wt(e),
            a = gt(r[1] - n[1]),
            o = gt(r[0] - n[0]),
            s = gt(n[1]),
            l = gt(r[1]),
            h = Math.pow(Math.sin(a / 2), 2) + Math.pow(Math.sin(o / 2), 2) * Math.cos(s) * Math.cos(l);
          return pt(2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)), i.units);
        };
        const Gt = function (t) {
          var e = t[0],
            i = t[1],
            n = t[2],
            r = t[3];
          if (At(t.slice(0, 2), [n, i]) >= At(t.slice(0, 2), [e, r])) {
            var a = (i + r) / 2;
            return [e, a - (n - e) / 2, n, a + (n - e) / 2];
          }
          var o = (e + n) / 2;
          return [o - (r - i) / 2, i, o + (r - i) / 2, r];
        };
        function Nt(t) {
          var e = [Infinity, Infinity, -Infinity, -Infinity];
          return St(t, function (t) {
            e[0] > t[0] && (e[0] = t[0]), e[1] > t[1] && (e[1] = t[1]), e[2] < t[0] && (e[2] = t[0]), e[3] < t[1] && (e[3] = t[1]);
          }), e;
        }
        Nt["default"] = Nt;
        const zt = Nt;
        const Ut = function (t, e) {
          void 0 === e && (e = {});
          var i = e.precision,
            n = e.coordinates,
            r = e.mutate;
          if (i = i === undefined || null === i || isNaN(i) ? 6 : i, n = n === undefined || null === n || isNaN(n) ? 3 : n, !t) throw new Error("<geojson> is required");
          if ("number" != typeof i) throw new Error("<precision> must be a number");
          if ("number" != typeof n) throw new Error("<coordinates> must be a number");
          !1 !== r && r !== undefined || (t = JSON.parse(JSON.stringify(t)));
          var a = Math.pow(10, i);
          return St(t, function (t) {
            !function (t, e, i) {
              t.length > i && t.splice(i, t.length);
              for (var n = 0; n < t.length; n++) t[n] = Math.round(t[n] * e) / e;
            }(t, a, n);
          }), t;
        };
        function Ft(t, e, i) {
          if (void 0 === i && (i = {}), !0 === i.final) return function (t, e) {
            var i = Ft(e, t);
            return i = (i + 180) % 360;
          }(t, e);
          var n = wt(t),
            r = wt(e),
            a = gt(n[0]),
            o = gt(r[0]),
            s = gt(n[1]),
            l = gt(r[1]),
            h = Math.sin(o - a) * Math.cos(l),
            u = Math.cos(s) * Math.sin(l) - Math.sin(s) * Math.cos(l) * Math.cos(o - a);
          return ft(Math.atan2(h, u));
        }
        function Vt(t, e, i, n) {
          void 0 === n && (n = {});
          var r = wt(t),
            a = gt(r[0]),
            o = gt(r[1]),
            s = gt(i),
            l = dt(e, n.units),
            h = Math.asin(Math.sin(o) * Math.cos(l) + Math.cos(o) * Math.sin(l) * Math.cos(s));
          return ht([ft(a + Math.atan2(Math.sin(s) * Math.sin(l) * Math.cos(o), Math.cos(l) - Math.sin(o) * Math.sin(h))), ft(h)], n.properties);
        }
        const Kt = function (t, e, i) {
          void 0 === i && (i = {});
          var n = ht([Infinity, Infinity], {
              dist: Infinity
            }),
            r = 0;
          return Rt(t, function (t) {
            for (var a = Ct(t), o = 0; o < a.length - 1; o++) {
              var s = ht(a[o]);
              s.properties.dist = At(e, s, i);
              var l = ht(a[o + 1]);
              l.properties.dist = At(e, l, i);
              var h = At(s, l, i),
                u = Math.max(s.properties.dist, l.properties.dist),
                c = Ft(s, l),
                p = Vt(e, u, c + 90, i),
                d = Vt(e, u, c - 90, i),
                f = jt(ut([p.geometry.coordinates, d.geometry.coordinates]), ut([s.geometry.coordinates, l.geometry.coordinates])),
                g = null;
              f.features.length > 0 && ((g = f.features[0]).properties.dist = At(e, g, i), g.properties.location = r + At(s, g, i)), s.properties.dist < n.properties.dist && ((n = s).properties.index = o, n.properties.location = r), l.properties.dist < n.properties.dist && ((n = l).properties.index = o + 1, n.properties.location = r + h), g && g.properties.dist < n.properties.dist && ((n = g).properties.index = o), r += h;
            }
          }), n;
        };
        function Ht(t, e) {
          var i = [],
            n = Tt();
          return Rt(e, function (e) {
            if (i.forEach(function (t, e) {
              t.id = e;
            }), i.length) {
              var r = n.search(e);
              if (r.features.length) {
                var a = Jt(e, r);
                i = i.filter(function (t) {
                  return t.id !== a.id;
                }), n.remove(a), Ot(qt(a, e), function (t) {
                  i.push(t), n.insert(t);
                });
              }
            } else (i = qt(t, e).features).forEach(function (t) {
              t.bbox || (t.bbox = Gt(zt(t)));
            }), n.load(ct(i));
          }), ct(i);
        }
        function qt(t, e) {
          var i = [],
            n = Ct(t)[0],
            r = Ct(t)[t.geometry.coordinates.length - 1];
          if (Yt(n, wt(e)) || Yt(r, wt(e))) return ct([t]);
          var a = Tt(),
            o = Bt(t);
          a.load(o);
          var s = a.search(e);
          if (!s.features.length) return ct([t]);
          var l = Jt(e, s),
            h = function (t, e, i) {
              var n = i;
              return Ot(t, function (t, r) {
                n = 0 === r && i === undefined ? t : e(n, t, r);
              }), n;
            }(o, function (t, n, r) {
              var a = Ct(n)[1],
                o = wt(e);
              return r === l.id ? (t.push(o), i.push(ut(t)), Yt(o, a) ? [o] : [o, a]) : (t.push(a), t);
            }, [n]);
          return h.length > 1 && i.push(ut(h)), ct(i);
        }
        function Jt(t, e) {
          if (!e.features.length) throw new Error("lines must contain features");
          if (1 === e.features.length) return e.features[0];
          var i,
            n = Infinity;
          return Ot(e, function (e) {
            var r = Kt(e, t).properties.dist;
            r < n && (i = e, n = r);
          }), i;
        }
        function Yt(t, e) {
          return t[0] === e[0] && t[1] === e[1];
        }
        const Xt = function (t, e) {
          if (!t) throw new Error("line is required");
          if (!e) throw new Error("splitter is required");
          var i = Et(t),
            n = Et(e);
          if ("LineString" !== i) throw new Error("line must be LineString");
          if ("FeatureCollection" === n) throw new Error("splitter cannot be a FeatureCollection");
          if ("GeometryCollection" === n) throw new Error("splitter cannot be a GeometryCollection");
          var r = Ut(e, {
            precision: 7
          });
          switch (n) {
            case "Point":
              return qt(t, r);
            case "MultiPoint":
              return Ht(t, r);
            case "LineString":
            case "MultiLineString":
            case "Polygon":
            case "MultiPolygon":
              return Ht(t, jt(t, r));
          }
        };
        function Zt(t, e, i) {
          if (void 0 === i && (i = {}), !t) throw new Error("point is required");
          if (!e) throw new Error("polygon is required");
          var n = wt(t),
            r = Pt(e),
            a = r.type,
            o = e.bbox,
            s = r.coordinates;
          if (o && !1 === function (t, e) {
            return e[0] <= t[0] && e[1] <= t[1] && e[2] >= t[0] && e[3] >= t[1];
          }(n, o)) return !1;
          "Polygon" === a && (s = [s]);
          for (var l = !1, h = 0; h < s.length && !l; h++) if ($t(n, s[h][0], i.ignoreBoundary)) {
            for (var u = !1, c = 1; c < s[h].length && !u;) $t(n, s[h][c], !i.ignoreBoundary) && (u = !0), c++;
            u || (l = !0);
          }
          return l;
        }
        function $t(t, e, i) {
          var n = !1;
          e[0][0] === e[e.length - 1][0] && e[0][1] === e[e.length - 1][1] && (e = e.slice(0, e.length - 1));
          for (var r = 0, a = e.length - 1; r < e.length; a = r++) {
            var o = e[r][0],
              s = e[r][1],
              l = e[a][0],
              h = e[a][1];
            if (t[1] * (o - l) + s * (l - t[0]) + h * (t[0] - o) == 0 && (o - t[0]) * (l - t[0]) <= 0 && (s - t[1]) * (h - t[1]) <= 0) return !i;
            s > t[1] != h > t[1] && t[0] < (l - o) * (t[1] - s) / (h - s) + o && (n = !n);
          }
          return n;
        }
        function Wt(t, e, i, n, r) {
          var a = i[0],
            o = i[1],
            s = t[0],
            l = t[1],
            h = e[0],
            u = e[1],
            c = h - s,
            p = u - l,
            d = (i[0] - s) * p - (i[1] - l) * c;
          if (null !== r) {
            if (Math.abs(d) > r) return !1;
          } else if (0 !== d) return !1;
          return n ? "start" === n ? Math.abs(c) >= Math.abs(p) ? c > 0 ? s < a && a <= h : h <= a && a < s : p > 0 ? l < o && o <= u : u <= o && o < l : "end" === n ? Math.abs(c) >= Math.abs(p) ? c > 0 ? s <= a && a < h : h < a && a <= s : p > 0 ? l <= o && o < u : u < o && o <= l : "both" === n && (Math.abs(c) >= Math.abs(p) ? c > 0 ? s < a && a < h : h < a && a < s : p > 0 ? l < o && o < u : u < o && o < l) : Math.abs(c) >= Math.abs(p) ? c > 0 ? s <= a && a <= h : h <= a && a <= s : p > 0 ? l <= o && o <= u : u <= o && o <= l;
        }
        const Qt = function (t, e, i) {
          void 0 === i && (i = {});
          for (var n = wt(t), r = Ct(e), a = 0; a < r.length - 1; a++) {
            var o = !1;
            if (i.ignoreEndVertices && (0 === a && (o = "start"), a === r.length - 2 && (o = "end"), 0 === a && a + 1 === r.length - 1 && (o = "both")), Wt(r[a], r[a + 1], n, o, "undefined" == typeof i.epsilon ? null : i.epsilon)) return !0;
          }
          return !1;
        };
        function te(t, e) {
          var i = Pt(t),
            n = Pt(e),
            r = i.type,
            a = n.type,
            o = i.coordinates,
            s = n.coordinates;
          switch (r) {
            case "Point":
              if ("Point" === a) return ie(o, s);
              throw new Error("feature2 " + a + " geometry not supported");
            case "MultiPoint":
              switch (a) {
                case "Point":
                  return function (t, e) {
                    var i,
                      n = !1;
                    for (i = 0; i < t.coordinates.length; i++) if (ie(t.coordinates[i], e.coordinates)) {
                      n = !0;
                      break;
                    }
                    return n;
                  }(i, n);
                case "MultiPoint":
                  return function (t, e) {
                    for (var i = 0, n = e.coordinates; i < n.length; i++) {
                      for (var r = n[i], a = !1, o = 0, s = t.coordinates; o < s.length; o++) {
                        if (ie(r, s[o])) {
                          a = !0;
                          break;
                        }
                      }
                      if (!a) return !1;
                    }
                    return !0;
                  }(i, n);
                default:
                  throw new Error("feature2 " + a + " geometry not supported");
              }
            case "LineString":
              switch (a) {
                case "Point":
                  return Qt(n, i, {
                    ignoreEndVertices: !0
                  });
                case "LineString":
                  return function (t, e) {
                    for (var i = !1, n = 0, r = e.coordinates; n < r.length; n++) {
                      var a = r[n];
                      if (Qt({
                        type: "Point",
                        coordinates: a
                      }, t, {
                        ignoreEndVertices: !0
                      }) && (i = !0), !Qt({
                        type: "Point",
                        coordinates: a
                      }, t, {
                        ignoreEndVertices: !1
                      })) return !1;
                    }
                    return i;
                  }(i, n);
                case "MultiPoint":
                  return function (t, e) {
                    for (var i = !1, n = 0, r = e.coordinates; n < r.length; n++) {
                      var a = r[n];
                      if (Qt(a, t, {
                        ignoreEndVertices: !0
                      }) && (i = !0), !Qt(a, t)) return !1;
                    }
                    if (i) return !0;
                    return !1;
                  }(i, n);
                default:
                  throw new Error("feature2 " + a + " geometry not supported");
              }
            case "Polygon":
              switch (a) {
                case "Point":
                  return Zt(n, i, {
                    ignoreBoundary: !0
                  });
                case "LineString":
                  return function (t, e) {
                    var i = !1,
                      n = 0,
                      r = zt(t),
                      a = zt(e);
                    if (!ee(r, a)) return !1;
                    for (; n < e.coordinates.length - 1; n++) {
                      if (Zt({
                        type: "Point",
                        coordinates: ne(e.coordinates[n], e.coordinates[n + 1])
                      }, t, {
                        ignoreBoundary: !0
                      })) {
                        i = !0;
                        break;
                      }
                    }
                    return i;
                  }(i, n);
                case "Polygon":
                  return function (t, e) {
                    if ("Feature" === t.type && null === t.geometry) return !1;
                    if ("Feature" === e.type && null === e.geometry) return !1;
                    var i = zt(t),
                      n = zt(e);
                    if (!ee(i, n)) return !1;
                    for (var r = Pt(e).coordinates, a = 0, o = r; a < o.length; a++) for (var s = 0, l = o[a]; s < l.length; s++) {
                      if (!Zt(l[s], t)) return !1;
                    }
                    return !0;
                  }(i, n);
                case "MultiPoint":
                  return function (t, e) {
                    for (var i = 0, n = e.coordinates; i < n.length; i++) {
                      if (!Zt(n[i], t, {
                        ignoreBoundary: !0
                      })) return !1;
                    }
                    return !0;
                  }(i, n);
                default:
                  throw new Error("feature2 " + a + " geometry not supported");
              }
            default:
              throw new Error("feature1 " + r + " geometry not supported");
          }
        }
        function ee(t, e) {
          return !(t[0] > e[0]) && !(t[2] < e[2]) && !(t[1] > e[1]) && !(t[3] < e[3]);
        }
        function ie(t, e) {
          return t[0] === e[0] && t[1] === e[1];
        }
        function ne(t, e) {
          return [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2];
        }
        var re = i(2676),
          ae = i.n(re);
        function oe(t) {
          var e = {
            type: "Feature"
          };
          return e.geometry = t, e;
        }
        function se(t) {
          return "Feature" === t.type ? t.geometry : t;
        }
        function le(t) {
          return t.geometry.coordinates;
        }
        function he(t) {
          return oe({
            type: "Polygon",
            coordinates: t
          });
        }
        function ue(t) {
          return oe({
            type: "MultiPolygon",
            coordinates: t
          });
        }
        function ce(t) {
          return Array.isArray(t) ? 1 + ce(t[0]) : -1;
        }
        function pe(t) {
          t instanceof L.Polyline && (t = t.toGeoJSON(15));
          var e = le(t),
            i = ce(e),
            n = [];
          return i > 1 ? e.forEach(function (t) {
            n.push(function (t) {
              return oe({
                type: "LineString",
                coordinates: t
              });
            }(t));
          }) : n.push(t), n;
        }
        function de(t) {
          var e = [];
          return t.eachLayer(function (t) {
            e.push(le(t.toGeoJSON(15)));
          }), function (t) {
            return oe({
              type: "MultiLineString",
              coordinates: t
            });
          }(e);
        }
        function fe(t, e) {
          return function (t) {
            if (Array.isArray(t)) return t;
          }(t) || function (t, e) {
            var i = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
            if (null == i) return;
            var n,
              r,
              a = [],
              o = !0,
              s = !1;
            try {
              for (i = i.call(t); !(o = (n = i.next()).done) && (a.push(n.value), !e || a.length !== e); o = !0);
            } catch (l) {
              s = !0, r = l;
            } finally {
              try {
                o || null == i["return"] || i["return"]();
              } finally {
                if (s) throw r;
              }
            }
            return a;
          }(t, e) || function (t, e) {
            if (!t) return;
            if ("string" == typeof t) return ge(t, e);
            var i = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === i && t.constructor && (i = t.constructor.name);
            if ("Map" === i || "Set" === i) return Array.from(t);
            if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return ge(t, e);
          }(t, e) || function () {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function ge(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
          return n;
        }
        function _e(t) {
          return function (t) {
            if (Array.isArray(t)) return me(t);
          }(t) || function (t) {
            if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t);
          }(t) || function (t, e) {
            if (!t) return;
            if ("string" == typeof t) return me(t, e);
            var i = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === i && t.constructor && (i = t.constructor.name);
            if ("Map" === i || "Set" === i) return Array.from(t);
            if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return me(t, e);
          }(t) || function () {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function me(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
          return n;
        }
        at.Cut = at.Polygon.extend({
          initialize: function (t) {
            this._map = t, this._shape = "Cut", this.toolbarButtonName = "cutPolygon";
          },
          _finishShape: function () {
            var t = this;
            if (this._editedLayers = [], this.options.allowSelfIntersection || (this._handleSelfIntersection(!0, this._layer.getLatLngs()[0]), !this._doesSelfIntersect)) {
              var e = this._layer.getLatLngs(),
                i = L.polygon(e, this.options.pathOptions);
              i._latlngInfos = this._layer._latlngInfo, this.cut(i), this._cleanupSnapping(), this._otherSnapLayers.splice(this._tempSnapLayerIndex, 1), delete this._tempSnapLayerIndex, this._editedLayers.forEach(function (e) {
                var i = e.layer,
                  n = e.originalLayer;
                t._fireCut(n, i, n), t._fireCut(t._map, i, n), n.pm._fireEdit();
              }), this._editedLayers = [], this.disable(), this.options.continueDrawing && this.enable();
            }
          },
          cut: function (t) {
            var e = this,
              i = this._map._layers,
              n = t._latlngInfos || [];
            Object.keys(i).map(function (t) {
              return i[t];
            }).filter(function (t) {
              return t.pm;
            }).filter(function (t) {
              return !t._pmTempLayer;
            }).filter(function (t) {
              return !L.PM.optIn && !t.options.pmIgnore || L.PM.optIn && !1 === t.options.pmIgnore;
            }).filter(function (t) {
              return t instanceof L.Polyline;
            }).filter(function (e) {
              return e !== t;
            }).filter(function (t) {
              return t.pm.options.allowCutting;
            }).filter(function (t) {
              return !(e.options.layersToCut && L.Util.isArray(e.options.layersToCut) && e.options.layersToCut.length > 0) || e.options.layersToCut.indexOf(t) > -1;
            }).filter(function (t) {
              return !e._layerGroup.hasLayer(t);
            }).filter(function (e) {
              try {
                var i = !!jt(t.toGeoJSON(15), e.toGeoJSON(15)).features.length > 0;
                return i || e instanceof L.Polyline && !(e instanceof L.Polygon) ? i : (n = t.toGeoJSON(15), r = e.toGeoJSON(15), a = se(n), o = se(r), !(0 === (s = ae().intersection(a.coordinates, o.coordinates)).length || !(1 === s.length ? he(s[0]) : ue(s))));
              } catch (l) {
                return e instanceof L.Polygon && console.error("You can't cut polygons with self-intersections"), !1;
              }
              var n, r, a, o, s;
            }).forEach(function (i) {
              var r;
              if (i instanceof L.Polygon) {
                var a = (r = L.polygon(i.getLatLngs())).getLatLngs();
                n.forEach(function (t) {
                  if (t && t.snapInfo) {
                    var i = t.latlng,
                      n = e._calcClosestLayer(i, [r]);
                    if (n && n.segment && n.distance < e.options.snapDistance) {
                      var o = n.segment;
                      if (o && 2 === o.length) {
                        var s = L.PM.Utils._getIndexFromSegment(a, o),
                          l = s.indexPath,
                          h = s.parentPath,
                          u = s.newIndex;
                        (l.length > 1 ? R()(a, h) : a).splice(u, 0, i);
                      }
                    }
                  }
                });
              } else r = i;
              var o = e._cutLayer(t, r),
                s = L.geoJSON(o, i.options);
              if (1 === s.getLayers().length) {
                var l = s.getLayers();
                s = fe(l, 1)[0];
              }
              e._setPane(s, "layerPane");
              var h = s.addTo(e._map.pm._getContainingLayer());
              if (h.pm.enable(i.pm.options), h.pm.disable(), i._pmTempLayer = !0, t._pmTempLayer = !0, i.remove(), i.removeFrom(e._map.pm._getContainingLayer()), t.remove(), t.removeFrom(e._map.pm._getContainingLayer()), h.getLayers && 0 === h.getLayers().length && e._map.pm.removeLayer({
                target: h
              }), h instanceof L.LayerGroup ? (h.eachLayer(function (t) {
                e._addDrawnLayerProp(t);
              }), e._addDrawnLayerProp(h)) : e._addDrawnLayerProp(h), e.options.layersToCut && L.Util.isArray(e.options.layersToCut) && e.options.layersToCut.length > 0) {
                var u = e.options.layersToCut.indexOf(i);
                u > -1 && e.options.layersToCut.splice(u, 1);
              }
              e._editedLayers.push({
                layer: h,
                originalLayer: i
              });
            });
          },
          _cutLayer: function (t, e) {
            var i,
              n,
              r,
              a,
              o,
              s,
              l = L.geoJSON();
            if (e instanceof L.Polygon) n = e.toGeoJSON(15), r = t.toGeoJSON(15), a = se(n), o = se(r), i = 0 === (s = ae().difference(a.coordinates, o.coordinates)).length ? null : 1 === s.length ? he(s[0]) : ue(s);else {
              var h = pe(e);
              h.forEach(function (e) {
                var i = Xt(e, t.toGeoJSON(15));
                (i && i.features.length > 0 ? L.geoJSON(i) : L.geoJSON(e)).getLayers().forEach(function (e) {
                  te(t.toGeoJSON(15), e.toGeoJSON(15)) || e.addTo(l);
                });
              }), i = h.length > 1 ? de(l) : l.toGeoJSON(15);
            }
            return i;
          },
          _change: L.Util.falseFn
        }), at.Text = at.extend({
          initialize: function (t) {
            this._map = t, this._shape = "Text", this.toolbarButtonName = "drawText";
          },
          enable: function (t) {
            L.Util.setOptions(this, t), this._enabled = !0, this._map.on("click", this._createMarker, this), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !0), this._hintMarker = L.marker(this._map.getCenter(), {
              interactive: !1,
              zIndexOffset: 100,
              icon: L.divIcon({
                className: "marker-icon cursor-marker"
              })
            }), this._setPane(this._hintMarker, "vertexPane"), this._hintMarker._pmTempLayer = !0, this._hintMarker.addTo(this._map), this.options.cursorMarker && L.DomUtil.addClass(this._hintMarker._icon, "visible"), this.options.tooltips && this._hintMarker.bindTooltip(I("tooltips.placeText"), {
              permanent: !0,
              offset: L.point(0, 10),
              direction: "bottom",
              opacity: .8
            }).openTooltip(), this._layer = this._hintMarker, this._map.on("mousemove", this._syncHintMarker, this), this._fireDrawStart(), this._setGlobalDrawMode();
          },
          disable: function () {
            this._enabled && (this._enabled = !1, this._map.off("click", this._createMarker, this), this._hintMarker.remove(), this._map.off("mousemove", this._syncHintMarker, this), this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, !1), this.options.snappable && this._cleanupSnapping(), this._fireDrawEnd(), this._setGlobalDrawMode());
          },
          enabled: function () {
            return this._enabled;
          },
          toggle: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          _syncHintMarker: function (t) {
            if (this._hintMarker.setLatLng(t.latlng), this.options.snappable) {
              var e = t;
              e.target = this._hintMarker, this._handleSnapping(e);
            }
          },
          _createMarker: function (t) {
            var e;
            if (t.latlng && (!this.options.requireSnapToFinish || this._hintMarker._snapped || this._isFirstLayer())) {
              this._hintMarker._snapped || this._hintMarker.setLatLng(t.latlng);
              var i = this._hintMarker.getLatLng();
              if (this.textArea = this._createTextArea(), null !== (e = this.options.textOptions) && void 0 !== e && e.className) {
                var n,
                  r = this.options.textOptions.className.split(" ");
                (n = this.textArea.classList).add.apply(n, _e(r));
              }
              var a = this._createTextIcon(this.textArea),
                o = new L.Marker(i, {
                  textMarker: !0,
                  _textMarkerOverPM: !0,
                  icon: a
                });
              if (this._setPane(o, "markerPane"), this._finishLayer(o), o.pm || (o.options.draggable = !1), o.addTo(this._map.pm._getContainingLayer()), o.pm) {
                var s, l, h, u, c;
                o.pm.textArea = this.textArea, L.setOptions(o.pm, {
                  removeIfEmpty: null === (s = null === (l = this.options.textOptions) || void 0 === l ? void 0 : l.removeIfEmpty) || void 0 === s || s
                });
                var p = null === (h = null === (u = this.options.textOptions) || void 0 === u ? void 0 : u.focusAfterDraw) || void 0 === h || h;
                o.pm._createTextMarker(p), null !== (c = this.options.textOptions) && void 0 !== c && c.text && o.pm.setText(this.options.textOptions.text);
              }
              this._fireCreate(o), this._cleanupSnapping(), this.disable(), this.options.continueDrawing && this.enable();
            }
          },
          _createTextArea: function () {
            var t = document.createElement("textarea");
            return t.autofocus = !0, t.readOnly = !0, t.classList.add("pm-textarea", "pm-disabled"), t;
          },
          _createTextIcon: function (t) {
            return L.divIcon({
              className: "pm-text-marker",
              html: t
            });
          }
        });
        const ye = {
          enableLayerDrag: function () {
            if (this.options.draggable && this._layer._map) {
              this.disable(), this._layerDragEnabled = !0, this._map || (this._map = this._layer._map), (this._layer instanceof L.Marker || this._layer instanceof L.ImageOverlay) && L.DomEvent.on(this._getDOMElem(), "dragstart", this._stopDOMImageDrag), this._layer.dragging && this._layer.dragging.disable(), this._tempDragCoord = null, V(this._layer) instanceof L.Canvas ? (this._layer.on("mouseout", this.removeDraggingClass, this), this._layer.on("mouseover", this.addDraggingClass, this)) : this.addDraggingClass(), this._originalMapDragState = this._layer._map.dragging._enabled, this._safeToCacheDragState = !0;
              var t = this._getDOMElem();
              t && (V(this._layer) instanceof L.Canvas ? (this._layer.on("touchstart mousedown", this._dragMixinOnMouseDown, this), this._map.pm._addTouchEvents(t)) : L.DomEvent.on(t, "touchstart mousedown", this._simulateMouseDownEvent, this)), this._fireDragEnable();
            }
          },
          disableLayerDrag: function () {
            this._layerDragEnabled = !1, V(this._layer) instanceof L.Canvas ? (this._layer.off("mouseout", this.removeDraggingClass, this), this._layer.off("mouseover", this.addDraggingClass, this)) : this.removeDraggingClass(), this._originalMapDragState && this._dragging && this._map.dragging.enable(), this._safeToCacheDragState = !1, this._layer.dragging && this._layer.dragging.disable();
            var t = this._getDOMElem();
            t && (V(this._layer) instanceof L.Canvas ? (this._layer.off("touchstart mousedown", this._dragMixinOnMouseDown, this), this._map.pm._removeTouchEvents(t)) : L.DomEvent.off(t, "touchstart mousedown", this._simulateMouseDownEvent, this)), this._layerDragged && this._fireUpdate(), this._layerDragged = !1, this._fireDragDisable();
          },
          dragging: function () {
            return this._dragging;
          },
          layerDragEnabled: function () {
            return !!this._layerDragEnabled;
          },
          _simulateMouseDownEvent: function (t) {
            var e = {
                originalEvent: t,
                target: this._layer
              },
              i = t.touches ? t.touches[0] : t;
            return e.containerPoint = this._map.mouseEventToContainerPoint(i), e.latlng = this._map.containerPointToLatLng(e.containerPoint), this._dragMixinOnMouseDown(e), !1;
          },
          _simulateMouseMoveEvent: function (t) {
            var e = {
                originalEvent: t,
                target: this._layer
              },
              i = t.touches ? t.touches[0] : t;
            return e.containerPoint = this._map.mouseEventToContainerPoint(i), e.latlng = this._map.containerPointToLatLng(e.containerPoint), this._dragMixinOnMouseMove(e), !1;
          },
          _simulateMouseUpEvent: function (t) {
            var e = {
              originalEvent: t,
              target: this._layer
            };
            return -1 === t.type.indexOf("touch") && (e.containerPoint = this._map.mouseEventToContainerPoint(t), e.latlng = this._map.containerPointToLatLng(e.containerPoint)), this._dragMixinOnMouseUp(e), !1;
          },
          _dragMixinOnMouseDown: function (t) {
            if (!(t.originalEvent.button > 0)) {
              this._overwriteEventIfItComesFromMarker(t);
              var e = t._fromLayerSync,
                i = this._syncLayers("_dragMixinOnMouseDown", t);
              this._layer instanceof L.Marker && (!this.options.snappable || e || i ? this._disableSnapping() : this._initSnappableMarkers()), this._layer instanceof L.CircleMarker && !(this._layer instanceof L.Circle) && (!this.options.snappable || e || i ? this._layer.pm.options.editable ? this._layer.pm._disableSnapping() : this._layer.pm._disableSnappingDrag() : this._layer.pm.options.editable || this._initSnappableMarkersDrag()), this._safeToCacheDragState && (this._originalMapDragState = this._layer._map.dragging._enabled, this._safeToCacheDragState = !1), this._tempDragCoord = t.latlng, L.DomEvent.on(this._map.getContainer(), "touchend mouseup", this._simulateMouseUpEvent, this), L.DomEvent.on(this._map.getContainer(), "touchmove mousemove", this._simulateMouseMoveEvent, this);
            }
          },
          _dragMixinOnMouseMove: function (t) {
            this._overwriteEventIfItComesFromMarker(t);
            var e = this._getDOMElem();
            this._syncLayers("_dragMixinOnMouseMove", t), this._dragging || (this._dragging = !0, L.DomUtil.addClass(e, "leaflet-pm-dragging"), this._layer instanceof L.Marker || this._layer.bringToFront(), this._originalMapDragState && this._map.dragging.disable(), this._fireDragStart()), this._tempDragCoord || (this._tempDragCoord = t.latlng), this._onLayerDrag(t), this._layer instanceof L.CircleMarker && this._layer.pm._updateHiddenPolyCircle();
          },
          _dragMixinOnMouseUp: function (t) {
            var e = this,
              i = this._getDOMElem();
            return this._syncLayers("_dragMixinOnMouseUp", t), this._originalMapDragState && this._map.dragging.enable(), this._safeToCacheDragState = !0, L.DomEvent.off(this._map.getContainer(), "touchmove mousemove", this._simulateMouseMoveEvent, this), L.DomEvent.off(this._map.getContainer(), "touchend mouseup", this._simulateMouseUpEvent, this), !!this._dragging && (this._layer instanceof L.CircleMarker && this._layer.pm._updateHiddenPolyCircle(), this._layerDragged = !0, window.setTimeout(function () {
              e._dragging = !1, i && L.DomUtil.removeClass(i, "leaflet-pm-dragging"), e._fireDragEnd(), e._fireEdit();
            }, 10), !0);
          },
          _onLayerDrag: function (t) {
            var e = t.latlng,
              i = e.lat - this._tempDragCoord.lat,
              n = e.lng - this._tempDragCoord.lng,
              r = function u(t) {
                return t.map(function (t) {
                  if (Array.isArray(t)) return u(t);
                  var e = {
                    lat: t.lat + i,
                    lng: t.lng + n
                  };
                  return (t.alt || 0 === t.alt) && (e.alt = t.alt), e;
                });
              };
            if (this._layer instanceof L.Circle || this._layer instanceof L.CircleMarker && this._layer.options.editable) {
              var a = r([this._layer.getLatLng()]);
              this._layer.setLatLng(a[0]), this._fireChange(this._layer.getLatLng(), "Edit");
            } else if (this._layer instanceof L.CircleMarker || this._layer instanceof L.Marker) {
              var o = this._layer.getLatLng();
              this._layer._snapped && (o = this._layer._orgLatLng);
              var s = r([o]);
              this._layer.setLatLng(s[0]), this._fireChange(this._layer.getLatLng(), "Edit");
            } else if (this._layer instanceof L.ImageOverlay) {
              var l = r([this._layer.getBounds().getNorthWest(), this._layer.getBounds().getSouthEast()]);
              this._layer.setBounds(l), this._fireChange(this._layer.getBounds(), "Edit");
            } else {
              var h = r(this._layer.getLatLngs());
              this._layer.setLatLngs(h), this._fireChange(this._layer.getLatLngs(), "Edit");
            }
            this._tempDragCoord = e, t.layer = this._layer, this._fireDrag(t);
          },
          addDraggingClass: function () {
            var t = this._getDOMElem();
            t && L.DomUtil.addClass(t, "leaflet-pm-draggable");
          },
          removeDraggingClass: function () {
            var t = this._getDOMElem();
            t && L.DomUtil.removeClass(t, "leaflet-pm-draggable");
          },
          _getDOMElem: function () {
            var t = null;
            return this._layer._path ? t = this._layer._path : this._layer._renderer && this._layer._renderer._container ? t = this._layer._renderer._container : this._layer._image ? t = this._layer._image : this._layer._icon && (t = this._layer._icon), t;
          },
          _overwriteEventIfItComesFromMarker: function (t) {
            t.target.getLatLng && (!t.target._radius || t.target._radius <= 10) && (t.containerPoint = this._map.mouseEventToContainerPoint(t.originalEvent), t.latlng = this._map.containerPointToLatLng(t.containerPoint));
          },
          _syncLayers: function (t, e) {
            var i = this;
            if (this.enabled()) return !1;
            if (!e._fromLayerSync && this._layer === e.target && this.options.syncLayersOnDrag) {
              e._fromLayerSync = !0;
              var n = [];
              if (L.Util.isArray(this.options.syncLayersOnDrag)) n = this.options.syncLayersOnDrag, this.options.syncLayersOnDrag.forEach(function (t) {
                t instanceof L.LayerGroup && (n = n.concat(t.pm.getLayers(!0)));
              });else if (!0 === this.options.syncLayersOnDrag && this._parentLayerGroup) for (var r in this._parentLayerGroup) {
                var a = this._parentLayerGroup[r];
                a.pm && (n = a.pm.getLayers(!0));
              }
              return L.Util.isArray(n) && n.length > 0 && (n = n.filter(function (t) {
                return !!t.pm;
              }).filter(function (t) {
                return !!t.pm.options.draggable;
              })).forEach(function (n) {
                n !== i._layer && n.pm[t] && (n._snapped = !1, n.pm[t](e));
              }), n.length > 0;
            }
            return !1;
          },
          _stopDOMImageDrag: function (t) {
            return t.preventDefault(), !1;
          }
        };
        function ve(t, e, i) {
          var n = i.getMaxZoom();
          if (n === Infinity && (n = i.getZoom()), L.Util.isArray(t)) {
            var r = [];
            return t.forEach(function (t) {
              r.push(ve(t, e, i));
            }), r;
          }
          return t instanceof L.LatLng ? function (t, e, i, n) {
            return i.unproject(e.transform(i.project(t, n)), n);
          }(t, e, i, n) : null;
        }
        function Le(t, e) {
          e instanceof L.Layer && (e = e.getLatLng());
          var i = t.getMaxZoom();
          return i === Infinity && (i = t.getZoom()), t.project(e, i);
        }
        function be(t, e) {
          var i = t.getMaxZoom();
          return i === Infinity && (i = t.getZoom()), t.unproject(e, i);
        }
        var ke = {
          _onRotateStart: function (t) {
            this._preventRenderingMarkers(!0), this._rotationOriginLatLng = this._getRotationCenter().clone(), this._rotationOriginPoint = Le(this._map, this._rotationOriginLatLng), this._rotationStartPoint = Le(this._map, t.target.getLatLng()), this._initialRotateLatLng = U(this._layer), this._startAngle = this.getAngle();
            var e = U(this._rotationLayer, this._rotationLayer.pm._rotateOrgLatLng);
            this._fireRotationStart(this._rotationLayer, e), this._fireRotationStart(this._map, e);
          },
          _onRotate: function (t) {
            var e = Le(this._map, t.target.getLatLng()),
              i = this._rotationStartPoint,
              n = this._rotationOriginPoint,
              r = Math.atan2(e.y - n.y, e.x - n.x) - Math.atan2(i.y - n.y, i.x - n.x);
            this._layer.setLatLngs(this._rotateLayer(r, this._initialRotateLatLng, this._rotationOriginLatLng, L.PM.Matrix.init(), this._map));
            var a = this;
            !function h(t) {
              var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
                i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
              if (i > -1 && e.push(i), L.Util.isArray(t[0])) t.forEach(function (t, i) {
                return h(t, e.slice(), i);
              });else {
                var n = R()(a._markers, e);
                t.forEach(function (t, e) {
                  n[e].setLatLng(t);
                });
              }
            }(this._layer.getLatLngs());
            var o = U(this._rotationLayer);
            this._rotationLayer.setLatLngs(this._rotateLayer(r, this._rotationLayer.pm._rotateOrgLatLng, this._rotationOriginLatLng, L.PM.Matrix.init(), this._map));
            var s = 180 * r / Math.PI,
              l = (s = s < 0 ? s + 360 : s) + this._startAngle;
            this._setAngle(l), this._rotationLayer.pm._setAngle(l), this._fireRotation(this._rotationLayer, s, o), this._fireRotation(this._map, s, o), this._rotationLayer.pm._fireChange(this._rotationLayer.getLatLngs(), "Rotation");
          },
          _onRotateEnd: function () {
            var t = this._startAngle;
            delete this._rotationOriginLatLng, delete this._rotationOriginPoint, delete this._rotationStartPoint, delete this._initialRotateLatLng, delete this._startAngle;
            var e = U(this._rotationLayer, this._rotationLayer.pm._rotateOrgLatLng);
            this._rotationLayer.pm._rotateOrgLatLng = U(this._rotationLayer), this._fireRotationEnd(this._rotationLayer, t, e), this._fireRotationEnd(this._map, t, e), this._rotationLayer.pm._fireEdit(this._rotationLayer, "Rotation"), this._preventRenderingMarkers(!1), this._layerRotated = !0;
          },
          _rotateLayer: function (t, e, i, n, r) {
            var a = Le(r, i);
            return this._matrix = n.clone().rotate(t, a).flip(), ve(e, this._matrix, r);
          },
          _setAngle: function (t) {
            t = t < 0 ? t + 360 : t, this._angle = t % 360;
          },
          _getRotationCenter: function () {
            var t = L.polygon(this._layer.getLatLngs(), {
                stroke: !1,
                fill: !1,
                pmIgnore: !0
              }).addTo(this._layer._map),
              e = t.getCenter();
            return t.removeFrom(this._layer._map), e;
          },
          enableRotate: function () {
            if (this.options.allowRotation) {
              this._rotatePoly = L.polygon(this._layer.getLatLngs(), {
                fill: !1,
                stroke: !1,
                pmIgnore: !1,
                snapIgnore: !0
              }).addTo(this._layer._map), this._rotatePoly.pm._setAngle(this.getAngle()), this._rotatePoly.pm.setOptions(this._layer._map.pm.getGlobalOptions()), this._rotatePoly.pm.setOptions({
                rotate: !0,
                snappable: !1,
                hideMiddleMarkers: !0
              }), this._rotatePoly.pm._rotationLayer = this._layer, this._rotatePoly.pm.enable(), this._rotateOrgLatLng = U(this._layer), this._rotateEnabled = !0, this._layer.on("remove", this.disableRotate, this), this._fireRotationEnable(this._layer), this._fireRotationEnable(this._layer._map);
            } else this.disableRotate();
          },
          disableRotate: function () {
            this.rotateEnabled() && (this._rotatePoly.pm._layerRotated && this._fireUpdate(), this._rotatePoly.pm._layerRotated = !1, this._rotatePoly.pm.disable(), this._rotatePoly.remove(), this._rotatePoly.pm.setOptions({
              rotate: !1
            }), this._rotatePoly = undefined, this._rotateOrgLatLng = undefined, this._layer.off("remove", this.disableRotate, this), this._rotateEnabled = !1, this._fireRotationDisable(this._layer), this._fireRotationDisable(this._layer._map));
          },
          rotateEnabled: function () {
            return this._rotateEnabled;
          },
          rotateLayer: function (t) {
            var e = this.getAngle(),
              i = this._layer.getLatLngs(),
              n = t * (Math.PI / 180);
            this._layer.setLatLngs(this._rotateLayer(n, this._layer.getLatLngs(), this._getRotationCenter(), L.PM.Matrix.init(), this._layer._map)), this._rotateOrgLatLng = L.polygon(this._layer.getLatLngs()).getLatLngs(), this._setAngle(this.getAngle() + t), this.rotateEnabled() && this._rotatePoly && this._rotatePoly.pm.enabled() && (this._rotatePoly.setLatLngs(this._rotateLayer(n, this._rotatePoly.getLatLngs(), this._getRotationCenter(), L.PM.Matrix.init(), this._rotatePoly._map)), this._rotatePoly.pm._initMarkers());
            var r = this.getAngle() - e;
            r = r < 0 ? r + 360 : r, this._startAngle = e, this._fireRotation(this._layer, r, i, this._layer), this._fireRotation(this._map, r, i, this._layer), delete this._startAngle, this._fireChange(this._layer.getLatLngs(), "Rotation");
          },
          rotateLayerToAngle: function (t) {
            var e = t - this.getAngle();
            this.rotateLayer(e);
          },
          getAngle: function () {
            return this._angle || 0;
          }
        };
        const Me = ke;
        const xe = L.Class.extend({
          includes: [ye, rt, Me, S],
          options: {
            snappable: !0,
            snapDistance: 20,
            allowSelfIntersection: !0,
            allowSelfIntersectionEdit: !1,
            preventMarkerRemoval: !1,
            removeLayerBelowMinVertexCount: !0,
            limitMarkersToCount: -1,
            hideMiddleMarkers: !1,
            snapSegment: !0,
            syncLayersOnDrag: !1,
            draggable: !0,
            allowEditing: !0,
            allowRemoval: !0,
            allowCutting: !0,
            allowRotation: !0,
            addVertexOn: "click",
            removeVertexOn: "contextmenu",
            removeVertexValidation: undefined,
            addVertexValidation: undefined,
            moveVertexValidation: undefined
          },
          setOptions: function (t) {
            L.Util.setOptions(this, t);
          },
          getOptions: function () {
            return this.options;
          },
          applyOptions: function () {},
          isPolygon: function () {
            return this._layer instanceof L.Polygon;
          },
          getShape: function () {
            return this._shape;
          },
          _setPane: function (t, e) {
            "layerPane" === e ? t.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.layerPane || "overlayPane" : "vertexPane" === e ? t.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.vertexPane || "markerPane" : "markerPane" === e && (t.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.markerPane || "markerPane");
          },
          remove: function () {
            (this._map || this._layer._map).pm.removeLayer({
              target: this._layer
            });
          },
          _vertexValidation: function (t, e) {
            var i = e.target,
              n = {
                layer: this._layer,
                marker: i,
                event: e
              },
              r = "";
            return "move" === t ? r = "moveVertexValidation" : "add" === t ? r = "addVertexValidation" : "remove" === t && (r = "removeVertexValidation"), this.options[r] && "function" == typeof this.options[r] && !this.options[r](n) ? ("move" === t && (i._cancelDragEventChain = i.getLatLng()), !1) : (i._cancelDragEventChain = null, !0);
          },
          _vertexValidationDrag: function (t) {
            return !t._cancelDragEventChain || (t._latlng = t._cancelDragEventChain, t.update(), !1);
          },
          _vertexValidationDragEnd: function (t) {
            return !t._cancelDragEventChain || (t._cancelDragEventChain = null, !1);
          }
        });
        function we(t) {
          return function (t) {
            if (Array.isArray(t)) return Ce(t);
          }(t) || function (t) {
            if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t);
          }(t) || function (t, e) {
            if (!t) return;
            if ("string" == typeof t) return Ce(t, e);
            var i = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === i && t.constructor && (i = t.constructor.name);
            if ("Map" === i || "Set" === i) return Array.from(t);
            if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return Ce(t, e);
          }(t) || function () {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function Ce(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
          return n;
        }
        xe.LayerGroup = L.Class.extend({
          initialize: function (t) {
            var e = this;
            this._layerGroup = t, this._layers = this.getLayers(), this._getMap(), this._layers.forEach(function (t) {
              return e._initLayer(t);
            });
            this._layerGroup.on("layeradd", L.Util.throttle(function (t) {
              if (!t.layer._pmTempLayer) {
                e._layers = e.getLayers();
                var i = e._layers.filter(function (t) {
                  return !t.pm._parentLayerGroup || !(e._layerGroup._leaflet_id in t.pm._parentLayerGroup);
                });
                i.forEach(function (t) {
                  e._initLayer(t);
                }), i.length > 0 && e._getMap() && e._getMap().pm.globalEditModeEnabled() && e.enabled() && e.enable(e.getOptions());
              }
            }, 100, this), this), this._layerGroup.on("layerremove", function (t) {
              e._removeLayerFromGroup(t.target);
            }, this);
            this._layerGroup.on("layerremove", L.Util.throttle(function (t) {
              t.target._pmTempLayer || (e._layers = e.getLayers());
            }, 100, this), this);
          },
          enable: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            0 === e.length && (this._layers = this.getLayers()), this._options = t, this._layers.forEach(function (i) {
              i instanceof L.LayerGroup ? -1 === e.indexOf(i._leaflet_id) && (e.push(i._leaflet_id), i.pm.enable(t, e)) : i.pm.enable(t);
            });
          },
          disable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            0 === t.length && (this._layers = this.getLayers()), this._layers.forEach(function (e) {
              e instanceof L.LayerGroup ? -1 === t.indexOf(e._leaflet_id) && (t.push(e._leaflet_id), e.pm.disable(t)) : e.pm.disable();
            });
          },
          enabled: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            0 === t.length && (this._layers = this.getLayers());
            var e = this._layers.find(function (e) {
              return e instanceof L.LayerGroup ? -1 === t.indexOf(e._leaflet_id) && (t.push(e._leaflet_id), e.pm.enabled(t)) : e.pm.enabled();
            });
            return !!e;
          },
          toggleEdit: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            0 === e.length && (this._layers = this.getLayers()), this._options = t, this._layers.forEach(function (i) {
              i instanceof L.LayerGroup ? -1 === e.indexOf(i._leaflet_id) && (e.push(i._leaflet_id), i.pm.toggleEdit(t, e)) : i.pm.toggleEdit(t);
            });
          },
          _initLayer: function (t) {
            var e = L.Util.stamp(this._layerGroup);
            t.pm._parentLayerGroup || (t.pm._parentLayerGroup = {}), t.pm._parentLayerGroup[e] = this._layerGroup;
          },
          _removeLayerFromGroup: function (t) {
            if (t.pm && t.pm._layerGroup) {
              var e = L.Util.stamp(this._layerGroup);
              delete t.pm._layerGroup[e];
            }
          },
          dragging: function () {
            if (this._layers = this.getLayers(), this._layers) {
              var t = this._layers.find(function (t) {
                return t.pm.dragging();
              });
              return !!t;
            }
            return !1;
          },
          getOptions: function () {
            return this.options;
          },
          _getMap: function () {
            var t;
            return this._map || (null === (t = this._layers.find(function (t) {
              return !!t._map;
            })) || void 0 === t ? void 0 : t._map) || null;
          },
          getLayers: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined && arguments[0],
              e = !(arguments.length > 1 && arguments[1] !== undefined) || arguments[1],
              i = !(arguments.length > 2 && arguments[2] !== undefined) || arguments[2],
              n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [],
              r = [];
            return t ? this._layerGroup.getLayers().forEach(function (t) {
              r.push(t), t instanceof L.LayerGroup && -1 === n.indexOf(t._leaflet_id) && (n.push(t._leaflet_id), r = r.concat(t.pm.getLayers(!0, !0, !0, n)));
            }) : r = this._layerGroup.getLayers(), i && (r = r.filter(function (t) {
              return !(t instanceof L.LayerGroup);
            })), e && (r = (r = (r = r.filter(function (t) {
              return !!t.pm;
            })).filter(function (t) {
              return !t._pmTempLayer;
            })).filter(function (t) {
              return !L.PM.optIn && !t.options.pmIgnore || L.PM.optIn && !1 === t.options.pmIgnore;
            })), r;
          },
          setOptions: function (t) {
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            0 === e.length && (this._layers = this.getLayers()), this.options = t, this._layers.forEach(function (i) {
              i.pm && (i instanceof L.LayerGroup ? -1 === e.indexOf(i._leaflet_id) && (e.push(i._leaflet_id), i.pm.setOptions(t, e)) : i.pm.setOptions(t));
            });
          }
        }), xe.Marker = xe.extend({
          _shape: "Marker",
          initialize: function (t) {
            this._layer = t, this._enabled = !1, this._layer.on("dragend", this._onDragEnd, this);
          },
          enable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
              draggable: !0
            };
            L.Util.setOptions(this, t), this.options.allowEditing && this._layer._map ? (this._map = this._layer._map, this.enabled() && this.disable(), this.applyOptions(), this._layer.on("remove", this.disable, this), this._enabled = !0, this._fireEnable()) : this.disable();
          },
          disable: function () {
            this.enabled() && (this.disableLayerDrag(), this._layer.off("remove", this.disable, this), this._layer.off("contextmenu", this._removeMarker, this), this._layerEdited && this._fireUpdate(), this._layerEdited = !1, this._fireDisable(), this._enabled = !1);
          },
          enabled: function () {
            return this._enabled;
          },
          toggleEdit: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          applyOptions: function () {
            this.options.snappable ? this._initSnappableMarkers() : this._disableSnapping(), this.options.draggable ? this.enableLayerDrag() : this.disableLayerDrag(), this.options.preventMarkerRemoval || this._layer.on("contextmenu", this._removeMarker, this);
          },
          _removeMarker: function (t) {
            var e = t.target;
            e.remove(), this._fireRemove(e), this._fireRemove(this._map, e);
          },
          _onDragEnd: function () {
            this._fireEdit(), this._layerEdited = !0;
          },
          _initSnappableMarkers: function () {
            var t = this._layer;
            this.options.snapDistance = this.options.snapDistance || 30, this.options.snapSegment = this.options.snapSegment === undefined || this.options.snapSegment, t.off("pm:drag", this._handleSnapping, this), t.on("pm:drag", this._handleSnapping, this), t.off("pm:dragend", this._cleanupSnapping, this), t.on("pm:dragend", this._cleanupSnapping, this), t.off("pm:dragstart", this._unsnap, this), t.on("pm:dragstart", this._unsnap, this);
          },
          _disableSnapping: function () {
            var t = this._layer;
            t.off("pm:drag", this._handleSnapping, this), t.off("pm:dragend", this._cleanupSnapping, this), t.off("pm:dragstart", this._unsnap, this);
          }
        });
        const Pe = {
          filterMarkerGroup: function () {
            this.markerCache = [], this.createCache(), this._layer.on("pm:edit", this.createCache, this), this.applyLimitFilters({}), this._layer.on("pm:disable", this._removeMarkerLimitEvents, this), this.options.limitMarkersToCount > -1 && (this._layer.on("pm:vertexremoved", this._initMarkers, this), this._map.on("mousemove", this.applyLimitFilters, this));
          },
          _removeMarkerLimitEvents: function () {
            this._map.off("mousemove", this.applyLimitFilters, this), this._layer.off("pm:edit", this.createCache, this), this._layer.off("pm:disable", this._removeMarkerLimitEvents, this), this._layer.off("pm:vertexremoved", this._initMarkers, this);
          },
          createCache: function () {
            var t = [].concat(we(this._markerGroup.getLayers()), we(this.markerCache));
            this.markerCache = t.filter(function (t, e, i) {
              return i.indexOf(t) === e;
            });
          },
          renderLimits: function (t) {
            var e = this;
            this.markerCache.forEach(function (i) {
              t.includes(i) ? e._markerGroup.addLayer(i) : e._markerGroup.removeLayer(i);
            });
          },
          applyLimitFilters: function (t) {
            var e = t.latlng,
              i = void 0 === e ? {
                lat: 0,
                lng: 0
              } : e;
            if (!this._preventRenderMarkers) {
              var n = we(this._filterClosestMarkers(i));
              this.renderLimits(n);
            }
          },
          _filterClosestMarkers: function (t) {
            var e = we(this.markerCache),
              i = this.options.limitMarkersToCount;
            return e.sort(function (e, i) {
              return e._latlng.distanceTo(t) - i._latlng.distanceTo(t);
            }), e.filter(function (t, e) {
              return !(i > -1) || e < i;
            });
          },
          _preventRenderMarkers: !1,
          _preventRenderingMarkers: function (t) {
            this._preventRenderMarkers = !!t;
          }
        };
        function Ee(t, e) {
          return function (t) {
            if (Array.isArray(t)) return t;
          }(t) || function (t, e) {
            var i = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
            if (null == i) return;
            var n,
              r,
              a = [],
              o = !0,
              s = !1;
            try {
              for (i = i.call(t); !(o = (n = i.next()).done) && (a.push(n.value), !e || a.length !== e); o = !0);
            } catch (l) {
              s = !0, r = l;
            } finally {
              try {
                o || null == i["return"] || i["return"]();
              } finally {
                if (s) throw r;
              }
            }
            return a;
          }(t, e) || function (t, e) {
            if (!t) return;
            if ("string" == typeof t) return Se(t, e);
            var i = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === i && t.constructor && (i = t.constructor.name);
            if ("Map" === i || "Set" === i) return Array.from(t);
            if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return Se(t, e);
          }(t, e) || function () {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function Se(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
          return n;
        }
        function Oe(t) {
          return function (t) {
            if (Array.isArray(t)) return De(t);
          }(t) || function (t) {
            if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t);
          }(t) || function (t, e) {
            if (!t) return;
            if ("string" == typeof t) return De(t, e);
            var i = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === i && t.constructor && (i = t.constructor.name);
            if ("Map" === i || "Set" === i) return Array.from(t);
            if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return De(t, e);
          }(t) || function () {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function De(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
          return n;
        }
        xe.Line = xe.extend({
          includes: [Pe],
          _shape: "Line",
          initialize: function (t) {
            this._layer = t, this._enabled = !1;
          },
          enable: function (t) {
            L.Util.setOptions(this, t), this._map = this._layer._map, this._map && (this.options.allowEditing ? (this.enabled() && this.disable(), this._enabled = !0, this._initMarkers(), this.applyOptions(), this._layer.on("remove", this.disable, this), this.options.allowSelfIntersection || this._layer.on("pm:vertexremoved", this._handleSelfIntersectionOnVertexRemoval, this), this.options.allowSelfIntersection ? this.cachedColor = undefined : ("#f00000ff" !== this._layer.options.color ? (this.cachedColor = this._layer.options.color, this.isRed = !1) : this.isRed = !0, this._handleLayerStyle()), this._fireEnable()) : this.disable());
          },
          disable: function () {
            if (this.enabled() && !this._dragging) {
              this._enabled = !1, this._markerGroup.clearLayers(), this._markerGroup.removeFrom(this._map), this._layer.off("remove", this.disable, this), this.options.allowSelfIntersection || this._layer.off("pm:vertexremoved", this._handleSelfIntersectionOnVertexRemoval, this);
              var t = this._layer._path ? this._layer._path : this._layer._renderer._container;
              L.DomUtil.removeClass(t, "leaflet-pm-draggable"), this.hasSelfIntersection() && L.DomUtil.removeClass(t, "leaflet-pm-invalid"), this._layerEdited && this._fireUpdate(), this._layerEdited = !1, this._fireDisable();
            }
          },
          enabled: function () {
            return this._enabled;
          },
          toggleEdit: function (t) {
            return this.enabled() ? this.disable() : this.enable(t), this.enabled();
          },
          applyOptions: function () {
            this.options.snappable ? this._initSnappableMarkers() : this._disableSnapping();
          },
          _initMarkers: function () {
            var t = this,
              e = this._map,
              i = this._layer.getLatLngs();
            this._markerGroup && this._markerGroup.clearLayers(), this._markerGroup = new L.LayerGroup(), this._markerGroup._pmTempLayer = !0;
            this._markers = function n(e) {
              if (Array.isArray(e[0])) return e.map(n, t);
              var i = e.map(t._createMarker, t);
              return !0 !== t.options.hideMiddleMarkers && e.map(function (n, r) {
                var a = t.isPolygon() ? (r + 1) % e.length : r + 1;
                return t._createMiddleMarker(i[r], i[a]);
              }), i;
            }(i), this.filterMarkerGroup(), e.addLayer(this._markerGroup);
          },
          _createMarker: function (t) {
            var e = new L.Marker(t, {
              draggable: !0,
              icon: L.divIcon({
                className: "marker-icon"
              })
            });
            return this._setPane(e, "vertexPane"), e._pmTempLayer = !0, this.options.rotate ? (e.on("dragstart", this._onRotateStart, this), e.on("drag", this._onRotate, this), e.on("dragend", this._onRotateEnd, this)) : (e.on("click", this._onVertexClick, this), e.on("dragstart", this._onMarkerDragStart, this), e.on("move", this._onMarkerDrag, this), e.on("dragend", this._onMarkerDragEnd, this), this.options.preventMarkerRemoval || e.on(this.options.removeVertexOn, this._removeMarker, this)), this._markerGroup.addLayer(e), e;
          },
          _createMiddleMarker: function (t, e) {
            if (!t || !e) return !1;
            var i = L.PM.Utils.calcMiddleLatLng(this._map, t.getLatLng(), e.getLatLng()),
              n = this._createMarker(i),
              r = L.divIcon({
                className: "marker-icon marker-icon-middle"
              });
            return n.setIcon(r), n.leftM = t, n.rightM = e, t._middleMarkerNext = n, e._middleMarkerPrev = n, n.on(this.options.addVertexOn, this._onMiddleMarkerClick, this), n.on("movestart", this._onMiddleMarkerMoveStart, this), n;
          },
          _onMiddleMarkerClick: function (t) {
            var e = t.target;
            if (this._vertexValidation("add", t)) {
              var i = L.divIcon({
                className: "marker-icon"
              });
              e.setIcon(i), this._addMarker(e, e.leftM, e.rightM);
            }
          },
          _onMiddleMarkerMoveStart: function (t) {
            var e = t.target;
            e.on("moveend", this._onMiddleMarkerMoveEnd, this), this._vertexValidation("add", t) ? (e._dragging = !0, this._addMarker(e, e.leftM, e.rightM)) : e.on("move", this._onMiddleMarkerMovePrevent, this);
          },
          _onMiddleMarkerMovePrevent: function (t) {
            var e = t.target;
            this._vertexValidationDrag(e);
          },
          _onMiddleMarkerMoveEnd: function (t) {
            var e = t.target;
            if (e.off("move", this._onMiddleMarkerMovePrevent, this), e.off("moveend", this._onMiddleMarkerMoveEnd, this), this._vertexValidationDragEnd(e)) {
              var i = L.divIcon({
                className: "marker-icon"
              });
              e.setIcon(i), setTimeout(function () {
                delete e._dragging;
              }, 100);
            }
          },
          _addMarker: function (t, e, i) {
            t.off("movestart", this._onMiddleMarkerMoveStart, this), t.off(this.options.addVertexOn, this._onMiddleMarkerClick, this);
            var n = t.getLatLng(),
              r = this._layer._latlngs;
            delete t.leftM, delete t.rightM;
            var a = L.PM.Utils.findDeepMarkerIndex(this._markers, e),
              o = a.indexPath,
              s = a.index,
              l = a.parentPath,
              h = o.length > 1 ? R()(r, l) : r,
              u = o.length > 1 ? R()(this._markers, l) : this._markers;
            h.splice(s + 1, 0, n), u.splice(s + 1, 0, t), this._layer.setLatLngs(r), !0 !== this.options.hideMiddleMarkers && (this._createMiddleMarker(e, t), this._createMiddleMarker(t, i)), this._fireEdit(), this._layerEdited = !0, this._fireChange(this._layer.getLatLngs(), "Edit"), this._fireVertexAdded(t, L.PM.Utils.findDeepMarkerIndex(this._markers, t).indexPath, n), this.options.snappable && this._initSnappableMarkers();
          },
          hasSelfIntersection: function () {
            return mt(this._layer.toGeoJSON(15)).features.length > 0;
          },
          _handleSelfIntersectionOnVertexRemoval: function () {
            this._handleLayerStyle(!0), this.hasSelfIntersection() && (this._layer.setLatLngs(this._coordsBeforeEdit), this._coordsBeforeEdit = null, this._initMarkers());
          },
          _handleLayerStyle: function (t) {
            var e = this._layer;
            if (this.hasSelfIntersection()) {
              if (!this.options.allowSelfIntersection && this.options.allowSelfIntersectionEdit && this._updateDisabledMarkerStyle(this._markers, !0), this.isRed) return;
              t ? this._flashLayer() : (e.setStyle({
                color: "#f00000ff"
              }), this.isRed = !0), this._fireIntersect(mt(this._layer.toGeoJSON(15)));
            } else e.setStyle({
              color: this.cachedColor
            }), this.isRed = !1, !this.options.allowSelfIntersection && this.options.allowSelfIntersectionEdit && this._updateDisabledMarkerStyle(this._markers, !1);
          },
          _flashLayer: function () {
            var t = this;
            this.cachedColor || (this.cachedColor = this._layer.options.color), this._layer.setStyle({
              color: "#f00000ff"
            }), this.isRed = !0, window.setTimeout(function () {
              t._layer.setStyle({
                color: t.cachedColor
              }), t.isRed = !1;
            }, 200);
          },
          _updateDisabledMarkerStyle: function (t, e) {
            var i = this;
            t.forEach(function (t) {
              Array.isArray(t) ? i._updateDisabledMarkerStyle(t, e) : t._icon && (e && !i._checkMarkerAllowedToDrag(t) ? L.DomUtil.addClass(t._icon, "vertexmarker-disabled") : L.DomUtil.removeClass(t._icon, "vertexmarker-disabled"));
            });
          },
          _removeMarker: function (t) {
            var e = t.target;
            if (this._vertexValidation("remove", t)) {
              if (!this.options.allowSelfIntersection) {
                var i = this._layer.getLatLngs();
                this._coordsBeforeEdit = JSON.parse(JSON.stringify(i));
              }
              var n = this._layer.getLatLngs(),
                r = L.PM.Utils.findDeepMarkerIndex(this._markers, e),
                a = r.indexPath,
                o = r.index,
                s = r.parentPath;
              if (a) {
                var l = a.length > 1 ? R()(n, s) : n,
                  h = a.length > 1 ? R()(this._markers, s) : this._markers;
                if (this.options.removeLayerBelowMinVertexCount || !(l.length <= 2 || this.isPolygon() && l.length <= 3)) {
                  l.splice(o, 1), this._layer.setLatLngs(n), this.isPolygon() && l.length <= 2 && l.splice(0, l.length);
                  var u = !1;
                  if (l.length <= 1 && (l.splice(0, l.length), this._layer.setLatLngs(n), this.disable(), this.enable(this.options), u = !0), j(n) && this._layer.remove(), n = A(n), this._layer.setLatLngs(n), this._markers = A(this._markers), !u && (h = a.length > 1 ? R()(this._markers, s) : this._markers, e._middleMarkerPrev && this._markerGroup.removeLayer(e._middleMarkerPrev), e._middleMarkerNext && this._markerGroup.removeLayer(e._middleMarkerNext), this._markerGroup.removeLayer(e), h)) {
                    var c, p;
                    if (this.isPolygon() ? (c = (o + 1) % h.length, p = (o + (h.length - 1)) % h.length) : (p = o - 1 < 0 ? undefined : o - 1, c = o + 1 >= h.length ? undefined : o + 1), c !== p) {
                      var d = h[p],
                        f = h[c];
                      !0 !== this.options.hideMiddleMarkers && this._createMiddleMarker(d, f);
                    }
                    h.splice(o, 1);
                  }
                  this._fireEdit(), this._layerEdited = !0, this._fireVertexRemoved(e, a), this._fireChange(this._layer.getLatLngs(), "Edit");
                } else this._flashLayer();
              }
            }
          },
          updatePolygonCoordsFromMarkerDrag: function (t) {
            var e = this._layer.getLatLngs(),
              i = t.getLatLng(),
              n = L.PM.Utils.findDeepMarkerIndex(this._markers, t),
              r = n.indexPath,
              a = n.index,
              o = n.parentPath;
            (r.length > 1 ? R()(e, o) : e).splice(a, 1, i), this._layer.setLatLngs(e);
          },
          _getNeighborMarkers: function (t) {
            var e = L.PM.Utils.findDeepMarkerIndex(this._markers, t),
              i = e.indexPath,
              n = e.index,
              r = e.parentPath,
              a = i.length > 1 ? R()(this._markers, r) : this._markers,
              o = (n + 1) % a.length;
            return {
              prevMarker: a[(n + (a.length - 1)) % a.length],
              nextMarker: a[o]
            };
          },
          _checkMarkerAllowedToDrag: function (t) {
            var e = this._getNeighborMarkers(t),
              i = e.prevMarker,
              n = e.nextMarker,
              r = L.polyline([i.getLatLng(), t.getLatLng()]),
              a = L.polyline([t.getLatLng(), n.getLatLng()]),
              o = jt(this._layer.toGeoJSON(15), r.toGeoJSON(15)).features.length,
              s = jt(this._layer.toGeoJSON(15), a.toGeoJSON(15)).features.length;
            return t.getLatLng() === this._markers[0][0].getLatLng() ? s += 1 : t.getLatLng() === this._markers[0][this._markers[0].length - 1].getLatLng() && (o += 1), !(o <= 2 && s <= 2);
          },
          _onMarkerDragStart: function (t) {
            var e = t.target;
            if (this.cachedColor || (this.cachedColor = this._layer.options.color), this._vertexValidation("move", t)) {
              var i = L.PM.Utils.findDeepMarkerIndex(this._markers, e).indexPath;
              this._fireMarkerDragStart(t, i), this.options.allowSelfIntersection || (this._coordsBeforeEdit = this._layer.getLatLngs()), !this.options.allowSelfIntersection && this.options.allowSelfIntersectionEdit && this.hasSelfIntersection() ? this._markerAllowedToDrag = this._checkMarkerAllowedToDrag(e) : this._markerAllowedToDrag = null;
            }
          },
          _onMarkerDrag: function (t) {
            var e = t.target;
            if (this._vertexValidationDrag(e)) {
              var i = L.PM.Utils.findDeepMarkerIndex(this._markers, e),
                n = i.indexPath,
                r = i.index,
                a = i.parentPath;
              if (n) {
                if (!this.options.allowSelfIntersection && this.options.allowSelfIntersectionEdit && this.hasSelfIntersection() && !1 === this._markerAllowedToDrag) return this._layer.setLatLngs(this._coordsBeforeEdit), this._initMarkers(), void this._handleLayerStyle();
                this.updatePolygonCoordsFromMarkerDrag(e);
                var o = n.length > 1 ? R()(this._markers, a) : this._markers,
                  s = (r + 1) % o.length,
                  l = (r + (o.length - 1)) % o.length,
                  h = e.getLatLng(),
                  u = o[l].getLatLng(),
                  c = o[s].getLatLng();
                if (e._middleMarkerNext) {
                  var p = L.PM.Utils.calcMiddleLatLng(this._map, h, c);
                  e._middleMarkerNext.setLatLng(p);
                }
                if (e._middleMarkerPrev) {
                  var d = L.PM.Utils.calcMiddleLatLng(this._map, h, u);
                  e._middleMarkerPrev.setLatLng(d);
                }
                this.options.allowSelfIntersection || this._handleLayerStyle(), this._fireMarkerDrag(t, n), this._fireChange(this._layer.getLatLngs(), "Edit");
              }
            }
          },
          _onMarkerDragEnd: function (t) {
            var e = t.target;
            if (this._vertexValidationDragEnd(e)) {
              var i = L.PM.Utils.findDeepMarkerIndex(this._markers, e).indexPath,
                n = this.hasSelfIntersection();
              n && this.options.allowSelfIntersectionEdit && this._markerAllowedToDrag && (n = !1);
              var r = !this.options.allowSelfIntersection && n;
              if (this._fireMarkerDragEnd(t, i, r), r) return this._layer.setLatLngs(this._coordsBeforeEdit), this._coordsBeforeEdit = null, this._initMarkers(), this.options.snappable && this._initSnappableMarkers(), this._handleLayerStyle(), void this._fireLayerReset(t, i);
              !this.options.allowSelfIntersection && this.options.allowSelfIntersectionEdit && this._handleLayerStyle(), this._fireEdit(), this._layerEdited = !0, this._fireChange(this._layer.getLatLngs(), "Edit");
            }
          },
          _onVertexClick: function (t) {
            var e = t.target;
            if (!e._dragging) {
              var i = L.PM.Utils.findDeepMarkerIndex(this._markers, e).indexPath;
              this._fireVertexClick(t, i);
            }
          }
        }), xe.Polygon = xe.Line.extend({
          _shape: "Polygon",
          _checkMarkerAllowedToDrag: function (t) {
            var e = this._getNeighborMarkers(t),
              i = e.prevMarker,
              n = e.nextMarker,
              r = L.polyline([i.getLatLng(), t.getLatLng()]),
              a = L.polyline([t.getLatLng(), n.getLatLng()]),
              o = jt(this._layer.toGeoJSON(15), r.toGeoJSON(15)).features.length,
              s = jt(this._layer.toGeoJSON(15), a.toGeoJSON(15)).features.length;
            return !(o <= 2 && s <= 2);
          }
        }), xe.Rectangle = xe.Polygon.extend({
          _shape: "Rectangle",
          _initMarkers: function () {
            var t = this,
              e = this._map,
              i = this._findCorners();
            this._markerGroup && this._markerGroup.clearLayers(), this._markerGroup = new L.LayerGroup(), this._markerGroup._pmTempLayer = !0, e.addLayer(this._markerGroup), this._markers = [], this._markers[0] = i.map(this._createMarker, this);
            var n = Ee(this._markers, 1);
            this._cornerMarkers = n[0], this._layer.getLatLngs()[0].forEach(function (e, i) {
              var n = t._cornerMarkers.find(function (t) {
                return t._index === i;
              });
              n && n.setLatLng(e);
            });
          },
          applyOptions: function () {
            this.options.snappable ? this._initSnappableMarkers() : this._disableSnapping(), this._addMarkerEvents();
          },
          _createMarker: function (t, e) {
            var i = new L.Marker(t, {
              draggable: !0,
              icon: L.divIcon({
                className: "marker-icon"
              })
            });
            return this._setPane(i, "vertexPane"), i._origLatLng = t, i._index = e, i._pmTempLayer = !0, this._markerGroup.addLayer(i), i;
          },
          _addMarkerEvents: function () {
            var t = this;
            this._markers[0].forEach(function (e) {
              e.on("dragstart", t._onMarkerDragStart, t), e.on("drag", t._onMarkerDrag, t), e.on("dragend", t._onMarkerDragEnd, t), t.options.preventMarkerRemoval || e.on("contextmenu", t._removeMarker, t);
            });
          },
          _removeMarker: function () {
            return null;
          },
          _onMarkerDragStart: function (t) {
            if (this._vertexValidation("move", t)) {
              var e = t.target,
                i = this._cornerMarkers;
              e._oppositeCornerLatLng = i.find(function (t) {
                return t._index === (e._index + 2) % 4;
              }).getLatLng(), e._snapped = !1, this._fireMarkerDragStart(t);
            }
          },
          _onMarkerDrag: function (t) {
            var e = t.target;
            this._vertexValidationDrag(e) && e._index !== undefined && (this._adjustRectangleForMarkerMove(e), this._fireMarkerDrag(t), this._fireChange(this._layer.getLatLngs(), "Edit"));
          },
          _onMarkerDragEnd: function (t) {
            var e = t.target;
            this._vertexValidationDragEnd(e) && (this._cornerMarkers.forEach(function (t) {
              delete t._oppositeCornerLatLng;
            }), this._fireMarkerDragEnd(t), this._fireEdit(), this._layerEdited = !0, this._fireChange(this._layer.getLatLngs(), "Edit"));
          },
          _adjustRectangleForMarkerMove: function (t) {
            L.extend(t._origLatLng, t._latlng);
            var e = L.PM.Utils._getRotatedRectangle(t.getLatLng(), t._oppositeCornerLatLng, this._angle || 0, this._map);
            this._layer.setLatLngs(e), this._adjustAllMarkers(), this._layer.redraw();
          },
          _adjustAllMarkers: function () {
            var t = this,
              e = this._layer.getLatLngs()[0];
            e && 4 !== e.length && e.length > 0 ? (e.forEach(function (e, i) {
              t._cornerMarkers[i].setLatLng(e);
            }), this._cornerMarkers.slice(e.length).forEach(function (t) {
              t.setLatLng(e[0]);
            })) : e && e.length ? this._cornerMarkers.forEach(function (t) {
              t.setLatLng(e[t._index]);
            }) : console.error("The layer has no LatLngs");
          },
          _findCorners: function () {
            var t = this._layer.getLatLngs()[0];
            return L.PM.Utils._getRotatedRectangle(t[0], t[2], this._angle || 0, this._map);
          }
        }), xe.Circle = xe.extend({
          _shape: "Circle",
          initialize: function (t) {
            this._layer = t, this._enabled = !1, this._updateHiddenPolyCircle();
          },
          enable: function (t) {
            L.Util.setOptions(this, t), this._map = this._layer._map, this.options.allowEditing ? (this.enabled() || this.disable(), this._enabled = !0, this._initMarkers(), this.applyOptions(), this._layer.on("remove", this.disable, this), this._updateHiddenPolyCircle(), this._fireEnable()) : this.disable();
          },
          disable: function () {
            if (this.enabled() && !this._dragging) {
              this._centerMarker.off("dragstart", this._onCircleDragStart, this), this._centerMarker.off("drag", this._onCircleDrag, this), this._centerMarker.off("dragend", this._onCircleDragEnd, this), this._outerMarker.off("drag", this._handleOuterMarkerSnapping, this), this._layer.off("remove", this.disable, this), this._enabled = !1, this._helperLayers.clearLayers();
              var t = this._layer._path ? this._layer._path : this._layer._renderer._container;
              L.DomUtil.removeClass(t, "leaflet-pm-draggable"), this._layerEdited && this._fireUpdate(), this._layerEdited = !1, this._fireDisable();
            }
          },
          enabled: function () {
            return this._enabled;
          },
          toggleEdit: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          _initMarkers: function () {
            var t = this._map;
            this._helperLayers && this._helperLayers.clearLayers(), this._helperLayers = new L.LayerGroup(), this._helperLayers._pmTempLayer = !0, this._helperLayers.addTo(t);
            var e = this._layer.getLatLng(),
              i = this._layer._radius,
              n = this._getLatLngOnCircle(e, i);
            this._centerMarker = this._createCenterMarker(e), this._outerMarker = this._createOuterMarker(n), this._markers = [this._centerMarker, this._outerMarker], this._createHintLine(this._centerMarker, this._outerMarker);
          },
          applyOptions: function () {
            this.options.snappable ? (this._initSnappableMarkers(), this._outerMarker.on("drag", this._handleOuterMarkerSnapping, this), this._outerMarker.on("move", this._syncHintLine, this), this._outerMarker.on("move", this._syncCircleRadius, this), this._centerMarker.on("move", this._moveCircle, this)) : this._disableSnapping();
          },
          _createHintLine: function (t, e) {
            var i = t.getLatLng(),
              n = e.getLatLng();
            this._hintline = L.polyline([i, n], this.options.hintlineStyle), this._setPane(this._hintline, "layerPane"), this._hintline._pmTempLayer = !0, this._helperLayers.addLayer(this._hintline);
          },
          _createCenterMarker: function (t) {
            var e = this._createMarker(t);
            return L.DomUtil.addClass(e._icon, "leaflet-pm-draggable"), e.on("drag", this._moveCircle, this), e.on("dragstart", this._onCircleDragStart, this), e.on("drag", this._onCircleDrag, this), e.on("dragend", this._onCircleDragEnd, this), e;
          },
          _createOuterMarker: function (t) {
            var e = this._createMarker(t);
            return e.on("drag", this._resizeCircle, this), e;
          },
          _createMarker: function (t) {
            var e = new L.Marker(t, {
              draggable: !0,
              icon: L.divIcon({
                className: "marker-icon"
              })
            });
            return this._setPane(e, "vertexPane"), e._origLatLng = t, e._pmTempLayer = !0, e.on("dragstart", this._onMarkerDragStart, this), e.on("drag", this._onMarkerDrag, this), e.on("dragend", this._onMarkerDragEnd, this), this._helperLayers.addLayer(e), e;
          },
          _resizeCircle: function () {
            this._outerMarker.setLatLng(this._getNewDestinationOfOuterMarker()), this._syncHintLine(), this._syncCircleRadius();
          },
          _moveCircle: function (t) {
            if (!t.target._cancelDragEventChain) {
              var e = t.latlng;
              this._layer.setLatLng(e);
              var i = this._layer._radius,
                n = this._getLatLngOnCircle(e, i);
              this._outerMarker._latlng = n, this._outerMarker.update(), this._syncHintLine(), this._updateHiddenPolyCircle(), this._fireCenterPlaced("Edit"), this._fireChange(this._layer.getLatLng(), "Edit");
            }
          },
          _syncCircleRadius: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._outerMarker.getLatLng(),
              i = this._map.distance(t, e);
            this.options.minRadiusCircle && i < this.options.minRadiusCircle ? this._layer.setRadius(this.options.minRadiusCircle) : this.options.maxRadiusCircle && i > this.options.maxRadiusCircle ? this._layer.setRadius(this.options.maxRadiusCircle) : this._layer.setRadius(i), this._updateHiddenPolyCircle(), this._fireChange(this._layer.getLatLng(), "Edit");
          },
          _syncHintLine: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._outerMarker.getLatLng();
            this._hintline.setLatLngs([t, e]);
          },
          _disableSnapping: function () {
            var t = this;
            this._markers.forEach(function (e) {
              e.off("move", t._syncHintLine, t), e.off("move", t._syncCircleRadius, t), e.off("drag", t._handleSnapping, t), e.off("dragend", t._cleanupSnapping, t);
            }), this._layer.off("pm:dragstart", this._unsnap, this);
          },
          _onMarkerDragStart: function (t) {
            this._vertexValidation("move", t) && this._fireMarkerDragStart(t);
          },
          _onMarkerDrag: function (t) {
            var e = t.target;
            this._vertexValidationDrag(e) && this._fireMarkerDrag(t);
          },
          _onMarkerDragEnd: function (t) {
            var e = t.target;
            this._vertexValidationDragEnd(e) && (this._fireEdit(), this._layerEdited = !0, this._fireMarkerDragEnd(t));
          },
          _onCircleDragStart: function (t) {
            this._vertexValidationDrag(t.target) ? (delete this._vertexValidationReset, this._fireDragStart()) : this._vertexValidationReset = !0;
          },
          _onCircleDrag: function (t) {
            this._vertexValidationReset || this._fireDrag(t);
          },
          _onCircleDragEnd: function () {
            this._vertexValidationReset ? delete this._vertexValidationReset : this._fireDragEnd();
          },
          _updateHiddenPolyCircle: function () {
            var t = this._map && this._map.pm._isCRSSimple();
            this._hiddenPolyCircle ? this._hiddenPolyCircle.setLatLngs(L.PM.Utils.circleToPolygon(this._layer, 200, !t).getLatLngs()) : this._hiddenPolyCircle = L.PM.Utils.circleToPolygon(this._layer, 200, !t), this._hiddenPolyCircle._parentCopy || (this._hiddenPolyCircle._parentCopy = this._layer);
          },
          _getLatLngOnCircle: function (t, e) {
            var i = this._map.project(t),
              n = L.point(i.x + e, i.y);
            return this._map.unproject(n);
          },
          _getNewDestinationOfOuterMarker: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._outerMarker.getLatLng(),
              i = this._map.distance(t, e);
            return this.options.minRadiusCircle && i < this.options.minRadiusCircle ? e = z(this._map, t, e, this.options.minRadiusCircle) : this.options.maxRadiusCircle && i > this.options.maxRadiusCircle && (e = z(this._map, t, e, this.options.maxRadiusCircle)), e;
          },
          _handleOuterMarkerSnapping: function () {
            if (this._outerMarker._snapped) {
              var t = this._centerMarker.getLatLng(),
                e = this._outerMarker.getLatLng(),
                i = this._map.distance(t, e);
              (this.options.minRadiusCircle && i < this.options.minRadiusCircle || this.options.maxRadiusCircle && i > this.options.maxRadiusCircle) && this._outerMarker.setLatLng(this._outerMarker._orgLatLng);
            }
            this._outerMarker.setLatLng(this._getNewDestinationOfOuterMarker());
          }
        }), xe.CircleMarker = xe.extend({
          _shape: "CircleMarker",
          initialize: function (t) {
            this._layer = t, this._enabled = !1, this._updateHiddenPolyCircle();
          },
          enable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
              draggable: !0,
              snappable: !0
            };
            L.Util.setOptions(this, t), this.options.allowEditing && this._layer._map ? (this._map = this._layer._map, this.enabled() && this.disable(), this.applyOptions(), this._layer.on("remove", this.disable, this), this._enabled = !0, this._layer.on("pm:dragstart", this._onDragStart, this), this._layer.on("pm:drag", this._onMarkerDrag, this), this._layer.on("pm:dragend", this._onMarkerDragEnd, this), this._updateHiddenPolyCircle(), this._fireEnable()) : this.disable();
          },
          disable: function () {
            this._dragging || (this._helperLayers && this._helperLayers.clearLayers(), this._map || (this._map = this._layer._map), this._map || (this.options.editable ? (this._map.off("move", this._syncMarkers, this), this._outerMarker && this._outerMarker.on("drag", this._handleOuterMarkerSnapping, this)) : this._map.off("move", this._updateHiddenPolyCircle, this)), this.disableLayerDrag(), this._layer.off("contextmenu", this._removeMarker, this), this._layer.off("remove", this.disable, this), this.enabled() && (this._layerEdited && this._fireUpdate(), this._layerEdited = !1, this._fireDisable()), this._enabled = !1);
          },
          enabled: function () {
            return this._enabled;
          },
          toggleEdit: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          applyOptions: function () {
            !this.options.editable && this.options.draggable ? this.enableLayerDrag() : this.disableLayerDrag(), this.options.editable ? (this._initMarkers(), this._map.on("move", this._syncMarkers, this)) : this._map.on("move", this._updateHiddenPolyCircle, this), this.options.snappable ? this.options.editable ? (this._initSnappableMarkers(), this._centerMarker.on("drag", this._moveCircle, this), this.options.editable && this._outerMarker.on("drag", this._handleOuterMarkerSnapping, this), this._outerMarker.on("move", this._syncHintLine, this), this._outerMarker.on("move", this._syncCircleRadius, this)) : this._initSnappableMarkersDrag() : this.options.editable ? this._disableSnapping() : this._disableSnappingDrag(), this.options.preventMarkerRemoval || this._layer.on("contextmenu", this._removeMarker, this);
          },
          _initMarkers: function () {
            var t = this._map;
            this._helperLayers && this._helperLayers.clearLayers(), this._helperLayers = new L.LayerGroup(), this._helperLayers._pmTempLayer = !0, this._helperLayers.addTo(t);
            var e = this._layer.getLatLng(),
              i = this._layer._radius,
              n = this._getLatLngOnCircle(e, i);
            this._centerMarker = this._createCenterMarker(e), this._outerMarker = this._createOuterMarker(n), this._markers = [this._centerMarker, this._outerMarker], this._createHintLine(this._centerMarker, this._outerMarker);
          },
          _getLatLngOnCircle: function (t, e) {
            var i = this._map.project(t),
              n = L.point(i.x + e, i.y);
            return this._map.unproject(n);
          },
          _createHintLine: function (t, e) {
            var i = t.getLatLng(),
              n = e.getLatLng();
            this._hintline = L.polyline([i, n], this.options.hintlineStyle), this._setPane(this._hintline, "layerPane"), this._hintline._pmTempLayer = !0, this._helperLayers.addLayer(this._hintline);
          },
          _createCenterMarker: function (t) {
            var e = this._createMarker(t);
            return this.options.draggable ? L.DomUtil.addClass(e._icon, "leaflet-pm-draggable") : e.dragging.disable(), e;
          },
          _createOuterMarker: function (t) {
            var e = this._createMarker(t);
            return e.on("drag", this._resizeCircle, this), e;
          },
          _createMarker: function (t) {
            var e = new L.Marker(t, {
              draggable: !0,
              icon: L.divIcon({
                className: "marker-icon"
              })
            });
            return this._setPane(e, "vertexPane"), e._origLatLng = t, e._pmTempLayer = !0, e.on("dragstart", this._onMarkerDragStart, this), e.on("drag", this._onMarkerDrag, this), e.on("dragend", this._onMarkerDragEnd, this), this._helperLayers.addLayer(e), e;
          },
          _moveCircle: function () {
            var t = this._centerMarker.getLatLng();
            this._layer.setLatLng(t);
            var e = this._layer._radius,
              i = this._getLatLngOnCircle(t, e);
            this._outerMarker._latlng = i, this._outerMarker.update(), this._syncHintLine(), this._updateHiddenPolyCircle(), this._fireCenterPlaced("Edit"), this._fireChange(this._layer.getLatLng(), "Edit");
          },
          _syncMarkers: function () {
            var t = this._layer.getLatLng(),
              e = this._layer._radius,
              i = this._getLatLngOnCircle(t, e);
            this._outerMarker.setLatLng(i), this._centerMarker.setLatLng(t), this._syncHintLine(), this._updateHiddenPolyCircle();
          },
          _resizeCircle: function () {
            this._outerMarker.setLatLng(this._getNewDestinationOfOuterMarker()), this._syncHintLine(), this._syncCircleRadius();
          },
          _syncCircleRadius: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._outerMarker.getLatLng(),
              i = this._map.project(t).distanceTo(this._map.project(e));
            this.options.minRadiusCircleMarker && i < this.options.minRadiusCircleMarker ? this._layer.setRadius(this.options.minRadiusCircleMarker) : this.options.maxRadiusCircleMarker && i > this.options.maxRadiusCircleMarker ? this._layer.setRadius(this.options.maxRadiusCircleMarker) : this._layer.setRadius(i), this._updateHiddenPolyCircle(), this._fireChange(this._layer.getLatLng(), "Edit");
          },
          _syncHintLine: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._outerMarker.getLatLng();
            this._hintline.setLatLngs([t, e]);
          },
          _removeMarker: function () {
            this.options.editable && this.disable(), this._layer.remove(), this._fireRemove(this._layer), this._fireRemove(this._map, this._layer);
          },
          _onDragStart: function () {
            this._map.pm.Draw.CircleMarker._layerIsDragging = !0;
          },
          _onMarkerDragStart: function (t) {
            this._vertexValidation("move", t) && this._fireMarkerDragStart(t);
          },
          _onMarkerDrag: function (t) {
            var e = t.target;
            e instanceof L.Marker && !this._vertexValidationDrag(e) || this._fireMarkerDrag(t);
          },
          _onMarkerDragEnd: function (t) {
            this._map.pm.Draw.CircleMarker._layerIsDragging = !1;
            var e = t.target;
            this._vertexValidationDragEnd(e) && (this.options.editable && (this._fireEdit(), this._layerEdited = !0), this._fireMarkerDragEnd(t));
          },
          _initSnappableMarkersDrag: function () {
            var t = this._layer;
            this.options.snapDistance = this.options.snapDistance || 30, this.options.snapSegment = this.options.snapSegment === undefined || this.options.snapSegment, t.off("pm:drag", this._handleSnapping, this), t.on("pm:drag", this._handleSnapping, this), t.off("pm:dragend", this._cleanupSnapping, this), t.on("pm:dragend", this._cleanupSnapping, this), t.off("pm:dragstart", this._unsnap, this), t.on("pm:dragstart", this._unsnap, this);
          },
          _disableSnappingDrag: function () {
            var t = this._layer;
            t.off("pm:drag", this._handleSnapping, this), t.off("pm:dragend", this._cleanupSnapping, this), t.off("pm:dragstart", this._unsnap, this);
          },
          _updateHiddenPolyCircle: function () {
            var t = this._layer._map || this._map;
            if (t) {
              var e = L.PM.Utils.pxRadiusToMeterRadius(this._layer.getRadius(), t, this._layer.getLatLng()),
                i = L.circle(this._layer.getLatLng(), this._layer.options);
              i.setRadius(e);
              var n = t && t.pm._isCRSSimple();
              this._hiddenPolyCircle ? this._hiddenPolyCircle.setLatLngs(L.PM.Utils.circleToPolygon(i, 200, !n).getLatLngs()) : this._hiddenPolyCircle = L.PM.Utils.circleToPolygon(i, 200, !n), this._hiddenPolyCircle._parentCopy || (this._hiddenPolyCircle._parentCopy = this._layer);
            }
          },
          _getNewDestinationOfOuterMarker: function () {
            var t = this._centerMarker.getLatLng(),
              e = this._outerMarker.getLatLng(),
              i = this._map.project(t).distanceTo(this._map.project(e));
            return this.options.minRadiusCircleMarker && i < this.options.minRadiusCircleMarker ? e = z(this._map, t, e, L.PM.Utils.pxRadiusToMeterRadius(this.options.minRadiusCircleMarker, this._map, t)) : this.options.maxRadiusCircleMarker && i > this.options.maxRadiusCircleMarker && (e = z(this._map, t, e, L.PM.Utils.pxRadiusToMeterRadius(this.options.maxRadiusCircleMarker, this._map, t))), e;
          },
          _handleOuterMarkerSnapping: function () {
            if (this._outerMarker._snapped) {
              var t = this._centerMarker.getLatLng(),
                e = this._outerMarker.getLatLng(),
                i = this._map.project(t).distanceTo(this._map.project(e));
              (this.options.minRadiusCircleMarker && i < this.options.minRadiusCircleMarker || this.options.maxRadiusCircleMarker && i > this.options.maxRadiusCircleMarker) && this._outerMarker.setLatLng(this._outerMarker._orgLatLng);
            }
            this._outerMarker.setLatLng(this._getNewDestinationOfOuterMarker());
          }
        }), xe.ImageOverlay = xe.extend({
          _shape: "ImageOverlay",
          initialize: function (t) {
            this._layer = t, this._enabled = !1;
          },
          toggleEdit: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          enabled: function () {
            return this._enabled;
          },
          enable: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
              draggable: !0,
              snappable: !0
            };
            L.Util.setOptions(this, t), this._map = this._layer._map, this._map && (this.options.allowEditing ? (this.enabled() || this.disable(), this.enableLayerDrag(), this._layer.on("remove", this.disable, this), this._enabled = !0, this._otherSnapLayers = this._findCorners(), this._fireEnable()) : this.disable());
          },
          disable: function () {
            this._dragging || (this._map || (this._map = this._layer._map), this.disableLayerDrag(), this._layer.off("remove", this.disable, this), this.enabled() || (this._layerEdited && this._fireUpdate(), this._layerEdited = !1, this._fireDisable()), this._enabled = !1);
          },
          _findCorners: function () {
            var t = this._layer.getBounds();
            return [t.getNorthWest(), t.getNorthEast(), t.getSouthEast(), t.getSouthWest()];
          }
        }), xe.Text = xe.extend({
          _shape: "Text",
          initialize: function (t) {
            this._layer = t, this._enabled = !1;
          },
          enable: function (t) {
            L.Util.setOptions(this, t), this.textArea && (this.options.allowEditing && this._layer._map ? (this._map = this._layer._map, this.enabled() && this.disable(), this.applyOptions(), this._focusChange(), this.textArea.readOnly = !1, this.textArea.classList.remove("pm-disabled"), this._layer.on("remove", this.disable, this), L.DomEvent.on(this.textArea, "input", this._autoResize, this), L.DomEvent.on(this.textArea, "focus", this._focusChange, this), L.DomEvent.on(this.textArea, "blur", this._focusChange, this), this._layer.on("dblclick", L.DomEvent.stop), L.DomEvent.off(this.textArea, "mousedown", this._preventTextSelection), this._enabled = !0, this._fireEnable()) : this.disable());
          },
          disable: function () {
            if (this.enabled()) {
              this._layer.off("remove", this.disable, this), L.DomEvent.off(this.textArea, "input", this._autoResize, this), L.DomEvent.off(this.textArea, "focus", this._focusChange, this), L.DomEvent.off(this.textArea, "blur", this._focusChange, this), L.DomEvent.off(document, "click", this._documentClick, this), this._focusChange(), this.textArea.readOnly = !0, this.textArea.classList.add("pm-disabled");
              var t = document.activeElement;
              this.textArea.focus(), this.textArea.selectionStart = 0, this.textArea.selectionEnd = 0, L.DomEvent.on(this.textArea, "mousedown", this._preventTextSelection), t.focus(), this._disableOnBlurActive = !1, this._layerEdited && this._fireUpdate(), this._layerEdited = !1, this._fireDisable(), this._enabled = !1;
            }
          },
          enabled: function () {
            return this._enabled;
          },
          toggleEdit: function (t) {
            this.enabled() ? this.disable() : this.enable(t);
          },
          applyOptions: function () {
            this.options.snappable ? this._initSnappableMarkers() : this._disableSnapping();
          },
          _initSnappableMarkers: function () {
            var t = this._layer;
            this.options.snapDistance = this.options.snapDistance || 30, this.options.snapSegment = this.options.snapSegment === undefined || this.options.snapSegment, t.off("pm:drag", this._handleSnapping, this), t.on("pm:drag", this._handleSnapping, this), t.off("pm:dragend", this._cleanupSnapping, this), t.on("pm:dragend", this._cleanupSnapping, this), t.off("pm:dragstart", this._unsnap, this), t.on("pm:dragstart", this._unsnap, this);
          },
          _disableSnapping: function () {
            var t = this._layer;
            t.off("pm:drag", this._handleSnapping, this), t.off("pm:dragend", this._cleanupSnapping, this), t.off("pm:dragstart", this._unsnap, this);
          },
          _autoResize: function () {
            this.textArea.style.height = "1px", this.textArea.style.width = "1px";
            var t = this.textArea.scrollHeight > 21 ? this.textArea.scrollHeight : 21,
              e = this.textArea.scrollWidth > 16 ? this.textArea.scrollWidth : 16;
            this.textArea.style.height = "".concat(t, "px"), this.textArea.style.width = "".concat(e, "px"), this._fireTextChange(this.getText());
          },
          _disableOnBlur: function () {
            var t = this;
            this._disableOnBlurActive = !0, setTimeout(function () {
              t.enabled() && L.DomEvent.on(document, "click", t._documentClick, t);
            }, 100);
          },
          _documentClick: function (t) {
            t.target !== this.textArea && (this.disable(), !this.getText() && this.options.removeIfEmpty && this.remove());
          },
          _focusChange: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            this._hasFocus = "focus" === t.type, this._hasFocus ? this._applyFocus() : this._removeFocus();
          },
          _applyFocus: function () {
            this.textArea.classList.add("pm-hasfocus"), this._map.dragging && (this._safeToCacheDragState && (this._originalMapDragState = this._map.dragging._enabled, this._safeToCacheDragState = !1), this._map.dragging.disable());
          },
          _removeFocus: function () {
            this._map.dragging && (this._originalMapDragState && this._map.dragging.enable(), this._safeToCacheDragState = !0), this.textArea.classList.remove("pm-hasfocus");
          },
          focus: function () {
            if (!this.enabled()) throw new TypeError("Layer is not enabled");
            this.textArea.focus();
          },
          blur: function () {
            if (!this.enabled()) throw new TypeError("Layer is not enabled");
            this.textArea.blur(), this._disableOnBlurActive && this.disable();
          },
          hasFocus: function () {
            return this._hasFocus;
          },
          getElement: function () {
            return this.textArea;
          },
          setText: function (t) {
            this.textArea.value = t, this._autoResize();
          },
          getText: function () {
            return this.textArea.value;
          },
          _initTextMarker: function () {
            if (this.textArea = L.PM.Draw.Text.prototype._createTextArea.call(this), this.options.className) {
              var t,
                e = this.options.className.split(" ");
              (t = this.textArea.classList).add.apply(t, Oe(e));
            }
            var i = L.PM.Draw.Text.prototype._createTextIcon.call(this, this.textArea);
            this._layer.setIcon(i), this._layer.once("add", this._createTextMarker, this);
          },
          _createTextMarker: function () {
            var t = arguments.length > 0 && arguments[0] !== undefined && arguments[0];
            this._layer.getElement().tabIndex = -1, this.textArea.wrap = "off", this.textArea.style.overflow = "hidden", this.textArea.style.height = L.DomUtil.getStyle(this.textArea, "font-size"), this.textArea.style.width = "1px", this._layer.options.text && this.setText(this._layer.options.text), this._autoResize(), t && (this.enable(), this.focus(), this._disableOnBlur());
          },
          _preventTextSelection: function (t) {
            t.preventDefault();
          }
        });
        var Re = function (t, e, i, n, r, a) {
          this._matrix = [t, e, i, n, r, a];
        };
        Re.init = function () {
          return new L.PM.Matrix(1, 0, 0, 1, 0, 0);
        }, Re.prototype = {
          transform: function (t) {
            return this._transform(t.clone());
          },
          _transform: function (t) {
            var e = this._matrix,
              i = t.x,
              n = t.y;
            return t.x = e[0] * i + e[1] * n + e[4], t.y = e[2] * i + e[3] * n + e[5], t;
          },
          untransform: function (t) {
            var e = this._matrix;
            return new L.Point((t.x / e[0] - e[4]) / e[0], (t.y / e[2] - e[5]) / e[2]);
          },
          clone: function () {
            var t = this._matrix;
            return new L.PM.Matrix(t[0], t[1], t[2], t[3], t[4], t[5]);
          },
          translate: function (t) {
            return t === undefined ? new L.Point(this._matrix[4], this._matrix[5]) : ("number" == typeof t ? (e = t, i = t) : (e = t.x, i = t.y), this._add(1, 0, 0, 1, e, i));
            var e, i;
          },
          scale: function (t, e) {
            return t === undefined ? new L.Point(this._matrix[0], this._matrix[3]) : (e = e || L.point(0, 0), "number" == typeof t ? (i = t, n = t) : (i = t.x, n = t.y), this._add(i, 0, 0, n, e.x, e.y)._add(1, 0, 0, 1, -e.x, -e.y));
            var i, n;
          },
          rotate: function (t, e) {
            var i = Math.cos(t),
              n = Math.sin(t);
            return e = e || new L.Point(0, 0), this._add(i, n, -n, i, e.x, e.y)._add(1, 0, 0, 1, -e.x, -e.y);
          },
          flip: function () {
            return this._matrix[1] *= -1, this._matrix[2] *= -1, this;
          },
          _add: function (t, e, i, n, r, a) {
            var o,
              s = [[], [], []],
              l = this._matrix,
              h = [[l[0], l[2], l[4]], [l[1], l[3], l[5]], [0, 0, 1]],
              u = [[t, i, r], [e, n, a], [0, 0, 1]];
            t && t instanceof L.PM.Matrix && (u = [[(l = t._matrix)[0], l[2], l[4]], [l[1], l[3], l[5]], [0, 0, 1]]);
            for (var c = 0; c < 3; c += 1) for (var p = 0; p < 3; p += 1) {
              o = 0;
              for (var d = 0; d < 3; d += 1) o += h[c][d] * u[d][p];
              s[c][p] = o;
            }
            return this._matrix = [s[0][0], s[1][0], s[0][1], s[1][1], s[0][2], s[1][2]], this;
          }
        };
        const Be = Re;
        var Te = {
          calcMiddleLatLng: function (t, e, i) {
            var n = t.project(e),
              r = t.project(i);
            return t.unproject(n._add(r)._divideBy(2));
          },
          findLayers: function (t) {
            var e = [];
            return t.eachLayer(function (t) {
              (t instanceof L.Polyline || t instanceof L.Marker || t instanceof L.Circle || t instanceof L.CircleMarker || t instanceof L.ImageOverlay) && e.push(t);
            }), e = (e = (e = e.filter(function (t) {
              return !!t.pm;
            })).filter(function (t) {
              return !t._pmTempLayer;
            })).filter(function (t) {
              return !L.PM.optIn && !t.options.pmIgnore || L.PM.optIn && !1 === t.options.pmIgnore;
            });
          },
          circleToPolygon: function (t) {
            for (var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60, i = !(arguments.length > 2 && arguments[2] !== undefined) || arguments[2], n = t.getLatLng(), r = t.getRadius(), a = N(n, r, e, 0, i), o = [], s = 0; s < a.length; s += 1) {
              var l = [a[s].lat, a[s].lng];
              o.push(l);
            }
            return L.polygon(o, t.options);
          },
          disablePopup: function (t) {
            t.getPopup() && (t._tempPopupCopy = t.getPopup(), t.unbindPopup());
          },
          enablePopup: function (t) {
            t._tempPopupCopy && (t.bindPopup(t._tempPopupCopy), delete t._tempPopupCopy);
          },
          _fireEvent: function (t, e, i) {
            var n = arguments.length > 3 && arguments[3] !== undefined && arguments[3];
            t.fire(e, i, n);
            var r = this.getAllParentGroups(t),
              a = r.groups;
            a.forEach(function (t) {
              t.fire(e, i, n);
            });
          },
          getAllParentGroups: function (t) {
            var e = [],
              i = [];
            return !t._pmLastGroupFetch || !t._pmLastGroupFetch.time || new Date().getTime() - t._pmLastGroupFetch.time > 1e3 ? (function n(t) {
              for (var r in t._eventParents) if (-1 === e.indexOf(r)) {
                e.push(r);
                var a = t._eventParents[r];
                i.push(a), n(a);
              }
            }(t), t._pmLastGroupFetch = {
              time: new Date().getTime(),
              groups: i,
              groupIds: e
            }, {
              groupIds: e,
              groups: i
            }) : {
              groups: t._pmLastGroupFetch.groups,
              groupIds: t._pmLastGroupFetch.groupIds
            };
          },
          createGeodesicPolygon: N,
          getTranslation: I,
          findDeepCoordIndex: function (t, e) {
            var i;
            t.some(function r(t) {
              return function (n, a) {
                var o = t.concat(a);
                return n.lat && n.lat === e.lat && n.lng === e.lng ? (i = o, !0) : Array.isArray(n) && n.some(r(o));
              };
            }([]));
            var n = {};
            return i && (n = {
              indexPath: i,
              index: i[i.length - 1],
              parentPath: i.slice(0, i.length - 1)
            }), n;
          },
          findDeepMarkerIndex: function (t, e) {
            var i;
            t.some(function r(t) {
              return function (n, a) {
                var o = t.concat(a);
                return n._leaflet_id === e._leaflet_id ? (i = o, !0) : Array.isArray(n) && n.some(r(o));
              };
            }([]));
            var n = {};
            return i && (n = {
              indexPath: i,
              index: i[i.length - 1],
              parentPath: i.slice(0, i.length - 1)
            }), n;
          },
          _getIndexFromSegment: function (t, e) {
            if (e && 2 === e.length) {
              var i = this.findDeepCoordIndex(t, e[0]),
                n = this.findDeepCoordIndex(t, e[1]),
                r = Math.max(i.index, n.index);
              return 0 !== i.index && 0 !== n.index || 1 === r || (r += 1), {
                indexA: i,
                indexB: n,
                newIndex: r,
                indexPath: i.indexPath,
                parentPath: i.parentPath
              };
            }
            return null;
          },
          _getRotatedRectangle: function (t, e, i, n) {
            var r = Le(n, t),
              a = Le(n, e),
              o = i * Math.PI / 180,
              s = Math.cos(o),
              l = Math.sin(o),
              h = (a.x - r.x) * s + (a.y - r.y) * l,
              u = (a.y - r.y) * s - (a.x - r.x) * l,
              c = h * s + r.x,
              p = h * l + r.y,
              d = -u * l + r.x,
              f = u * s + r.y;
            return [be(n, r), be(n, {
              x: c,
              y: p
            }), be(n, a), be(n, {
              x: d,
              y: f
            })];
          },
          pxRadiusToMeterRadius: function (t, e, i) {
            var n = e.project(i),
              r = L.point(n.x + t, n.y);
            return e.distance(e.unproject(r), i);
          }
        };
        const Ie = Te;
        L.PM = L.PM || {
          version: "2.13.0",
          Map: K,
          Toolbar: Q,
          Draw: at,
          Edit: xe,
          Utils: Ie,
          Matrix: Be,
          activeLang: "en",
          optIn: !1,
          initialize: function (t) {
            this.addInitHooks(t);
          },
          setOptIn: function (t) {
            this.optIn = !!t;
          },
          addInitHooks: function () {
            L.Map.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Map(this)) : this.options.pmIgnore || (this.pm = new L.PM.Map(this));
            }), L.LayerGroup.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Edit.LayerGroup(this)) : this.options.pmIgnore || (this.pm = new L.PM.Edit.LayerGroup(this));
            }), L.Marker.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.options.textMarker ? (this.pm = new L.PM.Edit.Text(this), this.options._textMarkerOverPM || this.pm._initTextMarker(), delete this.options._textMarkerOverPM) : this.pm = new L.PM.Edit.Marker(this)) : this.options.pmIgnore || (this.options.textMarker ? (this.pm = new L.PM.Edit.Text(this), this.options._textMarkerOverPM || this.pm._initTextMarker(), delete this.options._textMarkerOverPM) : this.pm = new L.PM.Edit.Marker(this));
            }), L.CircleMarker.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Edit.CircleMarker(this)) : this.options.pmIgnore || (this.pm = new L.PM.Edit.CircleMarker(this));
            }), L.Polyline.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Edit.Line(this)) : this.options.pmIgnore || (this.pm = new L.PM.Edit.Line(this));
            }), L.Polygon.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Edit.Polygon(this)) : this.options.pmIgnore || (this.pm = new L.PM.Edit.Polygon(this));
            }), L.Rectangle.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Edit.Rectangle(this)) : this.options.pmIgnore || (this.pm = new L.PM.Edit.Rectangle(this));
            }), L.Circle.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Edit.Circle(this)) : this.options.pmIgnore || (this.pm = new L.PM.Edit.Circle(this));
            }), L.ImageOverlay.addInitHook(function () {
              this.pm = undefined, L.PM.optIn ? !1 === this.options.pmIgnore && (this.pm = new L.PM.Edit.ImageOverlay(this)) : this.options.pmIgnore || (this.pm = new L.PM.Edit.ImageOverlay(this));
            });
          },
          reInitLayer: function (t) {
            var e = this;
            t instanceof L.LayerGroup && t.eachLayer(function (t) {
              e.reInitLayer(t);
            }), t.pm || L.PM.optIn && !1 !== t.options.pmIgnore || t.options.pmIgnore || (t instanceof L.Map ? t.pm = new L.PM.Map(t) : t instanceof L.Marker ? t.pm = new L.PM.Edit.Marker(t) : t instanceof L.Circle ? t.pm = new L.PM.Edit.Circle(t) : t instanceof L.CircleMarker ? t.pm = new L.PM.Edit.CircleMarker(t) : t instanceof L.Rectangle ? t.pm = new L.PM.Edit.Rectangle(t) : t instanceof L.Polygon ? t.pm = new L.PM.Edit.Polygon(t) : t instanceof L.Polyline ? t.pm = new L.PM.Edit.Line(t) : t instanceof L.LayerGroup ? t.pm = new L.PM.Edit.LayerGroup(t) : t instanceof L.ImageOverlay && (t.pm = new L.PM.Edit.ImageOverlay(t)));
          }
        }, L.PM.initialize();
      },
      7107: () => {
        Array.prototype.findIndex = Array.prototype.findIndex || function (t) {
          if (null === this) throw new TypeError("Array.prototype.findIndex called on null or undefined");
          if ("function" != typeof t) throw new TypeError("callback must be a function");
          for (var e = Object(this), i = e.length >>> 0, n = arguments[1], r = 0; r < i; r++) if (t.call(n, e[r], r, e)) return r;
          return -1;
        }, Array.prototype.find = Array.prototype.find || function (t) {
          if (null === this) throw new TypeError("Array.prototype.find called on null or undefined");
          if ("function" != typeof t) throw new TypeError("callback must be a function");
          for (var e = Object(this), i = e.length >>> 0, n = arguments[1], r = 0; r < i; r++) {
            var a = e[r];
            if (t.call(n, a, r, e)) return a;
          }
        }, "function" != typeof Object.assign && (Object.assign = function (t) {
          "use strict";

          if (null == t) throw new TypeError("Cannot convert undefined or null to object");
          t = Object(t);
          for (var e = 1; e < arguments.length; e++) {
            var i = arguments[e];
            if (null != i) for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
          }
          return t;
        }), [Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(function (t) {
          t.hasOwnProperty("remove") || Object.defineProperty(t, "remove", {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            value: function () {
              this.parentNode.removeChild(this);
            }
          });
        }), Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
          value: function (t, e) {
            if (null == this) throw new TypeError('"this" is null or not defined');
            var i = Object(this),
              n = i.length >>> 0;
            if (0 === n) return !1;
            var r,
              a,
              o = 0 | e,
              s = Math.max(o >= 0 ? o : n - Math.abs(o), 0);
            for (; s < n;) {
              if ((r = i[s]) === (a = t) || "number" == typeof r && "number" == typeof a && isNaN(r) && isNaN(a)) return !0;
              s++;
            }
            return !1;
          }
        });
      },
      1787: (t, e, i) => {
        var n = i(2582),
          r = i(4102),
          a = i(1540),
          o = i(9705).Z,
          s = a.featureEach,
          l = (a.coordEach, r.polygon, r.featureCollection);
        function h(t) {
          var e = new n(t);
          return e.insert = function (t) {
            if ("Feature" !== t.type) throw new Error("invalid feature");
            return t.bbox = t.bbox ? t.bbox : o(t), n.prototype.insert.call(this, t);
          }, e.load = function (t) {
            var e = [];
            return Array.isArray(t) ? t.forEach(function (t) {
              if ("Feature" !== t.type) throw new Error("invalid features");
              t.bbox = t.bbox ? t.bbox : o(t), e.push(t);
            }) : s(t, function (t) {
              if ("Feature" !== t.type) throw new Error("invalid features");
              t.bbox = t.bbox ? t.bbox : o(t), e.push(t);
            }), n.prototype.load.call(this, e);
          }, e.remove = function (t, e) {
            if ("Feature" !== t.type) throw new Error("invalid feature");
            return t.bbox = t.bbox ? t.bbox : o(t), n.prototype.remove.call(this, t, e);
          }, e.clear = function () {
            return n.prototype.clear.call(this);
          }, e.search = function (t) {
            var e = n.prototype.search.call(this, this.toBBox(t));
            return l(e);
          }, e.collides = function (t) {
            return n.prototype.collides.call(this, this.toBBox(t));
          }, e.all = function () {
            var t = n.prototype.all.call(this);
            return l(t);
          }, e.toJSON = function () {
            return n.prototype.toJSON.call(this);
          }, e.fromJSON = function (t) {
            return n.prototype.fromJSON.call(this, t);
          }, e.toBBox = function (t) {
            var e;
            if (t.bbox) e = t.bbox;else if (Array.isArray(t) && 4 === t.length) e = t;else if (Array.isArray(t) && 6 === t.length) e = [t[0], t[1], t[3], t[4]];else if ("Feature" === t.type) e = o(t);else {
              if ("FeatureCollection" !== t.type) throw new Error("invalid geojson");
              e = o(t);
            }
            return {
              minX: e[0],
              minY: e[1],
              maxX: e[2],
              maxY: e[3]
            };
          }, e;
        }
        t.exports = h, t.exports["default"] = h;
      },
      1989: (t, e, i) => {
        var n = i(1789),
          r = i(401),
          a = i(7667),
          o = i(1327),
          s = i(1866);
        function l(t) {
          var e = -1,
            i = null == t ? 0 : t.length;
          for (this.clear(); ++e < i;) {
            var n = t[e];
            this.set(n[0], n[1]);
          }
        }
        l.prototype.clear = n, l.prototype["delete"] = r, l.prototype.get = a, l.prototype.has = o, l.prototype.set = s, t.exports = l;
      },
      8407: (t, e, i) => {
        var n = i(7040),
          r = i(4125),
          a = i(2117),
          o = i(7518),
          s = i(4705);
        function l(t) {
          var e = -1,
            i = null == t ? 0 : t.length;
          for (this.clear(); ++e < i;) {
            var n = t[e];
            this.set(n[0], n[1]);
          }
        }
        l.prototype.clear = n, l.prototype["delete"] = r, l.prototype.get = a, l.prototype.has = o, l.prototype.set = s, t.exports = l;
      },
      7071: (t, e, i) => {
        var n = i(852)(i(5639), "Map");
        t.exports = n;
      },
      3369: (t, e, i) => {
        var n = i(4785),
          r = i(1285),
          a = i(6e3),
          o = i(9916),
          s = i(5265);
        function l(t) {
          var e = -1,
            i = null == t ? 0 : t.length;
          for (this.clear(); ++e < i;) {
            var n = t[e];
            this.set(n[0], n[1]);
          }
        }
        l.prototype.clear = n, l.prototype["delete"] = r, l.prototype.get = a, l.prototype.has = o, l.prototype.set = s, t.exports = l;
      },
      6384: (t, e, i) => {
        var n = i(8407),
          r = i(7465),
          a = i(3779),
          o = i(7599),
          s = i(4758),
          l = i(4309);
        function h(t) {
          var e = this.__data__ = new n(t);
          this.size = e.size;
        }
        h.prototype.clear = r, h.prototype["delete"] = a, h.prototype.get = o, h.prototype.has = s, h.prototype.set = l, t.exports = h;
      },
      2705: (t, e, i) => {
        var n = i(5639).Symbol;
        t.exports = n;
      },
      1149: (t, e, i) => {
        var n = i(5639).Uint8Array;
        t.exports = n;
      },
      6874: t => {
        t.exports = function (t, e, i) {
          switch (i.length) {
            case 0:
              return t.call(e);
            case 1:
              return t.call(e, i[0]);
            case 2:
              return t.call(e, i[0], i[1]);
            case 3:
              return t.call(e, i[0], i[1], i[2]);
          }
          return t.apply(e, i);
        };
      },
      4636: (t, e, i) => {
        var n = i(2545),
          r = i(5694),
          a = i(1469),
          o = i(4144),
          s = i(5776),
          l = i(6719),
          h = Object.prototype.hasOwnProperty;
        t.exports = function (t, e) {
          var i = a(t),
            u = !i && r(t),
            c = !i && !u && o(t),
            p = !i && !u && !c && l(t),
            d = i || u || c || p,
            f = d ? n(t.length, String) : [],
            g = f.length;
          for (var _ in t) !e && !h.call(t, _) || d && ("length" == _ || c && ("offset" == _ || "parent" == _) || p && ("buffer" == _ || "byteLength" == _ || "byteOffset" == _) || s(_, g)) || f.push(_);
          return f;
        };
      },
      9932: t => {
        t.exports = function (t, e) {
          for (var i = -1, n = null == t ? 0 : t.length, r = Array(n); ++i < n;) r[i] = e(t[i], i, t);
          return r;
        };
      },
      6556: (t, e, i) => {
        var n = i(9465),
          r = i(7813);
        t.exports = function (t, e, i) {
          (i !== undefined && !r(t[e], i) || i === undefined && !(e in t)) && n(t, e, i);
        };
      },
      4865: (t, e, i) => {
        var n = i(9465),
          r = i(7813),
          a = Object.prototype.hasOwnProperty;
        t.exports = function (t, e, i) {
          var o = t[e];
          a.call(t, e) && r(o, i) && (i !== undefined || e in t) || n(t, e, i);
        };
      },
      8470: (t, e, i) => {
        var n = i(7813);
        t.exports = function (t, e) {
          for (var i = t.length; i--;) if (n(t[i][0], e)) return i;
          return -1;
        };
      },
      9465: (t, e, i) => {
        var n = i(8777);
        t.exports = function (t, e, i) {
          "__proto__" == e && n ? n(t, e, {
            configurable: !0,
            enumerable: !0,
            value: i,
            writable: !0
          }) : t[e] = i;
        };
      },
      3118: (t, e, i) => {
        var n = i(3218),
          r = Object.create,
          a = function () {
            function t() {}
            return function (e) {
              if (!n(e)) return {};
              if (r) return r(e);
              t.prototype = e;
              var i = new t();
              return t.prototype = undefined, i;
            };
          }();
        t.exports = a;
      },
      8483: (t, e, i) => {
        var n = i(5063)();
        t.exports = n;
      },
      7786: (t, e, i) => {
        var n = i(1811),
          r = i(327);
        t.exports = function (t, e) {
          for (var i = 0, a = (e = n(e, t)).length; null != t && i < a;) t = t[r(e[i++])];
          return i && i == a ? t : undefined;
        };
      },
      4239: (t, e, i) => {
        var n = i(2705),
          r = i(9607),
          a = i(2333),
          o = n ? n.toStringTag : undefined;
        t.exports = function (t) {
          return null == t ? t === undefined ? "[object Undefined]" : "[object Null]" : o && o in Object(t) ? r(t) : a(t);
        };
      },
      8565: t => {
        var e = Object.prototype.hasOwnProperty;
        t.exports = function (t, i) {
          return null != t && e.call(t, i);
        };
      },
      9454: (t, e, i) => {
        var n = i(4239),
          r = i(7005);
        t.exports = function (t) {
          return r(t) && "[object Arguments]" == n(t);
        };
      },
      8458: (t, e, i) => {
        var n = i(3560),
          r = i(5346),
          a = i(3218),
          o = i(346),
          s = /^\[object .+?Constructor\]$/,
          l = Function.prototype,
          h = Object.prototype,
          u = l.toString,
          c = h.hasOwnProperty,
          p = RegExp("^" + u.call(c).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        t.exports = function (t) {
          return !(!a(t) || r(t)) && (n(t) ? p : s).test(o(t));
        };
      },
      8749: (t, e, i) => {
        var n = i(4239),
          r = i(1780),
          a = i(7005),
          o = {};
        o["[object Float32Array]"] = o["[object Float64Array]"] = o["[object Int8Array]"] = o["[object Int16Array]"] = o["[object Int32Array]"] = o["[object Uint8Array]"] = o["[object Uint8ClampedArray]"] = o["[object Uint16Array]"] = o["[object Uint32Array]"] = !0, o["[object Arguments]"] = o["[object Array]"] = o["[object ArrayBuffer]"] = o["[object Boolean]"] = o["[object DataView]"] = o["[object Date]"] = o["[object Error]"] = o["[object Function]"] = o["[object Map]"] = o["[object Number]"] = o["[object Object]"] = o["[object RegExp]"] = o["[object Set]"] = o["[object String]"] = o["[object WeakMap]"] = !1, t.exports = function (t) {
          return a(t) && r(t.length) && !!o[n(t)];
        };
      },
      313: (t, e, i) => {
        var n = i(3218),
          r = i(5726),
          a = i(3498),
          o = Object.prototype.hasOwnProperty;
        t.exports = function (t) {
          if (!n(t)) return a(t);
          var e = r(t),
            i = [];
          for (var s in t) ("constructor" != s || !e && o.call(t, s)) && i.push(s);
          return i;
        };
      },
      2980: (t, e, i) => {
        var n = i(6384),
          r = i(6556),
          a = i(8483),
          o = i(9783),
          s = i(3218),
          l = i(1704),
          h = i(6390);
        t.exports = function u(t, e, i, c, p) {
          t !== e && a(e, function (a, l) {
            if (p || (p = new n()), s(a)) o(t, e, l, i, u, c, p);else {
              var d = c ? c(h(t, l), a, l + "", t, e, p) : undefined;
              d === undefined && (d = a), r(t, l, d);
            }
          }, l);
        };
      },
      9783: (t, e, i) => {
        var n = i(6556),
          r = i(4626),
          a = i(7133),
          o = i(278),
          s = i(8517),
          l = i(5694),
          h = i(1469),
          u = i(9246),
          c = i(4144),
          p = i(3560),
          d = i(3218),
          f = i(8630),
          g = i(6719),
          _ = i(6390),
          m = i(9881);
        t.exports = function (t, e, i, y, v, L, b) {
          var k = _(t, i),
            M = _(e, i),
            x = b.get(M);
          if (x) n(t, i, x);else {
            var w = L ? L(k, M, i + "", t, e, b) : undefined,
              C = w === undefined;
            if (C) {
              var P = h(M),
                E = !P && c(M),
                S = !P && !E && g(M);
              w = M, P || E || S ? h(k) ? w = k : u(k) ? w = o(k) : E ? (C = !1, w = r(M, !0)) : S ? (C = !1, w = a(M, !0)) : w = [] : f(M) || l(M) ? (w = k, l(k) ? w = m(k) : d(k) && !p(k) || (w = s(M))) : C = !1;
            }
            C && (b.set(M, w), v(w, M, y, L, b), b["delete"](M)), n(t, i, w);
          }
        };
      },
      5976: (t, e, i) => {
        var n = i(6557),
          r = i(5357),
          a = i(61);
        t.exports = function (t, e) {
          return a(r(t, e, n), t + "");
        };
      },
      6560: (t, e, i) => {
        var n = i(5703),
          r = i(8777),
          a = i(6557),
          o = r ? function (t, e) {
            return r(t, "toString", {
              configurable: !0,
              enumerable: !1,
              value: n(e),
              writable: !0
            });
          } : a;
        t.exports = o;
      },
      2545: t => {
        t.exports = function (t, e) {
          for (var i = -1, n = Array(t); ++i < t;) n[i] = e(i);
          return n;
        };
      },
      531: (t, e, i) => {
        var n = i(2705),
          r = i(9932),
          a = i(1469),
          o = i(3448),
          s = n ? n.prototype : undefined,
          l = s ? s.toString : undefined;
        t.exports = function h(t) {
          if ("string" == typeof t) return t;
          if (a(t)) return r(t, h) + "";
          if (o(t)) return l ? l.call(t) : "";
          var e = t + "";
          return "0" == e && 1 / t == -Infinity ? "-0" : e;
        };
      },
      1717: t => {
        t.exports = function (t) {
          return function (e) {
            return t(e);
          };
        };
      },
      1811: (t, e, i) => {
        var n = i(1469),
          r = i(5403),
          a = i(5514),
          o = i(9833);
        t.exports = function (t, e) {
          return n(t) ? t : r(t, e) ? [t] : a(o(t));
        };
      },
      4318: (t, e, i) => {
        var n = i(1149);
        t.exports = function (t) {
          var e = new t.constructor(t.byteLength);
          return new n(e).set(new n(t)), e;
        };
      },
      4626: (t, e, i) => {
        t = i.nmd(t);
        var n = i(5639),
          r = e && !e.nodeType && e,
          a = r && t && !t.nodeType && t,
          o = a && a.exports === r ? n.Buffer : undefined,
          s = o ? o.allocUnsafe : undefined;
        t.exports = function (t, e) {
          if (e) return t.slice();
          var i = t.length,
            n = s ? s(i) : new t.constructor(i);
          return t.copy(n), n;
        };
      },
      7133: (t, e, i) => {
        var n = i(4318);
        t.exports = function (t, e) {
          var i = e ? n(t.buffer) : t.buffer;
          return new t.constructor(i, t.byteOffset, t.length);
        };
      },
      278: t => {
        t.exports = function (t, e) {
          var i = -1,
            n = t.length;
          for (e || (e = Array(n)); ++i < n;) e[i] = t[i];
          return e;
        };
      },
      8363: (t, e, i) => {
        var n = i(4865),
          r = i(9465);
        t.exports = function (t, e, i, a) {
          var o = !i;
          i || (i = {});
          for (var s = -1, l = e.length; ++s < l;) {
            var h = e[s],
              u = a ? a(i[h], t[h], h, i, t) : undefined;
            u === undefined && (u = t[h]), o ? r(i, h, u) : n(i, h, u);
          }
          return i;
        };
      },
      4429: (t, e, i) => {
        var n = i(5639)["__core-js_shared__"];
        t.exports = n;
      },
      1463: (t, e, i) => {
        var n = i(5976),
          r = i(6612);
        t.exports = function (t) {
          return n(function (e, i) {
            var n = -1,
              a = i.length,
              o = a > 1 ? i[a - 1] : undefined,
              s = a > 2 ? i[2] : undefined;
            for (o = t.length > 3 && "function" == typeof o ? (a--, o) : undefined, s && r(i[0], i[1], s) && (o = a < 3 ? undefined : o, a = 1), e = Object(e); ++n < a;) {
              var l = i[n];
              l && t(e, l, n, o);
            }
            return e;
          });
        };
      },
      5063: t => {
        t.exports = function (t) {
          return function (e, i, n) {
            for (var r = -1, a = Object(e), o = n(e), s = o.length; s--;) {
              var l = o[t ? s : ++r];
              if (!1 === i(a[l], l, a)) break;
            }
            return e;
          };
        };
      },
      8777: (t, e, i) => {
        var n = i(852),
          r = function () {
            try {
              var t = n(Object, "defineProperty");
              return t({}, "", {}), t;
            } catch (e) {}
          }();
        t.exports = r;
      },
      1957: (t, e, i) => {
        var n = "object" == typeof i.g && i.g && i.g.Object === Object && i.g;
        t.exports = n;
      },
      5050: (t, e, i) => {
        var n = i(7019);
        t.exports = function (t, e) {
          var i = t.__data__;
          return n(e) ? i["string" == typeof e ? "string" : "hash"] : i.map;
        };
      },
      852: (t, e, i) => {
        var n = i(8458),
          r = i(7801);
        t.exports = function (t, e) {
          var i = r(t, e);
          return n(i) ? i : undefined;
        };
      },
      5924: (t, e, i) => {
        var n = i(5569)(Object.getPrototypeOf, Object);
        t.exports = n;
      },
      9607: (t, e, i) => {
        var n = i(2705),
          r = Object.prototype,
          a = r.hasOwnProperty,
          o = r.toString,
          s = n ? n.toStringTag : undefined;
        t.exports = function (t) {
          var e = a.call(t, s),
            i = t[s];
          try {
            t[s] = undefined;
            var n = !0;
          } catch (l) {}
          var r = o.call(t);
          return n && (e ? t[s] = i : delete t[s]), r;
        };
      },
      7801: t => {
        t.exports = function (t, e) {
          return null == t ? undefined : t[e];
        };
      },
      222: (t, e, i) => {
        var n = i(1811),
          r = i(5694),
          a = i(1469),
          o = i(5776),
          s = i(1780),
          l = i(327);
        t.exports = function (t, e, i) {
          for (var h = -1, u = (e = n(e, t)).length, c = !1; ++h < u;) {
            var p = l(e[h]);
            if (!(c = null != t && i(t, p))) break;
            t = t[p];
          }
          return c || ++h != u ? c : !!(u = null == t ? 0 : t.length) && s(u) && o(p, u) && (a(t) || r(t));
        };
      },
      1789: (t, e, i) => {
        var n = i(4536);
        t.exports = function () {
          this.__data__ = n ? n(null) : {}, this.size = 0;
        };
      },
      401: t => {
        t.exports = function (t) {
          var e = this.has(t) && delete this.__data__[t];
          return this.size -= e ? 1 : 0, e;
        };
      },
      7667: (t, e, i) => {
        var n = i(4536),
          r = Object.prototype.hasOwnProperty;
        t.exports = function (t) {
          var e = this.__data__;
          if (n) {
            var i = e[t];
            return "__lodash_hash_undefined__" === i ? undefined : i;
          }
          return r.call(e, t) ? e[t] : undefined;
        };
      },
      1327: (t, e, i) => {
        var n = i(4536),
          r = Object.prototype.hasOwnProperty;
        t.exports = function (t) {
          var e = this.__data__;
          return n ? e[t] !== undefined : r.call(e, t);
        };
      },
      1866: (t, e, i) => {
        var n = i(4536);
        t.exports = function (t, e) {
          var i = this.__data__;
          return this.size += this.has(t) ? 0 : 1, i[t] = n && e === undefined ? "__lodash_hash_undefined__" : e, this;
        };
      },
      8517: (t, e, i) => {
        var n = i(3118),
          r = i(5924),
          a = i(5726);
        t.exports = function (t) {
          return "function" != typeof t.constructor || a(t) ? {} : n(r(t));
        };
      },
      5776: t => {
        var e = /^(?:0|[1-9]\d*)$/;
        t.exports = function (t, i) {
          var n = typeof t;
          return !!(i = null == i ? 9007199254740991 : i) && ("number" == n || "symbol" != n && e.test(t)) && t > -1 && t % 1 == 0 && t < i;
        };
      },
      6612: (t, e, i) => {
        var n = i(7813),
          r = i(8612),
          a = i(5776),
          o = i(3218);
        t.exports = function (t, e, i) {
          if (!o(i)) return !1;
          var s = typeof e;
          return !!("number" == s ? r(i) && a(e, i.length) : "string" == s && e in i) && n(i[e], t);
        };
      },
      5403: (t, e, i) => {
        var n = i(1469),
          r = i(3448),
          a = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          o = /^\w*$/;
        t.exports = function (t, e) {
          if (n(t)) return !1;
          var i = typeof t;
          return !("number" != i && "symbol" != i && "boolean" != i && null != t && !r(t)) || o.test(t) || !a.test(t) || null != e && t in Object(e);
        };
      },
      7019: t => {
        t.exports = function (t) {
          var e = typeof t;
          return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t;
        };
      },
      5346: (t, e, i) => {
        var n,
          r = i(4429),
          a = (n = /[^.]+$/.exec(r && r.keys && r.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : "";
        t.exports = function (t) {
          return !!a && a in t;
        };
      },
      5726: t => {
        var e = Object.prototype;
        t.exports = function (t) {
          var i = t && t.constructor;
          return t === ("function" == typeof i && i.prototype || e);
        };
      },
      7040: t => {
        t.exports = function () {
          this.__data__ = [], this.size = 0;
        };
      },
      4125: (t, e, i) => {
        var n = i(8470),
          r = Array.prototype.splice;
        t.exports = function (t) {
          var e = this.__data__,
            i = n(e, t);
          return !(i < 0) && (i == e.length - 1 ? e.pop() : r.call(e, i, 1), --this.size, !0);
        };
      },
      2117: (t, e, i) => {
        var n = i(8470);
        t.exports = function (t) {
          var e = this.__data__,
            i = n(e, t);
          return i < 0 ? undefined : e[i][1];
        };
      },
      7518: (t, e, i) => {
        var n = i(8470);
        t.exports = function (t) {
          return n(this.__data__, t) > -1;
        };
      },
      4705: (t, e, i) => {
        var n = i(8470);
        t.exports = function (t, e) {
          var i = this.__data__,
            r = n(i, t);
          return r < 0 ? (++this.size, i.push([t, e])) : i[r][1] = e, this;
        };
      },
      4785: (t, e, i) => {
        var n = i(1989),
          r = i(8407),
          a = i(7071);
        t.exports = function () {
          this.size = 0, this.__data__ = {
            hash: new n(),
            map: new (a || r)(),
            string: new n()
          };
        };
      },
      1285: (t, e, i) => {
        var n = i(5050);
        t.exports = function (t) {
          var e = n(this, t)["delete"](t);
          return this.size -= e ? 1 : 0, e;
        };
      },
      6e3: (t, e, i) => {
        var n = i(5050);
        t.exports = function (t) {
          return n(this, t).get(t);
        };
      },
      9916: (t, e, i) => {
        var n = i(5050);
        t.exports = function (t) {
          return n(this, t).has(t);
        };
      },
      5265: (t, e, i) => {
        var n = i(5050);
        t.exports = function (t, e) {
          var i = n(this, t),
            r = i.size;
          return i.set(t, e), this.size += i.size == r ? 0 : 1, this;
        };
      },
      4523: (t, e, i) => {
        var n = i(8306);
        t.exports = function (t) {
          var e = n(t, function (t) {
              return 500 === i.size && i.clear(), t;
            }),
            i = e.cache;
          return e;
        };
      },
      4536: (t, e, i) => {
        var n = i(852)(Object, "create");
        t.exports = n;
      },
      3498: t => {
        t.exports = function (t) {
          var e = [];
          if (null != t) for (var i in Object(t)) e.push(i);
          return e;
        };
      },
      1167: (t, e, i) => {
        t = i.nmd(t);
        var n = i(1957),
          r = e && !e.nodeType && e,
          a = r && t && !t.nodeType && t,
          o = a && a.exports === r && n.process,
          s = function () {
            try {
              var t = a && a.require && a.require("util").types;
              return t || o && o.binding && o.binding("util");
            } catch (e) {}
          }();
        t.exports = s;
      },
      2333: t => {
        var e = Object.prototype.toString;
        t.exports = function (t) {
          return e.call(t);
        };
      },
      5569: t => {
        t.exports = function (t, e) {
          return function (i) {
            return t(e(i));
          };
        };
      },
      5357: (t, e, i) => {
        var n = i(6874),
          r = Math.max;
        t.exports = function (t, e, i) {
          return e = r(e === undefined ? t.length - 1 : e, 0), function () {
            for (var a = arguments, o = -1, s = r(a.length - e, 0), l = Array(s); ++o < s;) l[o] = a[e + o];
            o = -1;
            for (var h = Array(e + 1); ++o < e;) h[o] = a[o];
            return h[e] = i(l), n(t, this, h);
          };
        };
      },
      5639: (t, e, i) => {
        var n = i(1957),
          r = "object" == typeof self && self && self.Object === Object && self,
          a = n || r || Function("return this")();
        t.exports = a;
      },
      6390: t => {
        t.exports = function (t, e) {
          if (("constructor" !== e || "function" != typeof t[e]) && "__proto__" != e) return t[e];
        };
      },
      61: (t, e, i) => {
        var n = i(6560),
          r = i(1275)(n);
        t.exports = r;
      },
      1275: t => {
        var e = Date.now;
        t.exports = function (t) {
          var i = 0,
            n = 0;
          return function () {
            var r = e(),
              a = 16 - (r - n);
            if (n = r, a > 0) {
              if (++i >= 800) return arguments[0];
            } else i = 0;
            return t.apply(undefined, arguments);
          };
        };
      },
      7465: (t, e, i) => {
        var n = i(8407);
        t.exports = function () {
          this.__data__ = new n(), this.size = 0;
        };
      },
      3779: t => {
        t.exports = function (t) {
          var e = this.__data__,
            i = e["delete"](t);
          return this.size = e.size, i;
        };
      },
      7599: t => {
        t.exports = function (t) {
          return this.__data__.get(t);
        };
      },
      4758: t => {
        t.exports = function (t) {
          return this.__data__.has(t);
        };
      },
      4309: (t, e, i) => {
        var n = i(8407),
          r = i(7071),
          a = i(3369);
        t.exports = function (t, e) {
          var i = this.__data__;
          if (i instanceof n) {
            var o = i.__data__;
            if (!r || o.length < 199) return o.push([t, e]), this.size = ++i.size, this;
            i = this.__data__ = new a(o);
          }
          return i.set(t, e), this.size = i.size, this;
        };
      },
      5514: (t, e, i) => {
        var n = i(4523),
          r = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
          a = /\\(\\)?/g,
          o = n(function (t) {
            var e = [];
            return 46 === t.charCodeAt(0) && e.push(""), t.replace(r, function (t, i, n, r) {
              e.push(n ? r.replace(a, "$1") : i || t);
            }), e;
          });
        t.exports = o;
      },
      327: (t, e, i) => {
        var n = i(3448);
        t.exports = function (t) {
          if ("string" == typeof t || n(t)) return t;
          var e = t + "";
          return "0" == e && 1 / t == -Infinity ? "-0" : e;
        };
      },
      346: t => {
        var e = Function.prototype.toString;
        t.exports = function (t) {
          if (null != t) {
            try {
              return e.call(t);
            } catch (i) {}
            try {
              return t + "";
            } catch (i) {}
          }
          return "";
        };
      },
      5703: t => {
        t.exports = function (t) {
          return function () {
            return t;
          };
        };
      },
      7813: t => {
        t.exports = function (t, e) {
          return t === e || t != t && e != e;
        };
      },
      7361: (t, e, i) => {
        var n = i(7786);
        t.exports = function (t, e, i) {
          var r = null == t ? undefined : n(t, e);
          return r === undefined ? i : r;
        };
      },
      8721: (t, e, i) => {
        var n = i(8565),
          r = i(222);
        t.exports = function (t, e) {
          return null != t && r(t, e, n);
        };
      },
      6557: t => {
        t.exports = function (t) {
          return t;
        };
      },
      5694: (t, e, i) => {
        var n = i(9454),
          r = i(7005),
          a = Object.prototype,
          o = a.hasOwnProperty,
          s = a.propertyIsEnumerable,
          l = n(function () {
            return arguments;
          }()) ? n : function (t) {
            return r(t) && o.call(t, "callee") && !s.call(t, "callee");
          };
        t.exports = l;
      },
      1469: t => {
        var e = Array.isArray;
        t.exports = e;
      },
      8612: (t, e, i) => {
        var n = i(3560),
          r = i(1780);
        t.exports = function (t) {
          return null != t && r(t.length) && !n(t);
        };
      },
      9246: (t, e, i) => {
        var n = i(8612),
          r = i(7005);
        t.exports = function (t) {
          return r(t) && n(t);
        };
      },
      4144: (t, e, i) => {
        t = i.nmd(t);
        var n = i(5639),
          r = i(5062),
          a = e && !e.nodeType && e,
          o = a && t && !t.nodeType && t,
          s = o && o.exports === a ? n.Buffer : undefined,
          l = (s ? s.isBuffer : undefined) || r;
        t.exports = l;
      },
      3560: (t, e, i) => {
        var n = i(4239),
          r = i(3218);
        t.exports = function (t) {
          if (!r(t)) return !1;
          var e = n(t);
          return "[object Function]" == e || "[object GeneratorFunction]" == e || "[object AsyncFunction]" == e || "[object Proxy]" == e;
        };
      },
      1780: t => {
        t.exports = function (t) {
          return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991;
        };
      },
      3218: t => {
        t.exports = function (t) {
          var e = typeof t;
          return null != t && ("object" == e || "function" == e);
        };
      },
      7005: t => {
        t.exports = function (t) {
          return null != t && "object" == typeof t;
        };
      },
      8630: (t, e, i) => {
        var n = i(4239),
          r = i(5924),
          a = i(7005),
          o = Function.prototype,
          s = Object.prototype,
          l = o.toString,
          h = s.hasOwnProperty,
          u = l.call(Object);
        t.exports = function (t) {
          if (!a(t) || "[object Object]" != n(t)) return !1;
          var e = r(t);
          if (null === e) return !0;
          var i = h.call(e, "constructor") && e.constructor;
          return "function" == typeof i && i instanceof i && l.call(i) == u;
        };
      },
      3448: (t, e, i) => {
        var n = i(4239),
          r = i(7005);
        t.exports = function (t) {
          return "symbol" == typeof t || r(t) && "[object Symbol]" == n(t);
        };
      },
      6719: (t, e, i) => {
        var n = i(8749),
          r = i(1717),
          a = i(1167),
          o = a && a.isTypedArray,
          s = o ? r(o) : n;
        t.exports = s;
      },
      1704: (t, e, i) => {
        var n = i(4636),
          r = i(313),
          a = i(8612);
        t.exports = function (t) {
          return a(t) ? n(t, !0) : r(t);
        };
      },
      8306: (t, e, i) => {
        var n = i(3369);
        function r(t, e) {
          if ("function" != typeof t || null != e && "function" != typeof e) throw new TypeError("Expected a function");
          var i = function () {
            var n = arguments,
              r = e ? e.apply(this, n) : n[0],
              a = i.cache;
            if (a.has(r)) return a.get(r);
            var o = t.apply(this, n);
            return i.cache = a.set(r, o) || a, o;
          };
          return i.cache = new (r.Cache || n)(), i;
        }
        r.Cache = n, t.exports = r;
      },
      2492: (t, e, i) => {
        var n = i(2980),
          r = i(1463)(function (t, e, i) {
            n(t, e, i);
          });
        t.exports = r;
      },
      5062: t => {
        t.exports = function () {
          return !1;
        };
      },
      9881: (t, e, i) => {
        var n = i(8363),
          r = i(1704);
        t.exports = function (t) {
          return n(t, r(t));
        };
      },
      9833: (t, e, i) => {
        var n = i(531);
        t.exports = function (t) {
          return null == t ? "" : n(t);
        };
      },
      2676: function (t) {
        t.exports = function () {
          "use strict";

          function t(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
          }
          function e(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
            }
          }
          function i(t, i, n) {
            return i && e(t.prototype, i), n && e(t, n), t;
          }
          var n = function () {
            function t(t, e) {
              this.next = null, this.key = t, this.data = e, this.left = null, this.right = null;
            }
            return t;
          }();
          function r(t, e) {
            return t > e ? 1 : t < e ? -1 : 0;
          }
          function a(t, e, i) {
            for (var r = new n(null, null), a = r, o = r;;) {
              var s = i(t, e.key);
              if (s < 0) {
                if (null === e.left) break;
                if (i(t, e.left.key) < 0) {
                  var l = e.left;
                  if (e.left = l.right, l.right = e, null === (e = l).left) break;
                }
                o.left = e, o = e, e = e.left;
              } else {
                if (!(s > 0)) break;
                if (null === e.right) break;
                if (i(t, e.right.key) > 0 && (l = e.right, e.right = l.left, l.left = e, null === (e = l).right)) break;
                a.right = e, a = e, e = e.right;
              }
            }
            return a.right = e.left, o.left = e.right, e.left = r.right, e.right = r.left, e;
          }
          function o(t, e, i, r) {
            var o = new n(t, e);
            if (null === i) return o.left = o.right = null, o;
            var s = r(t, (i = a(t, i, r)).key);
            return s < 0 ? (o.left = i.left, o.right = i, i.left = null) : s >= 0 && (o.right = i.right, o.left = i, i.right = null), o;
          }
          function s(t, e, i) {
            var n = null,
              r = null;
            if (e) {
              var o = i((e = a(t, e, i)).key, t);
              0 === o ? (n = e.left, r = e.right) : o < 0 ? (r = e.right, e.right = null, n = e) : (n = e.left, e.left = null, r = e);
            }
            return {
              left: n,
              right: r
            };
          }
          function l(t, e, i) {
            return null === e ? t : (null === t || ((e = a(t.key, e, i)).left = t), e);
          }
          function h(t, e, i, n, r) {
            if (t) {
              n(e + (i ? "????????? " : "????????? ") + r(t) + "\n");
              var a = e + (i ? "    " : "???   ");
              t.left && h(t.left, a, !1, n, r), t.right && h(t.right, a, !0, n, r);
            }
          }
          var u = function () {
            function t(t) {
              void 0 === t && (t = r), this._root = null, this._size = 0, this._comparator = t;
            }
            return t.prototype.insert = function (t, e) {
              return this._size++, this._root = o(t, e, this._root, this._comparator);
            }, t.prototype.add = function (t, e) {
              var i = new n(t, e);
              null === this._root && (i.left = i.right = null, this._size++, this._root = i);
              var r = this._comparator,
                o = a(t, this._root, r),
                s = r(t, o.key);
              return 0 === s ? this._root = o : (s < 0 ? (i.left = o.left, i.right = o, o.left = null) : s > 0 && (i.right = o.right, i.left = o, o.right = null), this._size++, this._root = i), this._root;
            }, t.prototype.remove = function (t) {
              this._root = this._remove(t, this._root, this._comparator);
            }, t.prototype._remove = function (t, e, i) {
              var n;
              return null === e ? null : 0 === i(t, (e = a(t, e, i)).key) ? (null === e.left ? n = e.right : (n = a(t, e.left, i)).right = e.right, this._size--, n) : e;
            }, t.prototype.pop = function () {
              var t = this._root;
              if (t) {
                for (; t.left;) t = t.left;
                return this._root = a(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), {
                  key: t.key,
                  data: t.data
                };
              }
              return null;
            }, t.prototype.findStatic = function (t) {
              for (var e = this._root, i = this._comparator; e;) {
                var n = i(t, e.key);
                if (0 === n) return e;
                e = n < 0 ? e.left : e.right;
              }
              return null;
            }, t.prototype.find = function (t) {
              return this._root && (this._root = a(t, this._root, this._comparator), 0 !== this._comparator(t, this._root.key)) ? null : this._root;
            }, t.prototype.contains = function (t) {
              for (var e = this._root, i = this._comparator; e;) {
                var n = i(t, e.key);
                if (0 === n) return !0;
                e = n < 0 ? e.left : e.right;
              }
              return !1;
            }, t.prototype.forEach = function (t, e) {
              for (var i = this._root, n = [], r = !1; !r;) null !== i ? (n.push(i), i = i.left) : 0 !== n.length ? (i = n.pop(), t.call(e, i), i = i.right) : r = !0;
              return this;
            }, t.prototype.range = function (t, e, i, n) {
              for (var r = [], a = this._comparator, o = this._root; 0 !== r.length || o;) if (o) r.push(o), o = o.left;else {
                if (a((o = r.pop()).key, e) > 0) break;
                if (a(o.key, t) >= 0 && i.call(n, o)) return this;
                o = o.right;
              }
              return this;
            }, t.prototype.keys = function () {
              var t = [];
              return this.forEach(function (e) {
                var i = e.key;
                return t.push(i);
              }), t;
            }, t.prototype.values = function () {
              var t = [];
              return this.forEach(function (e) {
                var i = e.data;
                return t.push(i);
              }), t;
            }, t.prototype.min = function () {
              return this._root ? this.minNode(this._root).key : null;
            }, t.prototype.max = function () {
              return this._root ? this.maxNode(this._root).key : null;
            }, t.prototype.minNode = function (t) {
              if (void 0 === t && (t = this._root), t) for (; t.left;) t = t.left;
              return t;
            }, t.prototype.maxNode = function (t) {
              if (void 0 === t && (t = this._root), t) for (; t.right;) t = t.right;
              return t;
            }, t.prototype.at = function (t) {
              for (var e = this._root, i = !1, n = 0, r = []; !i;) if (e) r.push(e), e = e.left;else if (r.length > 0) {
                if (e = r.pop(), n === t) return e;
                n++, e = e.right;
              } else i = !0;
              return null;
            }, t.prototype.next = function (t) {
              var e = this._root,
                i = null;
              if (t.right) {
                for (i = t.right; i.left;) i = i.left;
                return i;
              }
              for (var n = this._comparator; e;) {
                var r = n(t.key, e.key);
                if (0 === r) break;
                r < 0 ? (i = e, e = e.left) : e = e.right;
              }
              return i;
            }, t.prototype.prev = function (t) {
              var e = this._root,
                i = null;
              if (null !== t.left) {
                for (i = t.left; i.right;) i = i.right;
                return i;
              }
              for (var n = this._comparator; e;) {
                var r = n(t.key, e.key);
                if (0 === r) break;
                r < 0 ? e = e.left : (i = e, e = e.right);
              }
              return i;
            }, t.prototype.clear = function () {
              return this._root = null, this._size = 0, this;
            }, t.prototype.toList = function () {
              return d(this._root);
            }, t.prototype.load = function (t, e, i) {
              void 0 === e && (e = []), void 0 === i && (i = !1);
              var n = t.length,
                r = this._comparator;
              if (i && _(t, e, 0, n - 1, r), null === this._root) this._root = c(t, e, 0, n), this._size = n;else {
                var a = g(this.toList(), p(t, e), r);
                n = this._size + n, this._root = f({
                  head: a
                }, 0, n);
              }
              return this;
            }, t.prototype.isEmpty = function () {
              return null === this._root;
            }, Object.defineProperty(t.prototype, "size", {
              get: function () {
                return this._size;
              },
              enumerable: !0,
              configurable: !0
            }), Object.defineProperty(t.prototype, "root", {
              get: function () {
                return this._root;
              },
              enumerable: !0,
              configurable: !0
            }), t.prototype.toString = function (t) {
              void 0 === t && (t = function (t) {
                return String(t.key);
              });
              var e = [];
              return h(this._root, "", !0, function (t) {
                return e.push(t);
              }, t), e.join("");
            }, t.prototype.update = function (t, e, i) {
              var n = this._comparator,
                r = s(t, this._root, n),
                a = r.left,
                h = r.right;
              n(t, e) < 0 ? h = o(e, i, h, n) : a = o(e, i, a, n), this._root = l(a, h, n);
            }, t.prototype.split = function (t) {
              return s(t, this._root, this._comparator);
            }, t;
          }();
          function c(t, e, i, r) {
            var a = r - i;
            if (a > 0) {
              var o = i + Math.floor(a / 2),
                s = t[o],
                l = e[o],
                h = new n(s, l);
              return h.left = c(t, e, i, o), h.right = c(t, e, o + 1, r), h;
            }
            return null;
          }
          function p(t, e) {
            for (var i = new n(null, null), r = i, a = 0; a < t.length; a++) r = r.next = new n(t[a], e[a]);
            return r.next = null, i.next;
          }
          function d(t) {
            for (var e = t, i = [], r = !1, a = new n(null, null), o = a; !r;) e ? (i.push(e), e = e.left) : i.length > 0 ? e = (e = o = o.next = i.pop()).right : r = !0;
            return o.next = null, a.next;
          }
          function f(t, e, i) {
            var n = i - e;
            if (n > 0) {
              var r = e + Math.floor(n / 2),
                a = f(t, e, r),
                o = t.head;
              return o.left = a, t.head = t.head.next, o.right = f(t, r + 1, i), o;
            }
            return null;
          }
          function g(t, e, i) {
            for (var r = new n(null, null), a = r, o = t, s = e; null !== o && null !== s;) i(o.key, s.key) < 0 ? (a.next = o, o = o.next) : (a.next = s, s = s.next), a = a.next;
            return null !== o ? a.next = o : null !== s && (a.next = s), r.next;
          }
          function _(t, e, i, n, r) {
            if (!(i >= n)) {
              for (var a = t[i + n >> 1], o = i - 1, s = n + 1;;) {
                do {
                  o++;
                } while (r(t[o], a) < 0);
                do {
                  s--;
                } while (r(t[s], a) > 0);
                if (o >= s) break;
                var l = t[o];
                t[o] = t[s], t[s] = l, l = e[o], e[o] = e[s], e[s] = l;
              }
              _(t, e, i, s, r), _(t, e, s + 1, n, r);
            }
          }
          var m = function (t, e) {
              return t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y;
            },
            y = function (t, e) {
              if (e.ur.x < t.ll.x || t.ur.x < e.ll.x || e.ur.y < t.ll.y || t.ur.y < e.ll.y) return null;
              var i = t.ll.x < e.ll.x ? e.ll.x : t.ll.x,
                n = t.ur.x < e.ur.x ? t.ur.x : e.ur.x;
              return {
                ll: {
                  x: i,
                  y: t.ll.y < e.ll.y ? e.ll.y : t.ll.y
                },
                ur: {
                  x: n,
                  y: t.ur.y < e.ur.y ? t.ur.y : e.ur.y
                }
              };
            },
            v = Number.EPSILON;
          v === undefined && (v = Math.pow(2, -52));
          var L = v * v,
            b = function (t, e) {
              if (-v < t && t < v && -v < e && e < v) return 0;
              var i = t - e;
              return i * i < L * t * e ? 0 : t < e ? -1 : 1;
            },
            k = function () {
              function e() {
                t(this, e), this.reset();
              }
              return i(e, [{
                key: "reset",
                value: function () {
                  this.xRounder = new M(), this.yRounder = new M();
                }
              }, {
                key: "round",
                value: function (t, e) {
                  return {
                    x: this.xRounder.round(t),
                    y: this.yRounder.round(e)
                  };
                }
              }]), e;
            }(),
            M = function () {
              function e() {
                t(this, e), this.tree = new u(), this.round(0);
              }
              return i(e, [{
                key: "round",
                value: function (t) {
                  var e = this.tree.add(t),
                    i = this.tree.prev(e);
                  if (null !== i && 0 === b(e.key, i.key)) return this.tree.remove(t), i.key;
                  var n = this.tree.next(e);
                  return null !== n && 0 === b(e.key, n.key) ? (this.tree.remove(t), n.key) : t;
                }
              }]), e;
            }(),
            x = new k(),
            w = function (t, e) {
              return t.x * e.y - t.y * e.x;
            },
            C = function (t, e) {
              return t.x * e.x + t.y * e.y;
            },
            P = function (t, e, i) {
              var n = {
                  x: e.x - t.x,
                  y: e.y - t.y
                },
                r = {
                  x: i.x - t.x,
                  y: i.y - t.y
                },
                a = w(n, r);
              return b(a, 0);
            },
            E = function (t) {
              return Math.sqrt(C(t, t));
            },
            S = function (t, e, i) {
              var n = {
                  x: e.x - t.x,
                  y: e.y - t.y
                },
                r = {
                  x: i.x - t.x,
                  y: i.y - t.y
                };
              return w(r, n) / E(r) / E(n);
            },
            O = function (t, e, i) {
              var n = {
                  x: e.x - t.x,
                  y: e.y - t.y
                },
                r = {
                  x: i.x - t.x,
                  y: i.y - t.y
                };
              return C(r, n) / E(r) / E(n);
            },
            D = function (t, e, i) {
              return 0 === e.y ? null : {
                x: t.x + e.x / e.y * (i - t.y),
                y: i
              };
            },
            R = function (t, e, i) {
              return 0 === e.x ? null : {
                x: i,
                y: t.y + e.y / e.x * (i - t.x)
              };
            },
            B = function (t, e, i, n) {
              if (0 === e.x) return R(i, n, t.x);
              if (0 === n.x) return R(t, e, i.x);
              if (0 === e.y) return D(i, n, t.y);
              if (0 === n.y) return D(t, e, i.y);
              var r = w(e, n);
              if (0 == r) return null;
              var a = {
                  x: i.x - t.x,
                  y: i.y - t.y
                },
                o = w(a, e) / r,
                s = w(a, n) / r;
              return {
                x: (t.x + s * e.x + (i.x + o * n.x)) / 2,
                y: (t.y + s * e.y + (i.y + o * n.y)) / 2
              };
            },
            T = function () {
              function e(i, n) {
                t(this, e), i.events === undefined ? i.events = [this] : i.events.push(this), this.point = i, this.isLeft = n;
              }
              return i(e, null, [{
                key: "compare",
                value: function (t, i) {
                  var n = e.comparePoints(t.point, i.point);
                  return 0 !== n ? n : (t.point !== i.point && t.link(i), t.isLeft !== i.isLeft ? t.isLeft ? 1 : -1 : j.compare(t.segment, i.segment));
                }
              }, {
                key: "comparePoints",
                value: function (t, e) {
                  return t.x < e.x ? -1 : t.x > e.x ? 1 : t.y < e.y ? -1 : t.y > e.y ? 1 : 0;
                }
              }]), i(e, [{
                key: "link",
                value: function (t) {
                  if (t.point === this.point) throw new Error("Tried to link already linked events");
                  for (var e = t.point.events, i = 0, n = e.length; i < n; i++) {
                    var r = e[i];
                    this.point.events.push(r), r.point = this.point;
                  }
                  this.checkForConsuming();
                }
              }, {
                key: "checkForConsuming",
                value: function () {
                  for (var t = this.point.events.length, e = 0; e < t; e++) {
                    var i = this.point.events[e];
                    if (i.segment.consumedBy === undefined) for (var n = e + 1; n < t; n++) {
                      var r = this.point.events[n];
                      r.consumedBy === undefined && i.otherSE.point.events === r.otherSE.point.events && i.segment.consume(r.segment);
                    }
                  }
                }
              }, {
                key: "getAvailableLinkedEvents",
                value: function () {
                  for (var t = [], e = 0, i = this.point.events.length; e < i; e++) {
                    var n = this.point.events[e];
                    n !== this && !n.segment.ringOut && n.segment.isInResult() && t.push(n);
                  }
                  return t;
                }
              }, {
                key: "getLeftmostComparator",
                value: function (t) {
                  var e = this,
                    i = new Map(),
                    n = function (n) {
                      var r = n.otherSE;
                      i.set(n, {
                        sine: S(e.point, t.point, r.point),
                        cosine: O(e.point, t.point, r.point)
                      });
                    };
                  return function (t, e) {
                    i.has(t) || n(t), i.has(e) || n(e);
                    var r = i.get(t),
                      a = r.sine,
                      o = r.cosine,
                      s = i.get(e),
                      l = s.sine,
                      h = s.cosine;
                    return a >= 0 && l >= 0 ? o < h ? 1 : o > h ? -1 : 0 : a < 0 && l < 0 ? o < h ? -1 : o > h ? 1 : 0 : l < a ? -1 : l > a ? 1 : 0;
                  };
                }
              }]), e;
            }(),
            I = 0,
            j = function () {
              function e(i, n, r, a) {
                t(this, e), this.id = ++I, this.leftSE = i, i.segment = this, i.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = i, this.rings = r, this.windings = a;
              }
              return i(e, null, [{
                key: "compare",
                value: function (t, e) {
                  var i = t.leftSE.point.x,
                    n = e.leftSE.point.x,
                    r = t.rightSE.point.x,
                    a = e.rightSE.point.x;
                  if (a < i) return 1;
                  if (r < n) return -1;
                  var o = t.leftSE.point.y,
                    s = e.leftSE.point.y,
                    l = t.rightSE.point.y,
                    h = e.rightSE.point.y;
                  if (i < n) {
                    if (s < o && s < l) return 1;
                    if (s > o && s > l) return -1;
                    var u = t.comparePoint(e.leftSE.point);
                    if (u < 0) return 1;
                    if (u > 0) return -1;
                    var c = e.comparePoint(t.rightSE.point);
                    return 0 !== c ? c : -1;
                  }
                  if (i > n) {
                    if (o < s && o < h) return -1;
                    if (o > s && o > h) return 1;
                    var p = e.comparePoint(t.leftSE.point);
                    if (0 !== p) return p;
                    var d = t.comparePoint(e.rightSE.point);
                    return d < 0 ? 1 : d > 0 ? -1 : 1;
                  }
                  if (o < s) return -1;
                  if (o > s) return 1;
                  if (r < a) {
                    var f = e.comparePoint(t.rightSE.point);
                    if (0 !== f) return f;
                  }
                  if (r > a) {
                    var g = t.comparePoint(e.rightSE.point);
                    if (g < 0) return 1;
                    if (g > 0) return -1;
                  }
                  if (r !== a) {
                    var _ = l - o,
                      m = r - i,
                      y = h - s,
                      v = a - n;
                    if (_ > m && y < v) return 1;
                    if (_ < m && y > v) return -1;
                  }
                  return r > a ? 1 : r < a || l < h ? -1 : l > h ? 1 : t.id < e.id ? -1 : t.id > e.id ? 1 : 0;
                }
              }]), i(e, [{
                key: "replaceRightSE",
                value: function (t) {
                  this.rightSE = t, this.rightSE.segment = this, this.rightSE.otherSE = this.leftSE, this.leftSE.otherSE = this.rightSE;
                }
              }, {
                key: "bbox",
                value: function () {
                  var t = this.leftSE.point.y,
                    e = this.rightSE.point.y;
                  return {
                    ll: {
                      x: this.leftSE.point.x,
                      y: t < e ? t : e
                    },
                    ur: {
                      x: this.rightSE.point.x,
                      y: t > e ? t : e
                    }
                  };
                }
              }, {
                key: "vector",
                value: function () {
                  return {
                    x: this.rightSE.point.x - this.leftSE.point.x,
                    y: this.rightSE.point.y - this.leftSE.point.y
                  };
                }
              }, {
                key: "isAnEndpoint",
                value: function (t) {
                  return t.x === this.leftSE.point.x && t.y === this.leftSE.point.y || t.x === this.rightSE.point.x && t.y === this.rightSE.point.y;
                }
              }, {
                key: "comparePoint",
                value: function (t) {
                  if (this.isAnEndpoint(t)) return 0;
                  var e = this.leftSE.point,
                    i = this.rightSE.point,
                    n = this.vector();
                  if (e.x === i.x) return t.x === e.x ? 0 : t.x < e.x ? 1 : -1;
                  var r = (t.y - e.y) / n.y,
                    a = e.x + r * n.x;
                  if (t.x === a) return 0;
                  var o = (t.x - e.x) / n.x,
                    s = e.y + o * n.y;
                  return t.y === s ? 0 : t.y < s ? -1 : 1;
                }
              }, {
                key: "getIntersection",
                value: function (t) {
                  var e = this.bbox(),
                    i = t.bbox(),
                    n = y(e, i);
                  if (null === n) return null;
                  var r = this.leftSE.point,
                    a = this.rightSE.point,
                    o = t.leftSE.point,
                    s = t.rightSE.point,
                    l = m(e, o) && 0 === this.comparePoint(o),
                    h = m(i, r) && 0 === t.comparePoint(r),
                    u = m(e, s) && 0 === this.comparePoint(s),
                    c = m(i, a) && 0 === t.comparePoint(a);
                  if (h && l) return c && !u ? a : !c && u ? s : null;
                  if (h) return u && r.x === s.x && r.y === s.y ? null : r;
                  if (l) return c && a.x === o.x && a.y === o.y ? null : o;
                  if (c && u) return null;
                  if (c) return a;
                  if (u) return s;
                  var p = B(r, this.vector(), o, t.vector());
                  return null === p ? null : m(n, p) ? x.round(p.x, p.y) : null;
                }
              }, {
                key: "split",
                value: function (t) {
                  var i = [],
                    n = t.events !== undefined,
                    r = new T(t, !0),
                    a = new T(t, !1),
                    o = this.rightSE;
                  this.replaceRightSE(a), i.push(a), i.push(r);
                  var s = new e(r, o, this.rings.slice(), this.windings.slice());
                  return T.comparePoints(s.leftSE.point, s.rightSE.point) > 0 && s.swapEvents(), T.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), n && (r.checkForConsuming(), a.checkForConsuming()), i;
                }
              }, {
                key: "swapEvents",
                value: function () {
                  var t = this.rightSE;
                  this.rightSE = this.leftSE, this.leftSE = t, this.leftSE.isLeft = !0, this.rightSE.isLeft = !1;
                  for (var e = 0, i = this.windings.length; e < i; e++) this.windings[e] *= -1;
                }
              }, {
                key: "consume",
                value: function (t) {
                  for (var i = this, n = t; i.consumedBy;) i = i.consumedBy;
                  for (; n.consumedBy;) n = n.consumedBy;
                  var r = e.compare(i, n);
                  if (0 !== r) {
                    if (r > 0) {
                      var a = i;
                      i = n, n = a;
                    }
                    if (i.prev === n) {
                      var o = i;
                      i = n, n = o;
                    }
                    for (var s = 0, l = n.rings.length; s < l; s++) {
                      var h = n.rings[s],
                        u = n.windings[s],
                        c = i.rings.indexOf(h);
                      -1 === c ? (i.rings.push(h), i.windings.push(u)) : i.windings[c] += u;
                    }
                    n.rings = null, n.windings = null, n.consumedBy = i, n.leftSE.consumedBy = i.leftSE, n.rightSE.consumedBy = i.rightSE;
                  }
                }
              }, {
                key: "prevInResult",
                value: function () {
                  return this._prevInResult !== undefined || (this.prev ? this.prev.isInResult() ? this._prevInResult = this.prev : this._prevInResult = this.prev.prevInResult() : this._prevInResult = null), this._prevInResult;
                }
              }, {
                key: "beforeState",
                value: function () {
                  if (this._beforeState !== undefined) return this._beforeState;
                  if (this.prev) {
                    var t = this.prev.consumedBy || this.prev;
                    this._beforeState = t.afterState();
                  } else this._beforeState = {
                    rings: [],
                    windings: [],
                    multiPolys: []
                  };
                  return this._beforeState;
                }
              }, {
                key: "afterState",
                value: function () {
                  if (this._afterState !== undefined) return this._afterState;
                  var t = this.beforeState();
                  this._afterState = {
                    rings: t.rings.slice(0),
                    windings: t.windings.slice(0),
                    multiPolys: []
                  };
                  for (var e = this._afterState.rings, i = this._afterState.windings, n = this._afterState.multiPolys, r = 0, a = this.rings.length; r < a; r++) {
                    var o = this.rings[r],
                      s = this.windings[r],
                      l = e.indexOf(o);
                    -1 === l ? (e.push(o), i.push(s)) : i[l] += s;
                  }
                  for (var h = [], u = [], c = 0, p = e.length; c < p; c++) if (0 !== i[c]) {
                    var d = e[c],
                      f = d.poly;
                    if (-1 === u.indexOf(f)) if (d.isExterior) h.push(f);else {
                      -1 === u.indexOf(f) && u.push(f);
                      var g = h.indexOf(d.poly);
                      -1 !== g && h.splice(g, 1);
                    }
                  }
                  for (var _ = 0, m = h.length; _ < m; _++) {
                    var y = h[_].multiPoly;
                    -1 === n.indexOf(y) && n.push(y);
                  }
                  return this._afterState;
                }
              }, {
                key: "isInResult",
                value: function () {
                  if (this.consumedBy) return !1;
                  if (this._isInResult !== undefined) return this._isInResult;
                  var t = this.beforeState().multiPolys,
                    e = this.afterState().multiPolys;
                  switch (q.type) {
                    case "union":
                      var i = 0 === t.length,
                        n = 0 === e.length;
                      this._isInResult = i !== n;
                      break;
                    case "intersection":
                      var r, a;
                      t.length < e.length ? (r = t.length, a = e.length) : (r = e.length, a = t.length), this._isInResult = a === q.numMultiPolys && r < a;
                      break;
                    case "xor":
                      var o = Math.abs(t.length - e.length);
                      this._isInResult = o % 2 == 1;
                      break;
                    case "difference":
                      var s = function (t) {
                        return 1 === t.length && t[0].isSubject;
                      };
                      this._isInResult = s(t) !== s(e);
                      break;
                    default:
                      throw new Error("Unrecognized operation type found ".concat(q.type));
                  }
                  return this._isInResult;
                }
              }], [{
                key: "fromRing",
                value: function (t, i, n) {
                  var r,
                    a,
                    o,
                    s = T.comparePoints(t, i);
                  if (s < 0) r = t, a = i, o = 1;else {
                    if (!(s > 0)) throw new Error("Tried to create degenerate segment at [".concat(t.x, ", ").concat(t.y, "]"));
                    r = i, a = t, o = -1;
                  }
                  return new e(new T(r, !0), new T(a, !1), [n], [o]);
                }
              }]), e;
            }(),
            A = function () {
              function e(i, n, r) {
                if (t(this, e), !Array.isArray(i) || 0 === i.length) throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
                if (this.poly = n, this.isExterior = r, this.segments = [], "number" != typeof i[0][0] || "number" != typeof i[0][1]) throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
                var a = x.round(i[0][0], i[0][1]);
                this.bbox = {
                  ll: {
                    x: a.x,
                    y: a.y
                  },
                  ur: {
                    x: a.x,
                    y: a.y
                  }
                };
                for (var o = a, s = 1, l = i.length; s < l; s++) {
                  if ("number" != typeof i[s][0] || "number" != typeof i[s][1]) throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
                  var h = x.round(i[s][0], i[s][1]);
                  h.x === o.x && h.y === o.y || (this.segments.push(j.fromRing(o, h, this)), h.x < this.bbox.ll.x && (this.bbox.ll.x = h.x), h.y < this.bbox.ll.y && (this.bbox.ll.y = h.y), h.x > this.bbox.ur.x && (this.bbox.ur.x = h.x), h.y > this.bbox.ur.y && (this.bbox.ur.y = h.y), o = h);
                }
                a.x === o.x && a.y === o.y || this.segments.push(j.fromRing(o, a, this));
              }
              return i(e, [{
                key: "getSweepEvents",
                value: function () {
                  for (var t = [], e = 0, i = this.segments.length; e < i; e++) {
                    var n = this.segments[e];
                    t.push(n.leftSE), t.push(n.rightSE);
                  }
                  return t;
                }
              }]), e;
            }(),
            G = function () {
              function e(i, n) {
                if (t(this, e), !Array.isArray(i)) throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
                this.exteriorRing = new A(i[0], this, !0), this.bbox = {
                  ll: {
                    x: this.exteriorRing.bbox.ll.x,
                    y: this.exteriorRing.bbox.ll.y
                  },
                  ur: {
                    x: this.exteriorRing.bbox.ur.x,
                    y: this.exteriorRing.bbox.ur.y
                  }
                }, this.interiorRings = [];
                for (var r = 1, a = i.length; r < a; r++) {
                  var o = new A(i[r], this, !1);
                  o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.interiorRings.push(o);
                }
                this.multiPoly = n;
              }
              return i(e, [{
                key: "getSweepEvents",
                value: function () {
                  for (var t = this.exteriorRing.getSweepEvents(), e = 0, i = this.interiorRings.length; e < i; e++) for (var n = this.interiorRings[e].getSweepEvents(), r = 0, a = n.length; r < a; r++) t.push(n[r]);
                  return t;
                }
              }]), e;
            }(),
            N = function () {
              function e(i, n) {
                if (t(this, e), !Array.isArray(i)) throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
                try {
                  "number" == typeof i[0][0][0] && (i = [i]);
                } catch (s) {}
                this.polys = [], this.bbox = {
                  ll: {
                    x: Number.POSITIVE_INFINITY,
                    y: Number.POSITIVE_INFINITY
                  },
                  ur: {
                    x: Number.NEGATIVE_INFINITY,
                    y: Number.NEGATIVE_INFINITY
                  }
                };
                for (var r = 0, a = i.length; r < a; r++) {
                  var o = new G(i[r], this);
                  o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.polys.push(o);
                }
                this.isSubject = n;
              }
              return i(e, [{
                key: "getSweepEvents",
                value: function () {
                  for (var t = [], e = 0, i = this.polys.length; e < i; e++) for (var n = this.polys[e].getSweepEvents(), r = 0, a = n.length; r < a; r++) t.push(n[r]);
                  return t;
                }
              }]), e;
            }(),
            z = function () {
              function e(i) {
                t(this, e), this.events = i;
                for (var n = 0, r = i.length; n < r; n++) i[n].segment.ringOut = this;
                this.poly = null;
              }
              return i(e, null, [{
                key: "factory",
                value: function (t) {
                  for (var i = [], n = 0, r = t.length; n < r; n++) {
                    var a = t[n];
                    if (a.isInResult() && !a.ringOut) {
                      for (var o = null, s = a.leftSE, l = a.rightSE, h = [s], u = s.point, c = []; o = s, s = l, h.push(s), s.point !== u;) for (;;) {
                        var p = s.getAvailableLinkedEvents();
                        if (0 === p.length) {
                          var d = h[0].point,
                            f = h[h.length - 1].point;
                          throw new Error("Unable to complete output ring starting at [".concat(d.x, ",") + " ".concat(d.y, "]. Last matching segment found ends at") + " [".concat(f.x, ", ").concat(f.y, "]."));
                        }
                        if (1 === p.length) {
                          l = p[0].otherSE;
                          break;
                        }
                        for (var g = null, _ = 0, m = c.length; _ < m; _++) if (c[_].point === s.point) {
                          g = _;
                          break;
                        }
                        if (null === g) {
                          c.push({
                            index: h.length,
                            point: s.point
                          });
                          var y = s.getLeftmostComparator(o);
                          l = p.sort(y)[0].otherSE;
                          break;
                        }
                        var v = c.splice(g)[0],
                          L = h.splice(v.index);
                        L.unshift(L[0].otherSE), i.push(new e(L.reverse()));
                      }
                      i.push(new e(h));
                    }
                  }
                  return i;
                }
              }]), i(e, [{
                key: "getGeom",
                value: function () {
                  for (var t = this.events[0].point, e = [t], i = 1, n = this.events.length - 1; i < n; i++) {
                    var r = this.events[i].point,
                      a = this.events[i + 1].point;
                    0 !== P(r, t, a) && (e.push(r), t = r);
                  }
                  if (1 === e.length) return null;
                  var o = e[0],
                    s = e[1];
                  0 === P(o, t, s) && e.shift(), e.push(e[0]);
                  for (var l = this.isExteriorRing() ? 1 : -1, h = this.isExteriorRing() ? 0 : e.length - 1, u = this.isExteriorRing() ? e.length : -1, c = [], p = h; p != u; p += l) c.push([e[p].x, e[p].y]);
                  return c;
                }
              }, {
                key: "isExteriorRing",
                value: function () {
                  if (this._isExteriorRing === undefined) {
                    var t = this.enclosingRing();
                    this._isExteriorRing = !t || !t.isExteriorRing();
                  }
                  return this._isExteriorRing;
                }
              }, {
                key: "enclosingRing",
                value: function () {
                  return this._enclosingRing === undefined && (this._enclosingRing = this._calcEnclosingRing()), this._enclosingRing;
                }
              }, {
                key: "_calcEnclosingRing",
                value: function () {
                  for (var t = this.events[0], e = 1, i = this.events.length; e < i; e++) {
                    var n = this.events[e];
                    T.compare(t, n) > 0 && (t = n);
                  }
                  for (var r = t.segment.prevInResult(), a = r ? r.prevInResult() : null;;) {
                    if (!r) return null;
                    if (!a) return r.ringOut;
                    if (a.ringOut !== r.ringOut) return a.ringOut.enclosingRing() !== r.ringOut ? r.ringOut : r.ringOut.enclosingRing();
                    r = a.prevInResult(), a = r ? r.prevInResult() : null;
                  }
                }
              }]), e;
            }(),
            U = function () {
              function e(i) {
                t(this, e), this.exteriorRing = i, i.poly = this, this.interiorRings = [];
              }
              return i(e, [{
                key: "addInterior",
                value: function (t) {
                  this.interiorRings.push(t), t.poly = this;
                }
              }, {
                key: "getGeom",
                value: function () {
                  var t = [this.exteriorRing.getGeom()];
                  if (null === t[0]) return null;
                  for (var e = 0, i = this.interiorRings.length; e < i; e++) {
                    var n = this.interiorRings[e].getGeom();
                    null !== n && t.push(n);
                  }
                  return t;
                }
              }]), e;
            }(),
            F = function () {
              function e(i) {
                t(this, e), this.rings = i, this.polys = this._composePolys(i);
              }
              return i(e, [{
                key: "getGeom",
                value: function () {
                  for (var t = [], e = 0, i = this.polys.length; e < i; e++) {
                    var n = this.polys[e].getGeom();
                    null !== n && t.push(n);
                  }
                  return t;
                }
              }, {
                key: "_composePolys",
                value: function (t) {
                  for (var e = [], i = 0, n = t.length; i < n; i++) {
                    var r = t[i];
                    if (!r.poly) if (r.isExteriorRing()) e.push(new U(r));else {
                      var a = r.enclosingRing();
                      a.poly || e.push(new U(a)), a.poly.addInterior(r);
                    }
                  }
                  return e;
                }
              }]), e;
            }(),
            V = function () {
              function e(i) {
                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : j.compare;
                t(this, e), this.queue = i, this.tree = new u(n), this.segments = [];
              }
              return i(e, [{
                key: "process",
                value: function (t) {
                  var e = t.segment,
                    i = [];
                  if (t.consumedBy) return t.isLeft ? this.queue.remove(t.otherSE) : this.tree.remove(e), i;
                  var n = t.isLeft ? this.tree.insert(e) : this.tree.find(e);
                  if (!n) throw new Error("Unable to find segment #".concat(e.id, " ") + "[".concat(e.leftSE.point.x, ", ").concat(e.leftSE.point.y, "] -> ") + "[".concat(e.rightSE.point.x, ", ").concat(e.rightSE.point.y, "] ") + "in SweepLine tree. Please submit a bug report.");
                  for (var r = n, a = n, o = undefined, s = undefined; o === undefined;) null === (r = this.tree.prev(r)) ? o = null : r.key.consumedBy === undefined && (o = r.key);
                  for (; s === undefined;) null === (a = this.tree.next(a)) ? s = null : a.key.consumedBy === undefined && (s = a.key);
                  if (t.isLeft) {
                    var l = null;
                    if (o) {
                      var h = o.getIntersection(e);
                      if (null !== h && (e.isAnEndpoint(h) || (l = h), !o.isAnEndpoint(h))) for (var u = this._splitSafely(o, h), c = 0, p = u.length; c < p; c++) i.push(u[c]);
                    }
                    var d = null;
                    if (s) {
                      var f = s.getIntersection(e);
                      if (null !== f && (e.isAnEndpoint(f) || (d = f), !s.isAnEndpoint(f))) for (var g = this._splitSafely(s, f), _ = 0, m = g.length; _ < m; _++) i.push(g[_]);
                    }
                    if (null !== l || null !== d) {
                      var y = null;
                      y = null === l ? d : null === d || T.comparePoints(l, d) <= 0 ? l : d, this.queue.remove(e.rightSE), i.push(e.rightSE);
                      for (var v = e.split(y), L = 0, b = v.length; L < b; L++) i.push(v[L]);
                    }
                    i.length > 0 ? (this.tree.remove(e), i.push(t)) : (this.segments.push(e), e.prev = o);
                  } else {
                    if (o && s) {
                      var k = o.getIntersection(s);
                      if (null !== k) {
                        if (!o.isAnEndpoint(k)) for (var M = this._splitSafely(o, k), x = 0, w = M.length; x < w; x++) i.push(M[x]);
                        if (!s.isAnEndpoint(k)) for (var C = this._splitSafely(s, k), P = 0, E = C.length; P < E; P++) i.push(C[P]);
                      }
                    }
                    this.tree.remove(e);
                  }
                  return i;
                }
              }, {
                key: "_splitSafely",
                value: function (t, e) {
                  this.tree.remove(t);
                  var i = t.rightSE;
                  this.queue.remove(i);
                  var n = t.split(e);
                  return n.push(i), t.consumedBy === undefined && this.tree.insert(t), n;
                }
              }]), e;
            }(),
            K = "undefined" != typeof process && undefined || 1e6,
            H = "undefined" != typeof process && undefined || 1e6,
            q = new (function () {
              function e() {
                t(this, e);
              }
              return i(e, [{
                key: "run",
                value: function (t, e, i) {
                  q.type = t, x.reset();
                  for (var n = [new N(e, !0)], r = 0, a = i.length; r < a; r++) n.push(new N(i[r], !1));
                  if (q.numMultiPolys = n.length, "difference" === q.type) for (var o = n[0], s = 1; s < n.length;) null !== y(n[s].bbox, o.bbox) ? s++ : n.splice(s, 1);
                  if ("intersection" === q.type) for (var l = 0, h = n.length; l < h; l++) for (var c = n[l], p = l + 1, d = n.length; p < d; p++) if (null === y(c.bbox, n[p].bbox)) return [];
                  for (var f = new u(T.compare), g = 0, _ = n.length; g < _; g++) for (var m = n[g].getSweepEvents(), v = 0, L = m.length; v < L; v++) if (f.insert(m[v]), f.size > K) throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big). Please file a bug report.");
                  for (var b = new V(f), k = f.size, M = f.pop(); M;) {
                    var w = M.key;
                    if (f.size === k) {
                      var C = w.segment;
                      throw new Error("Unable to pop() ".concat(w.isLeft ? "left" : "right", " SweepEvent ") + "[".concat(w.point.x, ", ").concat(w.point.y, "] from segment #").concat(C.id, " ") + "[".concat(C.leftSE.point.x, ", ").concat(C.leftSE.point.y, "] -> ") + "[".concat(C.rightSE.point.x, ", ").concat(C.rightSE.point.y, "] from queue. ") + "Please file a bug report.");
                    }
                    if (f.size > K) throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big). Please file a bug report.");
                    if (b.segments.length > H) throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments). Please file a bug report.");
                    for (var P = b.process(w), E = 0, S = P.length; E < S; E++) {
                      var O = P[E];
                      O.consumedBy === undefined && f.insert(O);
                    }
                    k = f.size, M = f.pop();
                  }
                  x.reset();
                  var D = z.factory(b.segments);
                  return new F(D).getGeom();
                }
              }]), e;
            }())(),
            J = function (t) {
              for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
              return q.run("union", t, i);
            },
            Y = function (t) {
              for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
              return q.run("intersection", t, i);
            },
            X = function (t) {
              for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
              return q.run("xor", t, i);
            },
            Z = function (t) {
              for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
              return q.run("difference", t, i);
            };
          return {
            union: J,
            intersection: Y,
            xor: X,
            difference: Z
          };
        }();
      },
      2582: function (t) {
        t.exports = function () {
          "use strict";

          function t(t, n, r, a, o) {
            !function s(t, i, n, r, a) {
              for (; r > n;) {
                if (r - n > 600) {
                  var o = r - n + 1,
                    l = i - n + 1,
                    h = Math.log(o),
                    u = .5 * Math.exp(2 * h / 3),
                    c = .5 * Math.sqrt(h * u * (o - u) / o) * (l - o / 2 < 0 ? -1 : 1);
                  s(t, i, Math.max(n, Math.floor(i - l * u / o + c)), Math.min(r, Math.floor(i + (o - l) * u / o + c)), a);
                }
                var p = t[i],
                  d = n,
                  f = r;
                for (e(t, n, i), a(t[r], p) > 0 && e(t, n, r); d < f;) {
                  for (e(t, d, f), d++, f--; a(t[d], p) < 0;) d++;
                  for (; a(t[f], p) > 0;) f--;
                }
                0 === a(t[n], p) ? e(t, n, f) : e(t, ++f, r), f <= i && (n = f + 1), i <= f && (r = f - 1);
              }
            }(t, n, r || 0, a || t.length - 1, o || i);
          }
          function e(t, e, i) {
            var n = t[e];
            t[e] = t[i], t[i] = n;
          }
          function i(t, e) {
            return t < e ? -1 : t > e ? 1 : 0;
          }
          var n = function (t) {
            void 0 === t && (t = 9), this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)), this.clear();
          };
          function r(t, e, i) {
            if (!i) return e.indexOf(t);
            for (var n = 0; n < e.length; n++) if (i(t, e[n])) return n;
            return -1;
          }
          function a(t, e) {
            o(t, 0, t.children.length, e, t);
          }
          function o(t, e, i, n, r) {
            r || (r = f(null)), r.minX = 1 / 0, r.minY = 1 / 0, r.maxX = -1 / 0, r.maxY = -1 / 0;
            for (var a = e; a < i; a++) {
              var o = t.children[a];
              s(r, t.leaf ? n(o) : o);
            }
            return r;
          }
          function s(t, e) {
            return t.minX = Math.min(t.minX, e.minX), t.minY = Math.min(t.minY, e.minY), t.maxX = Math.max(t.maxX, e.maxX), t.maxY = Math.max(t.maxY, e.maxY), t;
          }
          function l(t, e) {
            return t.minX - e.minX;
          }
          function h(t, e) {
            return t.minY - e.minY;
          }
          function u(t) {
            return (t.maxX - t.minX) * (t.maxY - t.minY);
          }
          function c(t) {
            return t.maxX - t.minX + (t.maxY - t.minY);
          }
          function p(t, e) {
            return t.minX <= e.minX && t.minY <= e.minY && e.maxX <= t.maxX && e.maxY <= t.maxY;
          }
          function d(t, e) {
            return e.minX <= t.maxX && e.minY <= t.maxY && e.maxX >= t.minX && e.maxY >= t.minY;
          }
          function f(t) {
            return {
              children: t,
              height: 1,
              leaf: !0,
              minX: 1 / 0,
              minY: 1 / 0,
              maxX: -1 / 0,
              maxY: -1 / 0
            };
          }
          function g(e, i, n, r, a) {
            for (var o = [i, n]; o.length;) if (!((n = o.pop()) - (i = o.pop()) <= r)) {
              var s = i + Math.ceil((n - i) / r / 2) * r;
              t(e, s, i, n, a), o.push(i, s, s, n);
            }
          }
          return n.prototype.all = function () {
            return this._all(this.data, []);
          }, n.prototype.search = function (t) {
            var e = this.data,
              i = [];
            if (!d(t, e)) return i;
            for (var n = this.toBBox, r = []; e;) {
              for (var a = 0; a < e.children.length; a++) {
                var o = e.children[a],
                  s = e.leaf ? n(o) : o;
                d(t, s) && (e.leaf ? i.push(o) : p(t, s) ? this._all(o, i) : r.push(o));
              }
              e = r.pop();
            }
            return i;
          }, n.prototype.collides = function (t) {
            var e = this.data;
            if (!d(t, e)) return !1;
            for (var i = []; e;) {
              for (var n = 0; n < e.children.length; n++) {
                var r = e.children[n],
                  a = e.leaf ? this.toBBox(r) : r;
                if (d(t, a)) {
                  if (e.leaf || p(t, a)) return !0;
                  i.push(r);
                }
              }
              e = i.pop();
            }
            return !1;
          }, n.prototype.load = function (t) {
            if (!t || !t.length) return this;
            if (t.length < this._minEntries) {
              for (var e = 0; e < t.length; e++) this.insert(t[e]);
              return this;
            }
            var i = this._build(t.slice(), 0, t.length - 1, 0);
            if (this.data.children.length) {
              if (this.data.height === i.height) this._splitRoot(this.data, i);else {
                if (this.data.height < i.height) {
                  var n = this.data;
                  this.data = i, i = n;
                }
                this._insert(i, this.data.height - i.height - 1, !0);
              }
            } else this.data = i;
            return this;
          }, n.prototype.insert = function (t) {
            return t && this._insert(t, this.data.height - 1), this;
          }, n.prototype.clear = function () {
            return this.data = f([]), this;
          }, n.prototype.remove = function (t, e) {
            if (!t) return this;
            for (var i, n, a, o = this.data, s = this.toBBox(t), l = [], h = []; o || l.length;) {
              if (o || (o = l.pop(), n = l[l.length - 1], i = h.pop(), a = !0), o.leaf) {
                var u = r(t, o.children, e);
                if (-1 !== u) return o.children.splice(u, 1), l.push(o), this._condense(l), this;
              }
              a || o.leaf || !p(o, s) ? n ? (i++, o = n.children[i], a = !1) : o = null : (l.push(o), h.push(i), i = 0, n = o, o = o.children[0]);
            }
            return this;
          }, n.prototype.toBBox = function (t) {
            return t;
          }, n.prototype.compareMinX = function (t, e) {
            return t.minX - e.minX;
          }, n.prototype.compareMinY = function (t, e) {
            return t.minY - e.minY;
          }, n.prototype.toJSON = function () {
            return this.data;
          }, n.prototype.fromJSON = function (t) {
            return this.data = t, this;
          }, n.prototype._all = function (t, e) {
            for (var i = []; t;) t.leaf ? e.push.apply(e, t.children) : i.push.apply(i, t.children), t = i.pop();
            return e;
          }, n.prototype._build = function (t, e, i, n) {
            var r,
              o = i - e + 1,
              s = this._maxEntries;
            if (o <= s) return a(r = f(t.slice(e, i + 1)), this.toBBox), r;
            n || (n = Math.ceil(Math.log(o) / Math.log(s)), s = Math.ceil(o / Math.pow(s, n - 1))), (r = f([])).leaf = !1, r.height = n;
            var l = Math.ceil(o / s),
              h = l * Math.ceil(Math.sqrt(s));
            g(t, e, i, h, this.compareMinX);
            for (var u = e; u <= i; u += h) {
              var c = Math.min(u + h - 1, i);
              g(t, u, c, l, this.compareMinY);
              for (var p = u; p <= c; p += l) {
                var d = Math.min(p + l - 1, c);
                r.children.push(this._build(t, p, d, n - 1));
              }
            }
            return a(r, this.toBBox), r;
          }, n.prototype._chooseSubtree = function (t, e, i, n) {
            for (; n.push(e), !e.leaf && n.length - 1 !== i;) {
              for (var r = 1 / 0, a = 1 / 0, o = void 0, s = 0; s < e.children.length; s++) {
                var l = e.children[s],
                  h = u(l),
                  c = (p = t, d = l, (Math.max(d.maxX, p.maxX) - Math.min(d.minX, p.minX)) * (Math.max(d.maxY, p.maxY) - Math.min(d.minY, p.minY)) - h);
                c < a ? (a = c, r = h < r ? h : r, o = l) : c === a && h < r && (r = h, o = l);
              }
              e = o || e.children[0];
            }
            var p, d;
            return e;
          }, n.prototype._insert = function (t, e, i) {
            var n = i ? t : this.toBBox(t),
              r = [],
              a = this._chooseSubtree(n, this.data, e, r);
            for (a.children.push(t), s(a, n); e >= 0 && r[e].children.length > this._maxEntries;) this._split(r, e), e--;
            this._adjustParentBBoxes(n, r, e);
          }, n.prototype._split = function (t, e) {
            var i = t[e],
              n = i.children.length,
              r = this._minEntries;
            this._chooseSplitAxis(i, r, n);
            var o = this._chooseSplitIndex(i, r, n),
              s = f(i.children.splice(o, i.children.length - o));
            s.height = i.height, s.leaf = i.leaf, a(i, this.toBBox), a(s, this.toBBox), e ? t[e - 1].children.push(s) : this._splitRoot(i, s);
          }, n.prototype._splitRoot = function (t, e) {
            this.data = f([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
          }, n.prototype._chooseSplitIndex = function (t, e, i) {
            for (var n, r, a, s, l, h, c, p = 1 / 0, d = 1 / 0, f = e; f <= i - e; f++) {
              var g = o(t, 0, f, this.toBBox),
                _ = o(t, f, i, this.toBBox),
                m = (r = g, a = _, s = void 0, l = void 0, h = void 0, c = void 0, s = Math.max(r.minX, a.minX), l = Math.max(r.minY, a.minY), h = Math.min(r.maxX, a.maxX), c = Math.min(r.maxY, a.maxY), Math.max(0, h - s) * Math.max(0, c - l)),
                y = u(g) + u(_);
              m < p ? (p = m, n = f, d = y < d ? y : d) : m === p && y < d && (d = y, n = f);
            }
            return n || i - e;
          }, n.prototype._chooseSplitAxis = function (t, e, i) {
            var n = t.leaf ? this.compareMinX : l,
              r = t.leaf ? this.compareMinY : h;
            this._allDistMargin(t, e, i, n) < this._allDistMargin(t, e, i, r) && t.children.sort(n);
          }, n.prototype._allDistMargin = function (t, e, i, n) {
            t.children.sort(n);
            for (var r = this.toBBox, a = o(t, 0, e, r), l = o(t, i - e, i, r), h = c(a) + c(l), u = e; u < i - e; u++) {
              var p = t.children[u];
              s(a, t.leaf ? r(p) : p), h += c(a);
            }
            for (var d = i - e - 1; d >= e; d--) {
              var f = t.children[d];
              s(l, t.leaf ? r(f) : f), h += c(l);
            }
            return h;
          }, n.prototype._adjustParentBBoxes = function (t, e, i) {
            for (var n = i; n >= 0; n--) s(e[n], t);
          }, n.prototype._condense = function (t) {
            for (var e = t.length - 1, i = void 0; e >= 0; e--) 0 === t[e].children.length ? e > 0 ? (i = t[e - 1].children).splice(i.indexOf(t[e]), 1) : this.clear() : a(t[e], this.toBBox);
          }, n;
        }();
      }
    },
    e = {};
  function i(n) {
    var r = e[n];
    if (r !== undefined) return r.exports;
    var a = e[n] = {
      id: n,
      loaded: !1,
      exports: {}
    };
    return t[n].call(a.exports, a, a.exports, i), a.loaded = !0, a.exports;
  }
  i.n = t => {
    var e = t && t.__esModule ? () => t["default"] : () => t;
    return i.d(e, {
      a: e
    }), e;
  }, i.d = (t, e) => {
    for (var n in e) i.o(e, n) && !i.o(t, n) && Object.defineProperty(t, n, {
      enumerable: !0,
      get: e[n]
    });
  }, i.g = function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (t) {
      if ("object" == typeof window) return window;
    }
  }(), i.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), i.nmd = t => (t.paths = [], t.children || (t.children = []), t);
  i(414);
})();
},{"process":"node_modules/process/browser.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/uuid/dist/esm-browser/rng.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}
},{}],"node_modules/uuid/dist/esm-browser/regex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/validate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regex = _interopRequireDefault(require("./regex.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}
var _default = validate;
exports.default = _default;
},{"./regex.js":"node_modules/uuid/dist/esm-browser/regex.js"}],"node_modules/uuid/dist/esm-browser/stringify.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.unsafeStringify = unsafeStringify;
var _validate = _interopRequireDefault(require("./validate.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }
  return uuid;
}
var _default = stringify;
exports.default = _default;
},{"./validate.js":"node_modules/uuid/dist/esm-browser/validate.js"}],"node_modules/uuid/dist/esm-browser/v1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rng = _interopRequireDefault(require("./rng.js"));
var _stringify = require("./stringify.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;
let _clockseq; // Previous uuid creation time

let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.

  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval

  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested

  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }
  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }
  return buf || (0, _stringify.unsafeStringify)(b);
}
var _default = v1;
exports.default = _default;
},{"./rng.js":"node_modules/uuid/dist/esm-browser/rng.js","./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js"}],"node_modules/uuid/dist/esm-browser/parse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _validate = _interopRequireDefault(require("./validate.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }
  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}
var _default = parse;
exports.default = _default;
},{"./validate.js":"node_modules/uuid/dist/esm-browser/validate.js"}],"node_modules/uuid/dist/esm-browser/v35.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URL = exports.DNS = void 0;
exports.default = v35;
var _stringify = require("./stringify.js");
var _parse = _interopRequireDefault(require("./parse.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];
  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}
const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }
    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }
    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`

    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }
      return buf;
    }
    return (0, _stringify.unsafeStringify)(bytes);
  } // Function#name is not settable on some platforms (#270)

  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support

  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js","./parse.js":"node_modules/uuid/dist/esm-browser/parse.js"}],"node_modules/uuid/dist/esm-browser/md5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);
    for (let i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }
  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */

function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = '0123456789abcdef';
  for (let i = 0; i < length32; i += 8) {
    const x = input[i >> 5] >>> i % 32 & 0xff;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }
  return output;
}
/**
 * Calculate output length with padding and bit length
 */

function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */

function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */

function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }
  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));
  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }
  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */

function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */

function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */

function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}
var _default = md5;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _v = _interopRequireDefault(require("./v35.js"));
var _md = _interopRequireDefault(require("./md5.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
},{"./v35.js":"node_modules/uuid/dist/esm-browser/v35.js","./md5.js":"node_modules/uuid/dist/esm-browser/md5.js"}],"node_modules/uuid/dist/esm-browser/native.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var _default = {
  randomUUID
};
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _native = _interopRequireDefault(require("./native.js"));
var _rng = _interopRequireDefault(require("./rng.js"));
var _stringify = require("./stringify.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function v4(options, buf, offset) {
  if (_native.default.randomUUID && !buf && !options) {
    return _native.default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return (0, _stringify.unsafeStringify)(rnds);
}
var _default = v4;
exports.default = _default;
},{"./native.js":"node_modules/uuid/dist/esm-browser/native.js","./rng.js":"node_modules/uuid/dist/esm-browser/rng.js","./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js"}],"node_modules/uuid/dist/esm-browser/sha1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;
    case 1:
      return x ^ y ^ z;
    case 2:
      return x & y ^ x & z ^ y & z;
    case 3:
      return x ^ y ^ z;
  }
}
function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}
function sha1(bytes) {
  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];
    for (let i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }
  bytes.push(0x80);
  const l = bytes.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M = new Array(N);
  for (let i = 0; i < N; ++i) {
    const arr = new Uint32Array(16);
    for (let j = 0; j < 16; ++j) {
      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }
    M[i] = arr;
  }
  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;
  for (let i = 0; i < N; ++i) {
    const W = new Uint32Array(80);
    for (let t = 0; t < 16; ++t) {
      W[t] = M[i][t];
    }
    for (let t = 16; t < 80; ++t) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }
    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    for (let t = 0; t < 80; ++t) {
      const s = Math.floor(t / 20);
      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }
    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }
  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}
var _default = sha1;
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/v5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _v = _interopRequireDefault(require("./v35.js"));
var _sha = _interopRequireDefault(require("./sha1.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
},{"./v35.js":"node_modules/uuid/dist/esm-browser/v35.js","./sha1.js":"node_modules/uuid/dist/esm-browser/sha1.js"}],"node_modules/uuid/dist/esm-browser/nil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;
},{}],"node_modules/uuid/dist/esm-browser/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _validate = _interopRequireDefault(require("./validate.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }
  return parseInt(uuid.slice(14, 15), 16);
}
var _default = version;
exports.default = _default;
},{"./validate.js":"node_modules/uuid/dist/esm-browser/validate.js"}],"node_modules/uuid/dist/esm-browser/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "NIL", {
  enumerable: true,
  get: function () {
    return _nil.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return _validate.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});
var _v = _interopRequireDefault(require("./v1.js"));
var _v2 = _interopRequireDefault(require("./v3.js"));
var _v3 = _interopRequireDefault(require("./v4.js"));
var _v4 = _interopRequireDefault(require("./v5.js"));
var _nil = _interopRequireDefault(require("./nil.js"));
var _version = _interopRequireDefault(require("./version.js"));
var _validate = _interopRequireDefault(require("./validate.js"));
var _stringify = _interopRequireDefault(require("./stringify.js"));
var _parse = _interopRequireDefault(require("./parse.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./v1.js":"node_modules/uuid/dist/esm-browser/v1.js","./v3.js":"node_modules/uuid/dist/esm-browser/v3.js","./v4.js":"node_modules/uuid/dist/esm-browser/v4.js","./v5.js":"node_modules/uuid/dist/esm-browser/v5.js","./nil.js":"node_modules/uuid/dist/esm-browser/nil.js","./version.js":"node_modules/uuid/dist/esm-browser/version.js","./validate.js":"node_modules/uuid/dist/esm-browser/validate.js","./stringify.js":"node_modules/uuid/dist/esm-browser/stringify.js","./parse.js":"node_modules/uuid/dist/esm-browser/parse.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./images/bin.svg":[["bin.bbfa386d.svg","src/images/bin.svg"],"src/images/bin.svg"],"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/leaflet-text-label.js":[function(require,module,exports) {
"use strict";

var _leaflet = _interopRequireDefault(require("leaflet"));
require("@geoman-io/leaflet-geoman-free");
require("@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css");
var _uuid = require("uuid");
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function handleDelete(_) {
  this.remove();
}
function getPopupLatLng(bounds, map) {
  var sePoint = map.latLngToLayerPoint(bounds.getSouthEast());
  var swPoint = map.latLngToLayerPoint(bounds.getSouthWest());
  var middleOffset = [(swPoint.x + sePoint.x) / 2, swPoint.y + 50];
  return map.layerPointToLatLng(middleOffset);
}
_leaflet.default.LeafletTextLabel = _leaflet.default.SVGOverlay.extend({
  initialize: function initialize(options) {
    var _this = this;
    this._corner1 = null;
    this._corner2 = null;
    this._bounds = _leaflet.default.latLngBounds(_leaflet.default.latLng(0, 0), _leaflet.default.latLng(0, 0));
    this._guideRect = null;
    this._width = 0;
    this._height = 0;
    this._options = options;
    this._textAreaElement = null;
    this._uuid = (0, _uuid.v4)();
    this._svgElement = this._createEmptySVG();
    this._isEditing = false;
    this._text = "";
    this._deleteBtn = null;
    this._popup = _leaflet.default.popup({
      className: "leaflet-text-label-popup",
      closeButton: false
    }).setLatLng([0, 0]).setContent(function (layer) {
      _this._deleteBtn = _leaflet.default.DomUtil.create("div", "lealfet-text-label-popup-item-btn");
      _leaflet.default.DomEvent.on(_this._deleteBtn, "click", handleDelete, _this);
      return _this._deleteBtn;
    });

    // initialize an empty svg
    _leaflet.default.SVGOverlay.prototype.initialize.call(this, this._svgElement, this._bounds, _objectSpread(_objectSpread({}, this._options), {}, {
      interactive: true
    }));
  },
  onAdd: function onAdd(map) {
    var _this2 = this;
    map.once("mousedown", function (e) {
      map.dragging.disable();
      _this2._corner1 = e.latlng;
      _this2._guideRect = _leaflet.default.rectangle(_leaflet.default.latLngBounds(_this2._corner1, _this2._corner1), {
        opacity: 1,
        color: "#000",
        fillOpacity: 0,
        dashArray: [5, 5],
        weight: 1
      }).addTo(map);
      map.on("mousemove", function (_ref) {
        var latlng = _ref.latlng;
        _this2._corner2 = latlng;
        _this2._guideRect.setBounds(_leaflet.default.latLngBounds(_this2._corner1, _this2._corner2));
      });
    });
    map.once("mouseup", function (e) {
      map.off("mousemove");
      map.dragging.enable();
      _this2._corner2 = e.latlng;
      _this2._bounds = _leaflet.default.latLngBounds(_this2._corner1, _this2._corner2);
      _this2._setWidthHeightBounds(map, _this2._bounds);
      _this2.setBounds(_this2._bounds);
      _this2._addEvents();
      // workaround to prevent the click event being listened on the first edit
      // I couldnt stop the propagation
      setTimeout(function () {
        return _this2._edit();
      }, 100);
    });
    _leaflet.default.SVGOverlay.prototype.onAdd.call(this, map);
  },
  onRemove: function onRemove(map) {
    _leaflet.default.DomEvent.off(this._deleteBtn, "click", handleDelete, this);
    _leaflet.default.DomUtil.remove(this._deleteBtn);
    this._popup.remove();
    _leaflet.default.DomUtil.remove(this._svgElement);
    this._guideRect.remove();
    this.fire("remove", {
      id: this._uuid
    });
    _leaflet.default.SVGOverlay.prototype.onRemove.call(this, map);
  },
  _setWidthHeightBounds: function _setWidthHeightBounds(map, bounds) {
    var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
    var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
    this._width = Math.abs(bottomRight.x - topLeft.x);
    this._height = Math.abs(bottomRight.y - topLeft.y);
  },
  _createEmptySVG: function _createEmptySVG() {
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return svgElement;
  },
  _setEditSVG: function _setEditSVG() {
    this._svgElement.setAttribute("viewBox", "0 0 " + this._width + " " + this._height);
    this._svgElement.innerHTML = "\n      <foreignObject x=\"0\" y=\"0\" width=\"".concat(this._width, "\" height=\"").concat(this._height, "\">\n        <textarea id=\"").concat(this._uuid, "\"></textarea>\n      </foreignObject>\n    ");
    this._textAreaElement = document.getElementById(this._uuid);
  },
  _setViewingSVG: function _setViewingSVG() {
    var tSpanArr = this._text.split("\n").map(function (part) {
      return "<tspan x=\"0\" dy=\"".concat(part === "" ? "2em" : "1em", "\">").concat(part || "&nbsp", "</tspan>");
    }).join("\n");
    this._svgElement.innerHTML = "\n      <text\n        id=".concat(this._uuid, "\n        x=0\n        y=0\n        textAnchor=\"middle\"\n      >").concat(tSpanArr, "</text>\n    ");
    this._updateSVGTransform();
  },
  _updateSVGTransform: function _updateSVGTransform() {
    var textNode = document.getElementById(this._uuid);
    if (textNode) {
      var bb = textNode.getBBox();
      var widthTransform = this._width / bb.width;
      var heightTransform = this._height / bb.height;
      this._value = widthTransform < heightTransform ? widthTransform : heightTransform;
      textNode.style.transform = "scale(" + this._value + ")";
      textNode.style.transformOrigin = "0px 0px";
    }
  },
  _edit: function _edit() {
    var _this3 = this;
    console.log("edit");
    this._isEditing = true;
    this._guideRect.pm.disableLayerDrag();
    // this._guideRect.pm.disableRotate();
    this._guideRect.pm.enable({
      snappable: false,
      preventMarkerRemoval: true
    });
    this.bringToFront();
    this._setEditSVG();
    this._textAreaElement.value = this._text;
    this._guideRect.setStyle({
      opacity: 1
    });
    this._map.dragging.disable();
    this._textAreaElement.focus();
    _leaflet.default.DomEvent.on(this._textAreaElement, "mousemove", _leaflet.default.DomEvent.stopPropagation);
    _leaflet.default.DomEvent.disableClickPropagation(this._textAreaElement);
    this._map.on("click", function (_ref2) {
      var latlng = _ref2.latlng;
      if (!_this3._bounds.pad(0.025).contains(latlng) && _this3._isEditing) {
        _this3._finishEdit();
      }
      if (_this3.getText() && !_this3._isEditing) {
        _this3._guideRect.setStyle({
          opacity: 0
        });
      }
    });
  },
  _finishEdit: function _finishEdit() {
    console.log("finish edit");
    this._text = this._textAreaElement.value;
    this._isEditing = false;
    this._guideRect.pm.enableLayerDrag();
    // this._guideRect.pm.enableRotate();
    this._guideRect.pm.disable();
    this.bringToBack();
    this._setViewingSVG();
    this._map.dragging.enable();
    _leaflet.default.DomEvent.off(this._textAreaElement, "mousedown", _leaflet.default.DomEvent.stopPropagation);
    _leaflet.default.DomEvent.off(this._textAreaElement, "mouseup", _leaflet.default.DomEvent.stopPropagation);
    _leaflet.default.DomEvent.off(this._textAreaElement, "mousemove", _leaflet.default.DomEvent.stopPropagation);
    this._map.off("mousedown");
    this.fire("editend", {
      text: this._textAreaElement.value,
      bounds: this._bounds,
      id: this._uuid
    });
  },
  _addEvents: function _addEvents() {
    var _this4 = this;
    this._guideRect.on("click", function (e) {
      console.log("handleClick");
      _leaflet.default.DomEvent.stopPropagation(e);
      _this4._guideRect.setStyle({
        opacity: 1
      });
      _this4._popup.setLatLng(getPopupLatLng(_this4._bounds, _this4._map));
      _this4._map.openPopup(_this4._popup);
    });
    this._guideRect.on("dblclick", function (e) {
      console.log("handledblclick");
      _leaflet.default.DomEvent.stopPropagation(e);
      if (_this4._isEditing || _this4._guideRect.pm.dragging()) {
        return;
      }
      _this4._edit();
    });
    this._guideRect.on("pm:dragstart", function (e) {
      console.log("handleDragStart");
      e.layer.setStyle({
        opacity: 1
      });
      _this4._map.closePopup(_this4._popup);
    });
    this._guideRect.on("pm:dragend", function (e) {
      console.log("handleDragEnd");
      if (_this4.getText()) {
        e.layer.setStyle({
          opacity: 0
        });
      }
      _this4._map.closePopup(_this4._popup);
    });
    this._guideRect.on("pm:drag", function (e) {
      console.log("handleDrag");
      _this4._bounds = e.layer.getBounds();
      _this4.setBounds(_this4._bounds);
    });
    var handleResize = function handleResize(_ref3) {
      var layer = _ref3.layer;
      _this4._bounds = _leaflet.default.latLngBounds(layer.getBounds());
      _this4._setWidthHeightBounds(_this4._map, _this4._bounds);
      _this4.setBounds(_this4._bounds);
      _this4._setEditSVG();
      _this4._textAreaElement.value = _this4._text;
    };
    var handleResizeStart = function handleResizeStart(_) {
      _this4._map.closePopup(_this4._popup);
    };
    var handleResizeEnd = function handleResizeEnd(_ref4) {
      var layer = _ref4.layer;
      handleResize({
        layer: layer
      });
      _this4._popup.setLatLng(getPopupLatLng(_this4._bounds, _this4._map));
      _this4._map.openPopup(_this4._popup);
    };
    this._guideRect.on("pm:markerdragstart", handleResizeStart);
    this._guideRect.on("pm:markerdragend", handleResizeEnd);
    this._guideRect.on("pm:markerdrag", handleResize);
  },
  getText: function getText() {
    return this._text;
  }
});
_leaflet.default.leafletTextLabel = function (options) {
  return new _leaflet.default.LeafletTextLabel(options);
};
},{"leaflet":"node_modules/leaflet/dist/leaflet-src.js","@geoman-io/leaflet-geoman-free":"node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.min.js","@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css":"node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css","uuid":"node_modules/uuid/dist/esm-browser/index.js","./styles.css":"src/styles.css"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _leaflet = _interopRequireDefault(require("leaflet"));
require("./leaflet-text-label");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var map = _leaflet.default.map("app").setView([51, -114], 20);
_leaflet.default.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
var a = _leaflet.default.leafletTextLabel().addTo(map);
},{"leaflet":"node_modules/leaflet/dist/leaflet-src.js","./leaflet-text-label":"src/leaflet-text-label.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50761" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ??? Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] ????  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">????</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map