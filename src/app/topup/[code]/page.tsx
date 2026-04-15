import React from 'react';
import type { Metadata } from 'next';
import TopUpDetailsClient from '@/components/topup/TopUpDetailsClient';
import { notFound } from 'next/navigation';

async function fetchProductDetails(code: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.gammingbazaar.com';
    const res = await fetch(`${apiUrl}/api/topup-detail/${code}`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params; // ✅ await করা হলো
  const product = await fetchProductDetails(code);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested top-up package does not exist or is unavailable.',
    };
  }

  const title = `${product.name} Top Up Bangladesh`;
  const description = `Buy ${product.name} instantly through Bkash and Nagad. Fast and reliable top up service in Bangladesh for ${product.name}.`;

  let ogImageUrl = '';
  if (product.gallery) {
    ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/storage/products/${product.gallery}`;
  }

  return {
    title,
    description,
    keywords: [product.name, `${product.name} topup bangladesh`, `buy ${product.name} bkash`, 'game topup bd'],
    openGraph: {
      title,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gammingbazaar.com'}/topup/${code}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

// Page component
export default async function TopUpDetailsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params; // ✅ await করা হলো
  const product = await fetchProductDetails(code);

  if (!product) {
    // Next.js 15 way to show 404
    notFound();
  }

  return <TopUpDetailsClient product={product} />;
}