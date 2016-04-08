# 正则
## 量词符
```
- ? 表示某个模式出现0次或者1次，等于{0,1}
- * 表示某个模式出现0次或者多次，等于{0,}
- + 表示某个模式出现1次或者多次，等于{1,} 
```

# getComputedStyle
element.style获得的是应用在元素style属性中的样式（不包括css样式的属性）而getComputedStyle获得的属性是元素对象上所有的属性，即使没有为元素设置任何样式，仍然会有。
```javascript
// getComputedStyle IE 6~8是不支持的，currentStyle为ie属性
// 通过currentStyle或者getComputedStyle获取全部css属性
// getComputedStyle只读不能写，getPropertyValue获得属性值
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



----

# 问题
JS遍历数组与对象的方法？

Array.prototype.forEach用于数组遍历，跳过undefined
for （key in obj）遍历对象，会遍历对象原型中的属性
