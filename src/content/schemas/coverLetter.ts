import { z } from 'zod'
import { dateValue, publishedBase } from './shared'

const recipientSchema = z.looseObject({
	organization: z.string().min(1),
	name: z.string().min(1).optional(),
	title: z.string().min(1).optional(),
	address: z.array(z.string().min(1)).optional(),
})

const senderSchema = z.looseObject({
	name: z.string().min(1).optional(),
})

export const coverLetterSchema = z.looseObject({
	...publishedBase,
	archetype: z.literal('cover-letter'),
	date: dateValue.refine(value => !Number.isNaN(new Date(value).valueOf()), {
		message: 'Cover letter date must be a valid date.',
	}),
	recipient: recipientSchema,
	sender: senderSchema.optional(),
	greeting: z.string().min(1),
	subject: z.string().min(1).optional(),
	closing: z.string().min(1).optional(),
})
