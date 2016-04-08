/*var input = read_line(),
    T = parseInt(input),
    str = '',
    data = [];

while (T--) {
    str = read_line();
    data = str.split(' ');

    print(Math.ceil(data[0] / data[2]) + Math.ceil(data[1] / data[2]));
}*/


/////////

var input = read_line(),
    T = parseInt(input),
    str = '',
    data = [],
    me,
    res;

while (input) {
    str = read_line();
    data = str.split(' ');

    // 如果自己的票已经最高输出0
    if (Array.prototype.apply.call(data) === data[0]) {
        print('0');
    } else {
        me = data[0]; //保存自己的票数
        data.sort(function (x, y) { // 从大到小排序数组
            return y - x;
        });

        // 拉票数为自己的
        res = Math.ceil((data[0] + me) / 2);
        print(res);
    }

    input = read_line();
}



function A() {
    this.age = 20;
}