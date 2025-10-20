
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Check, X, Eye, TrendingUp, Users } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Affiliate {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  referralCode: string
  commissionRate: number
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED'
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  createdAt: string
  referrals: Array<{ id: string; orderAmount: number; commission: number }>
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [filteredAffiliates, setFilteredAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadAffiliates()
  }, [])

  useEffect(() => {
    filterAffiliates()
  }, [searchQuery, statusFilter, affiliates])

  const loadAffiliates = async () => {
    try {
      const res = await fetch('/api/affiliates')
      const data = await res.json()
      setAffiliates(data)
      setFilteredAffiliates(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load affiliates:', error)
      toast.error('Failed to load affiliates')
      setLoading(false)
    }
  }

  const filterAffiliates = () => {
    let filtered = affiliates

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.referralCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }

    setFilteredAffiliates(filtered)
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/affiliates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update affiliate')

      toast.success('Affiliate status updated successfully!')
      loadAffiliates()
    } catch (error) {
      console.error('Error updating affiliate:', error)
      toast.error('Failed to update affiliate')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      case 'REJECTED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const stats = {
    total: affiliates.length,
    approved: affiliates.filter((a) => a.status === 'APPROVED').length,
    pending: affiliates.filter((a) => a.status === 'PENDING').length,
    totalEarnings: affiliates.reduce((sum, a) => sum + a.totalEarnings, 0)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Affiliate Partners</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Affiliates</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-easymeals-green opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold mt-2">{stats.approved}</p>
              </div>
              <Check className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold mt-2">{stats.pending}</p>
              </div>
              <Eye className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings Paid</p>
                <p className="text-3xl font-bold mt-2">€{stats.totalEarnings.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-easymeals-orange opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, email, or referral code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-easymeals-green"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Affiliates List */}
      <div className="space-y-4">
        {filteredAffiliates.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-gray-500">No affiliates found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAffiliates.map((affiliate) => (
            <Card key={affiliate.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{affiliate.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          affiliate.status
                        )}`}
                      >
                        {affiliate.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{affiliate.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Referral Code</p>
                        <p className="font-bold text-easymeals-orange">{affiliate.referralCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Commission Rate</p>
                        <p className="font-medium">{affiliate.commissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Earnings</p>
                        <p className="font-medium">€{affiliate.totalEarnings.toFixed(2)}</p>
                      </div>
                    </div>
                    {affiliate.company && (
                      <p className="text-sm text-gray-500 mt-2">Company: {affiliate.company}</p>
                    )}
                  </div>

                  {affiliate.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateStatus(affiliate.id, 'APPROVED')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateStatus(affiliate.id, 'REJECTED')}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {affiliate.status === 'APPROVED' && (
                    <Button
                      onClick={() => updateStatus(affiliate.id, 'SUSPENDED')}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Suspend
                    </Button>
                  )}

                  {affiliate.status === 'SUSPENDED' && (
                    <Button
                      onClick={() => updateStatus(affiliate.id, 'APPROVED')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
