module.exports = {
    unit: {
        configFile: 'karma.conf.js',
        options: {
            files: '<%= config.files.testFiles %>',
            exclude: ['src/js/main.js']
        }
    }
};
