
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { useEditor } from '@/contexts/editor/editor-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

interface EditableImageProps {
  blockId: string
  imageUrl: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
}

export function EditableImage({
  blockId,
  imageUrl,
  alt,
  className,
  width,
  height,
  fill = false
}: EditableImageProps) {
  const { isEditing, selectedBlockId, setSelectedBlockId, updateBlock } = useEditor()
  const [isUploading, setIsUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation()
      setSelectedBlockId(blockId)
      setShowUpload(true)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      updateBlock(blockId, {
        content: { imageUrl: data.url }
      })
      toast.success('Image uploaded successfully!')
      setShowUpload(false)
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isEditing) {
    return fill ? (
      <Image src={imageUrl} alt={alt} fill className={className} />
    ) : (
      <Image src={imageUrl} alt={alt} width={width || 500} height={height || 300} className={className} />
    )
  }

  return (
    <div className="relative group">
      {fill ? (
        <Image src={imageUrl} alt={alt} fill className={cn(className, 'transition-all')} />
      ) : (
        <Image src={imageUrl} alt={alt} width={width || 500} height={height || 300} className={cn(className, 'transition-all')} />
      )}
      
      {isEditing && (
        <div
          onClick={handleClick}
          className={cn(
            'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all cursor-pointer flex items-center justify-center',
            selectedBlockId === blockId && 'ring-4 ring-yellow-400'
          )}
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Change Image'}
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
