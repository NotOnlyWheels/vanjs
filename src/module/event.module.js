Van.Event = function (src, props) {
    if (!(this instanceof Van.Event)) {
        return new Van.Event(src, props);
    }

    // src是原生事件对象
    if (src && src.type) {
        this.originalEvent = src;
        this.type = src.type;
        this.isDefaultPrevented = src.defaultPrevented;
    } else {
        this.type = src;
    }
};

