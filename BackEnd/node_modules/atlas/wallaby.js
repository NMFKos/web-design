module.exports = function() {
  return {
    testFramework: 'jest',
    files: ['src/**/*', {pattern: '**/*.test.js', ignore: true}],
    tests: [
      'src/**/__tests__/**/*.test.js',
    ],
    env: {
      type: 'node',
      runner: 'node',
    },
    workers: {
      recycle: true,
    },
    debug: false,
  };
};
