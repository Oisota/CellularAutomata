const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		publicPath: '/',
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: 'vue-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
					{
						loader: 'eslint-loader'
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(['./dist']),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			title: 'Cellular Automata',
			template: './src/html/index.html',
		}),
		new webpack.HashedModuleIdsPlugin(),
	],
};
