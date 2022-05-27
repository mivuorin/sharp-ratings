// eslint-disable-next-line no-undef
module.exports = {
  verbose: true,
  automock: false,
  resetMocks: true,
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: [
    './jest.setupAfterEnv.js',
    '@testing-library/jest-dom/extend-expect',
  ],
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.jsx?$': 'babel-jest',
  },
  //moduleNameMapper: { '^.+\\.(css|less|scss)$': 'babel-jest' },
  transformIgnorePatterns: ['node_modules/(?!(@smui|@material))'],
  moduleFileExtensions: ['js', 'jsm', 'svelte'],
  testEnvironment: 'jsdom',
};
