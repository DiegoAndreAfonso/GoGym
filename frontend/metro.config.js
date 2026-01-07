const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
});
