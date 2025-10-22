
import Head from 'next/head'

interface SEOMetaTagsProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noIndex?: boolean
  structuredData?: object
}

export default function SEOMetaTags({
  title = 'EasyMeals.ie - Fresh Ready Meals Delivered',
  description = 'Order delicious, healthy ready meals online. Fresh ingredients, chef-prepared, delivered across Ireland.',
  keywords = ['ready meals', 'meal delivery', 'fresh food', 'Ireland'],
  image = '/logo.png',
  url,
  type = 'website',
  noIndex = false,
  structuredData
}: SEOMetaTagsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://easymeals.abacusai.app'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImage = image?.startsWith('http') ? image : `${baseUrl}${image}`

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="EasyMeals.ie" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="en-IE" />
      <meta name="geo.region" content="IE" />
      <meta name="geo.placename" content="Ireland" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </>
  )
}

// Helper function to generate product structured data
export function generateProductSchema(product: {
  name: string
  description: string
  price: number
  imageUrl: string
  sku?: string
  calories?: number
  category?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://easymeals.abacusai.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl?.startsWith('http') ? product.imageUrl : `${baseUrl}${product.imageUrl}`,
    sku: product.sku || 'N/A',
    offers: {
      '@type': 'Offer',
      url: baseUrl,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'EasyMeals.ie'
      }
    },
    brand: {
      '@type': 'Brand',
      name: 'EasyMeals.ie'
    },
    category: product.category || 'Ready Meals',
    ...(product.calories && {
      nutrition: {
        '@type': 'NutritionInformation',
        calories: `${product.calories} calories`
      }
    })
  }
}

// Helper function to generate organization structured data
export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://easymeals.abacusai.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EasyMeals.ie',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Fresh ready meals delivered across Ireland. Healthy, delicious, and convenient.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@easymeals.ie'
    },
    sameAs: [
      // Add social media URLs here
    ]
  }
}
