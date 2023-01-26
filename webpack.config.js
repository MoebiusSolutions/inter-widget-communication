var path = require('path');

module.exports = function(env, argv) {
    return {
        entry: { index: path.resolve(__dirname, "src", "index.ts") },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'build'),
            clean: true,
            library: {
                name: '@moesol/inter-widget-communication',
                type: 'umd',
            },
        },

        resolve: {
            extensions: ['.ts', '.js', '.json'],
        },

        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
            ],
        },
    };
};
