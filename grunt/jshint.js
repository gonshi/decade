module.exports = function(grunt) {
    return {
        options: {
            jshintrc: '.jshintrc'
        },
        all: '<%= config.files.script %>',
        each: {
            files: [{
                src: []
            }]
        }
    };
};
