var path = require('path');
var context = path.resolve(__dirname, 'public/js');
var output = path.resolve(__dirname, 'public/bundle')
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	context: context,
	entry: './entry.js',
	output: {
		path: output,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.woff2$/,
				loader: 'file'
			},
			{
				test: /\.woff$/,
				loader: 'file'
			},
			{
				test: /\.ttf$/,
				loader: 'file'
			},
			{
				test: /\.eot$/,
				loader: 'file'
			},
			{
				test: /\.svg$/,
				loader: 'file'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css!resolve-url')
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css!resolve-url!sass?sourceMap')
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin('bundle.css', { allChunks: true }),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
};
