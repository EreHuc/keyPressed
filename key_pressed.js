/**
 * Created by Romain on 18/06/2017.
 */
let keyPressedUtils = (() => {
    class kpUtils {
        constructor(options) {
            options = options || {};
            this.setGlobalEventHandler();
            this.setAddEventHandler();
            this.setRemoveEventHandler();
            this.stack = {};
            this.keys = [];
            this.globalKeyEvents = {};
            this.upKeyEvents = {};
            this.downKeyEvents = {};
            this.selector = typeof options['selector'] === "string" ? options['selector'] : null;
            this.element = null;
            this.keys = (typeof options['keys'] === 'object' && !(options['keys'] === null || options['keys'] === undefined)) ? options['keys'] : [];
            this.triggerOnce = typeof options['triggerOnce'] === "boolean" ? options['triggerOnce'] : false;
            if (this.selector) {
                this.element = document.querySelector(this.selector);
                if (!this.element)
                    throw new Error('keyPressedClass : Valid selector is required');
            } else {
                this.element = document.querySelector('body');
            }
            this.setKeyEvent();
        }

        setKeyEvent() {
            let keyupEvent = (e) => {
                    let key = e.keyCode;
                    if (!this.keys.length || this.keys.indexOf(key) > -1) {
                        if (!this.triggerOnce || this.getKeyPressed().indexOf(key) > -1) {
                            this.remove(key, e);
                        }
                    }
                },
                keydownEvent = (e) => {
                    let key = e.keyCode;
                    if (!this.keys.length || this.keys.indexOf(key) > -1) {
                        if (!this.triggerOnce || this.getKeyPressed().indexOf(key) === -1) {
                            this.add(key, e);
                        }
                    }
                };
            this.element.addEventListener('keyup', keyupEvent);
            this.element.addEventListener('keydown', keydownEvent);
        }

        add(key, e) {
            e = e || {};
            this.stack[key] = true;
            e.keyPressed = this.getKeyPressed();
            this.addEventHandler(e);
            this.globalEventHandler(e);
            if (this.globalKeyEvents[key])
                this.globalKeyEvents[key](e);
            if (this.downKeyEvents[key])
                this.downKeyEvents[key](e);
        }

        remove(key, e) {
            e = e || {};
            delete this.stack[key];
            e.keyPressed = this.getKeyPressed();
            this.removeEventHandler(e);
            this.globalEventHandler(e);
            if (this.globalKeyEvents[key])
                this.globalKeyEvents[key](e);
            if (this.upKeyEvents[key])
                this.upKeyEvents[key](e);
        }

        setGlobalEventHandler(eventHandler) {
            let handler = function (e) {

            };
            if (typeof eventHandler === 'function') {
                handler = eventHandler;
            }
            this.globalEventHandler = handler;
        }

        setAddEventHandler(eventHandler) {
            let handler = function (e) {

            };
            if (typeof eventHandler === 'function') {
                handler = eventHandler;
            }
            this.addEventHandler = handler;
        }

        setRemoveEventHandler(eventHandler) {
            let handler = function (e) {

            };
            if (typeof eventHandler === 'function') {
                handler = eventHandler;
            }
            this.removeEventHandler = handler;
        }

        getKeyPressed() {
            let arr = [];
            Object.keys(this.stack).forEach(elm => {
                arr.push(Number(elm));
            });
            return arr;
        }

        setKeys(keys) {
            if (typeof keys === 'object' && !(keys.length === null || keys.length === undefined)) {
                this.keys = keys;
            } else if (keys === null) {
                this.keys = [];
            } else {
                throw new Error('setKeys : Only accept array or null value');
            }
        }

        getKeys() {
            return this.keys;
        }

        setOptions(options) {
            this.keys = (typeof options['keys'] === 'object' && !(options['keys'] === null || options['keys'] === undefined)) ? options['keys'] : this.keys;
            this.triggerOnce = typeof options['triggerOnce'] === "boolean" ? options['triggerOnce'] : this.triggerOnce;
            if (options['selector']) {
                let element = document.querySelector(options['selector']);
                if (!element)
                    throw new Error('setOptions : Valid selector is required');
                this.selector = options['selector'];
                this.element.removeEventListener('keydown');
                this.element.removeEventListener('keyup');
                this.element = element;
                this.setKeyEvent();
            }
        }

        getOptions() {
            return {
                keys: this.keys,
                triggerOnce: this.triggerOnce,
                selector: this.selector
            }
        }
    }

    return kpUtils;
})();

let keyPressedClass = function (options) {
    let prop = new WeakMap();
    class KeyPressed {
        constructor(options) {
            this.version = "1.0.0";
            prop.set(this, new keyPressedUtils(options))
        }

        on(event, eventHandler) {
            if (typeof eventHandler !== 'function')
                throw new Error('on : Event handler must be a function !');
            switch (event) {
                case 'keydown':
                    prop.get(this).setAddEventHandler(eventHandler);
                    break;
                case 'keyup':
                    prop.get(this).setRemoveEventHandler(eventHandler);
                    break;
                case 'global':
                    prop.get(this).setGlobalEventHandler(eventHandler);
                    break;
                default:
                    if (typeof Number(event) === "number") {
                        prop.get(this).globalKeyEvents[event] = eventHandler;
                    } else {
                        console.warn('on : event', event, 'is not supported');
                    }
                    break;
            }
            return this;
        }

        off(event) {
            switch (event) {
                case 'keydown':
                    prop.get(this).setAddEventHandler();
                    break;
                case 'keyup':
                    prop.get(this).setRemoveEventHandler();
                    break;
                case 'global':
                    prop.get(this).setGlobalEventHandler();
                    break;
                default:
                    if (typeof Number(event) === "number") {
                        delete prop.get(this).globalKeyEvents[event];
                        delete prop.get(this).upKeyEvents[event];
                        delete prop.get(this).downKeyEvents[event];
                        break;
                    }
            }
            return this;
        }

        up(keyCode, eventHandler) {
            if (typeof Number(keyCode) === 'number') {
                prop.get(this).upKeyEvents[keyCode] = eventHandler;
            } else {
                console.warn('up : event', keyCode, 'is not supported');
            }
            return this;
        }

        down(keyCode, eventHandler) {
            if (typeof Number(keyCode) === 'number') {
                prop.get(this).downKeyEvents[keyCode] = eventHandler;
            } else {
                console.warn('up : event', keyCode, 'is not supported');
            }
            return this;
        }

        setOptions(options) {
            prop.get(this).setOptions(options);
            return this;
        }

        getOptions() {
            return prop.get(this).getOptions();
        }
    }
    return new KeyPressed();
};

(function (global) {
    global.KeyPressed = keyPressedClass;
})(typeof window !== 'undefined' ? window : this);