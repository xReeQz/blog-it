var path = require('path');
var context = path.resolve(__dirname, 'public/js');
var output = path.resolve(__dirname, 'public/bundle')
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	context: context,
	entry: {
		article: './article.js',
		signup: './signup.js',
		main: './main.js'
	},
	output: {
		path: output,
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.woff2($|(\?v=.*))/,
				loader: 'file'
			},
			{
				test: /\.woff($|(\?v=.*))/,
				loader: 'file'
			},
			{
				test: /\.ttf($|(\?v=.*))/,
				loader: 'file'
			},
			{
				test: /\.eot($|(\?v=.*))/,
				loader: 'file'
			},
			{
				test: /\.svg($|(\?v=.*))/,
				loader: 'file'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css!resolve-url')
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style', 'css!resolve-url!less')
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin('bundle.css', { allChunks: true }),
		new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
		new webpack.optimize.CommonsChunkPlugin('bundle.js')
	]
};
