
'use client'

import { useEffect, useState } from 'react'
import { EditorProvider } from '@/contexts/editor/editor-context'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { BlockRenderer } from '@/components/editor/block-renderer'
import { Block } from '@/lib/editor-types'
import { Toaster } from 'react-hot-toast'

interface EditablePageWrapperProps {
  pageName: string
  children: React.ReactNode
  defaultBlocks?: Block[]
}

export function EditablePageWrapper({ 
  pageName, 
  children, 
  defaultBlocks = [] 
}: EditablePageWrapperProps) {
  const [blocks, setBlocks] = useState<Block[]>(defaultBlocks)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved blocks from the server
    fetch(`/api/editor/load?page=${pageName}`)
      .then(res => res.json())
      .then(data => {
        if (data.blocks && data.blocks.length > 0) {
          setBlocks(data.blocks)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [pageName])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easymeals-green"></div>
      </div>
    )
  }

  return (
    <EditorProvider initialBlocks={blocks} pageName={pageName}>
      <Toaster position="top-right" />
      <EditorToolbar />
      
      {/* Render saved blocks if they exist */}
      {blocks.length > 0 ? (
        <div className="min-h-screen">
          {blocks.map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      ) : (
        // Render default content if no blocks are saved
        <div className="min-h-screen">
          {children}
        </div>
      )}
    </EditorProvider>
  )
}
