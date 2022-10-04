/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig);
