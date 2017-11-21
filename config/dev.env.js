const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_ROOT: '"http://disneypubworlddev.cp.disney.com/global_titles_library/search/api"'
});
