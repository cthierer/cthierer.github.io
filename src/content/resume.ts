import { useContent } from './ContentContext'
import EducationEntry from './EducationEntry'
import ExperienceEntry from './ExperienceEntry'
import { ContentLink, useLinks } from './links'
import OrganizationEntry from './OrganizationEntry'

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

const getResumeLinkRank = (href: string): number => {
	if (href.startsWith('mailto:')) {
		return 10
	}

	if (href.includes('christhierer.com')) {
		return 20
	}

	if (href.includes('linkedin.com')) {
		return 30
	}

	if (href.includes('github.com')) {
		return 40
	}

	return 50
}

export const useResumeProfile = (): ResumeProfile => {
	const content = useContent()
	const entry = content.find(
		item => item.category === 'resume' && item.data.archetype === 'profile',
	)

	return {
		name: isString(entry?.data.name) ? entry.data.name : 'Chris Thierer',
		headline: isString(entry?.data.headline) ? entry.data.headline : 'Software Engineering Leader',
		location: isString(entry?.data.location) ? entry.data.location : 'Baltimore/DC area',
		html: entry?.html ?? '',
	}
}

export const useResumeSkills = (): ResumeSkillGroup[] => {
	const content = useContent()
	const entry = content.find(item => item.category === 'resume' && item.data.archetype === 'skills')
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
	const content = useContent()
	const entry = content.find(
		item => item.category === 'resume' && item.data.archetype === 'metrics',
	)
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

export const useResumeExperience = (): ResumeRole[] => {
	const content = useContent()
	const organizations = new Map(
		content
			.filter(entry => entry.category === 'organizations')
			.map(entry => [
				entry.data.slug as string,
				new OrganizationEntry(entry.category, entry.data, entry.html, entry.name),
			]),
	)

	return content
		.filter(entry => entry.category === 'experience')
		.map(entry => new ExperienceEntry(entry.category, entry.data, entry.html, entry.name))
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
}

export const useResumeEducation = (): EducationEntry[] => {
	const content = useContent()

	return content
		.filter(entry => entry.category === 'education')
		.map(entry => new EducationEntry(entry.category, entry.data, entry.html, entry.name))
		.filter(entry => entry.resumeInclude)
		.sort((entryA, entryB) => getComparableDate(entryB) - getComparableDate(entryA))
}

export const useResumeLinks = (): ContentLink[] =>
	[...useLinks({ area: 'resume', category: ['contact', 'social'] })].sort(
		(linkA, linkB) => getResumeLinkRank(linkA.href) - getResumeLinkRank(linkB.href),
	)
