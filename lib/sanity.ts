import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

// Image URL builder
const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Type definitions for our schemas
export interface Recipe {
  _id: string
  _type: 'recipe'
  title: string
  slug: {
    current: string
  }
  publishedDate: string
  coverImage?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
  introduction?: string
  body?: Array<any>
  yield?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  ingredientSections: Array<{
    title?: string
    ingredients: string[]
  }>
  instructions: string[]
  notes?: string[]
  categories?: Array<{
    _ref: string
    _type: 'reference'
  }>
  tags?: string[]
}

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: {
    current: string
  }
  description?: string
}
