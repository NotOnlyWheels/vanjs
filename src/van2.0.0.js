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
        rootVan;

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
            }
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

    window.Van = window.$ = Van;

})(window);