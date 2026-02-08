(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["zeu"] = factory();
	else
		root["zeu"] = factory();
})(Object(typeof self !== "undefined" ? self : this), () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animation-timer.ts"
/*!********************************!*\
  !*** ./src/animation-timer.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./src/global.ts");

class AnimationTimer {
    constructor() {
        // Bind the render function.
        this.render = this.render.bind(this);
        // Animation parameters.
        this._fps = 60;
        this._fpsInterval = 1000 / this._fps;
        this._lastFrame = Date.now();
        // Cross browser.
        if (!window.requestAnimationFrame) {
            window.requestAnimFrame = () => {
                return window.webkitRequestAnimationFrame(this.render) ||
                    window.mozRequestAnimationFrame(this.render) ||
                    window.oRequestAnimationFrame(this.render) ||
                    window.msRequestAnimationFrame(this.render);
            };
        }
    }
    render() {
        // FPS control
        const now = Date.now();
        const elapsed = now - this._lastFrame;
        if (elapsed > this._fpsInterval) {
            this._lastFrame = now - (elapsed % this._fpsInterval);
            // Draw
            for (let i = 0; i < _global__WEBPACK_IMPORTED_MODULE_0__.GLOBAL.requestAnimationFrameArray.length; i++) {
                const drawFrameObj = _global__WEBPACK_IMPORTED_MODULE_0__.GLOBAL.requestAnimationFrameArray[i];
                drawFrameObj.func.call(drawFrameObj.self);
            }
        }
        window.requestAnimationFrame(this.render);
    }
    setFps(fps) {
        this._fps = fps;
        this._fpsInterval = 1000 / this._fps;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new AnimationTimer());


/***/ },

/***/ "./src/bar-meter.ts"
/*!**************************!*\
  !*** ./src/bar-meter.ts ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BarMeter)
/* harmony export */ });
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");



class BarMeter extends _base_component__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 100;
        super(canvas, options, viewWidth, 200);
        this._currBar = 0;
        this._barHeight = 15;
        this._barWidth = this._viewWidth - 2 * this._space;
        // Initial calculation
        this._numberOfBars = Math.floor((this._value - this._min) / (this._max - this._min) * 10);
        this._barMax = this._numberOfBars * 100;
    }
    setOptions(options = {}) {
        this._min = options.min !== undefined ? options.min : 0;
        this._max = options.max !== undefined ? options.max : 100;
        this._value = options.value !== undefined ? options.value : 0;
        this.dashColor = options.dashColor || (this.theme ? this.theme.grey : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.grey);
        this.barColor = options.barColor || (this.theme ? this.theme.green : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.green);
        this.speed = options.speed !== undefined ? options.speed : 5;
        this._isGradient = options.gradient || false;
        this._space = options.space !== undefined ? options.space : 20;
    }
    isAnimating() {
        return this._currBar < this._barMax;
    }
    drawObject() {
        this.drawOffscreen();
        // Draw bars.
        if (this._currBar >= this._barMax) {
            this._currBar = -100;
        }
        else {
            const bar = this._currBar / 100;
            let colors = [];
            if (this._isGradient) {
                colors = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].generateGradientColor(this.theme.white, this.barColor, bar);
            }
            else {
                this._ctx.fillStyle = this.barColor;
            }
            for (let i = 0; i < bar; i++) {
                const y = this._viewHeight - (15 + i * 20);
                if (this._isGradient) {
                    this._ctx.fillStyle = '#' + colors[i];
                }
                this._ctx.beginPath();
                this._ctx.fillRect(this._space, y, this._barWidth, this._barHeight);
                this._ctx.closePath();
            }
            this._currBar += this.speed;
            this._dirty = true;
        }
    }
    drawStatic() {
        // Draw the dash.
        for (let i = 0; i < 10; i++) {
            const y = 5 + i * 20;
            this._offscreenCtx.fillStyle = this.dashColor;
            this._offscreenCtx.fillRect(this._space, y, this._barWidth, this._barHeight);
        }
    }
    set value(value) {
        this._value = value;
        this._numberOfBars = Math.floor((this._value - this._min) / (this._max - this._min) * 10);
        this._barMax = this._numberOfBars * 100;
        this._dirty = true;
    }
    get valuePct() {
        return Math.floor((this._value - this._min) / (this._max - this._min) * 100);
    }
}


/***/ },

/***/ "./src/base-component.ts"
/*!*******************************!*\
  !*** ./src/base-component.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseComponent)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./src/global.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shape */ "./src/shape.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./theme */ "./src/theme.ts");





class BaseComponent {
    get theme() {
        return _theme__WEBPACK_IMPORTED_MODULE_4__.ThemeManager.getInstance().theme;
    }
    constructor(canvasId, options = {}, viewWidth, viewHeight) {
        var _a;
        // Canvas
        const canvasElement = document.getElementById(canvasId);
        if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
            throw new Error(`Canvas element with id '${canvasId}' not found or is not a canvas.`);
        }
        this._canvas = canvasElement;
        // Canvas 2d context
        const context = this._canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2d context from canvas.');
        }
        this._ctx = context;
        // HiDPI support
        _utility__WEBPACK_IMPORTED_MODULE_1__["default"].prepareCanvas(this._canvas, this._ctx);
        // Offscreen canvas for pre-rendering
        this._offscreenCanvas = document.createElement('canvas');
        const offscreenContext = this._offscreenCanvas.getContext('2d');
        if (!offscreenContext) {
            throw new Error('Could not get 2d context from offscreen canvas.');
        }
        this._offscreenCtx = offscreenContext;
        this._staticRendered = false;
        // Current X value (Left 0 to right)
        this._x = 0;
        // Current Y value (Top 0 to bottom)
        this._y = 0;
        // The width and height used to draw the component.
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;
        // Initialize width/height
        this._width = viewWidth;
        this._height = viewHeight;
        // Scale parameters used in scale()
        this._scaleX = 1;
        this._scaleY = 1;
        // Get canvas height
        const canvasHeight = this._canvas.height || ((_a = this._canvas.parentNode) === null || _a === void 0 ? void 0 : _a.clientHeight) || viewHeight;
        // Set actual width and height of the component based on scales.
        this.scaleByHeight(canvasHeight);
        this._display = true;
        // Event queue that stores animation movements like 'move', 'scale', 'display' and etc.
        this._eventQueue = [];
        // Bind the drawFrame function.
        this.drawFrame = this.drawFrame.bind(this);
        // Init Shape instance.
        this._shape = new _shape__WEBPACK_IMPORTED_MODULE_2__["default"](this._ctx);
        const alert = {
            on: false,
            lastCall: 0,
            dashOffSet: 0,
            text: '',
            interval: 1500,
            lineColor: _color__WEBPACK_IMPORTED_MODULE_3__.COLOR.red,
            fontColor: _color__WEBPACK_IMPORTED_MODULE_3__.COLOR.red,
            bgColor: _color__WEBPACK_IMPORTED_MODULE_3__.COLOR.yellow
        };
        this._alert = alert;
        this.alertFunc = this.alertFunc.bind(this);
        this._dirty = true;
        // Theme subscription
        this._themeListener = () => {
            this._dirty = true;
            this._staticRendered = false; // Invalidate offscreen cache
        };
        _theme__WEBPACK_IMPORTED_MODULE_4__.ThemeManager.getInstance().subscribe(this._themeListener);
        // Set options
        this.setOptions(options);
        // Post constructor.
        this.postConstructor();
    }
    // ********** INTERNAL API **********
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    setOptions(_options) { }
    postConstructor() {
        this.removeFromAnimationQueue();
        this.addToAnimationQueue();
    }
    drawFrame() {
        // Check movement
        if (this._eventQueue.length > 0) {
            const event = this._eventQueue[0];
            if (event.type === 'move') {
                if (this._x === event.destX && this._y === event.destY) {
                    this._eventQueue.shift();
                }
                else {
                    this._x = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(this._x, event.destX, event.speedX);
                    this._y = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(this._y, event.destY, event.speedY);
                    this._dirty = true;
                }
            }
        }
        // Check display or not.
        if (!this.isDisplay() || (!this._dirty && !this.isAlert())) {
            return;
        }
        this.clear();
        this.save();
        this.drawObject();
        this._ctx.restore();
        if (this.isAlert()) {
            this.save();
            this._alert.lastCall = this.nextAlert(this.alertFunc, this._alert.lastCall, this._alert.interval);
            this._ctx.restore();
        }
        // Reset dirty flag if not animating or alerting
        if (this._eventQueue.length === 0 && !this.isAlert() && !this.isAnimating()) {
            this._dirty = false;
        }
    }
    isAnimating() {
        return false;
    }
    drawObject() { }
    drawStatic() {
        // Override this to draw static elements to this._offscreenCtx
    }
    drawOffscreen() {
        if (!this._staticRendered) {
            this.drawStatic();
            this._staticRendered = true;
        }
        this._ctx.drawImage(this._offscreenCanvas, 0, 0, this._offscreenCanvas.width, this._offscreenCanvas.height, this._x, this._y, this._width, this._height);
    }
    clear() {
        this._ctx.clearRect(this._x, this._y, this._width, this._height);
    }
    scale() {
        this._ctx.scale(this._scaleX, this._scaleY);
    }
    save() {
        this._ctx.save();
        this.scale();
    }
    addToAnimationQueue() {
        const index = this.getAnimationFrameArrayPos();
        if (index === -1) {
            _global__WEBPACK_IMPORTED_MODULE_0__.GLOBAL.requestAnimationFrameArray.push(this.drawFrameObj());
        }
    }
    removeFromAnimationQueue() {
        const index = this.getAnimationFrameArrayPos();
        if (index !== -1) {
            _global__WEBPACK_IMPORTED_MODULE_0__.GLOBAL.requestAnimationFrameArray.splice(index, 1);
        }
    }
    drawFrameObj() {
        return {
            func: this.drawFrame,
            self: this
        };
    }
    getAnimationFrameArrayPos() {
        return _global__WEBPACK_IMPORTED_MODULE_0__.GLOBAL.requestAnimationFrameArray.findIndex(obj => obj.self === this);
    }
    get isAnimationOn() {
        return this.getAnimationFrameArrayPos() !== -1;
    }
    nextAlert(alertFunc, lastAlert, interval) {
        const now = Date.now();
        if (now - lastAlert < interval) {
            alertFunc.call(this);
            return lastAlert;
        }
        else if (now - lastAlert < (interval * 2)) {
            return lastAlert;
        }
        return now;
    }
    alertFunc() {
        this._shape.fillRect(this._x, this._y, this._width, this._height, this._alert.bgColor);
        this._ctx.setLineDash([20, 16]);
        this._ctx.lineDashOffset = -this._alert.dashOffSet;
        this._ctx.lineWidth = 20;
        this._ctx.strokeStyle = this._alert.lineColor;
        this._ctx.strokeRect(this._x, this._y, this._width, this._height);
        this._alert.dashOffSet++;
        if (this._alert.dashOffSet > 32) {
            this._alert.dashOffSet = 0;
        }
        this._shape.fillText(this._alert.text, (this._width - this._x) / 2, (this._height - this._y) / 2 + 10, 'Bold 30px Arial', 'center', this._alert.fontColor);
    }
    // ********** EXTERNAL API **********
    /**
     * Destroy.
     */
    destroy() {
        _theme__WEBPACK_IMPORTED_MODULE_4__.ThemeManager.getInstance().unsubscribe(this._themeListener);
        this.removeFromAnimationQueue();
        this.clear();
        // Releasing references
        // @ts-expect-error: Intentional cleanup
        this._canvas = null;
        // @ts-expect-error: Intentional cleanup
        this._ctx = null;
        // @ts-expect-error: Intentional cleanup
        this._alert = null;
    }
    /**
     * Turn on alert.
     */
    alertOn(params = {}) {
        this._alert.text = params.text || 'ALERT';
        this._alert.interval = params.interval || 1500;
        this._alert.bgColor = params.bgColor || _color__WEBPACK_IMPORTED_MODULE_3__.COLOR.yellow;
        this._alert.fontColor = params.fontColor || _color__WEBPACK_IMPORTED_MODULE_3__.COLOR.red;
        this._alert.lineColor = params.lineColor || _color__WEBPACK_IMPORTED_MODULE_3__.COLOR.red;
        this._alert.on = true;
        this._dirty = true;
    }
    /**
     * Turn off alert.
     */
    alertOff() {
        this._alert.on = false;
        this._dirty = true;
    }
    isAlert() {
        return this._alert.on;
    }
    moveTo(destX, destY, duration) {
        let srcX = this._x;
        let srcY = this._y;
        // Find last move event.
        for (let i = (this._eventQueue.length - 1); i >= 0; i--) {
            const event = this._eventQueue[i];
            if (event.type === 'move') {
                srcX = event.destX;
                srcY = event.destY;
                break;
            }
        }
        // Calculate the speed.
        const speed = duration / 60;
        const sX = Math.abs(destX - srcX) / speed;
        const sY = Math.abs(destY - srcY) / speed;
        const speedX = destX > srcX ? sX : -sX;
        const speedY = destY > srcY ? sY : -sY;
        // Push the movement to the queue.
        this._eventQueue.push({
            type: 'move',
            destX: destX,
            destY: destY,
            speedX: speedX,
            speedY: speedY
        });
        return this;
    }
    scaleTo(x, y) {
        this._scaleX = x;
        this._scaleY = y;
        this._width = this._scaleX * this._viewWidth;
        this._height = this._scaleY * this._viewHeight;
        this._dirty = true;
        return this;
    }
    scaleByHeight(height) {
        this._scaleY = height / this._viewHeight;
        this._scaleX = this._scaleY;
        this._width = this._scaleX * this._viewWidth;
        this._height = this._scaleY * this._viewHeight;
        // Resize offscreen canvas
        const dpr = window.devicePixelRatio || 1;
        this._offscreenCanvas.width = this._width * dpr;
        this._offscreenCanvas.height = this._height * dpr;
        this._offscreenCtx.setTransform(1, 0, 0, 1, 0, 0);
        this._offscreenCtx.scale(dpr * this._scaleX, dpr * this._scaleY);
        this._staticRendered = false;
        this._dirty = true;
        return this;
    }
    show() {
        this._display = true;
        this._dirty = true;
    }
    hide() {
        this._display = false;
    }
    isDisplay() {
        return this._display;
    }
    get canvas() {
        return this._canvas;
    }
    get context() {
        return this._ctx;
    }
    get eventQueue() {
        return this._eventQueue;
    }
    get viewWidth() {
        return this._viewWidth;
    }
    get viewHeight() {
        return this._viewHeight;
    }
}


/***/ },

/***/ "./src/color.ts"
/*!**********************!*\
  !*** ./src/color.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLOR: () => (/* binding */ COLOR)
/* harmony export */ });
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./theme */ "./src/theme.ts");

const COLOR = new Proxy({}, {
    get: (_target, prop) => {
        return _theme__WEBPACK_IMPORTED_MODULE_0__.ThemeManager.getInstance().theme[prop];
    }
});


/***/ },

/***/ "./src/digital-clock.ts"
/*!******************************!*\
  !*** ./src/digital-clock.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DigitalClock)
/* harmony export */ });
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _digital_symbol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./digital-symbol */ "./src/digital-symbol.ts");




class DigitalClock extends _base_component__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(canvas, options = {}) {
        super(canvas, options, 400, 100);
        this._barWidth = 8;
        this._space = 12;
        this._numberWidth = 50;
        this._numberHeight = 100;
        this._timer = null;
        this._ds = new _digital_symbol__WEBPACK_IMPORTED_MODULE_3__["default"](this._ctx, this._barWidth, this._numberWidth, this._numberHeight, this._dashColor, this._numberColor);
    }
    postConstructor() {
        super.postConstructor();
        this.tick();
    }
    setOptions(options = {}) {
        this._numberColor = options.numberColor || (this.theme ? this.theme.red : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.red);
        this._dashColor = options.dashColor || (this.theme ? this.theme.lightGrey : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.lightGrey);
        this._hourOffset = options.hourOffset || 0;
    }
    destroy() {
        this.stopTick();
        super.destroy();
    }
    tick() {
        if (this._timer == null) {
            this._timer = setInterval(() => {
                this.drawTime();
            }, 1000);
        }
    }
    stopTick() {
        if (this._timer != null) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
    isAnimating() {
        return true;
    }
    drawTime() {
        const now = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].addHour(this._hourOffset);
        this.clear();
        this.save();
        this.drawTwoDigits(this._ds, now.getHours(), this._numberWidth + this._space);
        this._ds.drawColon();
        this._ctx.translate(this._barWidth + this._space, 0);
        this.drawTwoDigits(this._ds, now.getMinutes(), this._numberWidth + this._space);
        this._ds.drawColon();
        this._ctx.translate(this._barWidth + this._space, 0);
        this.drawTwoDigits(this._ds, now.getSeconds(), this._numberWidth + this._space);
        this._ctx.restore();
        this._dirty = true;
    }
    drawTwoDigits(digitalNumber, time, space) {
        if (time < 10) {
            digitalNumber.drawNumber(0);
            this._ctx.translate(space, 0);
            digitalNumber.drawNumber(time);
            this._ctx.translate(space, 0);
        }
        else {
            const left = Math.floor(time / 10);
            const right = time % 10;
            digitalNumber.drawNumber(left);
            this._ctx.translate(space, 0);
            digitalNumber.drawNumber(right);
            this._ctx.translate(space, 0);
        }
    }
}


/***/ },

/***/ "./src/digital-symbol.ts"
/*!*******************************!*\
  !*** ./src/digital-symbol.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DigitalSymbol)
/* harmony export */ });
class DigitalSymbol {
    constructor(ctx, barWidth, numberWidth, numberHeight, dashColor, numberColor) {
        this._ctx = ctx;
        this._barWidth = barWidth;
        this._verBarHeight = (numberHeight - 3 * barWidth) / 2;
        this._horBarHeight = numberWidth - 2 * barWidth;
        this._dashColor = dashColor;
        this._numberColor = numberColor;
    }
    drawColon() {
        this._ctx.beginPath();
        this._ctx.fillStyle = this._numberColor;
        this._ctx.fillRect(0, (this._verBarHeight * 2 + this._barWidth) / 3, this._barWidth, this._barWidth);
        this._ctx.fillRect(0, (this._verBarHeight * 2 + this._barWidth) / 3 * 2 + this._barWidth, this._barWidth, this._barWidth);
        this._ctx.closePath();
    }
    drawEmpty() {
        this._ctx.beginPath();
        this._ctx.fillStyle = this._dashColor;
        this._ctx.moveTo(0, 0);
        this.topLeft();
        this.bottomLeft();
        this.topRight();
        this.bottomRight();
        this.top();
        this.middle();
        this.bottom();
        this._ctx.closePath();
    }
    // Vertical: top left
    topLeft() {
        this._ctx.fillRect(0, this._barWidth, this._barWidth, this._verBarHeight);
    }
    // Vertical: bottom left
    bottomLeft() {
        this._ctx.fillRect(0, this._barWidth * 2 + this._verBarHeight, this._barWidth, this._verBarHeight);
    }
    // Vertial: top right
    topRight() {
        this._ctx.fillRect(this._barWidth + this._horBarHeight, this._barWidth, this._barWidth, this._verBarHeight);
    }
    // Vertial: bottom right
    bottomRight() {
        this._ctx.fillRect(this._barWidth + this._horBarHeight, this._barWidth * 2 + this._verBarHeight, this._barWidth, this._verBarHeight);
    }
    // Horizontal: top
    top() {
        this._ctx.fillRect(this._barWidth, 0, this._horBarHeight, this._barWidth);
    }
    // Horizontal: middle
    middle() {
        this._ctx.fillRect(this._barWidth, this._barWidth + this._verBarHeight, this._horBarHeight, this._barWidth);
    }
    // Horizontal: bottom
    bottom() {
        this._ctx.fillRect(this._barWidth, this._barWidth * 2 + this._verBarHeight * 2, this._horBarHeight, this._barWidth);
    }
    drawNumber(number) {
        this.drawEmpty();
        this._ctx.beginPath();
        this._ctx.fillStyle = this._numberColor;
        switch (number) {
            case 0:
                this.top();
                this.bottom();
                this.topLeft();
                this.topRight();
                this.bottomLeft();
                this.bottomRight();
                break;
            case 1:
                this.topRight();
                this.bottomRight();
                break;
            case 2:
                this.top();
                this.topRight();
                this.middle();
                this.bottomLeft();
                this.bottom();
                break;
            case 3:
                this.top();
                this.middle();
                this.bottom();
                this.topRight();
                this.bottomRight();
                break;
            case 4:
                this.middle();
                this.topLeft();
                this.topRight();
                this.bottomRight();
                break;
            case 5:
                this.top();
                this.middle();
                this.bottom();
                this.topLeft();
                this.bottomRight();
                break;
            case 6:
                this.top();
                this.middle();
                this.bottom();
                this.topLeft();
                this.bottomLeft();
                this.bottomRight();
                break;
            case 7:
                this.top();
                this.topRight();
                this.bottomRight();
                break;
            case 8:
                this.topLeft();
                this.bottomLeft();
                this.topRight();
                this.bottomRight();
                this.top();
                this.middle();
                this.bottom();
                break;
            case 9:
                this.top();
                this.middle();
                this.topLeft();
                this.topRight();
                this.bottomRight();
                break;
        }
        this._ctx.closePath();
    }
}


/***/ },

/***/ "./src/global.ts"
/*!***********************!*\
  !*** ./src/global.ts ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLOBAL: () => (/* binding */ GLOBAL)
/* harmony export */ });
const GLOBAL = {
    requestAnimationFrameArray: []
};



/***/ },

/***/ "./src/heartbeat.ts"
/*!**************************!*\
  !*** ./src/heartbeat.ts ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Heartbeat)
/* harmony export */ });
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");



class Heartbeat extends _base_component__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 200;
        super(canvas, options, viewWidth, 100);
        this._queue = [];
        this._lastSec = 0;
        this._timer = null;
        this._speed = 2;
        this._fontColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.black;
        this._maxQueueCapacity = 30;
        this.drawSeconds();
    }
    setOptions(options = {}) {
        this._speed = options.speed || 2;
        this._fontColor = options.fontColor || (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.black);
        this._maxQueueCapacity = options.maxQueueCapacity || 30;
    }
    postConstructor() {
        super.postConstructor();
        // Start drawing the seconds
        this.tick();
    }
    destroy() {
        if (this._timer != null) {
            clearInterval(this._timer);
        }
        super.destroy();
    }
    beat(params = {}) {
        const beatColor = params.color || (this.theme ? this.theme.green : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.green);
        const beatSpace = params.space || 0;
        if (this._queue.length >= this._maxQueueCapacity) {
            this._queue.shift();
        }
        this._queue.push({
            time: null,
            x: -30,
            color: beatColor,
            space: beatSpace
        });
        this._dirty = true;
    }
    tick() {
        if (this._timer == null) {
            this._timer = setInterval(() => {
                this.drawSeconds();
            }, 1000);
        }
    }
    drawSeconds() {
        if (this._queue.length >= this._maxQueueCapacity) {
            this._queue.shift();
        }
        const now = new Date();
        const currSec = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].leftPadZero(now.getMinutes()) + ':' + _utility__WEBPACK_IMPORTED_MODULE_0__["default"].leftPadZero(now.getSeconds());
        if (currSec !== this._lastSec) {
            this._queue.push({ time: currSec, x: -30 });
            this._lastSec = currSec;
            this._dirty = true;
        }
    }
    isAnimating() {
        return this._queue.length > 0;
    }
    drawObject() {
        this._ctx.textAlign = 'center';
        this._ctx.font = '12px Arial';
        // Draw the horizontal line
        this._shape.fillRect(0, 50, this._viewWidth, 2, this._fontColor);
        // Draw the pulse
        for (let i = 0; i < this._queue.length; i++) {
            const q = this._queue[i];
            if (q.time != null) {
                this._ctx.fillStyle = this._fontColor;
                this._ctx.fillText(q.time, q.x, 90);
                this._shape.fillRect(q.x - 1, 45, 2, 12, this._fontColor);
            }
            else {
                this._ctx.fillStyle = q.color || this._fontColor;
                this._ctx.beginPath();
                this._ctx.moveTo(q.x - 10, 50);
                this._ctx.quadraticCurveTo(q.x - 5, -20 + (q.space || 0) * 2, q.x, 50);
                this._ctx.quadraticCurveTo(q.x + 5, 100 - (q.space || 0) * 1, q.x + 10, 50);
                this._ctx.closePath();
                this._ctx.fill();
            }
            q.x += this._speed;
        }
        if (this._queue.length > 0) {
            this._dirty = true;
        }
    }
}


/***/ },

/***/ "./src/hex-grid.ts"
/*!*************************!*\
  !*** ./src/hex-grid.ts ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HexGrid)
/* harmony export */ });
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color */ "./src/color.ts");


class HexGrid extends _base_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 200;
        const viewHeight = options.viewHeight || 200;
        super(canvas, options, viewWidth, viewHeight);
        this._nodes = [];
        this._space = 5;
        this._radius = 20;
        this._border = 3;
    }
    setOptions(options = {}) {
        this._space = options.space || 5;
        this._radius = options.radius || 20;
        this._border = options.border || 3;
    }
    isAnimating() {
        return this._nodes.some(h => h.blink.on);
    }
    drawObject() {
        // 1. Draw static background from offscreen cache
        this.drawOffscreen();
        // 2. Draw only dynamic (blinking) elements
        const s = this._space;
        const r = this._radius;
        const w = Math.pow(3, 0.5) * r / 2;
        const now = Date.now();
        let animating = false;
        this._nodes.forEach((h) => {
            if (h.blink.on) {
                animating = true;
                const interval = h.blink.interval;
                const lastCall = h.blink.lastCall;
                if (now - lastCall < interval) {
                    const xOffset = h.x % 2 === 0 ? s + w : s * 3 / 2 + 2 * w;
                    const y = (s + r) + (w + s / 2) * Math.pow(3, 0.5) * h.x;
                    this.drawHex(xOffset + (2 * w + s) * h.y, y, r, h.blink.bgColor, h.blink.borderColor, h.blink.text, h.text.xOffset || 0, h.text.yOffset || 0);
                }
                else if (now - lastCall >= (interval * 2)) {
                    h.blink.lastCall = now;
                }
            }
        });
        if (animating) {
            this._dirty = true;
        }
    }
    drawStatic() {
        const s = this._space;
        const r = this._radius;
        const w = Math.pow(3, 0.5) * r / 2;
        this._offscreenCtx.lineWidth = this._border;
        this._nodes.forEach((h) => {
            const xOffset = h.x % 2 === 0 ? s + w : s * 3 / 2 + 2 * w;
            const y = (s + r) + (w + s / 2) * Math.pow(3, 0.5) * h.x;
            const x = xOffset + (2 * w + s) * h.y;
            // Draw to offscreen context
            this._offscreenCtx.strokeStyle = h.borderColor;
            this._offscreenCtx.beginPath();
            this._offscreenCtx.moveTo(x, y - r);
            this._offscreenCtx.lineTo(x + w, y - r / 2);
            this._offscreenCtx.lineTo(x + w, y + r / 2);
            this._offscreenCtx.lineTo(x, y + r);
            this._offscreenCtx.lineTo(x - w, y + r / 2);
            this._offscreenCtx.lineTo(x - w, y - r / 2);
            this._offscreenCtx.lineTo(x, y - r);
            this._offscreenCtx.closePath();
            this._offscreenCtx.stroke();
            this._offscreenCtx.fillStyle = h.bgColor;
            this._offscreenCtx.fill();
            // Text to offscreen
            this._offscreenCtx.beginPath();
            this._offscreenCtx.font = h.text.font || '12px Arial';
            this._offscreenCtx.textAlign = 'center';
            this._offscreenCtx.fillStyle = h.text.color;
            this._offscreenCtx.fillText(String(h.text.value), x + (h.text.xOffset || 0), y + (h.text.yOffset || 0));
            this._offscreenCtx.closePath();
        });
    }
    drawHex(x, y, r, bgColor, lineColor, text, xOffset, yOffset) {
        const w = Math.pow(3, 0.5) * r / 2;
        this._ctx.strokeStyle = lineColor;
        this._ctx.beginPath();
        this._ctx.moveTo(x, y - r);
        this._ctx.lineTo(x + w, y - r / 2);
        this._ctx.lineTo(x + w, y + r / 2);
        this._ctx.lineTo(x, y + r);
        this._ctx.lineTo(x - w, y + r / 2);
        this._ctx.lineTo(x - w, y - r / 2);
        this._ctx.lineTo(x, y - r);
        this._ctx.closePath();
        this._ctx.stroke();
        this._ctx.fillStyle = bgColor;
        this._ctx.fill();
        this._shape.fillText(String(text.value), x + xOffset, y + yOffset, text.font || '12px Arial', 'center', text.color);
    }
    saveHex(params) {
        const text = params.text || {};
        const node = {
            id: params.id,
            x: params.x,
            y: params.y,
            bgColor: params.bgColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white),
            borderColor: params.borderColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white),
            text: {
                value: text.value !== undefined ? text.value : '',
                color: text.color || (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.black),
                font: text.font || '12px Arial',
                xOffset: text.xOffset || 0,
                yOffset: text.yOffset || 0
            },
            blink: {
                text: {
                    value: '',
                    color: (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.black)
                },
                borderColor: params.borderColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white),
                bgColor: (this.theme ? this.theme.red : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.red),
                interval: 1000,
                on: false,
                lastCall: 0
            }
        };
        const index = this._nodes.findIndex(n => n.id === node.id);
        if (index !== -1) {
            this._nodes[index] = node;
        }
        else {
            this._nodes.push(node);
        }
        this._staticRendered = false;
        this._dirty = true;
    }
    blinkOn(params) {
        const text = params.text || {};
        for (let i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i].id === params.id) {
                this._nodes[i].blink.text.value = text.value !== undefined ? text.value : '';
                this._nodes[i].blink.text.color = text.color || (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.black);
                this._nodes[i].blink.borderColor = params.borderColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white);
                this._nodes[i].blink.bgColor = params.bgColor || (this.theme ? this.theme.red : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.red);
                this._nodes[i].blink.interval = params.interval || 1000;
                this._nodes[i].blink.on = true;
                this._dirty = true;
                break;
            }
        }
    }
    blinkOff(id) {
        for (let i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i].id === id) {
                this._nodes[i].blink.on = false;
                this._dirty = true;
                break;
            }
        }
    }
}


/***/ },

/***/ "./src/message-queue.ts"
/*!******************************!*\
  !*** ./src/message-queue.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MessageQueue)
/* harmony export */ });
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");


class MessageQueue extends _base_component__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 100;
        const viewHeight = options.viewHeight || 200;
        super(canvas, options, viewWidth, viewHeight);
        this._queue = [];
        this._arcWidth = 10;
    }
    setOptions(options = {}) {
        this._barHeight = options.barHeight || 20;
        this._speed = options.speed || 5;
        this._space = options.space || 5;
        this._maxQueueCapacity = options.maxQueueCapacity !== undefined ? options.maxQueueCapacity : 20;
    }
    isAnimating() {
        const bars = Math.floor(this._viewHeight / (this._barHeight + this._space));
        const drawQueueSize = Math.min(this._queue.length, bars);
        for (let i = 0; i < drawQueueSize; i++) {
            const q = this._queue[i];
            const currY = (this._barHeight + this._space) * i + this._space;
            if (currY < q.y) {
                return true;
            }
        }
        return false;
    }
    drawObject() {
        // Bars can be seen in the view
        const bars = Math.floor(this._viewHeight / (this._barHeight + this._space));
        const drawQueueSize = Math.min(this._queue.length, bars);
        let animating = false;
        for (let i = 0; i < drawQueueSize; i++) {
            const q = this._queue[i];
            const currY = (this._barHeight + this._space) * i + this._space;
            // Move up
            if (currY < q.y) {
                q.y -= this._speed;
                animating = true;
            }
            else {
                q.y = currY;
            }
            this._ctx.fillStyle = q.color;
            this._shape.fillRect(q.x, q.y, this._viewWidth - 2 * (this._arcWidth + q.space), this._barHeight, q.color);
            this._ctx.beginPath();
            this._ctx.moveTo(q.x, q.y);
            this._ctx.quadraticCurveTo(q.x - this._arcWidth, q.y + this._barHeight / 2, q.x, q.y + this._barHeight);
            this._ctx.fill();
            this._ctx.closePath();
            this._ctx.beginPath();
            this._ctx.moveTo(this._viewWidth - this._arcWidth - q.space, q.y);
            this._ctx.quadraticCurveTo(this._viewWidth - q.space, q.y + this._barHeight / 2, this._viewWidth - this._arcWidth - q.space, q.y + this._barHeight);
            this._ctx.fill();
            this._ctx.closePath();
        }
        if (animating) {
            this._dirty = true;
        }
        else {
            this._dirty = false;
        }
    }
    push(param = {}) {
        const barColor = param.color || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.blue);
        const barSpace = param.space || 0;
        if (this._queue.length >= this._maxQueueCapacity) {
            this.pop();
        }
        this._queue.push({
            x: this._arcWidth + barSpace,
            y: this._viewHeight + this._barHeight,
            color: barColor,
            space: barSpace
        });
        this._dirty = true;
    }
    pop() {
        if (this._queue.length > 0) {
            this._queue.shift();
            this._dirty = true;
        }
    }
    get queueSize() {
        return this._queue.length;
    }
}


/***/ },

/***/ "./src/network-graph.ts"
/*!******************************!*\
  !*** ./src/network-graph.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NetworkGraph)
/* harmony export */ });
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color */ "./src/color.ts");



class NetworkGraph extends _base_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 200;
        const viewHeight = options.viewHeight || 200;
        super(canvas, options, viewWidth, viewHeight);
        this._nodes = [];
        this._signalQueues = [];
    }
    setOptions(options = {}) {
        this._nodes = options.nodes || [];
    }
    drawObject() {
        // 1. Draw static background (nodes and edges)
        this.drawOffscreen();
        // 2. Draw moving signals
        const toDelete = [];
        let animating = false;
        for (let i = 0; i < this._signalQueues.length; i++) {
            const signal = this._signalQueues[i];
            const oldX = signal.x;
            const oldY = signal.y;
            this._signalQueues[i].x = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(signal.x, signal.destX, signal.speedX);
            this._signalQueues[i].y = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(signal.y, signal.destY, signal.speedY);
            if (this._signalQueues[i].x === signal.destX && this._signalQueues[i].y === signal.destY) {
                toDelete.push(i);
            }
            else {
                this._shape.fillCircle(signal.x, signal.y, signal.size, signal.color);
            }
            if (this._signalQueues[i].x !== oldX || this._signalQueues[i].y !== oldY) {
                animating = true;
            }
        }
        // Delete from the signal queue
        for (let i = toDelete.length - 1; i >= 0; i--) {
            this._signalQueues.splice(toDelete[i], 1);
            animating = true;
        }
        if (animating) {
            this._dirty = true;
        }
    }
    drawStatic() {
        // Draw edges
        this._nodes.forEach((node) => {
            const neighbors = node.neighbors || [];
            neighbors.forEach((neighbor) => {
                const destNode = this.getNodeById(neighbor.id);
                if (destNode) {
                    const edge = neighbor.edge || {};
                    const edgeWidth = edge.width || 1;
                    const edgeColor = edge.color || (this.theme ? this.theme.grey : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.grey);
                    const edgeDash = edge.dash || [];
                    this._offscreenCtx.beginPath();
                    if (edgeDash.length !== 0) {
                        this._offscreenCtx.setLineDash(edgeDash);
                    }
                    else {
                        this._offscreenCtx.setLineDash([]);
                    }
                    this._offscreenCtx.lineWidth = edgeWidth;
                    this._offscreenCtx.strokeStyle = edgeColor;
                    this._offscreenCtx.moveTo(node.x, node.y);
                    this._offscreenCtx.lineTo(destNode.x, destNode.y);
                    this._offscreenCtx.stroke();
                    this._offscreenCtx.closePath();
                }
            });
        });
        // Draw nodes
        this._nodes.forEach((node) => {
            const text = node.text || {};
            const textValue = text.value || '';
            const textColor = text.color || (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.black);
            const textFont = text.font || '12px Arial';
            const xTextOffset = text.xOffset || 0;
            const yTextOffset = text.yOffset || 0;
            // Node circle to offscreen
            this._offscreenCtx.beginPath();
            this._offscreenCtx.fillStyle = node.color;
            this._offscreenCtx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
            this._offscreenCtx.fill();
            this._offscreenCtx.closePath();
            // Text to offscreen
            this._offscreenCtx.beginPath();
            this._offscreenCtx.font = textFont;
            this._offscreenCtx.textAlign = 'center';
            this._offscreenCtx.fillStyle = textColor;
            this._offscreenCtx.fillText(textValue, node.x + xTextOffset, node.y + yTextOffset);
            this._offscreenCtx.closePath();
        });
    }
    getNodeById(nodeId) {
        return this._nodes.find(n => n.id === nodeId);
    }
    addNodes(nodes = []) {
        this._nodes.push(...nodes);
        this._staticRendered = false;
        this._dirty = true;
    }
    addNeighbor(from, neighbor = { id: '' }) {
        for (let i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i].id === from) {
                this._nodes[i].neighbors = this._nodes[i].neighbors || [];
                this._nodes[i].neighbors.push(neighbor);
                break;
            }
        }
        this._staticRendered = false;
        this._dirty = true;
    }
    isAnimating() {
        return this._signalQueues.length > 0;
    }
    signal(params) {
        const color = params.color || (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.black);
        const duration = params.duration || 2000;
        const size = params.size || 3;
        const srcNode = this.getNodeById(params.from);
        const destNode = this.getNodeById(params.to);
        if (srcNode && destNode) {
            const sX = Math.abs(destNode.x - srcNode.x) / (duration / 60);
            const sY = Math.abs(destNode.y - srcNode.y) / (duration / 60);
            const speedX = destNode.x > srcNode.x ? sX : -sX;
            const speedY = destNode.y > srcNode.y ? sY : -sY;
            this._signalQueues.push({
                x: srcNode.x,
                y: srcNode.y,
                destX: destNode.x,
                destY: destNode.y,
                speedX: speedX,
                speedY: speedY,
                color: color,
                size: size
            });
            this._dirty = true;
        }
    }
    get nodes() {
        return this._nodes;
    }
}


/***/ },

/***/ "./src/round-fan.ts"
/*!**************************!*\
  !*** ./src/round-fan.ts ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RoundFan)
/* harmony export */ });
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");



class RoundFan extends _base_component__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(canvas, options = {}) {
        super(canvas, options, 200, 200);
        this._degree = 0;
    }
    setOptions(options = {}) {
        const center = options.center || {};
        this.fanColor = options.fanColor || (this.theme ? this.theme.green : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.green);
        this.centerColor = center.color || (this.theme ? this.theme.green : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.green);
        this.centerBgColor = center.bgColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.white);
        this.speed = options.speed !== undefined ? options.speed : 1;
    }
    isAnimating() {
        return this.speed !== 0;
    }
    drawObject() {
        this._degree = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextAngleByDegree(this._degree, this.speed);
        const angle = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getAngleByDegree(this._degree);
        this._ctx.translate(100, 100);
        this._ctx.rotate(angle);
        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        // Up
        this._ctx.quadraticCurveTo(-60, -80, 0, -90);
        this._ctx.quadraticCurveTo(80, -100, 0, 0);
        // Right
        this._ctx.quadraticCurveTo(80, -60, 90, 0);
        this._ctx.quadraticCurveTo(100, 80, 0, 0);
        // Down
        this._ctx.quadraticCurveTo(60, 80, 0, 90);
        this._ctx.quadraticCurveTo(-80, 100, 0, 0);
        // Left
        this._ctx.quadraticCurveTo(-80, 60, -90, 0);
        this._ctx.quadraticCurveTo(-100, -80, 0, 0);
        this._ctx.fillStyle = this.fanColor;
        this._ctx.fill();
        this._ctx.closePath();
        this._shape.fillCircle(0, 0, 35, this.centerBgColor);
        this._shape.fillCircle(0, 0, 30, this.centerColor);
        this._shape.fillCircle(0, 0, 10, this.centerBgColor);
        if (this.speed !== 0) {
            this._dirty = true;
        }
    }
}


/***/ },

/***/ "./src/score-board.ts"
/*!****************************!*\
  !*** ./src/score-board.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ScoreBoard)
/* harmony export */ });
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color */ "./src/color.ts");



class ScoreBoard extends _base_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 200;
        const viewHeight = options.viewHeight || 200;
        super(canvas, options, viewWidth, viewHeight);
        this._rows = [];
    }
    setOptions(options = {}) {
        this._rowHeight = options.rowHeight || 20;
        this._space = options.space || 0;
        this._font = options.font || '10px Arial';
        this._speed = options.speed || 5;
        this._order = options.order !== undefined ? options.order : 'asc';
    }
    sort() {
        if (this._order === 'asc') {
            this._rows.sort((a, b) => a.score - b.score);
        }
        else {
            this._rows.sort((a, b) => b.score - a.score);
        }
    }
    isAnimating() {
        for (let i = 0; i < this._rows.length; i++) {
            const row = this._rows[i];
            if (row.moveType === 'move') {
                const destY = i * (this._rowHeight + this._space);
                if (row.y !== destY) {
                    return true;
                }
            }
            else if (row.moveType === 'remove') {
                return true;
            }
        }
        return false;
    }
    drawObject() {
        let animating = false;
        for (let i = 0; i < this._rows.length; i++) {
            const row = this._rows[i];
            this._shape.fillRect(row.x, row.y, this._viewWidth, this._rowHeight, row.bgColor);
            this._shape.fillText(String(row.text.value), row.x + row.text.xOffset, row.y + row.text.yOffset, this._font, 'left', row.text.color);
            if (row.moveType === 'move') {
                const destY = i * (this._rowHeight + this._space);
                if (row.y !== destY) {
                    const speedY = destY > row.y ? this._speed : -this._speed;
                    this._rows[i].y = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(row.y, destY, speedY);
                    animating = true;
                }
            }
            else if (row.moveType === 'remove') {
                if (row.destX < 0 && row.x === row.destX) {
                    this._rows[i].speedX = this._speed * 2;
                    this._rows[i].destX = this._viewWidth + 10;
                }
                const oldX = row.x;
                this._rows[i].x = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(row.x, this._rows[i].destX, this._rows[i].speedX);
                if (this._rows[i].x !== oldX) {
                    animating = true;
                }
            }
        }
        // Delete the row.
        for (let i = this._rows.length - 1; i >= 0; i--) {
            const row = this._rows[i];
            if (row.moveType === 'remove' && row.destX > 0 && row.x === row.destX) {
                this._rows.splice(i, 1);
                animating = true;
            }
        }
        if (animating) {
            this._dirty = true;
        }
    }
    update(params) {
        const id = params.id;
        const text = params.text || {};
        let isSort = false;
        for (let i = 0; i < this._rows.length; i++) {
            if (this._rows[i].id === id) {
                if (params.score !== undefined && this._rows[i].score !== params.score) {
                    isSort = true;
                    this._rows[i].score = params.score;
                }
                this._rows[i].moveType = 'move';
                this._rows[i].bgColor = params.bgColor || this._rows[i].bgColor;
                this._rows[i].text.value = text.value !== undefined ? text.value : this._rows[i].text.value;
                this._rows[i].text.color = text.color || this._rows[i].text.color;
                break;
            }
        }
        if (isSort) {
            this.sort();
        }
        this._dirty = true;
    }
    remove(id) {
        let isFound = false;
        for (let i = 0; i < this._rows.length; i++) {
            if (this._rows[i].id === id && this._rows[i].moveType !== 'remove') {
                this._rows[i].moveType = 'remove';
                this._rows[i].speedX = -this._speed;
                this._rows[i].destX = -40;
                isFound = true;
                break;
            }
        }
        if (isFound) {
            this.sort();
        }
        this._dirty = true;
    }
    add(params) {
        for (let i = 0; i < this._rows.length; i++) {
            if (this._rows[i].id === params.id) {
                return;
            }
        }
        const text = params.text || {};
        const row = {
            id: params.id,
            score: params.score || 0,
            bgColor: params.bgColor || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue),
            text: {
                value: text.value !== undefined ? text.value : '',
                color: text.color || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.white),
                xOffset: text.xOffset || 0,
                yOffset: text.yOffset || 0
            },
            x: 0,
            y: this._viewHeight, // Start from bottom
            destX: 0,
            destY: 0,
            speedX: 0,
            speedY: 0,
            moveType: 'move'
        };
        this._rows.push(row);
        this.sort();
        this._dirty = true;
    }
    get rows() {
        return this._rows;
    }
}


/***/ },

/***/ "./src/settings.ts"
/*!*************************!*\
  !*** ./src/settings.ts ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _animation_timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation-timer */ "./src/animation-timer.ts");

class Settings {
    constructor() {
        this._fps = 60;
    }
    set fps(fps) {
        this._fps = fps;
        _animation_timer__WEBPACK_IMPORTED_MODULE_0__["default"].setFps(fps);
    }
    get fps() {
        return this._fps;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Settings());


/***/ },

/***/ "./src/shape.ts"
/*!**********************!*\
  !*** ./src/shape.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Shape)
/* harmony export */ });
class Shape {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx context from canvas.getContext('2d')
     */
    constructor(ctx) {
        this._ctx = ctx;
    }
    /**
     * Create a filled rectangle
     */
    fillRect(x1, y1, x2, y2, fillStyle) {
        this._ctx.beginPath();
        this._ctx.fillStyle = fillStyle;
        this._ctx.fillRect(x1, y1, x2, y2);
        this._ctx.closePath();
    }
    /**
     * Create a filled triangle
     */
    fillTriangle(x1, y1, x2, y2, x3, y3, fillStyle) {
        this._ctx.beginPath();
        this._ctx.fillStyle = fillStyle;
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.lineTo(x3, y3);
        this._ctx.fill();
        this._ctx.closePath();
    }
    /**
     * Create a filled text
     */
    fillText(text, x, y, font, textAlign, fillStyle) {
        this._ctx.beginPath();
        this._ctx.font = font;
        this._ctx.textAlign = textAlign;
        this._ctx.fillStyle = fillStyle;
        this._ctx.fillText(text, x, y);
        this._ctx.closePath();
    }
    /**
     * Create a line
     */
    line(x1, y1, x2, y2, lineWidth, strokeStyle) {
        this._ctx.beginPath();
        this._ctx.lineWidth = lineWidth;
        this._ctx.strokeStyle = strokeStyle;
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.closePath();
        this._ctx.stroke();
    }
    /**
     * Create a filled circle
     */
    fillCircle(x, y, radius, fillStyle) {
        this._ctx.beginPath();
        this._ctx.fillStyle = fillStyle;
        this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this._ctx.fill();
        this._ctx.closePath();
    }
}


/***/ },

/***/ "./src/speed-circle.ts"
/*!*****************************!*\
  !*** ./src/speed-circle.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SpeedCircle)
/* harmony export */ });
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color */ "./src/color.ts");



class SpeedCircle extends _base_component__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor(canvas, options = {}) {
        super(canvas, options, 200, 200);
        this._font = '25px Arial';
        this._degree1 = 0;
        this._degree2 = 0;
        this._degree3 = 0;
        this._degree4 = 0;
    }
    setOptions(options = {}) {
        const c1 = options.circle1 || {};
        const c2 = options.circle2 || {};
        const c3 = options.circle3 || {};
        const c4 = options.circle4 || {};
        const text = options.text || {};
        this.speed1 = c1.speed !== undefined ? c1.speed : 0.5;
        this.color1 = c1.color || (this.theme ? this.theme.red : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.red);
        this.speed2 = c2.speed !== undefined ? c2.speed : -0.5;
        this.color2 = c2.color || (this.theme ? this.theme.yellow : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.yellow);
        this.speed3 = c3.speed !== undefined ? c3.speed : 0.5;
        this.color3 = c3.color || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue);
        this.speed4 = c4.speed !== undefined ? c4.speed : -0.5;
        this.color4 = c4.color || (this.theme ? this.theme.grey : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.grey);
        this.textColor = text.color || (this.theme ? this.theme.green : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.green);
        this.textValue = text.value !== undefined ? text.value : '';
    }
    isAnimating() {
        return this.speed1 !== 0 || this.speed2 !== 0 || this.speed3 !== 0 || this.speed4 !== 0;
    }
    drawObject() {
        this._degree1 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getNextAngleByDegree(this._degree1, this.speed1);
        this._degree2 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getNextAngleByDegree(this._degree2, this.speed2);
        this._degree3 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getNextAngleByDegree(this._degree3, this.speed3);
        this._degree4 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getNextAngleByDegree(this._degree4, this.speed4);
        const a1 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getAngleByDegree(this._degree1);
        const a2 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getAngleByDegree(this._degree2);
        const a3 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getAngleByDegree(this._degree3);
        const a4 = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getAngleByDegree(this._degree4);
        this._ctx.translate(100, 100);
        this._ctx.rotate(a1);
        // Draw bar circle 1.
        this._ctx.strokeStyle = this.color1;
        this._ctx.lineWidth = 8;
        const space = 0.02;
        let len = 0.5;
        let start = 0;
        let end = len;
        for (let i = 0; i < 6; i++) {
            this._ctx.beginPath();
            this._ctx.arc(0, 0, 90, Math.PI * start, Math.PI * end);
            this._ctx.stroke();
            this._ctx.closePath();
            start = end + space;
            len /= 1.7;
            end = start + len;
        }
        this._ctx.restore();
        this.save();
        this._ctx.translate(100, 100);
        this._ctx.rotate(a3);
        // Draw dot circle 3.
        for (let i = 0; i < 360; i = i + 9) {
            const a = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getAngleByDegree(i);
            const x = 64 * Math.cos(a);
            const y = 64 * Math.sin(a);
            this._shape.fillCircle(x, y, 3, this.color3);
        }
        this._ctx.restore();
        this.save();
        this._ctx.translate(100, 100);
        this._ctx.rotate(a2);
        // Draw bar circle 2.
        for (let i = 0; i < 360; i = i + 8) {
            const a = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getAngleByDegree(i);
            const x1 = 70 * Math.cos(a);
            const y1 = 70 * Math.sin(a);
            const x2 = 83 * Math.cos(a);
            const y2 = 83 * Math.sin(a);
            this._shape.line(x1, y1, x2, y2, 6, this.color2);
        }
        this._ctx.restore();
        this.save();
        this._ctx.translate(100, 100);
        this._ctx.rotate(a4);
        // Draw bar circle 4.
        this._ctx.lineWidth = 5;
        this._ctx.strokeStyle = this.color4;
        const len4 = (2 - (12 * space)) / 12;
        let start4 = 0;
        let end4 = len4;
        for (let i = 0; i < 12; i++) {
            this._ctx.beginPath();
            this._ctx.arc(0, 0, 56, Math.PI * start4, Math.PI * end4);
            this._ctx.stroke();
            this._ctx.closePath();
            start4 = end4 + space;
            end4 = start4 + len4;
        }
        this._ctx.restore();
        this.save();
        // Draw the text in the middle.
        this._shape.fillText(String(this.textValue), 100, 110, this._font, 'center', this.textColor);
        if (this.speed1 !== 0 || this.speed2 !== 0 || this.speed3 !== 0 || this.speed4 !== 0) {
            this._dirty = true;
        }
    }
}


/***/ },

/***/ "./src/text-box.ts"
/*!*************************!*\
  !*** ./src/text-box.ts ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TextBox)
/* harmony export */ });
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color */ "./src/color.ts");



class TextBox extends _base_component__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 200;
        super(canvas, options, viewWidth, 100);
        this._borderWidth = 8;
        this._borderHeight = 30;
        this._space = 10;
        this._waveY = 0;
        this._waveSpeed = 1;
        this._isWaveOn = false;
        this._textValue = '';
        this.textColor = _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.white;
        this.textBgColor = _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue;
        this.bgColor = 'rgba(0, 0, 0, 0.01)';
        this.borderColor = _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue;
        this.waveColor = _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue;
    }
    setOptions(options = {}) {
        const text = options.text || {};
        this._textValue = text.value || '';
        this.textColor = text.fontColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.white);
        this.textBgColor = text.bgColor || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue);
        this.bgColor = options.bgColor || 'rgba(0, 0, 0, 0.01)';
        this.borderColor = options.borderColor || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue);
        this.waveColor = options.waveColor || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_2__.COLOR.blue);
    }
    clear() {
        this._ctx.fillStyle = this.bgColor;
        this._ctx.fillRect(this._x, this._y, this._width, this._height);
    }
    isAnimating() {
        return this._isWaveOn;
    }
    drawObject() {
        this._ctx.textAlign = 'center';
        // Draw wave line
        if (this._isWaveOn) {
            const waveWidth = 1;
            if (this._waveY >= ((this._viewHeight / 2) + waveWidth)) {
                this._waveY = 0;
                this._isWaveOn = false;
            }
            else {
                this._ctx.fillStyle = this.waveColor;
                this._ctx.beginPath();
                this._ctx.fillRect(0, this._waveY, this._viewWidth + waveWidth, waveWidth);
                this._ctx.closePath();
                this._ctx.beginPath();
                this._ctx.fillRect(0, this._viewHeight - this._waveY - waveWidth, this._viewWidth, waveWidth);
                this._ctx.closePath();
                this._waveY = _utility__WEBPACK_IMPORTED_MODULE_0__["default"].getNextPos(this._waveY, this._viewHeight / 2 + waveWidth, this._waveSpeed);
                this._dirty = true;
            }
        }
        // Draw the border.
        // Top left
        this._ctx.fillStyle = this.borderColor;
        this._ctx.fillRect(0, 0, this._borderHeight, this._borderWidth);
        this._ctx.fillRect(0, 0, this._borderWidth, this._borderHeight);
        // Bottom left
        this._ctx.fillRect(0, this._viewHeight - this._borderHeight, this._borderWidth, this._borderHeight);
        this._ctx.fillRect(0, this._viewHeight - this._borderWidth, this._borderHeight, this._borderWidth);
        // Top right
        this._ctx.fillRect(this._viewWidth - this._borderHeight, 0, this._borderHeight, this._borderWidth);
        this._ctx.fillRect(this._viewWidth - this._borderWidth, 0, this._borderWidth, this._borderHeight);
        // Bottom right
        this._ctx.fillRect(this._viewWidth - this._borderHeight, this._viewHeight - this._borderWidth, this._borderHeight, this._borderWidth);
        this._ctx.fillRect(this._viewWidth - this._borderWidth, this._viewHeight - this._borderHeight, this._borderWidth, this._borderHeight);
        // Draw background rect.
        this._ctx.fillStyle = this.textBgColor;
        this._ctx.fillRect(this._borderWidth + this._space, this._borderWidth + this._space, this._viewWidth - 2 * (this._borderWidth + this._space), this._viewHeight - 2 * (this._borderWidth + this._space));
        // Draw text.
        this._shape.fillText(String(this._textValue), this._viewWidth / 2, this._viewHeight - 35, '40px Arial', 'center', this.textColor);
    }
    set value(s) {
        this._textValue = s;
        this._isWaveOn = true;
        this._dirty = true;
    }
    get value() {
        return this._textValue;
    }
}


/***/ },

/***/ "./src/text-meter.ts"
/*!***************************!*\
  !*** ./src/text-meter.ts ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TextMeter)
/* harmony export */ });
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");



class TextMeter extends _base_component__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(canvas, options = {}) {
        const viewWidth = options.viewWidth || 200;
        super(canvas, options, viewWidth, 100);
        this._lineWidth = 5;
        this._arrowWidth = 30;
        this._pctHeight = 30;
        this._arrow = null;
        this._arrowSpeed = 0.6;
        this._leftArrowX = -5;
        this.markerBgColor = _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.black;
        this.markerFontColor = _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.white;
        this.speed = 5;
        this.fillColor = _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.red;
        this.bgColor = _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.lightWhite;
        this._lineColor = _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.lightGreen;
        this._percentageValue = 0;
        this.displayValue = '';
        this.arrowColor = _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.blue;
        this._actualPctHeight = this._pctHeight - this._lineWidth / 2;
        this._meterWidth = this._viewWidth - 2 * this._arrowWidth;
        this._meterHeight = 100 - this._pctHeight - this._lineWidth / 2;
        this._middleBarHeight = this._meterHeight / 2 + this._pctHeight;
        this._barX = (this._percentageValue / 100) * this._meterWidth + this._arrowWidth;
        this._nextBarX = this._barX;
        this._rightArrowX = this._viewWidth + 5;
    }
    setOptions(options = {}) {
        const bar = options.bar || {};
        const marker = options.marker || {};
        this.markerBgColor = marker.bgColor || (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.black);
        this.markerFontColor = marker.fontColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.white);
        this.speed = bar.speed || 5;
        this.fillColor = bar.fillColor || (this.theme ? this.theme.red : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.red);
        this.bgColor = bar.bgColor || (this.theme ? this.theme.lightWhite : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.lightWhite);
        this._lineColor = bar.borderColor || (this.theme ? this.theme.lightGreen : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.lightGreen);
        this._percentageValue = options.value || 0;
        this.displayValue = options.displayValue || '';
        this.arrowColor = options.arrowColor || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_0__.COLOR.blue);
    }
    isAnimating() {
        return this._barX !== this._nextBarX || this._arrow !== null;
    }
    drawObject() {
        this._ctx.globalCompositeOperation = 'destination-over';
        // Draw left half text
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.rect(this._arrowWidth, this._pctHeight, this._barX - this._arrowWidth, this._meterHeight);
        this._ctx.clip();
        this._shape.fillText(this.displayValue, this._viewWidth / 2, 75, '30px Arial', 'center', this.bgColor);
        this._ctx.fillStyle = this.fillColor;
        this._ctx.fillRect(this._arrowWidth, this._pctHeight, this._barX - this._arrowWidth, this._meterHeight);
        this._ctx.restore();
        this._ctx.save();
        this._ctx.globalCompositeOperation = 'destination-over';
        // Draw right half text
        this._ctx.beginPath();
        this._ctx.rect(this._barX, this._pctHeight, this._viewWidth - this._barX - this._arrowWidth, this._meterHeight);
        this._ctx.clip();
        this._shape.fillText(this.displayValue, this._viewWidth / 2, 75, '30px Arial', 'center', this.fillColor);
        this._shape.fillRect(this._barX, this._pctHeight, this._viewWidth - this._barX - this._arrowWidth, this._meterHeight, this.bgColor);
        this._ctx.restore();
        this._ctx.save();
        this._ctx.globalCompositeOperation = 'source-over';
        // Draw the border.
        this._ctx.lineWidth = this._lineWidth;
        this._ctx.strokeStyle = this._lineColor;
        this._ctx.beginPath();
        this._ctx.rect(this._arrowWidth, this._pctHeight, this._meterWidth, this._meterHeight);
        this._ctx.stroke();
        this._ctx.closePath();
        // Draw percentage value
        this._ctx.fillStyle = this.markerBgColor;
        this._ctx.fillRect(this._barX - 25, 0, 50, this._actualPctHeight);
        this._shape.fillText(this._percentageValue + '%', this._barX, 20, '16px Arial', 'center', this.markerFontColor);
        this._ctx.beginPath();
        this._ctx.fillStyle = this.markerBgColor;
        this._ctx.moveTo(this._barX - 8, this._actualPctHeight - this._lineWidth / 2);
        this._ctx.lineTo(this._barX, this._pctHeight + this._lineWidth / 2);
        this._ctx.lineTo(this._barX + 8, this._actualPctHeight - this._lineWidth / 2);
        this._ctx.fill();
        this._ctx.closePath();
        // Draw arrow.
        if (this._arrow === null) {
            this.drawLeftArrow();
            this.drawRightArrow();
        }
        else if (this._arrow === 'left') {
            this.drawLeftArrow();
        }
        else {
            // right
            this.drawRightArrow();
        }
        this._ctx.restore();
        // Calculate next position barX
        const oldBarX = this._barX;
        this._barX = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(this._barX, this._nextBarX, this.speed);
        if (this._barX !== oldBarX || this._arrow !== null) {
            this._dirty = true;
        }
    }
    drawLeftArrow() {
        if (this._leftArrowX <= 0) {
            this._leftArrowX = this._arrowWidth - 3;
        }
        else {
            this._leftArrowX = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(this._leftArrowX, 0, -this._arrowSpeed);
        }
        this._shape.fillTriangle(this._leftArrowX, this._actualPctHeight + 10, this._leftArrowX - 20, this._middleBarHeight, this._leftArrowX, 90, this.arrowColor);
    }
    drawRightArrow() {
        if (this._rightArrowX >= this._viewWidth) {
            this._rightArrowX = this._arrowWidth + 3 + this._meterWidth;
        }
        else {
            this._rightArrowX = _utility__WEBPACK_IMPORTED_MODULE_1__["default"].getNextPos(this._rightArrowX, this._viewWidth, this._arrowSpeed);
        }
        this._shape.fillTriangle(this._rightArrowX, this._actualPctHeight + 10, this._rightArrowX + 20, this._middleBarHeight, this._rightArrowX, 90, this.arrowColor);
    }
    set value(value) {
        if (value >= 0 && value <= 100) {
            if (value < this._percentageValue) {
                this.speed = -Math.abs(this.speed);
                this._arrow = 'left';
            }
            else if (value > this._percentageValue) {
                this.speed = Math.abs(this.speed);
                this._arrow = 'right';
            }
            else {
                this._arrow = null;
            }
            this._percentageValue = Math.floor(value);
            this._nextBarX = (this._percentageValue / 100) * this._meterWidth + this._arrowWidth;
            this._dirty = true;
        }
    }
    get value() {
        return this._percentageValue;
    }
}


/***/ },

/***/ "./src/theme.ts"
/*!**********************!*\
  !*** ./src/theme.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultTheme: () => (/* binding */ DefaultTheme),
/* harmony export */   ThemeManager: () => (/* binding */ ThemeManager)
/* harmony export */ });
const DefaultTheme = {
    lightGreen: '#00d7af',
    lightWhite: '#f8f8ff',
    lightGrey: '#e0e0e0',
    lightBlack: '#343a42',
    black: '#000000',
    white: '#ffffff',
    red: '#dc3547',
    blue: '#007bfb',
    yellow: '#ffc108',
    cyan: '#17a2b9',
    grey: '#6c757e',
    green: '#28a748',
    orange: '#ffa500',
    transparent: 'rgba(255, 255, 255, 0)'
};
class ThemeManager {
    constructor() {
        this._listeners = [];
        this._theme = DefaultTheme;
    }
    static getInstance() {
        if (!ThemeManager._instance) {
            ThemeManager._instance = new ThemeManager();
        }
        return ThemeManager._instance;
    }
    get theme() {
        return this._theme;
    }
    set theme(newTheme) {
        this._theme = newTheme;
        this.notify();
    }
    subscribe(listener) {
        this._listeners.push(listener);
    }
    unsubscribe(listener) {
        this._listeners = this._listeners.filter(l => l !== listener);
    }
    get listenerCount() {
        return this._listeners.length;
    }
    notify() {
        this._listeners.forEach(listener => listener());
    }
}


/***/ },

/***/ "./src/utility.ts"
/*!************************!*\
  !*** ./src/utility.ts ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Utility)
/* harmony export */ });
class Utility {
    constructor() { }
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static getRandomColor() {
        return '#' + ((1 << 24) * Math.random() | 0).toString(16);
    }
    static has(object, key) {
        return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
    }
    static addHour(h) {
        const now = new Date();
        now.setHours(now.getHours() + h);
        return now;
    }
    static getAngleByDate(speed, date) {
        return ((speed * Math.PI) / 6) * date.getSeconds() + ((speed * Math.PI) / 6000) * date.getMilliseconds();
    }
    static getNextAngleByDegree(degree, speed) {
        if (degree >= 360) {
            return 0;
        }
        return degree + speed;
    }
    static getAngleByDegree(degree) {
        return degree * Math.PI / 180;
    }
    static hexToRgba(hex, opacity) {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    }
    static hexToRgb(hex) {
        const h = hex.replace('#', '');
        const color = [];
        color[0] = parseInt(h.substring(0, 2), 16);
        color[1] = parseInt(h.substring(2, 4), 16);
        color[2] = parseInt(h.substring(4, 6), 16);
        return color;
    }
    static hex(c) {
        const s = '0123456789abcdef';
        // Safety check if c is not a number, though TS should prevent it
        if (isNaN(c)) {
            return '00';
        }
        const i = Math.round(Math.min(Math.max(0, c), 255));
        return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
    }
    static convertToHex(rgb) {
        return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
    }
    static generateGradientColor(colorStart, colorEnd, colorCount) {
        const start = this.hexToRgb(colorStart);
        const end = this.hexToRgb(colorEnd);
        const len = colorCount;
        let alpha = 0.0;
        const rt = [];
        for (let i = 0; i < len; i++) {
            const c = [];
            alpha += (1.0 / len);
            c[0] = start[0] * alpha + (1 - alpha) * end[0];
            c[1] = start[1] * alpha + (1 - alpha) * end[1];
            c[2] = start[2] * alpha + (1 - alpha) * end[2];
            rt.push(this.convertToHex(c));
        }
        return rt;
    }
    static isDefined(o) {
        return o !== undefined && o !== null;
    }
    static leftPadZero(n) {
        if (n < 10) {
            return '0' + n;
        }
        return n;
    }
    static getNextPos(curr, dest, speed) {
        if (speed > 0 && curr + speed >= dest) {
            return dest;
        }
        if (speed < 0 && curr + speed <= dest) {
            return dest;
        }
        return curr + speed;
    }
    static shuffleArray(a) {
        let j = 0;
        let temp;
        for (let i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        return a;
    }
    static prepareCanvas(canvas, ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.scale(dpr, dpr);
        }
    }
}


/***/ },

/***/ "./src/volume-meter.ts"
/*!*****************************!*\
  !*** ./src/volume-meter.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VolumeMeter)
/* harmony export */ });
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");



class VolumeMeter extends _base_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(canvas, options = {}) {
        const viewHeight = options.viewHeight || 200;
        super(canvas, options, 100, viewHeight);
        this._lineWidth = 3;
        this._numberHeight = 20;
        this._minMax = 'min';
        this._minValue = 0;
        this._maxValue = 100;
        this._minFontColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white;
        this._minBgColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.red;
        this._maxFontColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white;
        this._maxBgColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.blue;
        this._barBorderColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.black;
        this.barFillColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.green;
        this._isGraident = false;
        this._speed = 5;
        this.markerBgColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.yellow;
        this._markerFontColor = _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white;
        this._internalValue = 0;
        this._meterWidth = this._viewWidth / 2;
        this._meterHeight = this._viewHeight - 2 * this._numberHeight;
        this._numberStart = (this._viewWidth - this._meterWidth - this._lineWidth) / 2;
        // Used only if the value is out of range.
        this._actualValue = this._internalValue;
        this._barY = this._viewHeight - (((this._internalValue - this._minValue) /
            (this._maxValue - this._minValue)) * this._meterHeight) - this._numberHeight;
        this._nextBarY = this._barY;
    }
    setOptions(options = {}) {
        const min = options.min || {};
        const max = options.max || {};
        const bar = options.bar || {};
        const marker = options.marker || {};
        this._minFontColor = min.fontColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white);
        this._minValue = min.value !== undefined ? min.value : 0;
        this._minBgColor = min.bgColor || (this.theme ? this.theme.red : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.red);
        this._maxFontColor = max.fontColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white);
        this._maxValue = max.value !== undefined ? max.value : 100;
        this._maxBgColor = max.bgColor || (this.theme ? this.theme.blue : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.blue);
        this._barBorderColor = bar.borderColor || (this.theme ? this.theme.black : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.black);
        this.barFillColor = bar.fillColor || (this.theme ? this.theme.green : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.green);
        this._isGraident = bar.graident || false;
        this._speed = bar.speed || 5;
        this.markerBgColor = marker.bgColor || (this.theme ? this.theme.yellow : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.yellow);
        this._markerFontColor = marker.fontColor || (this.theme ? this.theme.white : _color__WEBPACK_IMPORTED_MODULE_1__.COLOR.white);
        this._internalValue = options.value || 0;
    }
    isAnimating() {
        return this._barY !== this._nextBarY;
    }
    drawObject() {
        // Handle graident fill color.
        let barFillStyle = this.barFillColor;
        if (this._isGraident) {
            const gradient = this._ctx.createLinearGradient(this._viewWidth / 2, this._barY, this._viewWidth / 2, this._meterHeight + this._numberHeight);
            gradient.addColorStop(0, this.barFillColor);
            gradient.addColorStop(1, 'white');
            barFillStyle = gradient;
        }
        // Draw the filled part.
        this._shape.fillRect((this._viewWidth - this._meterWidth) / 2, this._barY, this._meterWidth, this._viewHeight - this._barY - this._numberHeight, barFillStyle);
        // Draw the border.
        this._ctx.beginPath();
        this._ctx.lineWidth = this._lineWidth;
        this._ctx.strokeStyle = this._barBorderColor;
        this._ctx.rect((this._viewWidth - this._meterWidth) / 2, this._numberHeight, this._meterWidth, this._meterHeight);
        this._ctx.stroke();
        this._ctx.closePath();
        // Draw value.
        this.drawMin();
        this.drawMax();
        this.drawMarker();
        // Calculate the Y value.
        const oldBarY = this._barY;
        this._barY = _utility__WEBPACK_IMPORTED_MODULE_2__["default"].getNextPos(this._barY, this._nextBarY, this._speed);
        if (this._barY !== oldBarY) {
            this._dirty = true;
        }
    }
    drawMin() {
        this._shape.fillRect(this._numberStart, this._viewHeight - this._numberHeight - this._lineWidth / 2, this._meterWidth + this._lineWidth, this._numberHeight + this._lineWidth / 2, this._minBgColor);
        this._shape.fillText(String(this._minValue), this._meterWidth, this._meterHeight + this._numberHeight + 15, '15px Arial', 'center', this._minFontColor);
    }
    drawMax() {
        this._shape.fillRect(this._numberStart, 0, this._meterWidth + this._lineWidth, this._numberHeight + this._lineWidth / 2, this._maxBgColor);
        this._shape.fillText(String(this._maxValue), this._meterWidth, this._numberHeight - 4, '15px Arial', 'center', this._maxFontColor);
    }
    drawMarker() {
        const text = (this._minMax === 'max' || this._minMax === 'min') ? this._actualValue : this._internalValue;
        this._shape.fillRect(this._numberStart + this._meterWidth + this._lineWidth, this._barY - 8, (this._viewWidth - (this._numberStart + this._meterWidth + this._lineWidth)), 16, this.markerBgColor);
        this._shape.fillRect(0, this._barY - this._lineWidth / 2, this._numberStart + this._meterWidth + this._lineWidth, this._lineWidth, this.markerBgColor);
        this._shape.fillText(String(text), (this._viewWidth - this._meterWidth) / 4 * 3 + this._meterWidth, this._barY + 4, '10px Arial', 'center', this._markerFontColor);
    }
    set value(value) {
        let n = value;
        this._actualValue = n;
        if (n >= this._maxValue) {
            this._minMax = 'max';
            n = this._maxValue;
        }
        else if (n <= this._minValue) {
            this._minMax = 'min';
            n = this._minValue;
        }
        else {
            this._minMax = 'normal';
        }
        this._speed = n < this._internalValue ? Math.abs(this._speed) : -Math.abs(this._speed);
        this._nextBarY = this._viewHeight - (((n - this._minValue) /
            (this._maxValue - this._minValue)) * this._meterHeight) - this._numberHeight;
        this._internalValue = n;
        this._dirty = true;
    }
    get value() {
        return this._actualValue;
    }
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BarMeter: () => (/* reexport safe */ _bar_meter__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   BaseComponent: () => (/* reexport safe */ _base_component__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   DigitalClock: () => (/* reexport safe */ _digital_clock__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   Heartbeat: () => (/* reexport safe */ _heartbeat__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   HexGrid: () => (/* reexport safe */ _hex_grid__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   MessageQueue: () => (/* reexport safe */ _message_queue__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   NetworkGraph: () => (/* reexport safe */ _network_graph__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   RoundFan: () => (/* reexport safe */ _round_fan__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   ScoreBoard: () => (/* reexport safe */ _score_board__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   Settings: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   SpeedCircle: () => (/* reexport safe */ _speed_circle__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   TextBox: () => (/* reexport safe */ _text_box__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   TextMeter: () => (/* reexport safe */ _text_meter__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   ThemeManager: () => (/* reexport safe */ _theme__WEBPACK_IMPORTED_MODULE_15__.ThemeManager),
/* harmony export */   VolumeMeter: () => (/* reexport safe */ _volume_meter__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _animation_timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation-timer */ "./src/animation-timer.ts");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings */ "./src/settings.ts");
/* harmony import */ var _bar_meter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bar-meter */ "./src/bar-meter.ts");
/* harmony import */ var _digital_clock__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./digital-clock */ "./src/digital-clock.ts");
/* harmony import */ var _round_fan__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./round-fan */ "./src/round-fan.ts");
/* harmony import */ var _volume_meter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./volume-meter */ "./src/volume-meter.ts");
/* harmony import */ var _heartbeat__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./heartbeat */ "./src/heartbeat.ts");
/* harmony import */ var _message_queue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./message-queue */ "./src/message-queue.ts");
/* harmony import */ var _text_meter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./text-meter */ "./src/text-meter.ts");
/* harmony import */ var _speed_circle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./speed-circle */ "./src/speed-circle.ts");
/* harmony import */ var _text_box__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./text-box */ "./src/text-box.ts");
/* harmony import */ var _network_graph__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./network-graph */ "./src/network-graph.ts");
/* harmony import */ var _hex_grid__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./hex-grid */ "./src/hex-grid.ts");
/* harmony import */ var _score_board__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./score-board */ "./src/score-board.ts");
/* harmony import */ var _base_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./base-component */ "./src/base-component.ts");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./theme */ "./src/theme.ts");

















/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    Settings: _settings__WEBPACK_IMPORTED_MODULE_1__["default"],
    BaseComponent: _base_component__WEBPACK_IMPORTED_MODULE_14__["default"],
    ThemeManager: _theme__WEBPACK_IMPORTED_MODULE_15__.ThemeManager,
    BarMeter: _bar_meter__WEBPACK_IMPORTED_MODULE_2__["default"],
    DigitalClock: _digital_clock__WEBPACK_IMPORTED_MODULE_3__["default"],
    VolumeMeter: _volume_meter__WEBPACK_IMPORTED_MODULE_5__["default"],
    Heartbeat: _heartbeat__WEBPACK_IMPORTED_MODULE_6__["default"],
    MessageQueue: _message_queue__WEBPACK_IMPORTED_MODULE_7__["default"],
    SpeedCircle: _speed_circle__WEBPACK_IMPORTED_MODULE_9__["default"],
    TextMeter: _text_meter__WEBPACK_IMPORTED_MODULE_8__["default"],
    RoundFan: _round_fan__WEBPACK_IMPORTED_MODULE_4__["default"],
    TextBox: _text_box__WEBPACK_IMPORTED_MODULE_10__["default"],
    NetworkGraph: _network_graph__WEBPACK_IMPORTED_MODULE_11__["default"],
    HexGrid: _hex_grid__WEBPACK_IMPORTED_MODULE_12__["default"],
    ScoreBoard: _score_board__WEBPACK_IMPORTED_MODULE_13__["default"]
});
// Fire up window.requestAnimationFrame()
_animation_timer__WEBPACK_IMPORTED_MODULE_0__["default"].render();

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=zeu.js.map