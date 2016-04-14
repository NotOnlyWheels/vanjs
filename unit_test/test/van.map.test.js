module('Van.map');
test('object', function () {
    var src = Test.obj;
    var dest = {
        a: 2,
        b: 4,
        c: 6
    };
    src = Van.map(function(item) {
        return item * 2;
    });

    ok(Test.compareValue(src, dest), 'object passing');
});

test('array', function () {
    var src = Test.arr;
    var dest = [2, 4, 6];
    src = Van.map(function(item) {
        return item * 2;
    });

    ok(Test.compareValue(src, dest), 'array passing');
});