const { build } = require('esbuild');
const { esbuildPluginTsc } = require('esbuild-plugin-tsc');
const { dependencies, peerDependencies } = require('./package.json');
//const { Generator } = require('npm-dts'); // requries yarn add npm-dts --dev

// new Generator({
//   entry: 'src/index.ts',
//   output: 'dist/index.d.ts',
// }).generate();

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  minify: false,
  // only needed if you have dependencies
  // external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
  sourcemap: true,
  platform: 'browser',
  format: 'esm',
  plugins: [
    esbuildPluginTsc({
      force: true,
      //tsconfigPath: './tsconfig.json' // already used by default, but only some properties from tsconfig are used
    }),
  ],
});