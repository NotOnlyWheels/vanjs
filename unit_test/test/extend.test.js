var Test = {
    add: function (a, b) {
        return a + b;
    },

    al: function () {
        alert('hello');
        return true;
    },

    compareValue: function(a, b) {
        for (var key in a) {
            if (a[key] !== b[key]) {
                return;
            }
        }
        return true;
    }

};

module('Van.extend');
asyncTest('Van.extend直接挂载', function () {
    Van.extend({
        add: Test.add,
        al: Test.al
    });

    var src = {uid: "0x0001"},
        result = Van.extend({}, {name: "Tom", age: 21},
            {name: "Jerry", sex: "Boy"}),
        result2 = Van.extend(src, {name: "Tom", age: 21},
            {name: "Jerry", sex: "Boy"});

    equal(Van.add(1, 2), 3, '1+2等于3');
    equal(Test.compareValue(result, {name:"Jerry",age:21,sex:"Boy"}),
        true, "将两个对象合并为一个对象，不更改元对象");
    equal(Test.compareValue(result2, {uid: "0x0001",name:"Jerry",age:21,sex:"Boy"}),
        true, "将两个对象合并为一个对象，在原对象基础上扩展");
    start();
});

module('Van.fn.extend');
test('Van.prototype.extend原型挂载', function () {
    Van.prototype.extend({
        add: Test.add,
        al: Test.al
    });
    var src = {uid: "0x0001"},
        result = Van.fn.extend({}, {name: "Tom", age: 21},
            {name: "Jerry", sex: "Boy"}),
        result2 = Van.fn.extend(src, {name: "Tom", age: 21},
            {name: "Jerry", sex: "Boy"});

    equal(Van.add(1, 2), 3, '1+2等于3');
    equal(Test.compareValue(result, {name:"Jerry",age:21,sex:"Boy"}),
        true, "将两个对象合并为一个对象，不更改元对象");
    equal(Test.compareValue(result2, {uid: "0x0001",name:"Jerry",age:21,sex:"Boy"}),
        true, "将两个对象合并为一个对象，在原对象基础上扩展");
});
