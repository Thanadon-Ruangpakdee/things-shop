/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zwnuvmfhxfmpkffuvflj.supabase.co', // URL โปรเจกต์ของเพื่อน
        port: '',
        pathname: '/storage/v1/object/public/**', // อนุญาตทุกรูปในถัง Public
      },
    ],
  },
};

export default nextConfig;