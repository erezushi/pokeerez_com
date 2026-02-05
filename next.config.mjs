/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.*', '172.16.0.*'],
  async rewrites() {
    return [
      // Path case insensitivity
      {
        source: '/youTube',
        destination: '/YouTube',
      },
      {
        source: '/twitch',
        destination: '/Twitch',
      },
      {
        source: '/schedule',
        destination: '/Schedule',
      },
      {
        source: '/twitter',
        destination: '/Twitter',
      },
      {
        source: '/bluesky',
        destination: '/Bluesky',
      },
      {
        source: '/collection',
        destination: '/Collection',
      },
      {
        source: '/erorBros',
        destination: '/ErOrBros',
      },
      {
        source: '/randomizer',
        destination: '/Randomizer',
      },
      {
        source: '/nameGame',
        destination: '/NameGame',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/GuessWho',
        destination: 'https://github.com/erezushi/pokeerez_com/tree/master/app/api/game',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
