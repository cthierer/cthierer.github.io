import { z } from 'zod'
import { publishedBase } from './shared'

export const articleSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('article'),
	order: z.number().optional(),
})
