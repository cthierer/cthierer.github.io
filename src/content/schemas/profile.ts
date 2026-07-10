import { z } from 'zod'
import { publishedBase } from './shared'

export const profileSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('profile'),
	headline: z.string().min(1),
	location: z.string().min(1),
	name: z.string().min(1),
})
