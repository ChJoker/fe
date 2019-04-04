function changeMulAttrSlow(object, attrs, callback) {
    window.clearInterval(object.timer);
    object.timer = window.setInterval(function () {
        var stop = true;
        for (var attr in attrs) {
            var cur = null, change = null;
            var target = attrs[attr];
            if (attr === 'opacity') {
                cur = parseFloat(getStyle(object, attr)) * 100;
            } else {
                cur = parseInt(getStyle(object, attr));
            }
            change = (target - cur) / 10;
            change = change > 0 ? Math.ceil(change) : Math.floor(change);
            if (cur === target) {
                continue;
            }
            stop = false;
            if (attr === 'opacity') {
                object.style[attr] = (cur + change) / 100;
            } else {
                object.style[attr] = cur + change + 'px';
            }
        }
        if (stop) {
            window.clearInterval(object.timer);
            typeof callback == 'function' && callback();
        }
    }, 30)
}


function getStyle(dom, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(dom, null)[attr];
    } else {
        return dom.currentStyle[attr];
    }
}