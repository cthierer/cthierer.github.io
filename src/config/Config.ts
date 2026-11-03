import { z } from 'zod'
import path from 'node:path'

const absolutePath = (val: string) => path.isAbsolute(val)

export const documentFormatSchema = z.enum(['html', 'pdf', 'md', 'txt'])
export type DocumentFormat = z.infer<typeof documentFormatSchema>

const pageSchema = z
	.looseObject({
		key: z.enum(['home', 'resume', 'privacy']),
		title: z.string(),
		path: z.string().refine(absolutePath),
		canonicalPath: z.string().refine(absolutePath).optional(),
		description: z.string(),
		formats: z
			.array(documentFormatSchema)
			.nonempty('Page formats must not be empty.')
			.refine(values => new Set(values).size === values.length, 'Page formats must be unique.')
			.refine(values => values.includes('html'), 'Page formats must include html.')
			.default(['html']),
		pdf: z
			.never({ error: 'The legacy pdf field is no longer supported; use formats: [html, pdf].' })
			.optional(),
	})
	.superRefine((page, context) => {
		if (
			page.key !== 'resume' &&
			page.formats?.some(format => format === 'md' || format === 'txt')
		) {
			context.addIssue({
				code: 'custom',
				message: 'Markdown and text formats are supported only for the resume page.',
				path: ['formats'],
			})
		}
	})

export const schema = z.looseObject({
	siteUrl: z.httpUrl(),
	siteTitle: z.string(),
	favIcon: z.string(),
	profileImage: z.string().refine(absolutePath),
	socialImage: z.string().refine(absolutePath),
	resumeDownload: z.union([z.httpUrl(), z.string().refine(absolutePath)]),
	umamiWebsiteId: z.string().optional(),
	pages: z.array(pageSchema),
})

type Config = z.infer<typeof schema>

export default Config
