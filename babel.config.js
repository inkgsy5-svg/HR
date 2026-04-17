module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': '.',
            '@app': './app',
            '@modules': './modules',
            '@services': './services',
            '@store': './store',
            '@hooks': './hooks',
            '@types': './types',
            '@utils': './utils',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
