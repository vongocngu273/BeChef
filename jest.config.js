const path = require('path');

module.exports = {
  projects: [
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/tests/recipe.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/tests/App.test.jsx', '<rootDir>/tests/recipeApi.test.js'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
      moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
      moduleNameMapper: {
        '^react$': path.resolve(__dirname, 'node_modules/react'),
        '^react/(.*)$': path.resolve(__dirname, 'node_modules/react/$1'),
        '^react-dom$': path.resolve(__dirname, 'node_modules/react-dom'),
        '^react-dom/(.*)$': path.resolve(__dirname, 'node_modules/react-dom/$1'),
        '\\.(css|less|scss|sass)$': path.resolve(__dirname, 'tests/styleMock.js')
      },
      transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
      }
    }
  ]
};
