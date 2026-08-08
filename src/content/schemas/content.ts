import { z } from 'zod'
import { articleSchema } from './article'
import { educationSchema } from './education'
import { experienceSchema } from './experience'
import { linkSchema } from './link'
import { organizationSchema } from './organization'
import { resumeSectionSchema } from './resumeSection'

export const contentSchema = z.discriminatedUnion('archetype', [
	articleSchema,
	educationSchema,
	experienceSchema,
	linkSchema,
	organizationSchema,
	resumeSectionSchema,
])
