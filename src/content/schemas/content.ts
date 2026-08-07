import { z } from 'zod'
import { articleSchema } from './article'
import { educationSchema } from './education'
import { experienceSchema } from './experience'
import { experienceSectionSchema } from './experienceSection'
import { linkSchema } from './link'
import { metricsSchema } from './metrics'
import { organizationSchema } from './organization'
import { profileSchema } from './profile'
import { skillsSchema } from './skills'

export const contentSchema = z.discriminatedUnion('archetype', [
	articleSchema,
	educationSchema,
	experienceSchema,
	experienceSectionSchema,
	linkSchema,
	metricsSchema,
	organizationSchema,
	profileSchema,
	skillsSchema,
])
