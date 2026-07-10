import { z } from 'zod'
import { publishedBase, dateValue } from './shared'

export const educationSchema = z.looseObject({
	...publishedBase,
	archetype: z.union([z.literal('certificate'), z.literal('degree')]),
	degree: z.string().min(1).optional(),
	endDate: dateValue.optional(),
	gpa: z.number().optional(),
	honors: z.array(z.string().min(1)).optional(),
	institution: z.string().min(1),
	program: z.string().min(1),
	resumeInclude: z.boolean().optional(),
	startDate: dateValue.optional(),
})
