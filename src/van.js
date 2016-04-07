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
        // 通过设置对象的length与splice属性可让对象成为一个array-like object
        // 在控制台以数组的形式显示
        length: 0,
        splice: Array.prototype.splice,
        selector: '',

        // 通过选择器选择dom
        init: function (selector) {
            if (!selector) {
                return this;
            }

            var element,
                i;
            selector = selector.trim();

            // 选择element以及返回van本身以完成链式调用
            if (selector.charAt(0) === '#' && !selector.match('\\s')) {
                selector = selector.substring(1);
                this.selector = selector;
                element = document.getElementById(selector);
                this[0] = element;
                this.length = 1;

                return this;
            } else {
                element = document.querySelectorAll(selector);
                for (i = 0; i < element.length; i++) {
                    this[i] = element[i];
                }
                this.length = element.length;

                return this;
            }

        },

        /**
         * 设置或者获取元素的css属性
         * @param attr 属性名称
         * @param val 属性值
         * @returns {*}
         */
        css: function (attr, val) {
            for (var i = 0; i < this.length; i++) {

                // 当只有一个参数时为获得元素的某一属性
                if (arguments.length === 1) {

                    // getComputedStyle IE 6~8是不支持的，currentStyle为ie属性
                    // 通过currentStyle或者getComputedStyle获取全部css属性
                    // getComputedStyle只读不能写，getPropertyValue获得属性值
                    return this[i].currentStyle ?
                        this[i].currentStyle[attr] :
                        window.getComputedStyle(this[i], null).getPropertyValue(attr);
                }

                // 两个参数时设置对应的属性值
                this[i].style[attr] = val;
            }

            return this;
        },

        /**
         * 判断元素/元素集合是否有指定class值
         * @param className 样式类名
         * @returns {boolean}
         */
        hasClass: function (className) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)'),
                i;

            for (i = 0; i < this.length; i++) {
                if (this[i].className.match(reg)) {
                    return true;
                }
            }

            return false;
        },

        /**
         * 给元素/元素集合添加class
         * @param className
         * @returns {Van}
         */
        addClass: function (className) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)'),
                i;

            for (i = 0; i < this.length; i++) {

                // 如果当前元素没有该class就添加
                if (!this[i].className.match(reg)) {
                    this[i].className += ' ' + className;
                }
            }

            return this;
        },

        /**
         * 移除元素/元素集合中的某一class
         * @param className
         * @returns {Van}
         */
        removeClass: function (className) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)'),
                i;

            for (i = 0; i < this.length; i++) {

                // 如果存在该class那么用空字符串替换
                if (this[i].className.match(reg)) {
                    this[i].className = this[i].className.replace(className, '');
                }
            }

            return this;
        }
    };

    // 将init方法的原型指向van的原型，以便生成的实例可以完成链式调用
    Van.prototype.init.prototype = Van.prototype;

    // 将van挂载到window全局上
    window.Van = Van;
    window.$ = Van;
})(window, document);