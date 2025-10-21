
export type BlockType = 
  | 'hero'
  | 'text'
  | 'image'
  | 'button'
  | 'card'
  | 'carousel'
  | 'grid'
  | 'testimonial'
  | 'feature'
  | 'cta'
  | 'spacer'

export interface Block {
  id: string
  type: BlockType
  content: {
    text?: string
    heading?: string
    subheading?: string
    imageUrl?: string
    imageAlt?: string
    buttonText?: string
    buttonLink?: string
    buttonVariant?: 'default' | 'outline' | 'ghost'
    [key: string]: any
  }
  styles: {
    backgroundColor?: string
    textColor?: string
    padding?: string
    margin?: string
    textAlign?: 'left' | 'center' | 'right'
    fontSize?: string
    fontWeight?: string
    borderRadius?: string
    [key: string]: any
  }
  order: number
}

export interface PageData {
  id?: string
  page: string
  blocks: Block[]
}
