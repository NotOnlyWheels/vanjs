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

                if (typeof attr === 'string') {
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
                } else if (typeof attr === 'object') {
                    var that = this[i];

                    // 将对象css值全部应用在元素上，注意cssText会覆盖掉之前的样式
                    // 所以应该在原有的css样式基础上追加css
                    // 注意缓存上面的this
                    Van.prototype.each(attr, function (key, value) {
                        that.style.cssText += ' ' + key + ':' + value + ';';
                    });
                }
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
            // callback第一个参数是key，第二个参数是value
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
        },

        /**
         * 设置/获得属性值，仅传一个参数时返回属性值，2个参数或者
         * attribute key-value对象时为设置参数
         * @param attr 属性名称
         * @param val 属性值
         * @returns {string}
         */
        attr: function (attr, val) {
            var i,
                that;

            for (i = 0; i < this.length; i++) {
                if (typeof attr === 'string') {

                    // 获取属性值
                    if (arguments.length === 1) {
                        return this[i].getAttribute(attr);
                    }

                    this[i].setAttribute(attr, val);
                } else {

                    // 设置多个属性值
                    that = this[i];
                    Van.prototype.each(attr, function (attr, val) {
                        that.setAttribute(attr, val);
                    });
                }
            }

            return this;
        },

        // 设置或者获得data属性
        data: function (attr, val) {
            var i,
                that;

            for (i = 0; i < this.length; i++) {
                if (typeof attr === 'string') {
                    if (arguments.length === 1) {
                        return this[i].getAttribute('data-' + attr);
                    }

                    this[i].setAttribute('data-' + attr, val);
                } else {
                    that = this[i];
                    Van.prototype.each(attr, function (attr, val) {
                        that.setAttribute('data-' + attr, val);
                    });
                }
            }

            return this;
        },

        // 获得元素的html内容/设置元素的html
        html: function (val) {
            var i;
            if (val === undefined && this[0].nodeType === 1) {
                return this[0].innerHTML;
            } else {
                for (i = 0; i < this.length; i++) {
                    this[i].innerHTML = val;
                }
            }

            return this;
        },

        text: function (val) {
            if (val === undefined && this[0].nodeType === 1) {
                return this[0].innerText;
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].innerText = val;
                }
            }
        },

        // 操作DOM，相对于innerHTML，该方法不会重新解析调用该方法的元素
        // 因此不会影响到已经存在的元素解析，避免额外的解析操作
        // beforebegin 在 element 元素的前面
        // afterbegin 在 element 元素的第一个子节点前面
        // beforeend 在 element 元素的最后一个子节点后面
        // afterend 在 element 元素的后面
        // text 是字符串，会被解析成 HTML 或 XML，并插入到 DOM 树中
        appendDOM: function (el, position, str) {
            el.insertAdjacentHTML(position, str);
        },

        // 添加在当前元素的最后一个子元素后面
        append: function (str) {
            for (var i = 0; i < this.length; i++) {
                console.log(str)
                Van.prototype.appendDOM(this[i], 'beforeend', str);
            }
            return this;
        },

        // 插在当前元素的前方
        before: function (str) {
            for (var i = 0; i < this.length; i++) {
                Van.prototype.appendDOM(this[i], 'beforebegin', str);
            }
            return this;
        },

        // 插在当前元素的后方
        after: function (str) {
            for (var i = 0; i < this.length; i++) {
                Van.prototype.appendDOM(this[i], 'afterend', str);
            }
            return this;
        },

        // 移除元素本身
        remove: function () {
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },

        _delegate: function (agent, type, selector, fn) {

            agent.addEventListener(type, function (e) {
                var target = e.target,
                    ctarget = e.currentTarget,
                    bubble = true;

                while (target !== ctarget) {
                    if (filiter(agent, selector, target)) {
                        bubble = fn.call(target, e);
                        return bubble;
                    }
                }
            }, false);

            function filiter(agent, selector, target) {
                var nodes = agent.querySelectorAll(selector);
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i] === target) {
                        return true;
                    }
                }
            }
        },

        // 绑定事件，不使用委托
        _on: function (type, selector, fn) {
            if (typeof selector === 'function') {
                fn = selector;
                for (var i = 0; i < this.length; i++) {
                    if (!this[i].guid) {
                        this[i].guid = ++Van.guid;
                        Van.Events[Van.guid] = {};

                        Van.Events[Van.guid][type] = [fn];
                        Van._bind(this[i], type, this[i].guid);
                    } else {
                        var id = this[i].guid;
                        if (Van.Events[id][type]) {
                            Van.Events[id][type].push(fn);
                        } else {
                            Van.Events[id][type] = [fn];
                            Van._bind(this[i], type, id);
                        }
                    }
                }
            }
        },

        _bind: function (dom, type, guid) {
            dom.addEventListener(type, function (e) {
                for (var i = 0; i < Van.Events[guid][type].length; i++) {
                    Van.Events.guid[type][i].call(dom, e);
                }
            }, false);
        },

        // 设置/获得元素的宽度
        width: function (val) {

            // 当获取元素的宽度时
            if (arguments.length === 0) {

                // 如果选择的是window，即Van(this)
                if (this[0].document === doc) {
                    return this[0].innerWidth;
                    // 如果选择的是document
                } else if (this[0].nodeType === 9) {
                    return document.documentElement.clientWidth;
                } else {
                    // 选择的是普通元素
                    return parseInt(window.getComputedStyle(this[0], null)['width']);
                }
            } else {
                // 设置元素的宽度
                for (var i = 0; i < this.length; i++) {
                    this[i].style.width = val + 'px';
                }
            }
        },

        // 设置或者获得元素的高度
        height: function (val) {

            // 当获取元素的高度时
            if (arguments.length === 0) {

                // 如果选择的是window，即Van(this)
                if (this[0].document === doc) {
                    return this[0].innerHeight;
                    // 如果选择的是document
                } else if (this[0].nodeType === 9) {
                    return document.documentElement.clientHeight;
                } else {
                    // 选择的是普通元素
                    return parseInt(window.getComputedStyle(this[0], null)['height']);
                }
            } else {
                // 设置元素的高度
                for (var i = 0; i < this.length; i++) {
                    this[i].style.height = val + 'px';
                }
            }
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
    Van.ajax = function (options) {

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

    // 挂载事件数组
    Van.Events = [];
    Van.guid = 0;

    // Van扩展方法，原型扩展或直接对象挂载
    Van.prototype.extend = Van.extend = function () {
        var options = arguments[0];
        for (var i in options) {
            this[i] = options[i];
        }
    };

    // 将init方法的原型指向van的原型，以便生成的实例可以完成链式调用
    Van.prototype.init.prototype = Van.prototype;

    // 将van挂载到window全局上
    window.Van = Van;
    window.$ = Van;
})(window, document);