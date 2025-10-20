
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, FileText } from 'lucide-react'

interface PageContent {
  id: string
  page: string
  content: any
  updatedAt: string
}

export default function ContentManagementPage() {
  const [pages, setPages] = useState<PageContent[]>([])
  const [selectedPage, setSelectedPage] = useState<string>('')
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPages()
  }, [])

  useEffect(() => {
    if (selectedPage) {
      loadPageContent(selectedPage)
    }
  }, [selectedPage])

  const loadPages = async () => {
    try {
      const res = await fetch('/api/admin/content')
      const data = await res.json()
      setPages(data)
      if (data.length > 0 && !selectedPage) {
        setSelectedPage(data[0].page)
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to load pages:', error)
      setLoading(false)
    }
  }

  const loadPageContent = async (page: string) => {
    try {
      const res = await fetch(`/api/admin/content/${page}`)
      const data = await res.json()
      setContent(data.content || {})
    } catch (error) {
      console.error('Failed to load page content:', error)
      setContent({})
    }
  }

  const saveContent = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/content/${selectedPage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (res.ok) {
        alert('Content saved successfully!')
        loadPages()
      } else {
        alert('Failed to save content')
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      alert('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading content...</div>
  }

  const availablePages = [
    { value: 'homepage', label: 'Homepage' },
    { value: 'combos-meals', label: 'Combos Meals' },
    { value: 'kids-meals', label: 'Kids Meals' },
    { value: 'halal-meals', label: 'Halal Meals' },
    { value: 'student-life', label: 'Student Life' },
    { value: 'health-fitness', label: 'Health & Fitness' },
    { value: 'busy-life', label: 'Busy Life' },
    { value: 'about', label: 'About Us' },
    { value: 'how-it-works', label: 'How It Works' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Edit page content dynamically without changing code
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Page Selector */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availablePages.map((page) => (
                <button
                  key={page.value}
                  onClick={() => setSelectedPage(page.value)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${selectedPage === page.value
                      ? 'bg-[#1c7430] text-white'
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Edit {availablePages.find(p => p.value === selectedPage)?.label || 'Page'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedPage === 'homepage' && (
              <>
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={content.heroTitle || ''}
                    onChange={(e) => updateField('heroTitle', e.target.value)}
                    placeholder="Main headline on homepage"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={content.heroSubtitle || ''}
                    onChange={(e) => updateField('heroSubtitle', e.target.value)}
                    placeholder="Secondary text below headline"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="ctaText">Call to Action Button Text</Label>
                  <Input
                    id="ctaText"
                    value={content.ctaText || ''}
                    onChange={(e) => updateField('ctaText', e.target.value)}
                    placeholder="Button text"
                  />
                </div>
                <div>
                  <Label htmlFor="ctaLink">Call to Action Link</Label>
                  <Input
                    id="ctaLink"
                    value={content.ctaLink || ''}
                    onChange={(e) => updateField('ctaLink', e.target.value)}
                    placeholder="/meals"
                  />
                </div>
              </>
            )}

            {(selectedPage === 'combos-meals' || selectedPage === 'kids-meals' || 
              selectedPage === 'halal-meals' || selectedPage === 'student-life' ||
              selectedPage === 'health-fitness' || selectedPage === 'busy-life') && (
              <>
                <div>
                  <Label htmlFor="pageTitle">Page Title</Label>
                  <Input
                    id="pageTitle"
                    value={content.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Page title"
                  />
                </div>
                <div>
                  <Label htmlFor="pageDescription">Page Description</Label>
                  <Textarea
                    id="pageDescription"
                    value={content.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Page description"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Hero Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={content.imageUrl || ''}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/624px-No-Image-Placeholder.svg.png"
                  />
                </div>
              </>
            )}

            {selectedPage === 'about' && (
              <>
                <div>
                  <Label htmlFor="aboutTitle">About Title</Label>
                  <Input
                    id="aboutTitle"
                    value={content.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="About us title"
                  />
                </div>
                <div>
                  <Label htmlFor="aboutContent">About Content</Label>
                  <Textarea
                    id="aboutContent"
                    value={content.content || ''}
                    onChange={(e) => updateField('content', e.target.value)}
                    placeholder="About us content"
                    rows={8}
                  />
                </div>
              </>
            )}

            {selectedPage === 'how-it-works' && (
              <>
                <div>
                  <Label htmlFor="howTitle">Title</Label>
                  <Input
                    id="howTitle"
                    value={content.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="How it works title"
                  />
                </div>
                <div>
                  <Label htmlFor="howSubtitle">Subtitle</Label>
                  <Textarea
                    id="howSubtitle"
                    value={content.subtitle || ''}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    placeholder="How it works subtitle"
                    rows={2}
                  />
                </div>
              </>
            )}

            {/* Generic JSON Editor for advanced users */}
            <div className="pt-6 border-t">
              <Label htmlFor="jsonContent">Advanced: JSON Content Editor</Label>
              <Textarea
                id="jsonContent"
                value={JSON.stringify(content, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setContent(parsed)
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="font-mono text-sm"
                rows={10}
              />
              <p className="text-xs text-gray-500 mt-2">
                Edit the raw JSON for advanced customization
              </p>
            </div>

            <Button
              onClick={saveContent}
              disabled={saving}
              className="w-full bg-[#1c7430] hover:bg-[#155225]"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Content'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
