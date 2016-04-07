/**
 * Created by jiavan on 16-4-7.
 */
(function (window, document) {
    // 缓存window，document对象以及声明部分变量
    var w = window,
        doc = document,
        Van = function (selector) {

            // 通过直接调用van生成一个van的实例，不必每次都用new生成实例
            return new Van.prototype.init(selector);
        };

    // 重写vanjs原型并为一个类数组对象
    Van.prototype = {
        constructor: Van,
        length: 0,
        splice: Array.prototype.splice,
        selector: '',
        init: function (selector) {
            if (!selector) {
                return this;
            }

            var selector = selector.trim(),
                element;

        }
    };

    // 将init方法的原型指向van的原型，以便生成的实例可以完成链式调用
    Van.prototype.init.prototype = Van.prototype;

    // 将van挂载到window全局上
    window.Van = Van;
    window.$ = Van;
})(window, document);