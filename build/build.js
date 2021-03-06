// https://github.com/shelljs/shelljs
require('./check-versions')();

process.env.NODE_ENV = 'production';

const chalkAnimation = require('chalk-animation');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');

const animation = chalkAnimation.neon('building for production...');
animation.start();

const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
shell.rm('-rf', assetsPath);
shell.mkdir('-p', assetsPath);
shell.config.silent = true;
shell.cp('-R', 'static/*', assetsPath);
shell.config.silent = false;

webpack(webpackConfig, function (err, stats) {
    animation.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: Meant to be served over an HTTP server. Opening index.html over file:// won\'t work.\n'
    ));
});
