module.exports = {
  preset: 'jest-expo',
  setupFilesAfterFramework: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@store/(.*)$': '<rootDir>/store/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'modules/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
  ],
};
