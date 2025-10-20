
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Save, MapPin, Eye, EyeOff } from 'lucide-react'

interface DeliveryZone {
  id: string
  name: string
  areas: string[]
  deliveryFee: number
  isActive: boolean
}

export default function SettingsPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadZones()
  }, [])

  const loadZones = async () => {
    try {
      const res = await fetch('/api/admin/settings/delivery-zones')
      const data = await res.json()
      setZones(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load zones:', error)
      setLoading(false)
    }
  }

  const saveZone = async (zone: DeliveryZone) => {
    try {
      const url = zone.id 
        ? `/api/admin/settings/delivery-zones/${zone.id}`
        : '/api/admin/settings/delivery-zones'
      
      const res = await fetch(url, {
        method: zone.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone)
      })

      if (res.ok) {
        loadZones()
        setShowForm(false)
        setEditingZone(null)
      }
    } catch (error) {
      console.error('Failed to save zone:', error)
    }
  }

  const deleteZone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery zone?')) return

    try {
      const res = await fetch(`/api/admin/settings/delivery-zones/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadZones()
      }
    } catch (error) {
      console.error('Failed to delete zone:', error)
    }
  }

  const toggleZoneStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/settings/delivery-zones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (res.ok) {
        loadZones()
      }
    } catch (error) {
      console.error('Failed to toggle zone status:', error)
    }
  }

  const startEdit = (zone: DeliveryZone) => {
    setEditingZone(zone)
    setShowForm(true)
  }

  const startNew = () => {
    setEditingZone({
      id: '',
      name: '',
      areas: [],
      deliveryFee: 0,
      isActive: true
    })
    setShowForm(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-sm text-gray-600 mt-1">Manage delivery zones and site configuration</p>
        </div>
        {!showForm && (
          <Button onClick={startNew} className="bg-[#1c7430] hover:bg-[#155225]">
            <Plus className="w-4 h-4 mr-2" />
            Add Delivery Zone
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && editingZone && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingZone.id ? 'Edit Delivery Zone' : 'New Delivery Zone'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="zoneName">Zone Name *</Label>
              <Input
                id="zoneName"
                value={editingZone.name}
                onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                placeholder="e.g., Cork City Center"
              />
            </div>

            <div>
              <Label htmlFor="deliveryFee">Delivery Fee (€) *</Label>
              <Input
                id="deliveryFee"
                type="number"
                step="0.01"
                value={editingZone.deliveryFee}
                onChange={(e) => setEditingZone({ ...editingZone, deliveryFee: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="areas">Areas (comma-separated) *</Label>
              <Input
                id="areas"
                value={editingZone.areas.join(', ')}
                onChange={(e) => setEditingZone({ 
                  ...editingZone, 
                  areas: e.target.value.split(',').map(a => a.trim()).filter(a => a) 
                })}
                placeholder="e.g., Douglas, Ballincollig, Blackrock"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple areas with commas
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingZone.isActive}
                onChange={(e) => setEditingZone({ ...editingZone, isActive: e.target.checked })}
                className="rounded border-gray-300 text-[#1c7430] focus:ring-[#1c7430]"
              />
              <Label htmlFor="isActive" className="ml-2 cursor-pointer">
                Zone is active
              </Label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={() => saveZone(editingZone)}
                className="bg-[#1c7430] hover:bg-[#155225]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Zone
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingZone(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Zones List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Delivery Zones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zones.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No delivery zones configured
              </p>
            ) : (
              zones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{zone.name}</h4>
                      <button
                        onClick={() => toggleZoneStatus(zone.id, zone.isActive)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          zone.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {zone.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Areas: {zone.areas.join(', ')}
                    </p>
                    <p className="text-sm font-medium text-[#1c7430] mt-1">
                      Delivery Fee: €{zone.deliveryFee.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(zone)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteZone(zone.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
