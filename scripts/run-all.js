/**
 * Runs wp-scripts for every block with one command.
 * Usage: node scripts/run-all.js <start|build> [block-name]
 */
const { spawn } = require( 'node:child_process' );
const path = require( 'node:path' );

// Add the folder name of each new block here.
const BLOCKS = [ 'faq', 'currency-converter' ];

const [ , , command, only ] = process.argv;

if ( ! [ 'start', 'build' ].includes( command ) ) {
	console.error(
		'Usage: node scripts/run-all.js <start|build> [block-name]'
	);
	process.exit( 1 );
}

const targets = only ? BLOCKS.filter( ( block ) => block === only ) : BLOCKS;

if ( ! targets.length ) {
	console.error(
		`Unknown block "${ only }". Available: ${ BLOCKS.join( ', ' ) }`
	);
	process.exit( 1 );
}

const wpScripts = path.resolve(
	__dirname,
	'..',
	'node_modules',
	'@wordpress',
	'scripts',
	'bin',
	'wp-scripts.js'
);

const run = ( block ) =>
	new Promise( ( resolve ) => {
		const base = `wp-content/mu-plugins/${ block }`;
		const child = spawn(
			process.execPath,
			[
				wpScripts,
				command,
				'--webpack-copy-php',
				'--blocks-manifest',
				`--webpack-src-dir=${ base }/src`,
				`--output-path=${ base }/build`,
			],
			{ stdio: 'inherit' }
		);
		child.on( 'exit', ( code ) => resolve( code ?? 1 ) );
	} );

( async () => {
	const codes = await Promise.all( targets.map( run ) );
	process.exit( codes.some( ( code ) => code !== 0 ) ? 1 : 0 );
} )();