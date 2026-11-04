import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Old menu and wine list PDF links, shared before the files were renamed, open the current ones.
  async redirects() {
    return [
      { source: '/pdf/kismet-menu-october-2026.pdf', destination: '/pdf/kismet-menu-november-2026.pdf', permanent: false },
      { source: '/pdf/kismet-wine-list-october-2026.pdf', destination: '/pdf/kismet-wine-list-november-2026.pdf', permanent: false },
    ]
  },
}

export default nextConfig
