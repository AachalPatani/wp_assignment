module.exports = {
	transform: {
		'\\.[jt]sx?$': [
			'babel-jest',
			{
				configFile: false,
				babelrc: false,
				presets: [
					[ '@babel/preset-env', { targets: { node: 'current' } } ],
				],
			},
		],
	},
};