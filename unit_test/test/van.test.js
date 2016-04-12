var Test = {
    add: function (a, b) {
        return a + b;
    },

    al: function () {
        alert('hello');
        return true;
    }

};

module('扩展测试');
asyncTest('Van.extend直接挂载', function () {
    Van.extend({
        add: Test.add,
        al: Test.al
    });

    equal(Van.add(1, 2), 3, '1+2等于3');
    //equal(Van.al(), true, 'alert hello');
    // 注意异步测试时调用start以继续测试
    start();
});

test('Van.prototype.extend原型挂载', function () {
    Van.prototype.extend({
        add: Test.add,
        al: Test.al
    });
    equal(Van.prototype.add(1, 2), 3, '1+2等于3');
    //equal(Van.prototype.al(), true, 'alert hello');
});

module('attribute相关测试');
test('获得attribute', function () {
    document.getElementById('qunit-fixture').setAttribute('title', 'jiavan');
    var title = Van('#qunit-fixture').attr('title');
    equal(title, 'jiavan', 'title的属性应该是jiavan');
});

test('设置attribute', function () {
    Van('#qunit-fixture').attr('title', 'jiavan');
    var title = document.getElementById('qunit-fixture').getAttribute('title');
    equal(title, 'jiavan', 'title属性被设置为jiavan');
});