const withOffline = require("next-offline");
const GenerateServiceWorkerEnvVaresWebpackPlugin = require("./webpack-plugins/generateServiceWorkerEnvVariables");

module.exports = withOffline({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.plugins.push(
      new GenerateServiceWorkerEnvVaresWebpackPlugin({
        outputFilename: "sw-env-vars.js",
        envKeys: [
          "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
          "NEXT_PUBLIC_FIREBASE_APP_ID",
          "NEXT_PUBLIC_FIREBASE_API_KEY",
          "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        ],
      })
    );

    // Important: return the modified config
    return config;
  },
  workboxOpts: {
    swDest: process.env.NEXT_EXPORT
      ? "service-worker.js"
      : "static/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/service-worker.js",
        destination: "/_next/static/service-worker.js",
      },
    ];
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "avatars1.githubusercontent.com",
      "avatars2.githubusercontent.com",
      "avatars3.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
});
