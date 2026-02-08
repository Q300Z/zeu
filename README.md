# Zeu.js (Modernized)

![Build Status](https://travis-ci.org/shzlw/zeu.svg?branch=master)
[![license: MIT](https://img.shields.io/badge/license-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/zeu.svg)](https://www.npmjs.com/package/zeu)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/Coverage-%3E90%25-brightgreen.svg)]()

Zeu.js is a **100% TypeScript** library featuring a collection of prebuilt visualization components for building real-time TV dashboards, monitoring UIs, and IoT web interfaces.

## 🚀 Key Features (Modernized)

- **Strict TypeScript**: Fully typed API for better developer experience and zero `any` usage.
- **High Performance**: 
  - **Offscreen Canvas**: Pre-rendering of static elements to minimize CPU/GPU load.
  - **Intelligent Rendering**: Automatic dirty-checking to skip redundant redraws.
  - **HiDPI/Retina Support**: Automatic scaling for crystal-clear visuals on high-resolution screens.
- **Dynamic Theming**: Global `ThemeManager` to switch between Light, Dark, or Custom themes in real-time.
- **Robustness**: 
  - **Comprehensive Tests**: 75+ unit tests with >90% code coverage.
  - **Memory Safe**: Systematic resource cleanup in every component.

## What's New

### [System 002](https://shzlw.github.io/zeu/examples/system-002.html)
A complex real-time system monitoring demonstration using Network Graphs, Hex Grids, and more.

![system-002](https://github.com/shzlw/zeu/blob/master/examples/system-002.gif)

## Installation

From dist
```html
<script src="dist/zeu.min.js"></script>
```

NPM
```bash
npm i zeu
```

CDN
```html
<script src="https://cdn.jsdelivr.net/npm/zeu"></script>
```

## Quick Start

```html
<!-- Include zeu.js. -->
<script src="dist/zeu.js"></script>
<!-- Create a canvas. -->
<canvas id="text-meter" width="200" height="100"></canvas>
<script>
  // Create a Zeu TextMeter.
  var textMeter = new zeu.TextMeter('text-meter');
  // Update display and percentage value.
  textMeter.displayValue = 'ZEU';
  textMeter.value = 50;
</script>
```

## Development

Zeu.js now uses a modern development stack:

- **Build**: `npm run build` (Webpack 5)
- **Development**: `npm run dev`
- **Tests**: `npm test` (Vitest)
- **Lint**: `npx eslint src/*.ts`

## Framework Integration

Zeu.js works natively with any framework. See `examples/react-wrapper.tsx` for a clean implementation example using React Hooks.

## [Documentation](https://shzlw.github.io/zeu/docs/introduction.html)

## License

[MIT](http://opensource.org/licenses/MIT)
