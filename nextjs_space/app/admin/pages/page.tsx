
'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Copy, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Page {
  id: string
  page: string
  title: string
  slug: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export default function AdminPagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPageDialog, setShowNewPageDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [newPageData, setNewPageData] = useState({
    title: '',
    slug: '',
    status: 'draft' as 'published' | 'draft'
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const response = await fetch('/api/admin/pages')
      if (!response.ok) throw new Error('Failed to load pages')
      const data = await response.json()
      setPages(data.pages || [])
    } catch (error) {
      console.error('Error loading pages:', error)
      toast.error('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePage = async () => {
    if (!newPageData.title || !newPageData.slug) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPageData)
      })

      if (!response.ok) throw new Error('Failed to create page')
      
      const data = await response.json()
      toast.success('Page created successfully!')
      setShowNewPageDialog(false)
      setNewPageData({ title: '', slug: '', status: 'draft' })
      loadPages()
      
      // Navigate to editor
      router.push(`/admin/pages/editor/${data.page.id}`)
    } catch (error) {
      console.error('Error creating page:', error)
      toast.error('Failed to create page')
    }
  }

  const handleDeletePage = async () => {
    if (!selectedPage) return

    try {
      const response = await fetch(`/api/admin/pages/${selectedPage.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete page')
      
      toast.success('Page deleted successfully!')
      setShowDeleteDialog(false)
      setSelectedPage(null)
      loadPages()
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Failed to delete page')
    }
  }

  const handleDuplicatePage = async (page: Page) => {
    try {
      const response = await fetch(`/api/admin/pages/${page.id}/duplicate`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Failed to duplicate page')
      
      toast.success('Page duplicated successfully!')
      loadPages()
    } catch (error) {
      console.error('Error duplicating page:', error)
      toast.error('Failed to duplicate page')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easymeals-green"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pages</h1>
          <p className="text-gray-600">Manage your website pages and content</p>
        </div>
        <Button onClick={() => setShowNewPageDialog(true)} className="bg-easymeals-green hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>View and manage all pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first page</p>
              <Button onClick={() => setShowNewPageDialog(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Page
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-gray-600">/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/${page.slug}`)}
                          title="View page"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/admin/pages/editor/${page.id}`)}
                          title="Edit page"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicatePage(page)}
                          title="Duplicate page"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedPage(page)
                            setShowDeleteDialog(true)
                          }}
                          title="Delete page"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Page Dialog */}
      <Dialog open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new page to your website. You can customize it in the editor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                placeholder="e.g., About Us"
                value={newPageData.title}
                onChange={(e) => {
                  const title = e.target.value
                  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  setNewPageData({ ...newPageData, title, slug })
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="e.g., about-us"
                value={newPageData.slug}
                onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                This will be the URL: {window.location.origin}/{newPageData.slug}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePage} className="bg-easymeals-green hover:bg-green-700">
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPage?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeletePage} variant="destructive">
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
