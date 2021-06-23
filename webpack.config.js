const path = require("path");

module.exports = {
	entry: "./src/index.ts",
	mode: 'production',
	output: {
		filename: "drag-handler.min.js",
		globalObject: 'this',
		path: path.resolve(__dirname, "dist"),
		library: {
			name: 'dragHandler',
			type: 'umd'
		},

	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	}
};
