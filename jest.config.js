module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  clearMocks: true,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/tests/$1',
    '^.+\\.module\\.(css|sass|scss)$': '<rootDir>/tests/cssModuleMapper.js',
  },
  setupTestFrameworkScriptFile: '<rootDir>/tests/setup.js',
  snapshotSerializers: ['jest-serializer-html'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/tests/unit/**/*.test.(js|jsx)',
    '**/__tests__/*.test.(js|jsx)',
  ],
  testURL: 'http://localhost',
  transform: {
    '.+\\.(css|sass|scss)$': '<rootDir>/tests/cssTransformer.js',
    '.+\\.(png|jpg|svg|gif|ttf|woff|woff2)$':
      '<rootDir>/tests/fileTransformer.js',
    '^.+\\.jsx?$': 'babel-jest',
  },
};
