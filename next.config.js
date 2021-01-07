const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    // disable PWA when running in local dev mode
    disable: process.env.NODE_ENV === 'production' ? false : true,
    dest: 'public',
    runtimeCaching,
  },
})
