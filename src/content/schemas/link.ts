import { z } from 'zod'
import { publishedBase } from './shared'

export const linkSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('link'),
	areas: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
	href: z.string().min(1),
	icon: z.string().min(1).optional(),
	label: z.string().min(1),
	order: z.number().optional(),
})
