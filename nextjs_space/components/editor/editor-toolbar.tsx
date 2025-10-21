
'use client'

import { Save, Eye, Edit3, X, Plus, Undo, Redo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditor } from '@/contexts/editor/editor-context'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { BlockSelector } from './block-selector'

export function EditorToolbar() {
  const { 
    isEditing, 
    setIsEditing, 
    savePage, 
    isSaving, 
    hasUnsavedChanges 
  } = useEditor()
  const [showBlockSelector, setShowBlockSelector] = useState(false)

  const handleSave = async () => {
    try {
      await savePage()
      toast.success('Page saved successfully!')
    } catch (error) {
      toast.error('Failed to save page')
    }
  }

  const handleToggleEdit = () => {
    if (isEditing && hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Do you want to discard them?')) {
        return
      }
    }
    setIsEditing(!isEditing)
  }

  if (!isEditing) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsEditing(true)}
          size="lg"
          className="bg-easymeals-green hover:bg-green-700 shadow-xl rounded-full px-6 py-6"
        >
          <Edit3 className="mr-2 h-5 w-5" />
          Edit Page
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="fixed top-20 left-0 right-0 z-50 bg-gray-900 text-white shadow-xl border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg">Editor Mode</span>
              {hasUnsavedChanges && (
                <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                  Unsaved changes
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowBlockSelector(true)}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Block
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>

              <Button
                onClick={handleToggleEdit}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                <X className="mr-2 h-4 w-4" />
                Exit Editor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showBlockSelector && (
        <BlockSelector onClose={() => setShowBlockSelector(false)} />
      )}
    </>
  )
}
