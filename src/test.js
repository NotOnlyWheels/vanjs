function A () {
    this.name = 'jiavan'
}
A.prototype.age = '20';

var a = new A();
for (var key in a) {
    console.log(a[key])
}

$().each([1,2,3,4], function(index, element) {
    element += index;
});