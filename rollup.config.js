import path from 'path';
import fs from 'fs';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import visualizer from 'rollup-plugin-visualizer';
import jsxPlugin from '@babel/plugin-transform-react-jsx';

const { version } = require(path.resolve(__dirname, './package.json')); // eslint-disable-line

try {
  const qextInputPath = path.resolve(__dirname, './assets/sn-scatter-plot.qext');
  const qextOutputPath = path.resolve(__dirname, './dist/sn-scatter-plot.qext');
  const qext = fs.readFileSync(qextInputPath, 'utf8').replace('__PACKAGE_VERSION__', version);
  fs.writeFileSync(qextOutputPath, qext);
} catch (err) {
  throw Error(`error while updating version in qext file: ${err}`);
}

export default {
  input: './src/index.js',
  output: {
    file: path.resolve(__dirname, 'dist', 'sn-scatter-plot.js'),
    name: 'Scatterplot',
    format: 'umd',
    exports: 'default',
    sourcemap: true,
    globals: {
      '@nebula.js/stardust': 'stardust',
      'picasso.js': 'picassojs',
      'picasso-plugin-q': 'picassoQ',
      'picasso-plugin-hammer': 'picassojs',
      hammerjs: 'Hammer',
    },
  },
  external: ['@nebula.js/stardust', 'picasso.js', 'picasso-plugin-q', 'picasso-plugin-hammer'],
  plugins: [
    replace({
      __PACKAGE_VERSION__: version,
    }),
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    external(),
    babel({
      babelrc: false,
      include: ['src/**'],
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            targets: {
              browsers: ['last 2 Chrome versions'],
            },
          },
        ],
        ['@babel/react'],
      ],
      plugins: [[jsxPlugin]],
    }),
    commonjs(),
    visualizer(),
  ],
};