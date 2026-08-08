import { z } from 'zod'
import path from 'node:path'

const absolutePath = (val: string) => path.isAbsolute(val)

const pageSchema = z.looseObject({
	key: z.enum(['home', 'resume', 'privacy']),
	title: z.string(),
	path: z.string().refine(absolutePath),
	canonicalPath: z.string().refine(absolutePath).optional(),
	description: z.string(),
	pdf: z.boolean().optional(),
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
