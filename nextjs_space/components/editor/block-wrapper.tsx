
'use client'

import { useEditor } from '@/contexts/editor/editor-context'
import { cn } from '@/lib/utils'
import { Trash2, ChevronUp, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Block } from '@/lib/editor-types'
import { useState } from 'react'
import { BlockStyleEditor } from './block-style-editor'

interface BlockWrapperProps {
  block: Block
  children: React.ReactNode
}

export function BlockWrapper({ block, children }: BlockWrapperProps) {
  const { 
    isEditing, 
    selectedBlockId, 
    setSelectedBlockId, 
    deleteBlock, 
    moveBlock,
    blocks 
  } = useEditor()
  const [showStyleEditor, setShowStyleEditor] = useState(false)

  const isSelected = selectedBlockId === block.id
  const blockIndex = blocks.findIndex(b => b.id === block.id)
  const isFirst = blockIndex === 0
  const isLast = blockIndex === blocks.length - 1

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation()
      setSelectedBlockId(block.id)
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this block?')) {
      deleteBlock(block.id)
    }
  }

  if (!isEditing) {
    return <div style={block.styles}>{children}</div>
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative transition-all',
        isSelected && 'ring-4 ring-blue-500 ring-opacity-50'
      )}
      style={block.styles}
    >
      {children}

      {isSelected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl flex items-center space-x-2 z-10">
          <span className="text-xs font-medium capitalize">{block.type} Block</span>
          
          <div className="flex items-center space-x-1 border-l border-gray-700 pl-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-gray-800"
              onClick={() => moveBlock(block.id, 'up')}
              disabled={isFirst}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-gray-800"
              onClick={() => moveBlock(block.id, 'down')}
              disabled={isLast}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1 border-l border-gray-700 pl-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-gray-800"
              onClick={() => setShowStyleEditor(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {showStyleEditor && (
        <BlockStyleEditor
          block={block}
          onClose={() => setShowStyleEditor(false)}
        />
      )}
    </div>
  )
}
