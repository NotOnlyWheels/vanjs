# 正则
## 量词符
```
- ? 表示某个模式出现0次或者1次，等于{0,1}
- * 表示某个模式出现0次或者多次，等于{0,}
- + 表示某个模式出现1次或者多次，等于{1,} 
```

# 页面加载
```javascript
DOM文档加载的步骤为

0. 解析HTML结构。
1. 加载外部脚本和样式表文件。
2. 解析并执行脚本代码。
3. DOM树构建完成。//DOMContentLoaded
4. 加载图片等外部文件。
5. 页面加载完毕。//load
在第4步，会触发DOMContentLoaded事件。在第6步，触发load事件。
```

# CSS部分
## getComputedStyle
element.style获得的是应用在元素style属性中的样式（不包括css样式的属性）而getComputedStyle获得的属性是元素对象上所有的属性，即使没有为元素设置任何样式，仍然会有。
```javascript
// getComputedStyle IE 6~8是不支持的，currentStyle为ie属性
// 通过currentStyle或者getComputedStyle获取全部css属性
// getComputedStyle只读不能写，getPropertyValue获得属性值
```

## el.style.cssText
这个属性有点类似于el.innerText，可以批量的设置css样式
```javascript
el.style.cssText = 'width: 200px; color: red';
```
注意，这样的用法会覆盖掉之前元素的样式，所以一般采用追加的方式。



# DOM操作
## 性能问题
```javascript
// 操作DOM，相对于innerHTML，该方法不会重新解析调用该方法的元素
// 因此不会影响到已经存在的元素解析，避免额外的解析操作
// beforebegin 在 element 元素的前面
// afterbegin 在 element 元素的第一个子节点前面
// beforeend 在 element 元素的最后一个子节点后面
// afterend 在 element 元素的后面
// text 是字符串，会被解析成 HTML 或 XML，并插入到 DOM 树中
appendDOM: function (el, position, str) {
    el.insertAdjacentHTML(position, str);
}
```
----

# 问题
JS遍历数组与对象的方法？

Array.prototype.forEach用于数组遍历，跳过undefined
for （key in obj）遍历对象，会遍历对象原型中的属性
