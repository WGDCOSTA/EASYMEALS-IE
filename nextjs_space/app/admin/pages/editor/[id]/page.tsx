
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PageEditorComponent } from '@/components/admin/page-editor'
import { toast } from 'react-hot-toast'

interface PageData {
  id: string
  page: string
  title: string
  slug: string
  status: string
  content: any
}

export default function PageEditorPage() {
  const params = useParams()
  const pageId = params?.id as string
  const router = useRouter()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (pageId) {
      loadPage()
    }
  }, [pageId])

  const loadPage = async () => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`)
      if (!response.ok) throw new Error('Failed to load page')
      const data = await response.json()
      setPageData(data.page)
    } catch (error) {
      console.error('Error loading page:', error)
      toast.error('Failed to load page')
      router.push('/admin/pages')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easymeals-green"></div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/pages')}
            className="text-easymeals-green hover:underline"
          >
            Back to Pages
          </button>
        </div>
      </div>
    )
  }

  return <PageEditorComponent pageData={pageData} onUpdate={loadPage} />
}
