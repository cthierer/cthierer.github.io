import { z } from 'zod'
import { publishedBase } from './shared'

const resumeSectionBase = {
	...publishedBase,
	archetype: z.literal('resume-section'),
	order: z.number(),
}

const metricSchema = z.looseObject({
	detail: z.string().min(1).optional(),
	label: z.string().min(1),
	value: z.string().min(1),
})

const skillGroupSchema = z.looseObject({
	items: z.array(z.string().min(1)).min(1),
	label: z.string().min(1),
})

export const resumeSectionSchema = z.discriminatedUnion('kind', [
	z.looseObject({
		...resumeSectionBase,
		kind: z.literal('profile'),
		headline: z.string().min(1),
		location: z.string().min(1),
		name: z.string().min(1),
	}),
	z.looseObject({
		...resumeSectionBase,
		kind: z.literal('metrics'),
		metrics: z.array(metricSchema),
	}),
	z.looseObject({
		...resumeSectionBase,
		kind: z.literal('skills'),
		groups: z.array(skillGroupSchema).min(1),
	}),
	z.looseObject({
		...resumeSectionBase,
		kind: z.literal('prose'),
	}),
	z.looseObject({
		...resumeSectionBase,
		kind: z.literal('experience'),
		limit: z.number().int().positive().optional(),
	}),
	z.looseObject({
		...resumeSectionBase,
		kind: z.literal('education'),
	}),
])
