import { Lexer, type Token } from 'marked'
import { decodeHTML } from 'entities'
import type Config from '../config/Config'
import type Entry from './Entry'
import EducationEntry from './EducationEntry'
import ExperienceEntry from './ExperienceEntry'
import OrganizationEntry from './OrganizationEntry'
import { getCoverLetter, type CoverLetter } from './coverLetter'
import {
	type ResumeEducationSection,
	type ResumeExperienceSection,
	type ResumeProfile,
	type ResumeSection,
} from './resume'
import type { ContentLink } from './links'
import { formatResumeLinkLabel } from '../components/resume/format'

export interface ResumeDocument {
	readonly profile: ResumeProfile
	readonly links: readonly ContentLink[]
	readonly sections: readonly ResolvedResumeSection[]
}

export type ResolvedResumeSection =
	| Exclude<ResumeSection, ResumeExperienceSection | ResumeEducationSection>
	| (ResumeExperienceSection & { readonly roles: readonly ResumeRole[] })
	| (ResumeEducationSection & { readonly education: readonly EducationEntry[] })

export interface ResumeRole {
	readonly experience: ExperienceEntry
	readonly organization: OrganizationEntry
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)
const isString = (value: unknown): value is string => typeof value === 'string'
const educationDate = (entry: EducationEntry): number =>
	(entry.endDate ?? entry.startDate ?? new Date(0)).valueOf()
const linkRank = (link: ContentLink): number => (link.href.startsWith('mailto:') ? 0 : 1)

export const createResumeDocument = (content: readonly Entry[], config: Config): ResumeDocument => {
	const organizations = new Map(
		content
			.filter(entry => entry.category === 'organizations')
			.map(entry => [
				entry.data.slug as string,
				new OrganizationEntry(entry.category, entry.data, entry.html, entry.markdown, entry.name),
			]),
	)
	const sections = content
		.filter(entry => entry.category === 'resume' && entry.data.archetype === 'resume-section')
		.flatMap<ResumeSection>(entry => {
			const { data } = entry
			if (!isString(data.title) || typeof data.order !== 'number' || !isString(data.kind)) return []
			const base = {
				entryName: entry.name,
				html: entry.html,
				markdown: entry.markdown,
				order: data.order,
				title: data.title,
			}
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
				case 'metrics':
					return [
						{
							...base,
							kind: data.kind,
							metrics: Array.isArray(data.metrics)
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
								: [],
						},
					]
				case 'skills':
					return [
						{
							...base,
							kind: data.kind,
							groups: Array.isArray(data.groups)
								? data.groups.flatMap(group =>
										isRecord(group) &&
										isString(group.label) &&
										Array.isArray(group.items) &&
										group.items.every(isString)
											? [{ items: group.items, label: group.label }]
											: [],
									)
								: [],
						},
					]
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
		.sort((a, b) => a.order - b.order || a.entryName.localeCompare(b.entryName))
	const profile = sections.find(
		(section): section is ResumeProfile => section.kind === 'profile',
	) ?? {
		entryName: 'resume/Profile.md',
		headline: '',
		html: '',
		markdown: '',
		kind: 'profile' as const,
		location: '',
		name: config.siteTitle,
		order: 0,
		title: 'Profile',
	}
	const links = content
		.filter(
			entry =>
				(entry.category === 'contact' || entry.category === 'social') &&
				entry.data.archetype === 'link' &&
				(Array.isArray(entry.data.areas) ? entry.data.areas : [entry.data.areas]).includes(
					'resume',
				),
		)
		.flatMap<ContentLink>(entry =>
			isString(entry.data.href) && isString(entry.data.label) && isString(entry.data.slug)
				? [
						{
							category: entry.category,
							href: entry.data.href,
							label: entry.data.label,
							name: entry.name,
							order:
								typeof entry.data.order === 'number' ? entry.data.order : Number.MAX_SAFE_INTEGER,
							slug: entry.data.slug,
							title: isString(entry.data.title) ? entry.data.title : entry.name,
						},
					]
				: [],
		)
		.sort((a, b) => linkRank(a) - linkRank(b) || a.order - b.order || a.name.localeCompare(b.name))
	const roles = content
		.filter(entry => entry.category === 'experience')
		.map(
			entry =>
				new ExperienceEntry(entry.category, entry.data, entry.html, entry.markdown, entry.name),
		)
		.filter(entry => entry.resumeInclude)
		.flatMap(experience => {
			const organization = organizations.get(experience.organization)
			return organization ? [{ experience, organization }] : []
		})
		.sort((a, b) => b.experience.startDate.valueOf() - a.experience.startDate.valueOf())
	const education = content
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
		.sort((a, b) => educationDate(b) - educationDate(a))
	return {
		profile,
		links,
		sections: sections.map(section =>
			section.kind === 'experience'
				? { ...section, roles: section.limit === undefined ? roles : roles.slice(0, section.limit) }
				: section.kind === 'education'
					? { ...section, education }
					: section,
		),
	}
}

export interface CoverLetterDocument {
	readonly letter: CoverLetter
	readonly profile: ResumeProfile
	readonly links: readonly ContentLink[]
	readonly senderName: string
}
export const createCoverLetterDocument = (
	content: readonly Entry[],
	config: Config,
): CoverLetterDocument | undefined => {
	const letter = getCoverLetter([...content])
	if (!letter) return undefined
	const resume = createResumeDocument(content, config)
	return {
		letter,
		profile: resume.profile,
		links: resume.links,
		senderName: letter.sender?.name ?? resume.profile.name,
	}
}

export const formatResumeDate = (date: Date): string =>
	new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
		date,
	)
export const formatCoverLetterDate = (value: Date | string): string =>
	new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(
		value instanceof Date ? value : new Date(value.length === 10 ? `${value}T00:00:00Z` : value),
	)
export const formatEducation = (entry: EducationEntry): string =>
	entry.degree ? `${entry.degree}, ${entry.program}` : entry.program

const proseTokensText = (tokens: readonly Token[]): string =>
	tokens
		.flatMap((token: Token) => {
			const value = token as Token & { text?: string; tokens?: Token[]; items?: Token[] }
			if (value.type === 'space' || value.type === 'def') return []
			if (value.type === 'list' && value.items)
				return [
					value.items
						.map(item => {
							const itemValue = item as unknown as { text?: string; tokens?: Token[] }
							const lines = proseTokensText(itemValue.tokens ?? Lexer.lex(itemValue.text ?? ''))
								.split('\n')
								.filter(
									(line, index, values) => line !== '' || !values[index + 1]?.startsWith('- '),
								)
							return [
								`- ${lines[0] ?? ''}`,
								...lines.slice(1).map(line => (line === '' ? line : `  ${line}`)),
							].join('\n')
						})
						.join('\n'),
				]
			return [value.tokens ? inlineTokensText(value.tokens) : inlineText(token)]
		})
		.join('\n\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim()

const proseText = (markdown: string): string => proseTokensText(Lexer.lex(markdown))

const isRawHtmlStart = (value: string): boolean => /^<(?:script|style)\b/i.test(value)
const isRawHtmlEnd = (value: string): boolean => /^<\/(?:script|style)\s*>/i.test(value)
const inlineTokensText = (tokens: readonly Token[]): string => {
	let rawHtml = false
	let skipLeadingWhitespace = false
	return tokens
		.map(token => {
			const value = token as Token & { text?: string }
			if (value.type === 'html' && isRawHtmlStart(value.text ?? '')) {
				rawHtml = true
				return ''
			}
			if (value.type === 'html' && rawHtml && isRawHtmlEnd(value.text ?? '')) {
				rawHtml = false
				skipLeadingWhitespace = true
				return ''
			}
			if (rawHtml) return ''
			const text = inlineText(token)
			if (!skipLeadingWhitespace) return text
			skipLeadingWhitespace = false
			return text.replace(/^[ \t]+/, '')
		})
		.join('')
}

const decodeHtmlEntities = (value: string): string => decodeHTML(value)

const htmlText = (value: string): string =>
	decodeHtmlEntities(
		value
			.replace(/<!--[\s\S]*?-->/g, '')
			.replace(/<(script|style)\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/\1\s*>/gi, '')
			.replace(
				/<\/?(?:address|article|aside|blockquote|div|dl|dt|dd|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|table|tbody|td|tfoot|th|thead|tr|ul)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi,
				'\n',
			)
			.replace(/<br\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi, '\n')
			.replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g, ''),
	).replace(/[ \t]*\n[ \t]*/g, '\n')

const inlineText = (token: Token): string => {
	const value = token as Token & { text?: string; href?: string; tokens?: Token[] }
	if (value.type === 'link') {
		const label = value.tokens ? inlineTokensText(value.tokens) : (value.text ?? '')
		if (value.href?.startsWith('mailto:')) return value.href.slice('mailto:'.length)
		if (value.href?.startsWith('tel:') || value.href?.startsWith('geo:')) return label
		return label === value.href ? label : `${label} (${value.href})`
	}
	if (value.type === 'html') return htmlText(value.text ?? '')
	if (value.type === 'text')
		return value.tokens ? inlineTokensText(value.tokens) : decodeHtmlEntities(value.text ?? '')
	return value.tokens ? inlineTokensText(value.tokens) : (value.text ?? '')
}

const ascii = (value: string): string => {
	const normalized = value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[–—]/g, '-')
		.replace(/[‘’]/g, "'")
		.replace(/[“”]/g, '"')
		.replace(/…/g, '...')
	if (Array.from(normalized).some(character => (character.codePointAt(0) ?? 0) > 127))
		throw new Error('Text output contains characters that cannot be ASCII-normalized.')
	return normalized
}

export const serializeResumeMarkdown = (document: ResumeDocument): string => {
	const lines = [
		`# ${document.profile.name}`,
		'',
		`${document.profile.headline} | ${document.profile.location}`,
		'',
		...document.links.map(
			link => `[${formatResumeLinkLabel(link.href, link.label)}](${link.href})`,
		),
		'',
	]
	for (const section of document.sections) {
		lines.push(`## ${section.title}`, '')
		if (section.kind === 'profile') lines.push(section.markdown.trim())
		else if (section.kind === 'metrics')
			lines.push(
				...section.metrics.flatMap(metric => [
					`- **${metric.value} — ${metric.label}**${metric.detail ? `: ${metric.detail}` : ''}`,
				]),
			)
		else if (section.kind === 'skills')
			lines.push(...section.groups.map(group => `- **${group.label}:** ${group.items.join(', ')}`))
		else if (section.kind === 'prose') lines.push(section.markdown.trim())
		else if (section.kind === 'experience')
			for (const { experience, organization } of section.roles) {
				lines.push(
					`### ${experience.jobTitle}`,
					'',
					`${organization.label} | ${formatResumeDate(experience.startDate)} - ${experience.endDate ? formatResumeDate(experience.endDate) : 'Present'} | ${experience.location}`,
					'',
				)
				if (experience.resumeSummary || experience.resumeHighlights.length) {
					if (experience.resumeSummary) lines.push(experience.resumeSummary, '')
					lines.push(...experience.resumeHighlights.map(value => `- ${value}`))
				} else lines.push(experience.markdown.trim())
			}
		else if (section.kind === 'education')
			for (const entry of section.education) {
				lines.push(
					`### ${formatEducation(entry)}`,
					'',
					`${entry.institution}${entry.endDate ? ` | ${entry.endDate.getUTCFullYear()}` : ''}`,
				)
				if (entry.honors.length) lines.push('', `- ${entry.honors.join(', ')}`)
			}
		lines.push('')
	}
	return lines.join('\n')
}

export const serializeCoverLetterMarkdown = ({
	letter,
	profile,
	links,
	senderName,
}: CoverLetterDocument): string =>
	[
		`# ${profile.name}`,
		'',
		`${profile.headline} | ${profile.location}`,
		'',
		...links.map(link => `[${formatResumeLinkLabel(link.href, link.label)}](${link.href})`),
		'',
		formatCoverLetterDate(letter.date),
		'',
		...[
			letter.recipient.name,
			letter.recipient.title,
			letter.recipient.organization,
			...(letter.recipient.address ?? []),
		].filter(Boolean),
		'',
		...(letter.subject ? [`**${letter.subject}**`, ''] : []),
		letter.greeting,
		'',
		letter.markdown.trim(),
		'',
		letter.closing,
		senderName,
	]
		.filter((line, index, values) => line !== '' || index === 0 || values[index - 1] !== '')
		.join('\n')

export const serializeText = (markdown: string): string => ascii(proseText(markdown))
export const serializeResumeText = (document: ResumeDocument): string =>
	serializeText(serializeResumeMarkdown(document))
export const serializeCoverLetterText = (document: CoverLetterDocument): string =>
	serializeText(serializeCoverLetterMarkdown(document))
