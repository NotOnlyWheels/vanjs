(function () {
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
        },

        obj: {
            a: 1,
            b: 2,
            c: 3
        },

        arr: [1, 2, 3]

    };

    window.Test = Test;
})();