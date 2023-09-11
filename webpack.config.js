const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
	entry: {
		index: path.resolve(__dirname, 'src/views', 'main-screen', 'main-screen.ts'),
        details: path.resolve(__dirname, 'src/views', 'details-screen', 'details-screen.ts'),
        favorites: path.resolve(__dirname, 'src/views', 'favorites-screen', 'favorites-screen.ts')
	}, 

	output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }, 

	module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

	resolve: {
        extensions: ['.ts', '.js', '.css'],

        alias: {
            assets: path.resolve(__dirname, 'src/assets')
        }
    },

	plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src/views', 'main-screen', 'main-screen.html'),
            chunks: ['index'] 
        }),
        new HtmlWebpackPlugin({
            filename: 'details.html',
            template: path.resolve(__dirname, 'src/views', 'details-screen', 'details-screen.html'),
            chunks: ['details'] 
        }),
        new HtmlWebpackPlugin({
            filename: 'favorites.html',
            template: path.resolve(__dirname, 'src/views', 'favorites-screen', 'favorites-screen.html'),
            chunks: ['favorites'] 
        }),
        
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/assets', to: 'assets'}
            ]
        })
    ],

    devtool: 'source-map',

    devServer:{
        liveReload: true,
        port: 8080,
        static:{
            directory: path.resolve(__dirname, 'dist')
        },
        watchFiles:{
            paths: ['src']
        }
    },

    // Otimização
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    }
};