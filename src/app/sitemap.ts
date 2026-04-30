
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

/* ---------------------------
   BLOGS FETCH
----------------------------*/
async function fetchBlogs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) return { data: [] }

    return res.json()
  } catch {
    return { data: [] }
  }
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://freefiretopupbd.com'

  const products = await fetchProducts()
  console.log("PRODUCTS IN SITEMAP:", products) // debug

    /* BLOGS */
  const blogResponse = await fetchBlogs()
  const blogs = blogResponse ?? []

  console.log("PRODUCTS:", products)
  console.log("BLOGS:", blogs)

  const productUrls: MetadataRoute.Sitemap = products.map(
    (product: any) => ({
      url: `${baseUrl}/topup/${product.slug || product.code}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  )

  /* ---------------------------
     BLOG URLs
  ----------------------------*/
  const blogUrls: MetadataRoute.Sitemap = blogs.map(
    (blog: any) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at),
      changeFrequency: 'weekly',
      priority: 0.7,
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

    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },

    ...productUrls,
    ...blogUrls,
  ]
}



