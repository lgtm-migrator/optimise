const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    entry: (process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : [])[
        './src/index'
    ],
    watch: process.env.NODE_ENV === 'development' ? true : false,
    target: 'node',
    externals: [nodeExternals({
        whitelist: process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : undefined
    })],
    module: {
        rules: [
            {
                test: /knex(\\|\/)lib(\\|\/)dialects(\\|\/)sqlite3(\\|\/)index\.js$/,
                use: {
                    loader: 'string-replace-loader',
                    options: {
                        multiple: [
                            { search: 'return require(\'sqlite3\')', replace: 'return require(\'optimise-sqlite\')' }
                        ],
                    },
                },
            },
            {
                test: /\.js?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                loader: 'native-ext-loader'
            }
        ]
    },
    plugins: (process.env.NODE_ENV === 'development' ? [
        new StartServerPlugin('server.js'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat([
        new webpack.NormalModuleReplacementPlugin(/pg-connection-string/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/node-pre-gyp/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/fs-migrations\.js/, `${__dirname}/db/mocks/fs-migrations.js`),
        new webpack.NormalModuleReplacementPlugin(/seed(\\|\/)index\.js/, `${__dirname}/db/mocks/seeder.js`),
        new webpack.IgnorePlugin(new RegExp('^(mssql.*|mariasql|.*oracle.*|mysql.*|pg.*|node-pre-gyp|tedious)$')),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'BUILD_TARGET': JSON.stringify('server')
            }
        }),
    ]),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'server.js'
    },
    node: {
        // We are doing this because of a bug in SwaggerUI
        __filename: false,
        __dirname: true
    }
};