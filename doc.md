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