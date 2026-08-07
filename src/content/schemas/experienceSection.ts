import { z } from 'zod'
import { publishedBase } from './shared'

export const experienceSectionSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('experience-section'),
	limit: z.number().int().positive().optional(),
})
