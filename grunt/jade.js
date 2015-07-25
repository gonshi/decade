module.exports = {
    options: {
        pretty: true,
        basedir: '<%= config.dir.src %>/jade'
    },
    compile: {
        options: {
            data: {
                prod: false,
                sc: '<%= config.jade.js %>',
                libs: '<%= config.jade.libs %>',
                dummy: '<%= config.jade.dummy %>'
            }
        },
        files: [{
            expand: true,
            cwd: '<%= config.dir.src %>/jade',
            src: '**/!(_)*.jade',
            dest: '<%= config.dir.tmp %>',
            ext: '.html'
        }]
    },
    prod: {
        options: {
            data: {
                prod: true,
                libs: '<%= config.jade.libs %>',
                dummy: '<%= config.jade.dummy %>'
            }
        },
        files: [{
            expand: true,
            cwd: '<%= config.dir.src %>/jade',
            src: '**/!(_)*.jade',
            dest: '<%= config.dir.dist %>',
            ext: '.html'
        }]
    }
};
