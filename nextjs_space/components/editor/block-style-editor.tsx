
'use client'

import { useState } from 'react'
import { Block } from '@/lib/editor-types'
import { useEditor } from '@/contexts/editor/editor-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BlockStyleEditorProps {
  block: Block
  onClose: () => void
}

export function BlockStyleEditor({ block, onClose }: BlockStyleEditorProps) {
  const { updateBlock } = useEditor()
  const [styles, setStyles] = useState(block.styles)
  const [content, setContent] = useState(block.content)

  const handleSave = () => {
    updateBlock(block.id, { styles, content })
    onClose()
  }

  const updateStyle = (key: string, value: string) => {
    setStyles(prev => ({ ...prev, [key]: value }))
  }

  const updateContent = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.type} Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Content</h3>
            
            {content.heading !== undefined && (
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  value={content.heading}
                  onChange={(e) => updateContent('heading', e.target.value)}
                />
              </div>
            )}

            {content.subheading !== undefined && (
              <div className="space-y-2">
                <Label>Subheading</Label>
                <Input
                  value={content.subheading}
                  onChange={(e) => updateContent('subheading', e.target.value)}
                />
              </div>
            )}

            {content.text !== undefined && (
              <div className="space-y-2">
                <Label>Text</Label>
                <textarea
                  value={content.text}
                  onChange={(e) => updateContent('text', e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                />
              </div>
            )}

            {content.buttonText !== undefined && (
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={content.buttonText}
                  onChange={(e) => updateContent('buttonText', e.target.value)}
                />
              </div>
            )}

            {content.buttonLink !== undefined && (
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={content.buttonLink}
                  onChange={(e) => updateContent('buttonLink', e.target.value)}
                />
              </div>
            )}

            {content.buttonVariant !== undefined && (
              <div className="space-y-2">
                <Label>Button Style</Label>
                <Select
                  value={content.buttonVariant}
                  onValueChange={(value) => updateContent('buttonVariant', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Styles Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Styles</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={styles.backgroundColor || ''}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={styles.textColor || '#000000'}
                    onChange={(e) => updateStyle('textColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={styles.textColor || ''}
                    onChange={(e) => updateStyle('textColor', e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                  value={styles.padding || ''}
                  onChange={(e) => updateStyle('padding', e.target.value)}
                  placeholder="2rem"
                />
              </div>

              <div className="space-y-2">
                <Label>Margin</Label>
                <Input
                  value={styles.margin || ''}
                  onChange={(e) => updateStyle('margin', e.target.value)}
                  placeholder="1rem 0"
                />
              </div>

              <div className="space-y-2">
                <Label>Text Align</Label>
                <Select
                  value={styles.textAlign || 'left'}
                  onValueChange={(value) => updateStyle('textAlign', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Input
                  value={styles.fontSize || ''}
                  onChange={(e) => updateStyle('fontSize', e.target.value)}
                  placeholder="1rem"
                />
              </div>

              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={styles.fontWeight || 'normal'}
                  onValueChange={(value) => updateStyle('fontWeight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semibold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Input
                  value={styles.borderRadius || ''}
                  onChange={(e) => updateStyle('borderRadius', e.target.value)}
                  placeholder="0.5rem"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
