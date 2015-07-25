module.exports = {
    options: {
        mangle: {
            except: ['$', '_', 'namespace']
        }
    },
    apps: {
        files: {
            '<%= config.dir.dist %>/js/app.min.js': ['<%= config.dir.dist %>/js/app.js']
        }
    }
};
