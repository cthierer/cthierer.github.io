import { z } from 'zod'

export const publishedBase = {
	title: z.string().min(1),
	published: z.boolean(),
}

export const dateValue = z.union([z.string().min(1), z.date()])
