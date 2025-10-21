
'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Block, PageData } from '@/lib/editor-types'

interface EditorContextType {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  selectedBlockId: string | null
  setSelectedBlockId: (id: string | null) => void
  blocks: Block[]
  setBlocks: (blocks: Block[]) => void
  updateBlock: (blockId: string, updates: Partial<Block>) => void
  addBlock: (block: Block, index?: number) => void
  deleteBlock: (blockId: string) => void
  moveBlock: (blockId: string, direction: 'up' | 'down') => void
  savePage: () => Promise<void>
  isSaving: boolean
  hasUnsavedChanges: boolean
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ 
  children, 
  initialBlocks = [],
  pageName 
}: { 
  children: React.ReactNode
  initialBlocks?: Block[]
  pageName: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, ...updates, content: { ...block.content, ...updates.content }, styles: { ...block.styles, ...updates.styles } }
          : block
      )
    )
    setHasUnsavedChanges(true)
  }, [])

  const addBlock = useCallback((block: Block, index?: number) => {
    setBlocks(prev => {
      const newBlocks = [...prev]
      if (index !== undefined) {
        newBlocks.splice(index, 0, block)
      } else {
        newBlocks.push(block)
      }
      // Reorder
      return newBlocks.map((b, i) => ({ ...b, order: i }))
    })
    setHasUnsavedChanges(true)
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId).map((b, i) => ({ ...b, order: i })))
    setSelectedBlockId(null)
    setHasUnsavedChanges(true)
  }, [])

  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === blockId)
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newBlocks = [...prev]
      const [movedBlock] = newBlocks.splice(index, 1)
      newBlocks.splice(newIndex, 0, movedBlock)
      
      return newBlocks.map((b, i) => ({ ...b, order: i }))
    })
    setHasUnsavedChanges(true)
  }, [])

  const savePage = useCallback(async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/editor/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pageName,
          blocks
        })
      })
      
      if (!response.ok) throw new Error('Failed to save')
      
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving page:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [blocks, pageName])

  return (
    <EditorContext.Provider
      value={{
        isEditing,
        setIsEditing,
        selectedBlockId,
        setSelectedBlockId,
        blocks,
        setBlocks,
        updateBlock,
        addBlock,
        deleteBlock,
        moveBlock,
        savePage,
        isSaving,
        hasUnsavedChanges
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider')
  }
  return context
}
