
'use client'

import { Block } from '@/lib/editor-types'
import { BlockWrapper } from './block-wrapper'
import { EditableText } from './editable-text'
import { EditableImage } from './editable-image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  return (
    <BlockWrapper block={block}>
      {block.type === 'text' && (
        <div>
          {block.content.heading && (
            <EditableText
              blockId={block.id}
              content={block.content.heading}
              field="heading"
              as="h2"
              className="text-3xl font-bold mb-4"
            />
          )}
          <EditableText
            blockId={block.id}
            content={block.content.text || ''}
            field="text"
            as="p"
            className="text-lg"
          />
        </div>
      )}

      {block.type === 'image' && (
        <div className="relative w-full" style={{ minHeight: '200px' }}>
          <EditableImage
            blockId={block.id}
            imageUrl={block.content.imageUrl || '/placeholder-image.jpg'}
            alt={block.content.imageAlt || 'Image'}
            className="w-full h-auto rounded-lg"
            width={1200}
            height={600}
          />
        </div>
      )}

      {block.type === 'button' && (
        <div className="flex justify-center">
          <Button
            variant={block.content.buttonVariant as any || 'default'}
            size="lg"
            asChild
          >
            <Link href={block.content.buttonLink || '#'}>
              <EditableText
                blockId={block.id}
                content={block.content.buttonText || 'Button'}
                field="buttonText"
                as="span"
              />
            </Link>
          </Button>
        </div>
      )}

      {block.type === 'hero' && (
        <div className="relative overflow-hidden">
          {block.content.imageUrl && (
            <div className="absolute inset-0 z-0">
              <EditableImage
                blockId={block.id}
                imageUrl={block.content.imageUrl}
                alt="Hero background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
          <div className="relative z-10 container mx-auto px-4 py-20">
            <EditableText
              blockId={block.id}
              content={block.content.heading || 'Hero Heading'}
              field="heading"
              as="h1"
              className="text-5xl md:text-6xl font-bold mb-6"
            />
            {block.content.subheading && (
              <EditableText
                blockId={block.id}
                content={block.content.subheading}
                field="subheading"
                as="p"
                className="text-xl md:text-2xl mb-8"
              />
            )}
            {block.content.buttonText && (
              <Button size="lg" asChild>
                <Link href={block.content.buttonLink || '#'}>
                  <EditableText
                    blockId={block.id}
                    content={block.content.buttonText}
                    field="buttonText"
                    as="span"
                  />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {block.type === 'card' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {block.content.imageUrl && (
            <div className="relative h-48">
              <EditableImage
                blockId={block.id}
                imageUrl={block.content.imageUrl}
                alt={block.content.heading || 'Card image'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <EditableText
              blockId={block.id}
              content={block.content.heading || 'Card Title'}
              field="heading"
              as="h3"
              className="text-2xl font-bold mb-3"
            />
            <EditableText
              blockId={block.id}
              content={block.content.text || 'Card description'}
              field="text"
              as="p"
              className="text-gray-600 mb-4"
            />
            {block.content.buttonText && (
              <Button asChild>
                <Link href={block.content.buttonLink || '#'}>
                  <EditableText
                    blockId={block.id}
                    content={block.content.buttonText}
                    field="buttonText"
                    as="span"
                  />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {block.type === 'grid' && (
        <div 
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${block.content.columns || 3}, 1fr)`
          }}
        >
          {block.content.items?.map((item: any, index: number) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="text-xl font-bold mb-2">{item.heading}</h4>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {block.type === 'testimonial' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            {Array.from({ length: block.content.rating || 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <EditableText
            blockId={block.id}
            content={block.content.text || 'Testimonial text'}
            field="text"
            as="p"
            className="text-lg italic mb-4"
          />
          <div className="flex items-center">
            {block.content.imageUrl && (
              <div className="relative w-12 h-12 mr-4">
                <EditableImage
                  blockId={block.id}
                  imageUrl={block.content.imageUrl}
                  alt={block.content.author || 'Author'}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <EditableText
                blockId={block.id}
                content={block.content.author || 'Author Name'}
                field="author"
                as="p"
                className="font-bold"
              />
              <EditableText
                blockId={block.id}
                content={block.content.role || 'Role'}
                field="role"
                as="p"
                className="text-sm text-gray-600"
              />
            </div>
          </div>
        </div>
      )}

      {block.type === 'spacer' && (
        <div style={{ height: block.styles.padding || '2rem' }} />
      )}
    </BlockWrapper>
  )
}
