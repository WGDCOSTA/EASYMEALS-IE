
'use client'

import { useState, useCallback } from 'react'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Settings, 
  Layout, 
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Block {
  id: string
  type: string
  content: any
  styles: any
}

interface PageEditorProps {
  pageData: {
    id: string
    title: string
    slug: string
    status: string
    content: any
  }
  onUpdate: () => void
}

const BLOCK_TYPES = [
  { value: 'hero', label: 'Hero Section', icon: '🎯' },
  { value: 'text', label: 'Text Block', icon: '📝' },
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'button', label: 'Button', icon: '🔘' },
  { value: 'card', label: 'Card', icon: '🃏' },
  { value: 'grid', label: 'Grid', icon: '⬜' },
  { value: 'feature', label: 'Feature Section', icon: '⭐' },
  { value: 'cta', label: 'Call to Action', icon: '📢' },
  { value: 'spacer', label: 'Spacer', icon: '↕️' }
]

export function PageEditorComponent({ pageData, onUpdate }: PageEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(pageData.title)
  const [slug, setSlug] = useState(pageData.slug)
  const [status, setStatus] = useState(pageData.status)
  const [blocks, setBlocks] = useState<Block[]>(pageData.content?.blocks || [])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState('design')
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/pages/${pageData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          status,
          content: { blocks }
        })
      })

      if (!response.ok) throw new Error('Failed to save')
      
      toast.success('Page saved successfully!')
      setHasChanges(false)
      onUpdate()
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to save page')
    } finally {
      setIsSaving(false)
    }
  }

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    }
    setBlocks([...blocks, newBlock])
    setSelectedBlockId(newBlock.id)
    setHasChanges(true)
  }

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId))
    if (selectedBlockId === blockId) setSelectedBlockId(null)
    setHasChanges(true)
  }

  const duplicateBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return
    
    const newBlock = {
      ...block,
      id: `block-${Date.now()}`
    }
    const index = blocks.findIndex(b => b.id === blockId)
    setBlocks([...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)])
    setHasChanges(true)
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return
    
    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    setBlocks(newBlocks)
    setHasChanges(true)
  }

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => 
      b.id === blockId 
        ? { ...b, ...updates, content: { ...b.content, ...updates.content }, styles: { ...b.styles, ...updates.styles } }
        : b
    ))
    setHasChanges(true)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/pages')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="border-l border-gray-300 h-6"></div>
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-xs text-gray-500">/{slug}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {hasChanges && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Unsaved changes
              </span>
            )}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={cn(
                  "p-2 rounded transition-colors",
                  previewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                )}
                title="Desktop view"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={cn(
                  "p-2 rounded transition-colors",
                  previewMode === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                )}
                title="Tablet view"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={cn(
                  "p-2 rounded transition-colors",
                  previewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                )}
                title="Mobile view"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/${slug}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              size="sm"
              className="bg-easymeals-green hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Blocks List */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Add Blocks</h3>
            <div className="space-y-2">
              {BLOCK_TYPES.map((blockType) => (
                <button
                  key={blockType.value}
                  onClick={() => addBlock(blockType.value)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-easymeals-green hover:bg-green-50 transition-colors text-left"
                >
                  <span className="text-2xl">{blockType.icon}</span>
                  <span className="text-sm font-medium">{blockType.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Page Blocks ({blocks.length})</h3>
            <div className="space-y-2">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    selectedBlockId === block.id
                      ? 'border-easymeals-green bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">{block.type}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveBlock(block.id, 'up')
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move up"
                      >
                        <MoveUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveBlock(block.id, 'down')
                        }}
                        disabled={index === blocks.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="Move down"
                      >
                        <MoveDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateBlock(block.id)
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Duplicate"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteBlock(block.id)
                        }}
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {block.content.heading || block.content.text || 'Empty block'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div
            className={cn(
              "mx-auto bg-white shadow-lg min-h-[600px] transition-all",
              previewMode === 'desktop' && 'max-w-full',
              previewMode === 'tablet' && 'max-w-3xl',
              previewMode === 'mobile' && 'max-w-md'
            )}
          >
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Layout className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No blocks yet</h3>
                  <p className="text-gray-500 mb-4">Start building your page by adding blocks from the left sidebar</p>
                </div>
              </div>
            ) : (
              blocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={cn(
                    "relative group cursor-pointer transition-all",
                    selectedBlockId === block.id && "ring-2 ring-easymeals-green ring-offset-2"
                  )}
                >
                  <BlockPreview block={block} />
                  {selectedBlockId === block.id && (
                    <div className="absolute top-2 right-2 flex space-x-1 bg-white shadow-lg rounded-lg p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateBlock(block.id)
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteBlock(block.id)
                        }}
                        className="p-2 hover:bg-red-100 text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="border-b border-gray-200">
              <TabsList className="w-full grid grid-cols-2 h-12 bg-transparent">
                <TabsTrigger value="design" className="data-[state=active]:bg-gray-100">
                  <Settings className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gray-100">
                  <Code className="h-4 w-4 mr-2" />
                  Page
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="design" className="p-4 space-y-4 mt-0">
              {selectedBlock ? (
                <BlockEditor block={selectedBlock} onUpdate={(updates) => updateBlock(selectedBlock.id, updates)} />
              ) : (
                <div className="flex items-center justify-center h-64 text-center text-gray-500">
                  <div>
                    <Settings className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm">Select a block to edit its properties</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4 mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page-title">Page Title</Label>
                  <Input
                    id="page-title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      setHasChanges(true)
                    }}
                    placeholder="Enter page title"
                  />
                </div>

                <div>
                  <Label htmlFor="page-slug">URL Slug</Label>
                  <Input
                    id="page-slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setHasChanges(true)
                    }}
                    placeholder="page-url"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: {window.location.origin}/{slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="page-status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value)
                      setHasChanges(true)
                    }}
                  >
                    <SelectTrigger id="page-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Block Preview Component
function BlockPreview({ block }: { block: Block }) {
  const style = {
    backgroundColor: block.styles.backgroundColor,
    color: block.styles.textColor,
    padding: block.styles.padding || '2rem',
    margin: block.styles.margin,
    textAlign: block.styles.textAlign || 'left',
    ...block.styles
  }

  switch (block.type) {
    case 'hero':
      return (
        <div style={style} className="py-20">
          <h1 className="text-4xl font-bold mb-4">{block.content.heading || 'Hero Heading'}</h1>
          <p className="text-lg mb-6">{block.content.subheading || 'Hero subheading text'}</p>
          {block.content.buttonText && (
            <button className="px-6 py-3 bg-easymeals-green text-white rounded-lg">
              {block.content.buttonText}
            </button>
          )}
        </div>
      )
    
    case 'text':
      return (
        <div style={style}>
          {block.content.heading && <h2 className="text-2xl font-bold mb-4">{block.content.heading}</h2>}
          <p className="whitespace-pre-wrap">{block.content.text || 'Enter your text here...'}</p>
        </div>
      )
    
    case 'image':
      return (
        <div style={style}>
          {block.content.imageUrl ? (
            <img
              src={block.content.imageUrl}
              alt={block.content.imageAlt || 'Image'}
              className="w-full h-auto"
            />
          ) : (
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <span className="text-gray-400">No image selected</span>
            </div>
          )}
        </div>
      )
    
    case 'button':
      return (
        <div style={style}>
          <button className="px-6 py-3 bg-easymeals-green text-white rounded-lg hover:bg-green-700 transition-colors">
            {block.content.buttonText || 'Button Text'}
          </button>
        </div>
      )
    
    case 'spacer':
      return <div style={{ height: block.content.height || '2rem', ...style }} />
    
    default:
      return (
        <div style={style} className="p-8 border-2 border-dashed border-gray-300">
          <p className="text-gray-500">Block type: {block.type}</p>
        </div>
      )
  }
}

// Block Editor Component
function BlockEditor({ block, onUpdate }: { block: Block; onUpdate: (updates: Partial<Block>) => void }) {
  switch (block.type) {
    case 'hero':
    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              value={block.content.heading || ''}
              onChange={(e) => onUpdate({ content: { ...block.content, heading: e.target.value } })}
              placeholder="Enter heading"
            />
          </div>
          <div>
            <Label htmlFor="text">Text</Label>
            <Textarea
              id="text"
              value={block.content.text || block.content.subheading || ''}
              onChange={(e) => onUpdate({ content: { ...block.content, text: e.target.value, subheading: e.target.value } })}
              placeholder="Enter text content"
              rows={6}
            />
          </div>
          {block.type === 'hero' && (
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={block.content.buttonText || ''}
                onChange={(e) => onUpdate({ content: { ...block.content, buttonText: e.target.value } })}
                placeholder="Button text (optional)"
              />
            </div>
          )}
          <StyleEditor styles={block.styles} onUpdate={(styles) => onUpdate({ styles })} />
        </div>
      )
    
    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              value={block.content.imageUrl || ''}
              onChange={(e) => onUpdate({ content: { ...block.content, imageUrl: e.target.value } })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="image-alt">Alt Text</Label>
            <Input
              id="image-alt"
              value={block.content.imageAlt || ''}
              onChange={(e) => onUpdate({ content: { ...block.content, imageAlt: e.target.value } })}
              placeholder="Describe the image"
            />
          </div>
          <StyleEditor styles={block.styles} onUpdate={(styles) => onUpdate({ styles })} />
        </div>
      )
    
    case 'button':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              value={block.content.buttonText || ''}
              onChange={(e) => onUpdate({ content: { ...block.content, buttonText: e.target.value } })}
              placeholder="Click me"
            />
          </div>
          <div>
            <Label htmlFor="button-link">Link URL</Label>
            <Input
              id="button-link"
              value={block.content.buttonLink || ''}
              onChange={(e) => onUpdate({ content: { ...block.content, buttonLink: e.target.value } })}
              placeholder="/page or https://..."
            />
          </div>
          <StyleEditor styles={block.styles} onUpdate={(styles) => onUpdate({ styles })} />
        </div>
      )
    
    case 'spacer':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="spacer-height">Height</Label>
            <Input
              id="spacer-height"
              value={block.content.height || '2rem'}
              onChange={(e) => onUpdate({ content: { ...block.content, height: e.target.value } })}
              placeholder="2rem, 50px, etc."
            />
          </div>
        </div>
      )
    
    default:
      return <div className="text-gray-500 text-sm">No editor available for this block type</div>
  }
}

// Style Editor Component
function StyleEditor({ styles, onUpdate }: { styles: any; onUpdate: (styles: any) => void }) {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700">Styling</h4>
      
      <div>
        <Label htmlFor="bg-color">Background Color</Label>
        <Input
          id="bg-color"
          type="color"
          value={styles.backgroundColor || '#ffffff'}
          onChange={(e) => onUpdate({ ...styles, backgroundColor: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="text-color">Text Color</Label>
        <Input
          id="text-color"
          type="color"
          value={styles.textColor || '#000000'}
          onChange={(e) => onUpdate({ ...styles, textColor: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="text-align">Text Alignment</Label>
        <Select
          value={styles.textAlign || 'left'}
          onValueChange={(value) => onUpdate({ ...styles, textAlign: value })}
        >
          <SelectTrigger id="text-align">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="padding">Padding</Label>
        <Input
          id="padding"
          value={styles.padding || '2rem'}
          onChange={(e) => onUpdate({ ...styles, padding: e.target.value })}
          placeholder="e.g., 2rem, 20px 40px"
        />
      </div>
    </div>
  )
}

// Helper functions
function getDefaultContent(type: string) {
  switch (type) {
    case 'hero':
      return { heading: 'Welcome!', subheading: 'This is a hero section', buttonText: 'Get Started' }
    case 'text':
      return { heading: 'Text Block', text: 'Enter your text here...' }
    case 'image':
      return { imageUrl: '', imageAlt: '' }
    case 'button':
      return { buttonText: 'Click me', buttonLink: '#' }
    case 'spacer':
      return { height: '2rem' }
    default:
      return {}
  }
}

function getDefaultStyles(type: string) {
  return {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    padding: '2rem',
    textAlign: 'left'
  }
}
