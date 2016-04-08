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

            // 如果传入的是原生DOM对象/对象集或者直接是函数
            // 直接通过Van()或者$()形式调用函数，在DOM树解析完成后执行
            if (typeof selector === 'object') {

                // 如果传入的是类数组对象，那么转换为数组进行遍历
                if (selector.length) {
                    selector = Array.prototype.slice.call(selector);
                    for (var i = 0; i < selector.length; i++) {
                        this[i] = selector[i];
                    }
                    this.length = selector.length;
                    return this;
                } else {

                    // 如果是原生的DOM对象
                    this[0] = selector;
                    this.length = 1;
                    return this;
                }
            } else if (typeof selector === 'function') {
                this.ready(selector);
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
                this.selector = selector;
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
        },

        // 返回元素的下一个相邻节点
        next: function () {
            return sibling(this[0], 'nextSibling');
        },

        // 返回元素上一个相邻节点
        prev: function () {
            return sibling(this[0], 'previousSibling');
        },

        // 返回元素的父节点，暂时不稳定
        _parent: function () {
            var parent = this[0].parentNode;
            var p = Van();
            parent = parent && parent.nodeType !== 11 ? parent : null;
            p[0] = parent;
            p.selector = parent.tagName.toLowerCase();
            p.length = 1;

            return p;
        },

        // 返回元素的所有父节点
        parents: function () {
            var p = Van(),
                i = 0;

            // 从当前元素的父节点到document，document.nodeType === 9
            while ((this[0] = this[0]['parentNode']) && this[0].nodeType !== 9) {
                if (this[0].nodeType === 1) {
                    p[i] = this[0];
                    i++;
                }
            }

            p.length = i;

            return p;
        },

        // 当DOM树已经生成
        ready: function (fn) {
            doc.addEventListener('DOMContentLoaded', fn, false);
        },

        // 遍历对象或数组
        each: function (obj, callback, args) {
            var i = 0,
                length = obj.length,
                isArray = Array.isArray(obj),
                value;

            // 如果带有参数，将参数通过apply传入回调函数
            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                }
            } else {
                // 如果没有带参数，用call方法并传入元素的索引值以及本身
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        // 查找某一元素集合，返回的是Van对象，不是DOM集合对象
        find: function (selector) {
            if (!selector) {
                return;
            }

            var context = this.selector;
            return Van(context + ' ' + selector);
        },

        // 获得第一个元素，Van对象类型
        first: function () {
            return Van(this[0]);
        },

        // 最后一个元素，Van类型
        last: function () {
            return Van(this[this.length - 1]);
        },

        // 获得指定num的元素，并返回Van对象
        eq: function (num) {
            var res = num < 0 ?
                this[this.length - 1] :
                this[num];

            return Van(res);
        },

        // 获得指定num的原生DOM对象
        get: function (num) {
            return num < 0 ?
                this[this.length - 1 + num] :
                this[num];
        }
    };

    /**
     * 筛选是nodeType为1(为元素标签)的子节点
     * @param element 目标元素
     * @param dest 筛选的类型，previous ？ next
     * @returns {*}
     */
    function sibling(element, dir) {
        while ((element = element[dir]) && element.nodeType !== 1) {
        }
        return element;
    }

    /**
     * Ajax请求
     * @param options 选项配置信息
     */
    Van.ajax = function(options) {

        // 默认配置
        var defaultOptions = {
            url: false, // ajax请求地址
            type: 'GET', // 请求方式
            data: false, // post时附带的数据
            success: false, // ajax成功回调函数
            complete: false // ajax完成时的回调
        };
        var xhr = null,
            url;

        // 配置传入的options，如果存在值为undefined属性，则设为默认options value
        for (var i in defaultOptions) {
            if (options[i] === undefined) {
                options[i] = defaultOptions[i];
            }
        }

        xhr = new XMLHttpRequest();
        url = options.url;
        xhr.open(options.type, url);
        xhr.onreadystatechange = onStateChange;

        if (options.type.toLowerCase() === 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.send(options.data ? options.data : null);

        // ajax回应状态更改
        function onStateChange() {
            if (xhr.readyState === 4) {
                var result,
                    status = xhr.status;

                if ((status >= 200 && status < 300) || status === 304) {
                    result = xhr.responseText;

                    if (window.JSON) {
                        result = JSON.parse(result);
                    } else {
                        result = eval('(' + result + ')');
                    }

                    // 数据解析完成，调用触发ajax请求成功
                    ajaxSuccess(result, xhr);
                } else {
                    console.log('ERR', xhr.status);
                }
            }
        }

        // ajax请求成功
        function ajaxSuccess(data, xhr) {
            var status = 'success';
            // 如果存在ajax成功回调函数，就调用回调函数
            options.success && options.success(data, options, status, xhr);
            // ajax请求成功后触发ajax请求过程已完成
            ajaxComplete(status);
        }

        // ajax请求完成
        function ajaxComplete(status) {
            options.complete && options.complete(status);
        }
    };

    /**
     * 通过ajax方法发get请求
     * @param url 请求地址
     * @param successCallback 成功回调函数
     * @param completeCallback 完成回调函数
     */
    Van.get = function (url, successCallback, completeCallback) {
        var options = {
            url: url,
            success: successCallback,
            complete: completeCallback
        };
        Van.ajax(options);
    };

    /**
     * 通过ajax方法发post类型请求，二次封装
     * @param url 请求地址
     * @param data 要post的数据
     * @param successCallback 成功回调
     * @param completeCallback 完成回调
     */
    Van.post = function (url, data, successCallback, completeCallback) {
        var options = {
            url: url,
            type: 'post',
            data: data,
            success: successCallback,
            complete: completeCallback
        };
        Van.ajax(options);
    };

    // 将init方法的原型指向van的原型，以便生成的实例可以完成链式调用
    Van.prototype.init.prototype = Van.prototype;

    // 将van挂载到window全局上
    window.Van = Van;
    window.$ = Van;
})(window, document);