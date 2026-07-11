import { z } from 'zod'
import { publishedBase } from './shared'

export const organizationSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('organization'),
	label: z.string().min(1),
	location: z.string().min(1),
	logo: z.string().min(1).optional(),
	slug: z.string().min(1),
})
