const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const emptyShim = path.resolve(__dirname, 'src/lib/empty.js');

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    crypto: path.resolve(__dirname, 'node_modules/expo-crypto'),
    url: emptyShim,
    path: emptyShim,
    stream: emptyShim,
    buffer: emptyShim,
    fs: emptyShim,
    os: emptyShim,
    http: emptyShim,
    https: emptyShim,
    net: emptyShim,
    zlib: emptyShim,
    http2: emptyShim,
    tls: emptyShim,
    dns: emptyShim,
    punycode: emptyShim,
    querystring: emptyShim,
    string_decoder: emptyShim,
    util: emptyShim,
    child_process: emptyShim,
    cluster: emptyShim,
    events: emptyShim,
    constants: emptyShim,
    vm: emptyShim,
    tty: emptyShim,
    timers: emptyShim,
    process: emptyShim,
    assert: emptyShim,
};

config.transformer.getTransformOptions = async () => ({
    transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
    },
});

module.exports = config;
