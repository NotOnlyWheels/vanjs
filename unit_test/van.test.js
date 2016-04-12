var expect = require('chai').expect,
    Van = require('../src/van.js');

describe('Van unit test', function () {
    describe('extend 方法测试', function () {

        it('# 1+1应该返回2', function () {
            Van.extend({
                add: function (a, b) {
                    return a + b;
                }
            });
            var res = Van.add(1, 1);

            expect(res).to.be.equal(2);
        });
    });
});