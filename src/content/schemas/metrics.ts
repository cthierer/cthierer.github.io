import { z } from 'zod'
import { publishedBase } from './shared'

export const metricsSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('metrics'),
	metrics: z
		.array(
			z.looseObject({
				detail: z.string().min(1).optional(),
				label: z.string().min(1),
				value: z.string().min(1),
			}),
		)
		.min(1),
})
