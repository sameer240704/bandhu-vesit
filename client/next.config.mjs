/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "t3.ftcdn.net",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "clunyfarm.co.za"
            }
        ],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/en",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
