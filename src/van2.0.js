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
        };

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
        Van.extend = Van.fn.extend = function () {};

        return Van;
    })();

    window.Van = window.$ = Van;

})(window);