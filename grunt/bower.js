var path = require('path');
module.exports = {
    install: {
        options: {
            targetDir: '<%= config.dir.src %>',
            layout: function(type, component) {
                var makeDir = true,
                    p = {
                        css: '/css',
                        img: '/img/lib',
                        js: '/js/lib'
                    },
                    tmp,
                    _component;
                tmp = component.split('/');

                _component = tmp[1];

                if(makeDir) {
                    if(type === 'css') {
                        return path.join(_component, p.css);
                    } else if(type === 'img') {
                        return path.join(_component, p.img);
                    } else {
                        return path.join(_component, p.js);
                    }
                } else {
                    return _component;
                }
            },
            install: true,
            verbose: false,
            cleanTargetDir: false,
            cleanBowerDir: false
        }
    }
};