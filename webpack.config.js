const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

let target = 'web';
let mode = 'development';
let plugins = [
	new MiniCssExtractPlugin(),
	new HtmlWebpackPlugin({
		template: './src/index.html',
		inject: false
	})
];

if (process.env.NODE_ENV === 'production') {
	mode = 'production';
	target = 'browserslist';
} else {
	plugins.push(new ESLintPlugin({
		extensions: ['js', 'jsx']
	}));
}

let isDev = mode === 'development';

module.exports = {
	mode: mode,
	target: target,
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'images/[hash][ext][query]',
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.(s[ac]|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: ''
						} 
					}, 
					'css-loader', 
					'postcss-loader',
					'sass-loader'
				]
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource'
				// type: 'asset', // little image in base64
				// parser: {
				// 	dataUrlCondition: {
				// 		maxSize: 30 * 1024 //30Kb
				// 	}
				// }
			},
			{
				test: /\.(ttf|woff2?|eon|otf)$/,
				type: 'asset/resource'
			}
		]
	},
	plugins: plugins,
	resolve: {
		extensions: ['.js', '.jsx']
	},
	devtool: isDev ? 'source-map' : false,
	devServer: {
		contentBase: './dist',
		open: true,
		hot: true
	}
};