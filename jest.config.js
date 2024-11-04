/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  rootDir: "./test",
  transform: {
    "^.+.tsx?$": ["ts-jest",{tsconfig: "tsconfig-test.json"}],
  },
  watchPathIgnorePatterns: ['test-data/*'],
  testPathIgnorePatterns: ['test-data/*']
  
};