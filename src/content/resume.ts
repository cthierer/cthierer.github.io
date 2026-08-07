import { useConfigValue } from '../config/ConfigContext'
import { useContent } from './ContentContext'
import EducationEntry from './EducationEntry'
import ExperienceEntry from './ExperienceEntry'
import { ContentLink, useLinks } from './links'
import OrganizationEntry from './OrganizationEntry'

type ResumeSectionArchetype = 'experience-section' | 'metrics' | 'profile' | 'skills'

export interface ResumeProfile {
	readonly name: string
	readonly headline: string
	readonly location: string
	readonly html: string
}

export interface ResumeSkillGroup {
	readonly label: string
	readonly items: readonly string[]
}

export interface ResumeMetric {
	readonly value: string
	readonly label: string
	readonly detail?: string
}

export interface ResumeArticleSection {
	readonly html: string
	readonly name: string
	readonly order: number
	readonly title: string
}

export interface ResumeRole {
	readonly experience: ExperienceEntry
	readonly organization: OrganizationEntry
}

interface MetricData {
	readonly value?: unknown
	readonly label?: unknown
	readonly detail?: unknown
}

interface SkillGroupData {
	readonly label?: unknown
	readonly items?: unknown
}

const isMetricData = (value: unknown): value is MetricData =>
	typeof value === 'object' && value !== null

const isSkillGroupData = (value: unknown): value is SkillGroupData =>
	typeof value === 'object' && value !== null

const isString = (value: unknown): value is string => typeof value === 'string'

const getComparableDate = (entry: EducationEntry): number =>
	(entry.endDate ?? entry.startDate ?? new Date(0)).valueOf()

const getResumeLinkRank = (link: ContentLink): number => (link.href.startsWith('mailto:') ? 0 : 1)

const useResumeEntry = (archetype: ResumeSectionArchetype) => {
	const content = useContent()

	return content.find(entry => entry.category === 'resume' && entry.data.archetype === archetype)
}

export const useResumeSectionTitle = (
	archetype: ResumeSectionArchetype,
	fallback: string,
): string => {
	const entry = useResumeEntry(archetype)

	return isString(entry?.data.title) ? entry.data.title : fallback
}

export const useResumeProfile = (): ResumeProfile => {
	const siteTitle = useConfigValue('siteTitle')
	const entry = useResumeEntry('profile')

	return {
		name: isString(entry?.data.name) ? entry.data.name : siteTitle,
		headline: isString(entry?.data.headline) ? entry.data.headline : '',
		location: isString(entry?.data.location) ? entry.data.location : '',
		html: entry?.html ?? '',
	}
}

export const useResumeSkills = (): ResumeSkillGroup[] => {
	const entry = useResumeEntry('skills')
	const groups = entry?.data.groups

	if (!Array.isArray(groups)) {
		return []
	}

	return groups
		.filter(isSkillGroupData)
		.map(group => ({
			label: isString(group.label) ? group.label : '',
			items: Array.isArray(group.items) ? group.items.filter(isString) : [],
		}))
		.filter(group => group.label && group.items.length > 0)
}

export const useResumeMetrics = (): ResumeMetric[] => {
	const entry = useResumeEntry('metrics')
	const metrics = entry?.data.metrics

	if (!Array.isArray(metrics)) {
		return []
	}

	return metrics
		.filter(isMetricData)
		.map(metric => ({
			value: isString(metric.value) ? metric.value : '',
			label: isString(metric.label) ? metric.label : '',
			detail: isString(metric.detail) ? metric.detail : undefined,
		}))
		.filter(metric => metric.value && metric.label)
}

export const useResumeArticleSections = (): ResumeArticleSection[] => {
	const content = useContent()

	return content
		.filter(entry => entry.category === 'resume' && entry.data.archetype === 'article')
		.map(entry => ({
			html: entry.html,
			name: entry.name,
			order: typeof entry.data.order === 'number' ? entry.data.order : Number.MAX_SAFE_INTEGER,
			title: isString(entry.data.title) ? entry.data.title : entry.name,
		}))
		.sort(
			(sectionA, sectionB) =>
				sectionA.order - sectionB.order || sectionA.name.localeCompare(sectionB.name),
		)
}

export const useResumeExperience = (): ResumeRole[] => {
	const content = useContent()
	const section = useResumeEntry('experience-section')
	const organizations = new Map(
		content
			.filter(entry => entry.category === 'organizations')
			.map(entry => [
				entry.data.slug as string,
				new OrganizationEntry(entry.category, entry.data, entry.html, entry.markdown, entry.name),
			]),
	)

	const roles = content
		.filter(entry => entry.category === 'experience')
		.map(
			entry =>
				new ExperienceEntry(entry.category, entry.data, entry.html, entry.markdown, entry.name),
		)
		.filter(experience => experience.resumeInclude)
		.map(experience => {
			const organization = organizations.get(experience.organization)
			if (!organization) {
				return null
			}

			return { experience, organization }
		})
		.filter((role): role is ResumeRole => role !== null)
		.sort(
			(roleA, roleB) => roleB.experience.startDate.valueOf() - roleA.experience.startDate.valueOf(),
		)
	const limit = section?.data.limit

	return typeof limit === 'number' ? roles.slice(0, limit) : roles
}

export const useResumeEducation = (): EducationEntry[] => {
	const content = useContent()
	const organizations = new Map(
		content
			.filter(entry => entry.category === 'organizations')
			.map(entry => [
				entry.data.slug as string,
				new OrganizationEntry(entry.category, entry.data, entry.html, entry.markdown, entry.name),
			]),
	)

	return content
		.filter(entry => entry.category === 'education')
		.map(
			entry =>
				new EducationEntry(
					entry.category,
					entry.data,
					entry.html,
					entry.markdown,
					entry.name,
					organizations.get(entry.data.organization as string),
				),
		)
		.filter(entry => entry.resumeInclude)
		.sort((entryA, entryB) => getComparableDate(entryB) - getComparableDate(entryA))
}

export const useResumeLinks = (): ContentLink[] =>
	[...useLinks({ area: 'resume', category: ['contact', 'social'] })].sort(
		(linkA, linkB) =>
			getResumeLinkRank(linkA) - getResumeLinkRank(linkB) ||
			linkA.order - linkB.order ||
			linkA.name.localeCompare(linkB.name),
	)
