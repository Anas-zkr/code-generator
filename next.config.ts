import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the project root to the current directory
    root: path.join(__dirname),
  },
};

export default nextConfig;