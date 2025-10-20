
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, X, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  category: string
}

interface SectionProduct {
  id: string
  productId: string
  displayOrder: number
  product: Product
}

interface ProductSection {
  id: string
  name: string
  title: string
  description: string | null
  sectionProducts: SectionProduct[]
}

export default function EditSectionPage() {
  const params = useParams()
  const router = useRouter()
  const [section, setSection] = useState<ProductSection | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSection()
    loadProducts()
  }, [params.id])

  const loadSection = async () => {
    try {
      const res = await fetch(`/api/product-sections/${params.id}`)
      const data = await res.json()
      setSection(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load section:', error)
      toast.error('Failed to load section')
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setAllProducts(data.filter((p: Product) => p !== null))
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const addProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/product-sections/${params.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, displayOrder: section?.sectionProducts.length || 0 })
      })

      if (!res.ok) throw new Error('Failed to add product')

      toast.success('Product added successfully!')
      loadSection()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    }
  }

  const removeProduct = async (productId: string) => {
    try {
      const res = await fetch(
        `/api/product-sections/${params.id}/products?productId=${productId}`,
        { method: 'DELETE' }
      )

      if (!res.ok) throw new Error('Failed to remove product')

      toast.success('Product removed successfully!')
      loadSection()
    } catch (error) {
      console.error('Error removing product:', error)
      toast.error('Failed to remove product')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!section) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl">Section not found</div>
      </div>
    )
  }

  const currentProductIds = section.sectionProducts.map((sp) => sp.productId)
  const availableProducts = allProducts.filter(
    (p) => !currentProductIds.includes(p.id) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/sections')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sections
        </Button>
        <h1 className="text-3xl font-bold">{section.title}</h1>
        <p className="text-gray-600 mt-2">{section.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Products */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">
              Current Products ({section.sectionProducts.length})
            </h2>
            {section.sectionProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No products added yet. Add products from the right panel.
              </p>
            ) : (
              <div className="space-y-3">
                {section.sectionProducts.map((sp) => (
                  <div
                    key={sp.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={sp.product.imageUrl}
                        alt={sp.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{sp.product.name}</h3>
                      <p className="text-sm text-gray-500">€{sp.product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeProduct(sp.productId)}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Products */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Add Products</h2>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {availableProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {searchQuery ? 'No products found.' : 'All products have been added.'}
                </p>
              ) : (
                availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">€{product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addProduct(product.id)}
                    >
                      <Plus className="w-4 h-4 text-green-600" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
