
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useEditor } from '@/contexts/editor/editor-context'
import { cn } from '@/lib/utils'

interface EditableTextProps {
  blockId: string
  content: string
  field: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  placeholder?: string
}

export function EditableText({
  blockId,
  content,
  field,
  className,
  as: Component = 'p',
  placeholder = 'Enter text...'
}: EditableTextProps) {
  const { isEditing, selectedBlockId, setSelectedBlockId, updateBlock } = useEditor()
  const [isEditable, setIsEditable] = useState(false)
  const [text, setText] = useState(content)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setText(content)
  }, [content])

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation()
      setSelectedBlockId(blockId)
      setIsEditable(true)
    }
  }

  const handleBlur = () => {
    setIsEditable(false)
    if (text !== content) {
      updateBlock(blockId, {
        content: { [field]: text }
      })
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.textContent || '')
  }

  if (!isEditing) {
    return React.createElement(Component, { className }, content)
  }

  return (
    <div
      ref={ref}
      contentEditable={isEditable}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onInput={handleInput}
      className={cn(
        className,
        'outline-none',
        isEditing && 'cursor-text hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 transition-all',
        isEditable && 'ring-2 ring-blue-500',
        selectedBlockId === blockId && !isEditable && 'ring-2 ring-yellow-400'
      )}
      data-placeholder={placeholder}
    >
      {text || placeholder}
    </div>
  )
}
