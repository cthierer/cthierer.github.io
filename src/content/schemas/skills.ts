import { z } from 'zod'
import { publishedBase } from './shared'

export const skillsSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('skills'),
	groups: z
		.array(
			z.looseObject({
				items: z.array(z.string().min(1)).min(1),
				label: z.string().min(1),
			}),
		)
		.min(1),
})
