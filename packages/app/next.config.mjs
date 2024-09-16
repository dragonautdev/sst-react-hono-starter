/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "avatars.githubusercontent.com", // for github users url
      },
      {
        hostname: "api.dicebear.com", // for the avatar url
      },
      {
        hostname: "lh3.googleusercontent.com", // for Google account urls
      },
    ],
  },
};

export default nextConfig;
