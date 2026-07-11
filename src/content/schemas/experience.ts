import { z } from 'zod'
import { publishedBase, dateValue } from './shared'

export const experienceSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('experience'),
	endDate: dateValue.optional(),
	focusAreas: z.array(z.string()).optional(),
	jobTitle: z.string().min(1),
	location: z.string().min(1),
	organization: z.string().min(1),
	resume: z
		.looseObject({
			highlights: z.array(z.string().min(1)).optional(),
			summary: z.string().min(1).optional(),
		})
		.optional(),
	resumeInclude: z.boolean().optional(),
	role: z.string().min(1),
	startDate: dateValue,
	type: z.string().min(1),
})
