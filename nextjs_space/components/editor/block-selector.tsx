
'use client'

import { useState } from 'react'
import { X, Type, Image as ImageIcon, MousePointer, Grid3x3, Star, Zap, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditor } from '@/contexts/editor/editor-context'
import { Block, BlockType } from '@/lib/editor-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const blockTemplates: Array<{ type: BlockType; label: string; icon: any; template: Partial<Block> }> = [
  {
    type: 'text',
    label: 'Text Block',
    icon: Type,
    template: {
      content: {
        text: 'Edit this text...',
        heading: 'Heading Text'
      },
      styles: {
        textAlign: 'left',
        padding: '2rem',
        fontSize: '1rem'
      }
    }
  },
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    template: {
      content: {
        imageUrl: '/placeholder-image.jpg',
        imageAlt: 'Image description'
      },
      styles: {
        padding: '1rem'
      }
    }
  },
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    template: {
      content: {
        buttonText: 'Click Me',
        buttonLink: '#',
        buttonVariant: 'default'
      },
      styles: {
        textAlign: 'center',
        padding: '2rem'
      }
    }
  },
  {
    type: 'hero',
    label: 'Hero Section',
    icon: Zap,
    template: {
      content: {
        heading: 'Welcome to Our Site',
        subheading: 'Discover amazing products',
        buttonText: 'Get Started',
        buttonLink: '/meals',
        imageUrl: '/hero-bg.jpg'
      },
      styles: {
        backgroundColor: '#10b981',
        textColor: '#ffffff',
        padding: '4rem 2rem',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'card',
    label: 'Card',
    icon: Square,
    template: {
      content: {
        heading: 'Card Title',
        text: 'Card description goes here...',
        imageUrl: '/placeholder-image.jpg',
        buttonText: 'Learn More',
        buttonLink: '#'
      },
      styles: {
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem'
      }
    }
  },
  {
    type: 'grid',
    label: 'Grid Layout',
    icon: Grid3x3,
    template: {
      content: {
        columns: 3,
        items: [
          { heading: 'Feature 1', text: 'Description', icon: '✓' },
          { heading: 'Feature 2', text: 'Description', icon: '✓' },
          { heading: 'Feature 3', text: 'Description', icon: '✓' }
        ]
      },
      styles: {
        padding: '3rem 1rem',
        gap: '2rem'
      }
    }
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: Star,
    template: {
      content: {
        text: 'This is an amazing service!',
        author: 'Customer Name',
        role: 'Cork, Ireland',
        rating: 5,
        imageUrl: '/avatar-placeholder.jpg'
      },
      styles: {
        padding: '2rem',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: Square,
    template: {
      content: {},
      styles: {
        padding: '2rem'
      }
    }
  }
]

export function BlockSelector({ onClose }: { onClose: () => void }) {
  const { addBlock, selectedBlockId, blocks } = useEditor()

  const handleSelectBlock = (template: typeof blockTemplates[0]) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      content: template.template.content || {},
      styles: template.template.styles || {},
      order: blocks.length
    }

    // If a block is selected, insert after it
    if (selectedBlockId) {
      const index = blocks.findIndex(b => b.id === selectedBlockId)
      addBlock(newBlock, index + 1)
    } else {
      addBlock(newBlock)
    }

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Block</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {blockTemplates.map((template) => {
            const Icon = template.icon
            return (
              <button
                key={template.type}
                onClick={() => handleSelectBlock(template)}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-easymeals-green hover:bg-green-50 transition-all group"
              >
                <Icon className="h-8 w-8 mb-3 text-gray-600 group-hover:text-easymeals-green" />
                <span className="text-sm font-medium text-center">{template.label}</span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
