/**
 * @param winow 将全局传入作为局部变量
 * @param undefined 将undefined在函数内部声明
 * 当立即执行函数内需要查找window或者undefined时可直接使用
 * 缩短了变量查找时要查找的作用域链长度
 */
(function (window, undefined) {

    var Van = (function () {
        var Van = function (selector, context) {
                return new Van.fn.init(selector, context, rootVan);
            },

            rootVan,

        // reference core methods
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty,
            push = Array.prototype.push,
            slice = Array.prototype.slice,
            trim = String.prototype.trim,
            indexOf = Array.prototype.indexOf;

        // fn为Van原型对象的别名
        Van.fn = Van.prototype = {
            constructor: Van,
            init: function (selector, context, rootVan) {

                // Handle $(''), $(null), $(undefined)
                if (!selector) {
                    return this;
                }

                // Handle $(DOMElement)，传入原生DOM
                if (selector.nodeType) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                // Handle $(body)，传入body
                if (selector === 'body' && !context && document.body) {
                    this.context = document;
                    this.selector = selector;
                    this.length = 1;
                    return this;
                }
            },
            selector: '',
            van: '2.0.0',

            // Van对象的长度
            length: 0,

            // Van对象的size
            size: function () {
                return this.length;
            },

            // 将一个对象转换为数组
            toArray: function () {
                return slice.call(this, 0);
            },

            // 传入参数返回指定对象，支持负值
            // 不传参数默认返回全部元素的数组
            get: function (num) {
                return num === null ?
                    this.toArray() :
                    (num < 0 ? this[this.length + num] : num);
            },

            //
            pushStack: function (elems, name, selector) {

            },

            // 调用了静态方法
            each: function (callback, args) {
                return Van.each(this, callback, args);
            },
            ready: function (fn) {
            },
            eq: function (i) {
            },
            first: function () {
            },
            last: function () {
            },
            slice: function () {
            },
            map: function (callback) {
            },
            end: function () {
            },
            push: push,
            sort: [].sort,
            //splice: [].splice
        };

        // 将init方法的原型指向Van的原型，通过调用Van生成的init实例可调用Van原型上的方法
        Van.fn.init.prototype = Van.fn;

        // target[, obj][, obj..]
        // 一个参数时，直接对Van进行扩展，多个参数时，将后面的对象合并到target(后面覆盖之前属性)
        // Van.extend直接挂载在对象上this指向Van
        // Van.fn.extend挂载在Van的原型上，this指向prototype
        Van.extend = Van.fn.extend = function () {
            var target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                options,
                name,
                copy;

            // 当传入的target不为对象或者函数，默认设置为obj
            if (typeof target !== 'object' && typeof target !== 'function') {
                target = {};
            }

            // 当只有一个对象时，直接在Van上扩展
            if (length === 1) {
                target = this;
                --i;
            }

            // 对传入的对象进行合并，合并到target对象
            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        copy = options[name];
                        if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            return target;
        };

        return Van;
    })();

    // 在Van的基础上扩展静态方法
    Van.extend({

        isArray: Array.isArray,

        // 是否是一个函数
        isFunction: function (val) {
            return typeof val === 'function';
        },

        // 数组或对象遍历迭代方法
        each: function (obj, callbcak, args) {
            var i = 0,
                key,
                length = obj.length,
                isArray = Array.isArray;

            if (args) {

                // 存在参数的时候用apply传递参数
                if (isArray(obj)) {

                    for (; i < length; i++) {
                        if (callbcak.apply(obj[i], args) === false) {
                            break;
                        }
                    }
                } else {

                    // obj为对象时用for in循环，能遍历到原型中的属性
                    for (key in obj) {
                        if (callbcak.apply(obj[key], args) === false) {
                            break;
                        }
                    }
                }
            } else {

                // 不存在外部传参时，使用call方法传递参数，回调第一个参数是key，第二个是value
                if (isArray(obj)) {
                    for (; i < length; i++) {
                        if (callbcak.call(obj[i], i, obj[i]) === false) {
                            break;
                        }
                    }
                } else {
                    for (key in obj) {
                        if (callbcak.call(obj[key], key, obj[key]) === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        map: function (elems, callback, arg) {
            var i = 0,
                length = elems.length,
                set = [],
                key,
                value;

            if (this.isArray(elems)) {
                for (; i < length; i++) {
                    value = callback.apply(elems[i], arg);
                    if (value) {
                        set[set.length] = value;
                    }
                }
            } else {
                for (key in elems) {
                    value = elems[key];
                    if(value) {
                        set[set.length] = value;
                    }
                }
            }

            return set;
        }
    });

    window.Van = window.$ = Van;

})(window);