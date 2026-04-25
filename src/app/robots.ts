import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.freefiretopupbd.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/profile/',
        '/api/',
        '/checkout/',
        '/*?page=',
        '/*&page=',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}