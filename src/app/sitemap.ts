
import { MetadataRoute } from 'next'

export const revalidate = 3600 // 1 hour cache

async function fetchProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/all-products`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://freefiretopupbd.com'

  const products = await fetchProducts()
  console.log("PRODUCTS IN SITEMAP:", products) // debug

  const productUrls: MetadataRoute.Sitemap = products.map(
    (product: any) => ({
      url: `${baseUrl}/topup/${product.slug || product.code}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  )

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/topup`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...productUrls,
  ]
}






// import { MetadataRoute } from 'next'

// export default function sitemap(): MetadataRoute.Sitemap {
//   const baseUrl =
//     process.env.NEXT_PUBLIC_SITE_URL || 'https://freefiretopupbd.com'

//   return [
//     // 🏠 Main pages
//     {
//       url: `${baseUrl}`,
//       lastModified: new Date(),
//       changeFrequency: 'daily',
//       priority: 1,
//     },
//     {
//       url: `${baseUrl}/topup`,
//       lastModified: new Date(),
//       changeFrequency: 'daily',
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/faq`,
//       lastModified: new Date(),
//       changeFrequency: 'daily',
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/contact`,
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.7,
//     },

//     // 🎮 Manual products (example)
//     {
//       url: `${baseUrl}/topup/free-fire-uid-top-up-bd`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/topup/free-fire-level-up-pass-bd`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/topup/free-fire-top-up-indonesia`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/topup/free-fire-bd-monthly-top-up`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/topup/free-fire-bd-weekly-top-up`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     },
//   ]
// }





