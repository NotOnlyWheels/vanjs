module('Van.each');
test('Object遍历', function () {
    var obj = {
            name: 'jiavan',
            age: 20
        },
        res = {
            name: 'jiavan1',
            age: 21
        };

    Van.each(obj, function (key, value) {
        obj[key] = value + 1;
    });
    ok(Test.compareValue(obj, res), 'object passing');
});

test('Array遍历', function () {
    var dest = [1, 2, 3],
        src = [2, 3, 4];
    Van.each(src, function (key, value) {
        src[key] = --value;
    });
    ok(Test.compareValue(src, dest), 'array passing');
});