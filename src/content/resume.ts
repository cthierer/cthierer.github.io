import { useConfigValue } from '../config/ConfigContext'
import { useContent } from './ContentContext'
import EducationEntry from './EducationEntry'
import ExperienceEntry from './ExperienceEntry'
import { type ContentLink, useLinks } from './links'
import OrganizationEntry from './OrganizationEntry'

interface ResumeSectionBase {
	readonly entryName: string
	readonly html: string
	readonly order: number
	readonly title: string
}

export interface ResumeProfile extends ResumeSectionBase {
	readonly headline: string
	readonly kind: 'profile'
	readonly location: string
	readonly name: string
}

export interface ResumeMetric {
	readonly detail?: string
	readonly label: string
	readonly value: string
}

export interface ResumeMetricsSection extends ResumeSectionBase {
	readonly kind: 'metrics'
	readonly metrics: readonly ResumeMetric[]
}

export interface ResumeSkillGroup {
	readonly items: readonly string[]
	readonly label: string
}

export interface ResumeSkillsSection extends ResumeSectionBase {
	readonly groups: readonly ResumeSkillGroup[]
	readonly kind: 'skills'
}

export interface ResumeProseSection extends ResumeSectionBase {
	readonly kind: 'prose'
}

export interface ResumeExperienceSection extends ResumeSectionBase {
	readonly kind: 'experience'
	readonly limit?: number
}

export interface ResumeEducationSection extends ResumeSectionBase {
	readonly kind: 'education'
}

export type ResumeSection =
	| ResumeProfile
	| ResumeMetricsSection
	| ResumeSkillsSection
	| ResumeProseSection
	| ResumeExperienceSection
	| ResumeEducationSection

export interface ResumeRole {
	readonly experience: ExperienceEntry
	readonly organization: OrganizationEntry
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const isString = (value: unknown): value is string => typeof value === 'string'

const getComparableDate = (entry: EducationEntry): number =>
	(entry.endDate ?? entry.startDate ?? new Date(0)).valueOf()

const getResumeLinkRank = (link: ContentLink): number => (link.href.startsWith('mailto:') ? 0 : 1)

const getResumeSections = (content: ReturnType<typeof useContent>): ResumeSection[] => {
	const sections = content
		.filter(entry => entry.category === 'resume' && entry.data.archetype === 'resume-section')
		.flatMap<ResumeSection>((entry): ResumeSection[] => {
			const { data } = entry
			if (!isString(data.title) || typeof data.order !== 'number' || !isString(data.kind)) {
				return []
			}
			const base = { entryName: entry.name, html: entry.html, order: data.order, title: data.title }

			switch (data.kind) {
				case 'profile':
					return isString(data.name) && isString(data.headline) && isString(data.location)
						? [
								{
									...base,
									headline: data.headline,
									kind: data.kind,
									location: data.location,
									name: data.name,
								},
							]
						: []
				case 'metrics': {
					const metrics = Array.isArray(data.metrics)
						? data.metrics.flatMap(metric =>
								isRecord(metric) && isString(metric.value) && isString(metric.label)
									? [
											{
												detail: isString(metric.detail) ? metric.detail : undefined,
												label: metric.label,
												value: metric.value,
											},
										]
									: [],
							)
						: []
					return [{ ...base, kind: data.kind, metrics }]
				}
				case 'skills': {
					const groups = Array.isArray(data.groups)
						? data.groups.flatMap(group =>
								isRecord(group) &&
								isString(group.label) &&
								Array.isArray(group.items) &&
								group.items.every(isString)
									? [{ items: group.items, label: group.label }]
									: [],
							)
						: []
					return [{ ...base, groups, kind: data.kind }]
				}
				case 'prose':
					return [{ ...base, kind: data.kind }]
				case 'experience':
					return [
						{
							...base,
							kind: data.kind,
							limit: typeof data.limit === 'number' ? data.limit : undefined,
						},
					]
				case 'education':
					return [{ ...base, kind: data.kind }]
				default:
					return []
			}
		})

	return sections.sort(
		(sectionA, sectionB) =>
			sectionA.order - sectionB.order || sectionA.entryName.localeCompare(sectionB.entryName),
	)
}

export const useResumeSections = (): ResumeSection[] => getResumeSections(useContent())

export const useResumeProfile = (): ResumeProfile => {
	const siteTitle = useConfigValue('siteTitle')
	const profile = useResumeSections().find(
		(section): section is ResumeProfile => section.kind === 'profile',
	)

	return (
		profile ?? {
			entryName: 'resume/Profile.md',
			headline: '',
			html: '',
			kind: 'profile',
			location: '',
			name: siteTitle,
			order: 0,
			title: 'Profile',
		}
	)
}

export const useResumeExperience = (limit?: number): ResumeRole[] => {
	const content = useContent()
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
			return organization ? { experience, organization } : null
		})
		.filter((role): role is ResumeRole => role !== null)
		.sort(
			(roleA, roleB) => roleB.experience.startDate.valueOf() - roleA.experience.startDate.valueOf(),
		)

	return limit === undefined ? roles : roles.slice(0, limit)
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
