import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
	{
		input: 'out/src/main.js',
		output: {
			file: 'dist/main.js',
			format: 'umd',
			name: 'latexUtensils'
		},
		plugins: [
			resolve(),
			commonjs()
		]
	}
];
