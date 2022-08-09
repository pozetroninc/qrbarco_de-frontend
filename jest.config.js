module.exports = {
  "testEnvironment": "jsdom",
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],
  'collectCoverage': true,
  'collectCoverageFrom': [
    './src/components/*.{js,vue}',
    '!/src/App.vue',
    '!/src/main.js'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/'
}
