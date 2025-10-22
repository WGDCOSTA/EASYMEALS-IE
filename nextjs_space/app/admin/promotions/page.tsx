
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Promotion {
  id: string
  title: string
  description: string
  code: string | null
  discountType: string
  discountValue: number
  minPurchase: number | null
  maxDiscount: number | null
  startDate: string
  endDate: string
  isActive: boolean
  usageLimit: number | null
  usedCount: number
  targetAudience: string | null
  imageUrl: string | null
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    usageLimit: '',
    targetAudience: 'all',
    imageUrl: ''
  })

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    try {
      const res = await fetch('/api/promotions/admin')
      const data = await res.json()
      setPromotions(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load promotions:', error)
      toast.error('Failed to load promotions')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = '/api/promotions/admin'
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId ? { id: editingId, ...formData } : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(editingId ? 'Promotion updated!' : 'Promotion created!')
        setShowForm(false)
        setEditingId(null)
        resetForm()
        loadPromotions()
      } else {
        toast.error('Failed to save promotion')
      }
    } catch (error) {
      console.error('Error saving promotion:', error)
      toast.error('Failed to save promotion')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id)
    setFormData({
      title: promo.title,
      description: promo.description,
      code: promo.code || '',
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      minPurchase: promo.minPurchase?.toString() || '',
      maxDiscount: promo.maxDiscount?.toString() || '',
      startDate: promo.startDate.split('T')[0],
      endDate: promo.endDate.split('T')[0],
      isActive: promo.isActive,
      usageLimit: promo.usageLimit?.toString() || '',
      targetAudience: promo.targetAudience || 'all',
      imageUrl: promo.imageUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return

    try {
      const res = await fetch(`/api/promotions/admin?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Promotion deleted!')
        loadPromotions()
      } else {
        toast.error('Failed to delete promotion')
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
      toast.error('Failed to delete promotion')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
      usageLimit: '',
      targetAudience: 'all',
      imageUrl: ''
    })
  }

  const filteredPromotions = promotions.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading && promotions.length === 0) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Promotions</h2>
          <p className="text-sm text-gray-600 mt-1">Manage promotional offers and discounts</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          New Promotion
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Promotion' : 'Create New Promotion'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="code">Promo Code</Label>
                  <Input id="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="SUMMER20" />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <select id="discountType" value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input id="discountValue" type="number" step="0.01" value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="minPurchase">Min Purchase (€)</Label>
                  <Input id="minPurchase" type="number" step="0.01" value={formData.minPurchase} onChange={(e) => setFormData({...formData, minPurchase: e.target.value})} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Promotions ({filteredPromotions.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder="Search promotions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPromotions.map((promo) => (
              <div key={promo.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{promo.title}</h3>
                      <Badge className={promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {promo.code && (
                        <Badge variant="outline" className="font-mono">{promo.code}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Discount: {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `€${promo.discountValue}`}</span>
                      <span>Valid: {new Date(promo.startDate).toLocaleDateString('en-IE')} - {new Date(promo.endDate).toLocaleDateString('en-IE')}</span>
                      {promo.usageLimit && <span>Limit: {promo.usedCount}/{promo.usageLimit}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(promo)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(promo.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
